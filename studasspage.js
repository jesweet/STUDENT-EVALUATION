
// ASSESSMENT PAGE - WITH AI FEEDBACK

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);
let startTime = null;
let timerInterval = null;
let isSubmitting = false; // Global variable to prevent "Leave Page" warning during submission

// INITIALIZATION

window.onload = function() {
    // Check if studentName exists in localStorage - if not, redirect back to login
    const studentName = localStorage.getItem('studentName');
    if (!studentName) {
        // Check if there's URL parameter (user came from proper flow)
        const urlParams = new URLSearchParams(window.location.search);
        const urlStudentName = urlParams.get('name');
        
        if (!urlStudentName) {
            // No localStorage and no URL parameter - redirect to login
            showCustomAlert('Session Expired', 'Session expired. Please log in again.');
            setTimeout(() => {
                window.location.href = 'studlogin.html';
            }, 2000);
            return; // Stop execution if no valid session
        } else {
            // User has URL parameter but no localStorage - save it and continue
            localStorage.setItem('studentName', urlStudentName);
            localStorage.setItem('studentSection', urlParams.get('section') || 'Unknown');
            localStorage.setItem('studentBirthday', urlParams.get('birthday') || 'Unknown');
            localStorage.setItem('studentGrade', urlParams.get('grade') || 'Grade 6');
        }
    }
    
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
    // Add submit confirmation
    showCustomConfirm('Confirm Submission', 'Are you sure you want to submit your assessment? You cannot change your answers after this.', () => {
        const unanswered = answers.filter(a => a === null).length;
        
        if (unanswered > 0) {
            showCustomConfirm('Unanswered Questions', `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`, () => {
                proceedWithSubmission();
            });
        } else {
            proceedWithSubmission();
        }
    });
}

function proceedWithSubmission() {
    
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
            options: question.options,
            passage: question.passage || null
        });
    });
    
    const percentage = (totalScore / questions.length) * 100;
    const comprehensionPercentage = (comprehensionScore / comprehensionTotal) * 100;
    const grammarPercentage = (grammarScore / grammarTotal) * 100;
    const readinessLevel = percentage >= 70 ? "Ready" : "Need Improvement";
    
    const studentName = localStorage.getItem('studentName') || "Student";
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
        showCustomAlert('Processing Assessment',
            'Submitting your assessment and generating AI feedback...\n\n' +
            'This may take 10-15 seconds. Please wait.\n\n' +
            '✓ Calculating scores\n' +
            '✓ Analyzing performance patterns\n' +
            '🤖 Generating personalized feedback'
        );

        // Step 1: Call Firebase Cloud Function for AI feedback
        const aiFeedback = await callGroqAPI(null, data);

        // Step 2: Save assessment data + AI feedback to Firestore
        await saveToFirestore(data, aiFeedback);

        // Step 3: Show results with AI feedback
        showAIResults(data, aiFeedback);

    } catch (error) {
        console.error('Error in client-side processing:', error);
        showCustomAlert('Processing Error', '⚠️ Could not complete processing.\n\nYour results are saved locally.\n\nError: ' + error.message);

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
                questionText: answer.question,
                studentAnswer: answer.studentAnswer,
                correctAnswer: answer.correctAnswer,
                options: answer.options,
                passage: answer.passage
            });
        }
    });

    // Build detailed analysis for prompt
    let analysis = `Student Assessment Analysis for ${data.studentName} (${data.section}):\n\n`;
    
    // Summarize High-Level Stats First - clearly and explicitly
    analysis += `Total Score: ${data.totalScore}/${data.totalQuestions}\n`;
    analysis += `Reading Score: ${data.comprehensionScore}/${data.comprehensionTotal}\n`;
    analysis += `Grammar Score: ${data.grammarScore}/${data.grammarTotal}\n`;
    analysis += `Overall Percentage: ${data.percentage}%\n`;
    analysis += `Reading Comprehension Percentage: ${data.comprehensionPercentage}%\n`;
    analysis += `Grammar Percentage: ${data.grammarPercentage}%\n`;
    analysis += `Time Spent: ${Math.floor(data.timeSpent / 60)} minutes ${data.timeSpent % 60} seconds\n\n`;

    // Limit Detailed Examples - filter to just the first 3 wrong answers per category
    for (const [category, wrongAnswers] of Object.entries(wrongAnswersByCategory)) {
        analysis += `${category} - Key Examples to Review:\n`;
        
        // Take only the first 3 wrong answers for this category
        const limitedWrongAnswers = wrongAnswers.slice(0, 3);
        
        limitedWrongAnswers.forEach(wrong => {
            // Enrich Examples - include the question text and correct answer text
            const studentAnswerText = wrong.options[wrong.studentAnswer];
            const correctAnswerText = wrong.options[wrong.correctAnswer];
            const studentAnswerLetter = String.fromCharCode(65 + wrong.studentAnswer);
            const correctAnswerLetter = String.fromCharCode(65 + wrong.correctAnswer);

            analysis += `- Question ${wrong.questionId} (${wrong.difficulty}):\n`;
            analysis += `  Question: "${wrong.questionText}"\n`;
            analysis += `  Student's Answer (${studentAnswerLetter}): "${studentAnswerText}"\n`;
            analysis += `  Correct Answer (${correctAnswerLetter}): "${correctAnswerText}"\n`;

            // For Reading Comprehension questions, include passage context if available
            if (category === "Reading Comprehension" && wrong.passage) {
                const passageSnippet = wrong.passage.length > 100
                    ? wrong.passage.substring(0, 100) + "..."
                    : wrong.passage;
                analysis += `  Passage Context: "${passageSnippet}"\n`;
            }
            analysis += '\n';
        });
        
        // If there are more than 3 wrong answers, indicate this
        if (wrongAnswers.length > 3) {
            analysis += `... and ${wrongAnswers.length - 3} more ${category.toLowerCase()} questions need review.\n\n`;
        } else {
            analysis += '\n';
        }
    }

    return analysis;
}

