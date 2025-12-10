const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

admin.initializeApp();
const db = admin.firestore();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: functions.config().openai.key
});

// SUBMIT ASSESSMENT WITH AI ANALYSIS


exports.submitAssessment = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    
    try {
        const assessmentData = req.body;
        
        console.log('Processing assessment for:', assessmentData.studentName);
        
        // Generate comprehensive AI feedback with answer analysis
        const aiFeedback = await generateAIFeedbackWithAnswers(assessmentData);
        
        // Add AI feedback to assessment data
        assessmentData.aiFeedback = aiFeedback.generalFeedback;
        assessmentData.aiAnswerAnalysis = aiFeedback.answerAnalysis;
        assessmentData.aiRecommendations = aiFeedback.recommendations;
        
        // Save to Firestore
        const docRef = await db.collection('assessments').add({
            ...assessmentData,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Assessment saved with ID:', docRef.id);
        
        res.status(200).json({
            success: true,
            assessmentId: docRef.id,
            feedback: aiFeedback
        });
        
    } catch (error) {
        console.error('Error processing assessment:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});


// GENERATE AI FEEDBACK WITH ANSWER DETAILS

async function generateAIFeedbackWithAnswers(data) {
    // Prepare detailed answer breakdown
    let correctAnswersText = '';
    let incorrectAnswersText = '';
    let comprehensionIssues = [];
    let grammarIssues = [];
    
    data.detailedAnswers.forEach((answer, index) => {
        const questionNum = index + 1;
        
        if (answer.isCorrect) {
            correctAnswersText += `Q${questionNum} (${answer.category}) ✓, `;
        } else {
            const studentAnswerLetter = answer.studentAnswer !== null ? String.fromCharCode(65 + answer.studentAnswer) : 'No answer';
            const correctAnswerLetter = String.fromCharCode(65 + answer.correctAnswer);
            
            incorrectAnswersText += `Q${questionNum} (${answer.category}, ${answer.difficulty}): Student answered ${studentAnswerLetter}, Correct: ${correctAnswerLetter}. `;
            
            // Categorize issues
            if (answer.category === 'Reading Comprehension') {
                comprehensionIssues.push(`Q${questionNum} (${answer.difficulty})`);
            } else {
                grammarIssues.push(`Q${questionNum} (${answer.difficulty})`);
            }
        }
    });
    
    // Create comprehensive prompt for AI
    const prompt = `You are an educational AI assistant analyzing a Grade 6 student's assessment results.

STUDENT INFORMATION:
- Name: ${data.studentName}
- Section: ${data.section}
- Grade: Grade 6

OVERALL PERFORMANCE:
- Total Score: ${data.totalScore}/${data.totalQuestions} (${data.percentage}%)
- Reading Comprehension: ${data.comprehensionScore}/${data.comprehensionTotal} (${data.comprehensionPercentage}%)
- Grammar: ${data.grammarScore}/${data.grammarTotal} (${data.grammarPercentage}%)
- Readiness Level: ${data.readinessLevel}
- Time Taken: ${Math.floor(data.timeSpent / 60)} minutes ${data.timeSpent % 60} seconds

CORRECT ANSWERS:
${correctAnswersText || 'None'}

INCORRECT ANSWERS (with correct answers shown):
${incorrectAnswersText || 'All answers were correct!'}

COMPREHENSION ISSUES:
${comprehensionIssues.length > 0 ? comprehensionIssues.join(', ') : 'None - excellent comprehension!'}

GRAMMAR ISSUES:
${grammarIssues.length > 0 ? grammarIssues.join(', ') : 'None - excellent grammar knowledge!'}

Please provide a comprehensive evaluation in this EXACT format:

=== GENERAL FEEDBACK ===
[2-3 sentences about overall performance, tone should be encouraging]

=== STRENGTHS ===
[Bullet points of what the student did well]

=== AREAS FOR IMPROVEMENT ===
[Specific areas where the student struggled, mention the question numbers and correct answers]

=== RECOMMENDATIONS ===
[3-4 specific, actionable study recommendations based on their mistakes]

=== QUESTION-BY-QUESTION ANALYSIS ===
[For each INCORRECT answer, provide:
- Question number
- What they answered
- What the correct answer is
- Brief explanation why the correct answer is right]`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an experienced Grade 6 teacher providing detailed, encouraging feedback. Always include specific question numbers and correct answers when discussing mistakes."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        });
        
        const fullFeedback = completion.choices[0].message.content;
        
        // Parse the AI response into sections
        const sections = {
            generalFeedback: extractSection(fullFeedback, 'GENERAL FEEDBACK'),
            strengths: extractSection(fullFeedback, 'STRENGTHS'),
            areasForImprovement: extractSection(fullFeedback, 'AREAS FOR IMPROVEMENT'),
            recommendations: extractSection(fullFeedback, 'RECOMMENDATIONS'),
            answerAnalysis: extractSection(fullFeedback, 'QUESTION-BY-QUESTION ANALYSIS')
        };
        
        return sections;
        
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // Fallback feedback if AI fails
        return {
            generalFeedback: `${data.studentName} scored ${data.totalScore}/${data.totalQuestions} (${data.percentage}%). ${data.readinessLevel === 'Ready' ? 'Good job! Keep up the great work.' : 'Keep practicing to improve your skills.'}`,
            strengths: 'Assessment completed successfully.',
            areasForImprovement: incorrectAnswersText || 'No major issues detected.',
            recommendations: 'Continue studying and practicing regularly.',
            answerAnalysis: 'Detailed analysis unavailable. Please review incorrect answers with your teacher.'
        };
    }
}

// Helper function to extract sections from AI response
function extractSection(text, sectionName) {
    const regex = new RegExp(`===\\s*${sectionName}\\s*===\\s*([\\s\\S]*?)(?=(===|$))`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not available';
}


// GET ALL STUDENTS

exports.getStudents = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    
    try {
        const snapshot = await db.collection('assessments')
            .orderBy('createdAt', 'desc')
            .get();
            
        const students = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString()
        }));
        
        res.status(200).json({ 
            success: true,
            count: students.length,
            students: students 
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});


// GET STUDENTS BY SECTION

exports.getStudentsBySection = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    
    const section = req.query.section;
    
    if (!section) {
        res.status(400).json({ 
            success: false,
            error: 'Section parameter required' 
        });
        return;
    }
    
    try {
        const snapshot = await db.collection('assessments')
            .where('section', '==', section)
            .orderBy('createdAt', 'desc')
            .get();
            
        const students = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString()
        }));
        
        res.status(200).json({ 
            success: true,
            section: section,
            count: students.length,
            students: students 
        });
    } catch (error) {
        console.error('Error fetching students by section:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});


// GET SINGLE STUDENT DETAILS

exports.getStudentDetails = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    
    const studentId = req.query.id;
    
    if (!studentId) {
        res.status(400).json({ 
            success: false,
            error: 'Student ID required' 
        });
        return;
    }
    
    try {
        const doc = await db.collection('assessments').doc(studentId).get();
        
        if (!doc.exists) {
            res.status(404).json({ 
                success: false,
                error: 'Student not found' 
            });
            return;
        }
        
        res.status(200).json({ 
            success: true,
            student: {
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});