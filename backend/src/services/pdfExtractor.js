const { PDFParse } = require('pdf-parse');

// Configure pdf-parse v2 text extraction options.
const parseOptions = {
  lineEnforce: true,
  pageJoiner: '\n',
};

async function pdfExtractor(buffer) {
  if (!buffer || buffer.length === 0) {
    throw new Error('PDF buffer is empty');
  }

  let parser;
  let timeoutId;

  try {
    console.log('[pdfExtractor] Starting PDF parsing with buffer size:', buffer.length);
    parser = new PDFParse({ data: buffer });

    // Add timeout to prevent hanging
    const parsePromise = parser.getText(parseOptions);
    const timeoutPromise = new Promise((_, reject) =>
      timeoutId = setTimeout(() => reject(new Error('PDF parsing timeout (30s)')), 30000)
    );

    const data = await Promise.race([parsePromise, timeoutPromise]);

    if (!data.text || data.text.trim().length === 0) {
      console.warn('[pdfExtractor] PDF parsed but no text content extracted');
      throw new Error('No text content found in PDF. This may be a scanned PDF or image-based document.');
    }

    const extractedText = data.text.trim();
    console.log('[pdfExtractor] Successfully extracted', extractedText.length, 'characters from PDF');
    return extractedText;

  } catch (error) {
    const errorMessage = error.message || String(error);
    console.error('[pdfExtractor] PDF extraction failed:', {
      message: errorMessage,
      bufferSize: buffer.length,
      name: error.name,
      code: error.code,
    });

    // Provide helpful error messages based on error type
    if (errorMessage.includes('XRef')) {
      throw new Error(
        'Failed to parse PDF structure (XRef error). The PDF may be corrupted or use an unsupported format. Please try a different PDF file.'
      );
    } else if (errorMessage.includes('timeout')) {
      throw new Error(
        'PDF parsing took too long. The file may be too large or complex. Please try a smaller PDF.'
      );
    } else if (errorMessage.includes('object')) {
      throw new Error(
        'PDF format error. The file may be corrupted. Please try re-saving the PDF.'
      );
    } else {
      throw new Error(
        `Failed to extract text from PDF: ${errorMessage}`
      );
    }
  } finally {
    clearTimeout(timeoutId);
    if (parser) {
      await parser.destroy().catch(err => {
        console.warn('[pdfExtractor] Error cleaning up PDF parser:', err.message);
      });
    }
  }
}

module.exports = pdfExtractor;