// Call Groq API directly for AI feedback
async function callGroqAPI(prompt, data) {
    try {
        console.log('🔧 DEBUG: callGroqAPI called with data:', data);
        console.log('🔧 DEBUG: Checking if Firebase functions is available...');
        
        // Check if Firebase is properly initialized
        if (!firebase || !firebase.functions) {
            throw new Error('Firebase functions not available - Firebase not initialized');
        }
        
        // Check if the function exists (this will fail if not deployed)
        const functions = firebase.functions();
        console.log('🔧 DEBUG: Firebase functions object:', functions);
        
        // Try to get the callable function
        const generateAIFeedback = functions.httpsCallable('generateAIFeedback');
        console.log('🔧 DEBUG: generateAIFeedback function reference created');
        
        // Construct AI prompt from student data
        const analysisPrompt = constructAIPrompt(data);
        console.log('🔧 DEBUG: Analysis prompt constructed');
        
        // Call the function
        console.log('🔧 DEBUG: Calling Firebase function...');
        const result = await generateAIFeedback({ assessmentData: data });
        console.log('🔧 DEBUG: Firebase function call successful:', result);
        
        return result.data;

    } catch (error) {
        console.error('🔧 DEBUG: Groq API error caught:', error);
        console.error('🔧 DEBUG: Error type:', error.constructor.name);
        console.error('🔧 DEBUG: Error message:', error.message);
        console.error('🔧 DEBUG: Error code:', error.code);
        
        // Return enhanced fallback AI feedback
        return createDynamicFallback(data, error.message);
    }
}

// Add API status monitoring
window.apiStatus = {
    lastCall: null,
    successRate: 0,
    totalCalls: 0,
    successfulCalls: 0
};

// Wrap callGroqAPI to track API status
const originalCallGroqAPI = callGroqAPI;
callGroqAPI = async function(prompt, data) {
    window.apiStatus.totalCalls++;
    window.apiStatus.lastCall = new Date().toISOString();
    
    try {
        const result = await originalCallGroqAPI(prompt, data);
        window.apiStatus.successfulCalls++;
        window.apiStatus.successRate = (window.apiStatus.successfulCalls / window.apiStatus.totalCalls * 100).toFixed(1);
        console.log('✅ AI API call successful. Success rate:', window.apiStatus.successRate + '%');
        return result;
    } catch (error) {
        window.apiStatus.successRate = (window.apiStatus.successfulCalls / window.apiStatus.totalCalls * 100).toFixed(1);
        console.log('❌ AI API call failed. Success rate:', window.apiStatus.successRate + '%');
        throw error;
    }
};

