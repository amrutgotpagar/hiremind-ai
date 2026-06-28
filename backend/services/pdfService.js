const fs = require('fs');
const { PDFParse } = require('pdf-parse');

/**
 * Extracts plain text from a PDF file on disk.
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });

  const result = await parser.getText();

  // Combine text from all pages into one string
  const fullText = result.pages.map((page) => page.text).join('\n\n');

  return fullText.trim();
};

module.exports = { extractTextFromPDF };