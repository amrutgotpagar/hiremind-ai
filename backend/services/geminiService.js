const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Strips markdown code fences (```json ... ```) that Gemini sometimes
 * wraps around JSON output, despite instructions not to.
 */
const cleanJsonResponse = (rawText) => {
  return rawText
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```\s*$/, '')
    .trim();
};

/**
 * Generates interview questions based on resume text.
 * @param {string} resumeText - Extracted plain text from the candidate's resume
 * @returns {Promise<string[]>} Array of interview question strings
 */
const generateInterviewQuestions = async (resumeText) => {
  const prompt = `
You are an experienced technical interviewer. Based on the following resume content, generate exactly 5 relevant interview questions that probe the candidate's actual experience, skills, and projects mentioned.
Rules:
- Return ONLY a valid JSON array of 5 strings, nothing else.
- No markdown, no explanation, no code fences.
- Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?","Question 5?"]
Resume content:
"""
${resumeText}
"""
`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  const rawText = cleanJsonResponse(response.text);
  try {
    const questions = JSON.parse(rawText);
    if (!Array.isArray(questions)) {
      throw new Error('Gemini response was not an array');
    }
    return questions;
  } catch (parseError) {
    throw new Error(`Failed to parse Gemini response as JSON: ${rawText}`);
  }
};

/**
 * Evaluates a candidate's interview answers using Gemini.
 * @param {Array<{question: string, answer: string}>} qaPairs
 * @returns {Promise<{evaluations: Array<{score: number, feedback: string}>, overallScore: number, overallFeedback: string}>}
 */
const evaluateAnswers = async (qaPairs) => {
  const qaText = qaPairs
    .map((pair, i) => `Q${i + 1}: ${pair.question}\nA${i + 1}: ${pair.answer || '(no answer provided)'}`)
    .join('\n\n');
  const prompt = `
You are a senior technical interviewer evaluating a candidate's interview answers.
For each question-answer pair below, score the answer from 0-10 based on relevance, technical depth, and clarity. If no answer was provided, score it 0 with feedback noting it was unanswered.
Then provide an overall score from 0-100 and brief overall feedback summarizing the candidate's performance.
Rules:
- Return ONLY valid JSON, no markdown, no code fences, no explanation outside the JSON.
- Exact format:
{
  "evaluations": [
    { "score": 0, "feedback": "short specific feedback" },
    ...
  ],
  "overallScore": 0,
  "overallFeedback": "short overall summary"
}
- The "evaluations" array must have exactly ${qaPairs.length} entries, in the same order as the questions below.
Questions and answers:
${qaText}
`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  const rawText = cleanJsonResponse(response.text);
  try {
    const result = JSON.parse(rawText);
    if (!result.evaluations || !Array.isArray(result.evaluations)) {
      throw new Error('Missing or invalid evaluations array');
    }
    return result;
  } catch (parseError) {
    throw new Error(`Failed to parse Gemini evaluation response: ${rawText}`);
  }
};

/**
 * Generates qualitative ATS scores and feedback by comparing resume text
 * against an optional job description.
 * @param {string} resumeText
 * @param {string} jobDescriptionText - may be empty string
 * @returns {Promise<{
 *   resumeStrength: number,
 *   contentQuality: number,
 *   experienceRelevance: number,
 *   strengths: string[],
 *   weaknesses: string[],
 *   recruiterPerspective: string,
 *   atsPerspective: string,
 *   suggestions: string[]
 * }>}
 */
const generateAtsFeedback = async (resumeText, jobDescriptionText) => {
  const hasJD = jobDescriptionText && jobDescriptionText.trim().length > 0;

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and senior technical recruiter.

Analyze the following resume${hasJD ? ' against the provided job description' : ''} and provide a structured assessment.

Score each of the following from 0-100:
- resumeStrength: overall quality of the resume as a professional document
- contentQuality: clarity, specificity, and use of strong action verbs/quantified results
- experienceRelevance: how relevant the candidate's experience is${hasJD ? ' to the job description' : ' to their stated field'}

Then provide:
- strengths: array of 2-4 short specific strengths
- weaknesses: array of 2-4 short specific weaknesses
- recruiterPerspective: 1-2 sentences, how a human recruiter skimming this resume in 6 seconds would react
- atsPerspective: 1-2 sentences, how an automated ATS system would likely parse/score this resume
- suggestions: array of 2-4 specific, actionable improvement suggestions

Rules:
- Return ONLY valid JSON, no markdown, no code fences, no explanation outside the JSON.
- Exact format:
{
  "resumeStrength": 0,
  "contentQuality": 0,
  "experienceRelevance": 0,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recruiterPerspective": "...",
  "atsPerspective": "...",
  "suggestions": ["..."]
}

Resume:
"""
${resumeText}
"""
${hasJD ? `\nJob Description:\n"""\n${jobDescriptionText}\n"""` : ''}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const rawText = cleanJsonResponse(response.text);

  try {
    const result = JSON.parse(rawText);
    return result;
  } catch (parseError) {
    throw new Error(`Failed to parse Gemini ATS feedback response: ${rawText}`);
  }
};

const generateCareerRoadmap = async (profile) => {
  const {
    targetCompany,
    targetRole,
    currentSkills,
    currentProjects,
    experienceLevel,
    graduationYear,
    weeklyStudyHours,
  } = profile;

  const prompt = `
You are a senior technical career coach who has helped many candidates get hired at ${targetCompany}.

Analyze this candidate's profile for a ${targetRole} role and generate a structured, realistic, personalized roadmap. Calibrate your expectations specifically to ${targetCompany}'s actual interview process, technical bar, and culture — not generic advice. Give honest assessments, not inflated ones.

Candidate profile:
- Current skills: ${currentSkills.join(', ') || 'none listed'}
- Current projects: ${currentProjects || 'none listed'}
- Experience level: ${experienceLevel}
- Graduation year: ${graduationYear}
- Available study time: ${weeklyStudyHours} hours/week

Generate:
1. readinessScore: 0-100, how ready this candidate is for ${targetCompany} right now
2. skillAssessment: 2-3 sentences on their current standing
3. missingSkills: array of objects, each with a "skill" (specific skill/technology they need) and an "urgency" rating of exactly "critical", "important", or "nice-to-have" based on how essential that skill is for ${targetCompany}'s ${targetRole} interviews specifically
4. phases: an array of roadmap phases (choose however many genuinely make sense for this candidate — typically 3-5). Each phase needs:
   - phaseNumber
   - title
   - topics (array of strings)
   - estimatedWeeks (number, calibrated to their weekly study hours)
   - recommendedProjects (array of strings, specific project ideas)
   - recommendedCertifications (array of strings, can be empty if none are relevant)
5. interviewPrepPlan: 2-3 sentences describing how they should prepare for ${targetCompany}'s specific interview process
6. totalTimelineWeeks: sum of all phase durations
7. dailyStudyPlan: 1-2 sentences on how to structure a typical study day
8. weeklyGoals: array of 3-5 short weekly goal strings
9. monthlyMilestones: array of 3-5 short milestone strings

Rules:
- Return ONLY valid JSON, no markdown, no code fences, no explanation outside the JSON.
- Double-check every array uses square brackets [ ] and every object uses curly braces { } — do not mix them up.
- Exact format:
{
  "readinessScore": 0,
  "skillAssessment": "...",
  "missingSkills": [
    { "skill": "...", "urgency": "critical" }
  ],
  "phases": [
    {
      "phaseNumber": 1,
      "title": "...",
      "topics": ["..."],
      "estimatedWeeks": 0,
      "recommendedProjects": ["..."],
      "recommendedCertifications": ["..."]
    }
  ],
  "interviewPrepPlan": "...",
  "totalTimelineWeeks": 0,
  "dailyStudyPlan": "...",
  "weeklyGoals": ["..."],
  "monthlyMilestones": ["..."]
}
`;

  const MAX_ATTEMPTS = 2;
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = cleanJsonResponse(response.text);

    try {
      const result = JSON.parse(rawText);
      if (!result.phases || !Array.isArray(result.phases)) {
        throw new Error('Missing or invalid phases array');
      }
      return result;
    } catch (parseError) {
      lastError = new Error(`Failed to parse Gemini roadmap response: ${rawText}`);
    }
  }

  throw lastError;
};
module.exports = { generateInterviewQuestions, evaluateAnswers, generateCareerRoadmap,  generateAtsFeedback };