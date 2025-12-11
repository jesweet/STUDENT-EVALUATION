const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Secure AI Feedback Generation Function
exports.generateAIFeedback = functions.https.onCall(async (data, context) => {
  try {
    // Validate input data
    if (!data || !data.detailedAnswers || !Array.isArray(data.detailedAnswers)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid assessment data provided'
      );
    }

    // Get Groq API key from environment variables
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error('GROQ_API_KEY environment variable not set');
      throw new functions.https.HttpsError(
        'failed-precondition',
        'AI service configuration error'
      );
    }

    // Construct AI prompt from student's answers
    const aiPrompt = constructAIPrompt(data);

    // Call Groq API
    const aiFeedback = await callGroqAPI(aiPrompt, data, groqApiKey);

    return {
      success: true,
      data: aiFeedback
    };

  } catch (error) {
    console.error('Error generating AI feedback:', error);
    
    // Handle different types of errors appropriately
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Return structured error response
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate AI feedback. Please try again.'
    );
  }
});

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
async function callGroqAPI(prompt, data, apiKey) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
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
    const errorText = await response.text();
    console.error('Groq API error:', response.status, errorText);
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
}