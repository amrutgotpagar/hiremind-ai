// A reasonably broad seed list of common tech/professional skill keywords.
// Used to extract recognizable skills from free-text (resume or job description).
const KNOWN_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'sql', 'html', 'css',
  'react', 'react.js', 'vue', 'angular', 'next.js', 'node.js', 'node', 'express',
  'mongodb', 'mongoose', 'postgresql', 'mysql', 'redis', 'graphql', 'rest api',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'github actions',
  'git', 'github', 'linux', 'agile', 'scrum', 'jira', 'figma',
  'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'scikit-learn',
  'pandas', 'numpy', 'flask', 'django', 'spring boot', 'microservices',
  'jwt', 'oauth', 'websocket', 'socket.io', 'redux', 'tailwind', 'bootstrap',
  'jest', 'mocha', 'cypress', 'testing', 'unit testing', 'webpack', 'vite',
];

/**
 * Extracts known skill keywords found in a block of text.
 * @param {string} text
 * @returns {Set<string>} lowercase matched skill keywords
 */
const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  const found = new Set();

  for (const skill of KNOWN_SKILLS) {
    // Word-boundary match to avoid partial matches (e.g. "java" inside "javascript")
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escaped}\\b`, 'i');
    if (pattern.test(lowerText)) {
      found.add(skill);
    }
  }

  return found;
};

/**
 * Compares resume skills against job description skills.
 * @param {string} resumeText
 * @param {string} jobDescriptionText
 * @returns {{ matchedKeywords: string[], missingKeywords: string[], keywordMatchScore: number }}
 */
const compareKeywords = (resumeText, jobDescriptionText) => {
  const resumeSkills = extractSkills(resumeText);

  // If no job description provided, just return resume's own detected skills as "matched"
  if (!jobDescriptionText || jobDescriptionText.trim().length === 0) {
    return {
      matchedKeywords: [...resumeSkills],
      missingKeywords: [],
      keywordMatchScore: resumeSkills.size > 0 ? 100 : 0,
    };
  }

  const jdSkills = extractSkills(jobDescriptionText);

  const matched = [...jdSkills].filter((skill) => resumeSkills.has(skill));
  const missing = [...jdSkills].filter((skill) => !resumeSkills.has(skill));

  const keywordMatchScore =
    jdSkills.size === 0 ? 0 : Math.round((matched.length / jdSkills.size) * 100);

  return {
    matchedKeywords: matched,
    missingKeywords: missing,
    keywordMatchScore,
  };
};

module.exports = { extractSkills, compareKeywords };