// Enhanced fallback function with dynamic content generation
function createDynamicFallback(data, aiContent) {
    console.log('🔧 DEBUG: createDynamicFallback called with data:', data);
    console.log('🔧 DEBUG: data keys:', Object.keys(data));
    
    // Analyze performance patterns for more personalized fallback
    const wrongAnswersByCategory = {};
    const wrongAnswersByDifficulty = {};
    
    data.detailedAnswers.forEach(answer => {
        if (!answer.isCorrect) {
            // Category analysis
            if (!wrongAnswersByCategory[answer.category]) {
                wrongAnswersByCategory[answer.category] = 0;
            }
            wrongAnswersByCategory[answer.category]++;
            
            // Difficulty analysis
            if (!wrongAnswersByDifficulty[answer.difficulty]) {
                wrongAnswersByDifficulty[answer.difficulty] = 0;
            }
            wrongAnswersByDifficulty[answer.difficulty]++;
        }
    });
    
    // Generate category-specific insights
    const categoryInsights = Object.entries(wrongAnswersByCategory)
        .map(([category, count]) => `${category}: ${count} incorrect answer${count > 1 ? 's' : ''}`)
        .join(', ');
    
    // Generate difficulty-specific insights
    const difficultyInsights = Object.entries(wrongAnswersByDifficulty)
        .map(([difficulty, count]) => `${difficulty}: ${count} incorrect`)
        .join(', ');
    
    const strongerArea = data.comprehensionPercentage > data.grammarPercentage ? 'Reading Comprehension' : 'Grammar';
    const weakerArea = data.comprehensionPercentage < data.grammarPercentage ? 'Reading Comprehension' : 'Grammar';
    
    console.log('🔧 DEBUG: strongerArea:', strongerArea);
    console.log('🔧 DEBUG: weakerArea:', weakerArea);
    console.log('🔧 DEBUG: data.comprehensionPercentage:', data.comprehensionPercentage);
    console.log('🔧 DEBUG: data.grammarPercentage:', data.grammarPercentage);
    console.log('🔧 DEBUG: data.percentage:', data.percentage);
    console.log('🔧 DEBUG: data.readinessLevel:', data.readinessLevel);
    console.log('🔧 DEBUG: data.timeSpent:', data.timeSpent);
    
    // Check for undefined values before using them
    const comprehensionPercentage = data.comprehensionPercentage ?? '0';
    const grammarPercentage = data.grammarPercentage ?? '0';
    const percentage = data.percentage ?? '0';
    const readinessLevel = data.readinessLevel ?? 'Unknown';
    const timeSpent = data.timeSpent ?? 0;
    
    return {
        generalFeedback: `Based on your assessment results, you scored ${percentage}% overall, which indicates ${readinessLevel === 'Ready' ? 'strong readiness for advanced topics' : 'opportunities for growth in foundational concepts'}. Your performance shows particular ${data.comprehensionPercentage > data.grammarPercentage ? 'strength in reading comprehension' : 'proficiency in grammar skills'}.`,
        
        strengths: `You demonstrated particular strength in ${strongerArea} with ${comprehensionPercentage}% accuracy. You showed consistency across ${data.comprehensionPercentage === data.grammarPercentage ? 'both skill areas' : 'your stronger subject area'}. Your time management was effective, completing the assessment in ${Math.floor(timeSpent / 60)} minutes.`,
        
        areasForImprovement: `Focus on improving your ${weakerArea} skills (${grammarPercentage}% accuracy). ${categoryInsights ? `Specific attention needed in: ${categoryInsights}.` : ''} ${difficultyInsights ? `Difficulty breakdown: ${difficultyInsights}.` : ''} ${percentage < 50 ? 'Consider reviewing fundamental concepts before moving to more advanced material.' : 'Continue building on your solid foundation while addressing identified weak areas.'}`,
        
        recommendations: `${percentage >= 80 ? 'Excellent work! ' : ''}Practice regularly in your ${weakerArea.toLowerCase()} skills. ${timeSpent > 1800 ? 'Work on time management while maintaining accuracy. ' : ''}Review the specific questions you answered incorrectly, focusing on the concepts behind each answer. ${categoryInsights ? `Pay special attention to: ${categoryInsights}. ` : ''}Consider seeking additional practice materials or tutoring support in challenging areas. Set small, achievable goals for improvement and track your progress over time.`
    };
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
    // Set isSubmitting = true BEFORE running window.location.href to prevent "Leave Site?" popup
    isSubmitting = true;
    
    // Redirect directly to results page - all info is displayed there
    window.location.href = 'assessment-results.html';
}

// SHOW BASIC RESULTS (FALLBACK)

function showBasicResults(data) {
    // Set isSubmitting = true BEFORE running window.location.href to prevent "Leave Site?" popup
    isSubmitting = true;
    
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
    
    showCustomAlert('Assessment Completed', message);
    setTimeout(() => {
        window.location.href = 'assessment-results.html';
    }, 3000);
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

// PREVENT ACCIDENTAL PAGE LEAVE - Updated to check isSubmitting

window.addEventListener('beforeunload', function(e) {
    // Only show warning if assessment is not complete AND not currently submitting
    if (currentQuestion < questions.length && !isSubmitting) {
        e.preventDefault();
        e.returnValue = 'You have not finished the assessment. Are you sure you want to leave?';
        return e.returnValue;
    }
});

console.log("✅ Assessment system initialized");
console.log("📝 Total Questions:", questions.length);
console.log("👤 Student:", localStorage.getItem('studentName') || 'Not logged in');
console.log("📚 Section:", localStorage.getItem('studentSection') || 'Unknown');