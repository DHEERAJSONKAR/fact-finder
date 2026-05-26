const pdfParseModule = require('pdf-parse');
// Handle both default export and direct function export
const pdfParse = pdfParseModule.default || pdfParseModule;

// Configure pdf-parse with options for better compatibility
const pdfOptions = {
  pagerender: renderPage,
  max: 0, // 0 = all pages
  version: 'v2', // Use the latest version available
};

// Custom page renderer for better error resilience
function renderPage(pageData) {
  return Promise.resolve()
    .then(() => {
      let render_options = {
        normalizeWhitespace: true,
        disableCombineTextItems: false,
      };
      return pageData.getTextContent(render_options)
        .then(textContent => {
          let lastY, text = '';
          for (let item of textContent.items) {
            if (lastY == item.y || !lastY) {
              text += item.str;
            } else {
              text += '\n' + item.str;
            }
            lastY = item.y;
          }
          return text;
        });
    })
    .catch(err => {
      console.warn('[pdfExtractor] Error rendering page:', err.message);
      // Continue with partial extraction on render error
      return '';
    });
}

async function pdfExtractor(buffer) {
  if (!buffer || buffer.length === 0) {
    throw new Error('PDF buffer is empty');
  }

  try {
    console.log('[pdfExtractor] Starting PDF parsing with buffer size:', buffer.length);

    // Add timeout to prevent hanging
    const parsePromise = pdfParse(buffer, pdfOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('PDF parsing timeout (30s)')), 30000)
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
  }
}

module.exports = pdfExtractor;
