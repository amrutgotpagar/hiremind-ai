/**
 * Converts a format-warning count into a 0-100 score using a softened
 * (diminishing) penalty curve, so the first couple of issues don't
 * tank the score the way a flat per-warning deduction would.
 */
const formattingScoreFromWarnings = (warningCount) => {
  if (warningCount === 0) return 100;
  // Diminishing penalty: each additional warning costs less than the last.
  // 1 warning: -10, 2: -18, 3: -24, 4: -29, 5: -33, approaching a floor of ~35.
  const penalty = 100 * (1 - Math.pow(0.82, warningCount));
  return Math.max(35, Math.round(100 - penalty));
};

/**
 * Computes "skills coverage": of the candidate's own detected skills,
 * how many are relevant to what this JD is asking for.
 * Framed positively — this rewards breadth, not just JD-matching.
 */
const skillsCoverageScore = (resumeSkillCount, matchedKeywordCount) => {
  if (resumeSkillCount === 0) return 0;
  const raw = (matchedKeywordCount / resumeSkillCount) * 100;
  // Small floor boost so having *some* relevant skills doesn't read as a failure
  return Math.round(Math.min(100, raw + 10));
};

/**
 * Combines all sub-scores into the final weighted ATS Score (0-100).
 * Weights reflect how real ATS systems prioritize: keyword matching first,
 * then formatting parseability, then the more subjective quality signals.
 */
const computeOverallAtsScore = (scores) => {
  const weights = {
    keywordMatch: 0.30,
    formatting: 0.20,
    contentQuality: 0.20,
    experienceRelevance: 0.15,
    resumeStrength: 0.15,
  };

  const weighted =
    scores.keywordMatch * weights.keywordMatch +
    scores.formatting * weights.formatting +
    scores.contentQuality * weights.contentQuality +
    scores.experienceRelevance * weights.experienceRelevance +
    scores.resumeStrength * weights.resumeStrength;

  return Math.round(weighted);
};

module.exports = { formattingScoreFromWarnings, skillsCoverageScore, computeOverallAtsScore };