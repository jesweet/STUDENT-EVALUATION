const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

admin.initializeApp();
const db = admin.firestore();

// === CHANGE 1: CONNECT TO GROQ ===
const openai = new OpenAI({
    apiKey: functions.config().groq.key, 
    baseURL: "https://api.groq.com/openai/v1" 
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
            if (answer.category === 'Reading Comprehension') {
                comprehensionIssues.push(`Q${questionNum} (${answer.difficulty})`);
            } else {
                grammarIssues.push(`Q${questionNum} (${answer.difficulty})`);
            }
        }
    });

    const prompt = `You are an educational AI assistant analyzing a Grade 6 student's assessment results.
STUDENT: ${data.studentName}, Grade 6
SCORE: ${data.totalScore}/${data.totalQuestions} (${data.percentage}%)
READINESS: ${data.readinessLevel}
INCORRECT ANSWERS: ${incorrectAnswersText || 'None'}

Provide feedback in this EXACT format:
=== GENERAL FEEDBACK ===
[2-3 encouraging sentences]
=== STRENGTHS ===
[Bullet points]
=== AREAS FOR IMPROVEMENT ===
[Specific areas]
=== RECOMMENDATIONS ===
[3-4 actionable tips]
=== QUESTION-BY-QUESTION ANALYSIS ===
[Brief analysis of mistakes]`;

    try {
        const completion = await openai.chat.completions.create({
            // === CHANGE 2: USE GROQ MODEL ===
            model: "llama3-70b-8192", 
            messages: [
                { role: "system", content: "You are a Grade 6 teacher." },
                { role: "user", content: prompt }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        const fullFeedback = completion.choices[0].message.content;

        return {
            generalFeedback: extractSection(fullFeedback, 'GENERAL FEEDBACK'),
            strengths: extractSection(fullFeedback, 'STRENGTHS'),
            areasForImprovement: extractSection(fullFeedback, 'AREAS FOR IMPROVEMENT'),
            recommendations: extractSection(fullFeedback, 'RECOMMENDATIONS'),
            answerAnalysis: extractSection(fullFeedback, 'QUESTION-BY-QUESTION ANALYSIS')
        };

    } catch (error) {
        console.error('AI Error:', error);
        return {
            generalFeedback: 'Good job on completing the assessment.',
            strengths: 'Completed on time.',
            areasForImprovement: 'Review incorrect answers.',
            recommendations: 'Keep practicing.',
            answerAnalysis: 'AI analysis unavailable.'
        };
    }
}

function extractSection(text, sectionName) {
    const regex = new RegExp(`===\\s*${sectionName}\\s*===\\s*([\\s\\S]*?)(?=(===|$))`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not available';
}

exports.getStudents = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const snapshot = await db.collection('assessments').orderBy('createdAt', 'desc').get();
        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() }));
        res.status(200).json({ success: true, count: students.length, students: students });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});