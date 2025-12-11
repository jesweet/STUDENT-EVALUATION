
// ASSESSMENT PAGE - WITH AI FEEDBACK

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);
let startTime = null;
let timerInterval = null;

// INITIALIZATION

window.onload = function() {
    console.log("Assessment started!");
    console.log("Total questions:", questions.length);
    
    startTime = Date.now();
    startTimer();
    displayQuestion();
    createOverviewGrid();

    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitBtn').addEventListener('click', submitAssessment);
};

// TIMER FUNCTIONS

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// DISPLAY QUESTION

function displayQuestion() {
    const question = questions[currentQuestion];
    const container = document.getElementById('questionContainer');
    
    let html = `
        <div class="question-card">
            <div class="question-header">
                <div class="q-number">${question.id}</div>
                <div class="q-category">${question.category}</div>
                <div class="q-difficulty difficulty-${question.difficulty}">${question.difficulty}</div>
            </div>
    `;
    
    if (question.passage) {
        html += `<div class="q-passage">${question.passage}</div>`;
    }
    
    html += `<div class="q-text">${question.question}</div>`;
    html += `<div class="answer-options">`;
    
    question.options.forEach((option, index) => {
        const selected = answers[currentQuestion] === index ? 'selected' : '';
        const letter = String.fromCharCode(65 + index);
        html += `
            <div class="answer-option ${selected}" onclick="selectAnswer(${index})">
                <span class="answer-label">${letter}</span>
                <span class="answer-content">${option}</span>
            </div>
        `;
    });
    html += `</div></div>`;
    
    container.innerHTML = html;
    updateProgress();
    updateButtons();
    updateOverviewGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectAnswer(optionIndex) {
    answers[currentQuestion] = optionIndex;
    console.log(`Question ${currentQuestion + 1} answered:`, optionIndex);
    displayQuestion();
}

function updateProgress() {
    document.getElementById('currentQuestionNum').textContent = currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.disabled = (currentQuestion === 0);
    
    if (currentQuestion === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function createOverviewGrid() {
    const grid = document.getElementById('overviewGrid');
    let html = '';
    questions.forEach((q, index) => {
        html += `<div class="overview-item unanswered" onclick="jumpToQuestion(${index})">${index + 1}</div>`;
    });
    grid.innerHTML = html;
}

function updateOverviewGrid() {
    const items = document.querySelectorAll('.overview-item');
    items.forEach((item, index) => {
        item.className = 'overview-item';
        if (index === currentQuestion) {
            item.classList.add('current');
        } else if (answers[index] !== null) {
            item.classList.add('answered');
        } else {
            item.classList.add('unanswered');
        }
    });
}

function jumpToQuestion(index) {
    currentQuestion = index;
    displayQuestion();
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// SUBMIT ASSESSMENT

function submitAssessment() {
    const unanswered = answers.filter(a => a === null).length;
    
    if (unanswered > 0) {
        const confirmSubmit = confirm(
            `You have ${unanswered} unanswered question(s).\n\nAre you sure you want to submit?`
        );
        if (!confirmSubmit) return;
    }
    
    clearInterval(timerInterval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate scores
    let totalScore = 0;
    let comprehensionScore = 0;
    let grammarScore = 0;
    let comprehensionTotal = 0;
    let grammarTotal = 0;
    
    const detailedAnswers = [];
    
    answers.forEach((answer, index) => {
        const question = questions[index];
        const isCorrect = (answer === question.correct);
        
        if (isCorrect) {
            totalScore++;
            if (question.category === "Reading Comprehension") {
                comprehensionScore++;
            } else {
                grammarScore++;
            }
        }
        
        if (question.category === "Reading Comprehension") {
            comprehensionTotal++;
        } else {
            grammarTotal++;
        }
        
        detailedAnswers.push({
            questionId: question.id,
            question: question.question,
            category: question.category,
            difficulty: question.difficulty,
            studentAnswer: answer,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            options: question.options
        });
    });
    
    const percentage = (totalScore / questions.length) * 100;
    const comprehensionPercentage = (comprehensionScore / comprehensionTotal) * 100;
    const grammarPercentage = (grammarScore / grammarTotal) * 100;
    const readinessLevel = percentage >= 70 ? "Ready" : "Need Improvement";
    
    const studentName = localStorage.getItem('studentName') || 'Unknown Student';
    const studentSection = localStorage.getItem('studentSection') || 'Unknown Section';
    const studentBirthday = localStorage.getItem('studentBirthday') || 'Unknown';
    
    const assessmentData = {
        studentName: studentName,
        section: studentSection,
        birthday: studentBirthday,
        gradeLevel: "Grade 6",
        totalScore: totalScore,
        totalQuestions: questions.length,
        percentage: percentage.toFixed(1),
        comprehensionScore: comprehensionScore,
        comprehensionTotal: comprehensionTotal,
        comprehensionPercentage: comprehensionPercentage.toFixed(1),
        grammarScore: grammarScore,
        grammarTotal: grammarTotal,
        grammarPercentage: grammarPercentage.toFixed(1),
        readinessLevel: readinessLevel,
        answers: answers,
        detailedAnswers: detailedAnswers,
        timeSpent: totalTime,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('assessmentResult', JSON.stringify(assessmentData));
    console.log("Assessment Data:", assessmentData);
    
    // Submit to backend with AI analysis
    submitToBackend(assessmentData);
}


// SUBMIT TO BACKEND - UPDATED WITH AI


async function submitToBackend(data) {
    try {
        // Show loading message
        alert('Submitting your assessment and generating AI feedback...\n\nThis may take 10-15 seconds. Please wait.');

        // Step 1: Construct AI prompt from student's answers
        const aiPrompt = constructAIPrompt(data);

        // Step 2: Call Groq API for AI feedback
        const aiFeedback = await callGroqAPI(aiPrompt, data);

        // Step 3: Save assessment data + AI feedback to Firestore
        await saveToFirestore(data, aiFeedback);

        // Step 4: Show results with AI feedback
        showAIResults(data, aiFeedback);

    } catch (error) {
        console.error('Error in client-side processing:', error);
        alert('⚠️ Could not complete processing.\n\nYour results are saved locally.\n\nError: ' + error.message);

        // Show results without AI feedback
        showBasicResults(data);
    }
}

// Construct AI prompt from student's answers
function constructAIPrompt(data) {
    // Analyze wrong answers by category
    const wrongAnswersByCategory = {};
    data.detailedAnswers.forEach(answer => {
        if (!answer.isCorrect) {
            if (!wrongAnswersByCategory[answer.category]) {
                wrongAnswersByCategory[answer.category] = [];
            }
            wrongAnswersByCategory[answer.category].push({
                questionId: answer.questionId,
                difficulty: answer.difficulty,
                studentAnswer: answer.studentAnswer,
                correctAnswer: answer.correctAnswer
            });
        }
    });

    // Build detailed analysis for prompt
    let analysis = `Student Assessment Analysis for ${data.studentName} (${data.section}):\n\n`;
    analysis += `Overall Performance: ${data.totalScore}/${data.totalQuestions} (${data.percentage}%)\n`;
    analysis += `Reading Comprehension: ${data.comprehensionScore}/${data.comprehensionTotal} (${data.comprehensionPercentage}%)\n`;
    analysis += `Grammar: ${data.grammarScore}/${data.grammarTotal} (${data.grammarPercentage}%)\n`;
    analysis += `Time Spent: ${Math.floor(data.timeSpent / 60)} minutes ${data.timeSpent % 60} seconds\n\n`;

    // Add wrong answer analysis by category
    for (const [category, wrongAnswers] of Object.entries(wrongAnswersByCategory)) {
        analysis += `${category} Weaknesses:\n`;
        wrongAnswers.forEach(wrong => {
            analysis += `- Question ${wrong.questionId} (${wrong.difficulty}): Student chose option ${String.fromCharCode(65 + wrong.studentAnswer)}, correct was ${String.fromCharCode(65 + wrong.correctAnswer)}\n`;
        });
        analysis += '\n';
    }

    return analysis;
}

// Call Groq API for AI feedback
async function callGroqAPI(prompt, data) {
    try {
        // REPLACE WITH YOUR ACTUAL GROQ API KEY
        const GROQ_API_KEY = 'PASTE_YOUR_GROQ_API_KEY_HERE';

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert English teacher providing detailed, constructive feedback on student assessments. Analyze the student's performance and provide specific strengths, areas for improvement, and actionable recommendations."
                    },
                    {
                        role: "user",
                        content: `Based on this assessment data, provide comprehensive feedback:\n\n${prompt}\n\nPlease provide your analysis in JSON format with these fields:\n- generalFeedback: Overall assessment of student performance\n- strengths: Specific areas where student performed well\n- areasForImprovement: Specific areas needing improvement\n- recommendations: Actionable study recommendations`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Groq API response:', result);

        if (result.choices && result.choices[0].message.content) {
            try {
                return JSON.parse(result.choices[0].message.content);
            } catch (e) {
                // If JSON parsing fails, return structured feedback
                return {
                    generalFeedback: result.choices[0].message.content,
                    strengths: "Detailed analysis available in general feedback",
                    areasForImprovement: "Detailed analysis available in general feedback",
                    recommendations: "Review the general feedback for specific recommendations"
                };
            }
        } else {
            throw new Error('Invalid Groq API response format');
        }

    } catch (error) {
        console.error('Groq API error:', error);
        // Return fallback AI feedback if API fails
        return {
            generalFeedback: `Based on your score of ${data.percentage}%, you have ${data.readinessLevel === 'Ready' ? 'demonstrated strong understanding' : 'areas that need improvement'}.`,
            strengths: `You scored well in ${data.comprehensionPercentage > data.grammarPercentage ? 'Reading Comprehension' : 'Grammar'}.`,
            areasForImprovement: `Focus on improving your ${data.comprehensionPercentage < data.grammarPercentage ? 'Reading Comprehension' : 'Grammar'} skills.`,
            recommendations: `Practice regularly and review the questions you got wrong. Consider additional study time on challenging topics.`
        };
    }
}

// Save assessment data to Firestore
async function saveToFirestore(data, aiFeedback) {
    try {
        // Add AI feedback to assessment data
        const assessmentWithFeedback = {
            ...data,
            aiFeedback: aiFeedback.generalFeedback,
            aiStrengths: aiFeedback.strengths,
            aiAreasForImprovement: aiFeedback.areasForImprovement,
            aiRecommendations: aiFeedback.recommendations,
            createdAt: new Date()
        };

        // Save to Firestore
        const docRef = await db.collection('assessments').add(assessmentWithFeedback);
        console.log('Document written with ID: ', docRef.id);

        // Also save AI feedback to localStorage
        localStorage.setItem('aiFeedback', JSON.stringify(aiFeedback));

        return docRef.id;

    } catch (error) {
        console.error('Error saving to Firestore:', error);
        throw new Error('Failed to save assessment data');
    }
}

// SHOW RESULTS WITH AI FEEDBACK

function showAIResults(data, aiFeedback) {
    const minutes = Math.floor(data.timeSpent / 60);
    const seconds = data.timeSpent % 60;
    
    const message = `
🎉 ASSESSMENT COMPLETED! 🎉

📊 YOUR RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Score: ${data.totalScore}/${data.totalQuestions} (${data.percentage}%)
📖 Reading: ${data.comprehensionScore}/${data.comprehensionTotal} (${data.comprehensionPercentage}%)
✍️ Grammar: ${data.grammarScore}/${data.grammarTotal} (${data.grammarPercentage}%)
⏱️ Time: ${minutes}m ${seconds}s
📈 Status: ${data.readinessLevel}
━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 AI FEEDBACK:
${aiFeedback.generalFeedback}

✨ STRENGTHS:
${aiFeedback.strengths}

📝 AREAS TO IMPROVE:
${aiFeedback.areasForImprovement}

💡 RECOMMENDATIONS:
${aiFeedback.recommendations}

✅ Detailed answer analysis has been saved.
Your teacher can review all your answers and the AI's analysis.
    `;
    
    alert(message);
    
    // Redirect to results page
    window.location.href = 'assessment-results.html';
}

// SHOW BASIC RESULTS (FALLBACK)

function showBasicResults(data) {
    const minutes = Math.floor(data.timeSpent / 60);
    const seconds = data.timeSpent % 60;
    
    // Create a simple summary of wrong answers
    let wrongAnswersSummary = '\n\n📋 QUESTIONS TO REVIEW:\n';
    let wrongCount = 0;
    
    data.detailedAnswers.forEach((answer) => {
        if (!answer.isCorrect) {
            wrongCount++;
            const studentLetter = answer.studentAnswer !== null ? String.fromCharCode(65 + answer.studentAnswer) : 'No answer';
            const correctLetter = String.fromCharCode(65 + answer.correctAnswer);
            wrongAnswersSummary += `\nQ${answer.questionId} (${answer.category})\nYour answer: ${studentLetter}\nCorrect answer: ${correctLetter}\n`;
        }
    });
    
    if (wrongCount === 0) {
        wrongAnswersSummary = '\n\n🌟 Perfect score! All answers correct!';
    }
    
    const message = `
🎉 ASSESSMENT COMPLETED! 🎉

📊 YOUR RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Score: ${data.totalScore}/${data.totalQuestions} (${data.percentage}%)
📖 Reading: ${data.comprehensionScore}/${data.comprehensionTotal} (${data.comprehensionPercentage}%)
✍️ Grammar: ${data.grammarScore}/${data.grammarTotal} (${data.grammarPercentage}%)
⏱️ Time: ${minutes}m ${seconds}s
📈 Status: ${data.readinessLevel}
━━━━━━━━━━━━━━━━━━━━━━━━━━

${wrongAnswersSummary}

${data.readinessLevel === "Ready" 
    ? "🌟 Excellent work! You're ready for the next level!" 
    : "💪 Keep practicing! Review the questions above with your teacher."}
    `;
    
    alert(message);
    window.location.href = 'studassdb.html';
}


// KEYBOARD NAVIGATION

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' && currentQuestion < questions.length - 1) {
        nextQuestion();
    } else if (e.key === 'ArrowLeft' && currentQuestion > 0) {
        previousQuestion();
    } else if (e.key >= '1' && e.key <= '4') {
        const optionIndex = parseInt(e.key) - 1;
        if (optionIndex < questions[currentQuestion].options.length) {
            selectAnswer(optionIndex);
        }
    }
});

// PREVENT ACCIDENTAL PAGE LEAVE

window.addEventListener('beforeunload', function(e) {
    if (currentQuestion < questions.length) {
        e.preventDefault();
        e.returnValue = 'You have not finished the assessment. Are you sure you want to leave?';
        return e.returnValue;
    }
});

console.log("✅ Assessment system initialized");
console.log("📝 Total Questions:", questions.length);
console.log("👤 Student:", localStorage.getItem('studentName') || 'Not logged in');
console.log("📚 Section:", localStorage.getItem('studentSection') || 'Unknown');