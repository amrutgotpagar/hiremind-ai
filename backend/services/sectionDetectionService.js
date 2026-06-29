/**
 * Detects which standard resume sections are present in the resume text,
 * based on common heading keywords. Case-insensitive.
 */
const SECTION_PATTERNS = {
  contact: /\b(email|phone|linkedin|github|contact)\b/i,
  summary: /\b(summary|profile|objective|about me)\b/i,
  skills: /\b(skills|technical skills|technologies|tech stack)\b/i,
  experience: /\b(experience|employment|work history|internship)\b/i,
  projects: /\b(projects?)\b/i,
  education: /\b(education|academic background|degree)\b/i,
  certifications: /\b(certifications?|certificates?|licenses?)\b/i,
};

/**
 * @param {string} resumeText - extracted plain text from the resume
 * @returns {{ sections: Object, formatWarnings: string[] }}
 */
const detectSections = (resumeText) => {
  const sections = {};
  const formatWarnings = [];

  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    sections[key] = pattern.test(resumeText);
  }

  // Missing-section warnings
  const sectionLabels = {
    contact: 'Contact Information',
    summary: 'Summary/Objective',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    education: 'Education',
    certifications: 'Certifications',
  };

  for (const [key, present] of Object.entries(sections)) {
    if (!present) {
      formatWarnings.push(`Missing section: ${sectionLabels[key]}`);
    }
  }

  // Basic formatting heuristics
  if (resumeText.length < 300) {
    formatWarnings.push(
      'Resume text is unusually short — this may indicate the PDF uses tables, images, or graphics that ATS systems cannot read.'
    );
  }

  const lineBreakCount = (resumeText.match(/\n/g) || []).length;
  if (lineBreakCount < 10) {
    formatWarnings.push(
      'Very few line breaks detected — resume may be using a single-column dense block instead of clear section formatting.'
    );
  }

  return { sections, formatWarnings };
};

module.exports = { detectSections };