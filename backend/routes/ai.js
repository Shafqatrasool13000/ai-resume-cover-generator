const express = require('express');
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Generate Cover Letter
router.post('/cover-letter', authMiddleware, async (req, res) => {
    try {
        const { jobTitle, jobDescription, userBackground } = req.body;

        if (!jobTitle || !jobDescription || !userBackground) {
            return res.status(400).json({
                message: 'jobTitle, jobDescription and userBackground are required'
            });
        }

        const prompt = `
You are an expert career coach and professional cover letter writer.

Write a compelling, professional cover letter for the following:

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Candidate Background:
${userBackground}

Instructions:
- Keep it under 400 words
- Make it personalized and specific to the job
- Use a professional but warm tone
- Include why they are a great fit
- Do not use generic phrases
- Format it as a proper cover letter
- Do NOT use placeholder brackets like [Your Name] or [Company Name]
- Use "I" for the candidate and "your company" for the employer
- Do not include a formal address header
- Start directly with "Dear Hiring Manager,"
`;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0.7
        });

        const coverLetter = completion.choices[0].message.content;

        res.json({
            message: 'Cover letter generated successfully',
            coverLetter
        });

    } catch (error) {
        console.log('AI Error:', error);
        res.status(500).json({ message: 'AI generation failed', error: error.message });
    }
});

// Analyze Resume
router.post('/analyze-resume', authMiddleware, async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({
                message: 'resumeText and jobDescription are required'
            });
        }

        const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze this resume against the job description and provide specific feedback:

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your analysis in this exact JSON format:
{
  "matchScore": <number 0-100>,
  "strengths": [<list of 3-4 strengths>],
  "improvements": [<list of 3-4 specific improvements>],
  "missingKeywords": [<list of important keywords missing from resume>],
  "summary": "<2-3 sentence overall assessment>"
}

Return only the JSON, nothing else.
`;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0.7
        });

        const rawResponse = completion.choices[0].message.content;
        const analysis = JSON.parse(rawResponse);

        res.json({
            message: 'Resume analyzed successfully',
            analysis
        });

    } catch (error) {
        console.log('AI Error:', error);
        res.status(500).json({ message: 'AI analysis failed', error: error.message });
    }
});

module.exports = router;