import { PDFDocument, rgb, StandardFonts, TextAlignment } from "pdf-lib";

// --- Configuration Object ---
// Centralizes layout, styling, and fixed text elements for easier customization.
const pdfConfig = {
  page: {
    width: 595, // A4 width in points
    height: 842, // A4 height in points
  },
  margins: {
    top: 50,
    bottom: 80, // Accounts for footer height
    left: 50,
    right: 50,
  },
  fonts: {
    // Embedded font objects will be added here later
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold,
  },
  fontSizes: {
    title: 17,
    body: 12.5,
    date: 10,
    footer: 11,
    signatureName: 12.5, // Same as body for consistency
    signatureDetails: 12.5, // Same as body
  },
  lineHeights: {
    // Calculated based on font sizes for consistent spacing
    title: 17 * 1.35,
    body: 12.5 * 1.35,
    date: 50 * 1.2,
    footer: 11 * 1.2,
    signature: 12.5 * 1.2, // Slightly tighter for signature block
  },
  spacing: {
    // Vertical spacing between elements
    afterTitle: 26 * 1.5,
    paragraph: 26,
    afterMainBody: 26 * 1.2,
    beforeTechList: 5.5 * 1.35 * 1.5, // Extra space before the list items
    afterTechList: 10 * 1.2,
    beforeSignature: 12.5 * 1.35 * 2.5, // Spacing above "Kind Regards"
  },
  colors: {
    text: rgb(0.1, 0.1, 0.1),
    boldText: rgb(0, 0, 0),
    headerLine: rgb(0.4, 0.4, 0.4),
    footerBackground: rgb(0.3, 0.7, 0.2),
    footerCapsule: rgb(1, 1, 1),
    footerText: rgb(0.1, 0.1, 0.1),
    error: rgb(1, 0, 0),
    placeholder: rgb(0.5, 0.5, 0.5),
  },
  logo: {
    maxWidth: 240,
    maxHeight: 120,
    gapAfter: 5, // Space between logo end and header line start
  },
  signature: {
    minYFromBottom: 150, // Ensure signature block doesn't go too low
    imageMaxHeight: 35,
    imageMaxWidth: 110,
    fixedName: "K.R.SRIDHAR",
    fixedTitle: "Business Development Manager, AAHA Solutions",
    fixedLocation: "Pondicherry",
  },
  footer: {
    height: 80,
    capsuleHMargin: 30, // Horizontal margin inside footer for capsule
    capsuleVMargin: 7.5, // Vertical margin inside footer for capsule ( (80 - 65) / 2 )
    capsuleHeight: 65, // Increased height from 65
    // capsuleBorderRadius: 32.5, // Calculated as capsuleHeight / 2
    colPadding: 25, // Padding inside the capsule for text columns
    // Fixed text content
    col1Text: ["aahasolutions.com", "www.aahasolutions.com"],
    col2Text: ["info@aahasolutions.com", "+918098299921"],
    col3Text: "No:27,3rdCross,SithanKudi,BrindavanColony,Puducherry-605013.",
  },
  // --- Derived Values (calculated within the main function) ---
  contentWidth: 0, // page.width - margins.left - margins.right
  headerBaseY: 0, // page.height - margins.top
};

// --- Helper Functions ---

/**
 * Draws text that wraps within a given width. Handles starting the first line
 * at an initial X offset.
 * Returns the Y coordinate *below* the last line of text drawn.
 */
const drawWrappedText = (page, text, options) => {
  const { x, y, font, size, color, maxWidth, lineHeight, initialX } = options;
  const words = text.split(' ');
  let currentLine = '';
  let currentY = y;
  let currentX = initialX !== undefined ? initialX : x; // Starting X pos
  let isFirstLineSegment = (initialX !== undefined);
  let linesDrawn = 0;

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);

    // Calculate the actual available width for the current segment
    const availableWidth = isFirstLineSegment ? (x + maxWidth) - currentX : maxWidth;

    if (testWidth <= availableWidth) {
      // Word fits, add to current line
      currentLine = testLine;
    } else {
      // Word doesn't fit, wrap required. Draw the previous line segment.
      if (currentLine) { // Avoid drawing empty line if first word was too long
        page.drawText(currentLine, { x: currentX, y: currentY, font, size, color });
        linesDrawn++;
      }

      // Start new line with the current word
      currentLine = word;
      if (linesDrawn > 0 || initialX === undefined) { // Only decrement Y if we've already drawn a line or we start at margin X
           currentY -= lineHeight;
      } else if (currentLine && linesDrawn === 0 && initialX !== undefined) {
          // If the very first segment wrapped, and we had an initialX,
          // the *next* line starts lower.
          currentY -= lineHeight;
      }

      currentX = x; // Reset X to the default margin 'x'
      isFirstLineSegment = false; // No longer the initial segment

      // Check if this single word is too long even for a full line
      const singleWordWidth = font.widthOfTextAtSize(currentLine, size);
      if (singleWordWidth > maxWidth) {
        console.warn(`Word "${currentLine}" (${singleWordWidth.toFixed(1)}pt) is too long for standard line width ${maxWidth}pt. Drawing anyway.`);
        // Draw the single long word on its own line (it will overflow)
        page.drawText(currentLine, { x: currentX, y: currentY, font, size, color });
        linesDrawn++;
        currentLine = ''; // Reset line as it was just drawn
      }
    }
  } // End for loop

  // Draw the very last line segment if it exists
  if (currentLine) {
    page.drawText(currentLine, { x: currentX, y: currentY, font, size, color });
    linesDrawn++;
  }

  // Return the Y position *below* the last line drawn.
  // If no text was drawn (empty input string), return the original Y.
  return linesDrawn > 0 ? currentY - lineHeight : y;
};


/**
 * Format date for display (e.g., 4th April 2025)
 */
const formatDateWithSuffix = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return "Invalid Date";
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  let suffix = "th";
  if (day % 10 === 1 && day !== 11) suffix = "st";
  else if (day % 10 === 2 && day !== 12) suffix = "nd";
  else if (day % 10 === 3 && day !== 13) suffix = "rd";
  return `${day}${suffix} ${month} ${year}`;
};


// --- Drawing Sections ---

/**
 * Draws the header section (Logo, Line, Date).
 * Returns the Y position below the header content.
 */
const drawHeader = async (page, pdfDoc, config, logo) => {
    let currentY = config.headerBaseY;
    let logoEndX = config.margins.left;
    let logoCenterY = config.headerBaseY - 30; // Default vertical center if no logo
    let logoBottomY = config.headerBaseY - 60; // Default bottom if no logo

    // --- Logo ---
    if (logo) {
      try {
        const logoImage = await pdfDoc.embedPng(logo);
        const originalDims = logoImage.scale(1);
        const scaleWidth = config.logo.maxWidth / originalDims.width;
        const scaleHeight = config.logo.maxHeight / originalDims.height;
        const scale = Math.min(scaleWidth, scaleHeight, 1); // Don't scale up
        const logoDims = logoImage.scale(scale);

        logoBottomY = config.headerBaseY - logoDims.height;
        logoCenterY = logoBottomY + logoDims.height / 2;

        page.drawImage(logoImage, {
          x: config.margins.left,
          y: logoBottomY,
          width: logoDims.width,
          height: logoDims.height,
        });
        logoEndX = config.margins.left + logoDims.width;
      } catch (imgError) {
          console.error("Error embedding logo:", imgError);
          logoBottomY = config.headerBaseY - 20; // Adjust placeholder Y
          logoCenterY = logoBottomY + 10;
          page.drawText("[Logo Error]", {
              x: config.margins.left,
              y: logoBottomY,
              size: 10, // Smaller size for error/placeholder
              font: config.fonts.regular,
              color: config.colors.error
          });
          logoEndX = config.margins.left + 100; // Placeholder width
      }
    } else {
        // Placeholder if no logo is provided
        logoBottomY = config.headerBaseY - 20; // Placeholder Y
        logoCenterY = logoBottomY + 10;
        page.drawText("[No Logo]", {
            x: config.margins.left,
            y: logoBottomY,
            size: 10,
            font: config.fonts.regular,
            color: config.colors.placeholder
        });
        logoEndX = config.margins.left + 100; // Placeholder width
    }

    // --- Header Line ---
    const lineStartX = logoEndX + config.logo.gapAfter;
    const lineY = logoCenterY; // Vertically aligned with the logo's center
    page.drawLine({
        start: { x: lineStartX, y: lineY },
        end: { x: config.page.width - config.margins.right, y: lineY },
        thickness: 2,
        color: config.colors.headerLine,
    });

    // --- Date --- (Positioned below the line)
    const formattedIssueDate = formatDateWithSuffix(new Date());
    const dateText = `Date: ${formattedIssueDate}`;
    const dateTextWidth = config.fonts.regular.widthOfTextAtSize(dateText, config.fontSizes.date);
    const dateY = lineY - 15; // Fixed offset below the line
    page.drawText(dateText, {
        x: config.page.width - config.margins.right - dateTextWidth,
        y: dateY,
        size: config.fontSizes.date,
        font: config.fonts.regular,
        color: config.colors.text,
    });

    // Return the Y position to start the next content block, below the lowest header element (date)
    return dateY - config.lineHeights.date;
};

/**
 * Draws the main body content (Title, paragraphs, list).
 * Returns the Y position below the body content.
 */
const drawBody = (page, config, data, startY) => {
    let currentY = startY;
    const { name, college, year, course, company, project, startDate } = data;
    const { left: marginLeft, right: marginRight } = config.margins;
    const contentWidth = config.contentWidth;
    const bodyFontSize = config.fontSizes.body;
    const bodyLineHeight = config.lineHeights.body;

    // --- Title ---
    const title = "INDUSTRIAL VISIT CERTIFICATE";
    const titleWidth = config.fonts.bold.widthOfTextAtSize(title, config.fontSizes.title);
    currentY -= config.spacing.afterTitle; // Add space below header line before title
    page.drawText(title, {
        x: (config.page.width - titleWidth) / 2, // Centered
        y: currentY,
        size: config.fontSizes.title,
        font: config.fonts.bold,
        color: config.colors.boldText,
    });
    currentY -= config.fontSizes.title; // Move Y down by title height

    // --- Main Content Paragraph ---
    currentY -= config.spacing.paragraph; // Space before main paragraph
    const prefixText = "This is to certify that ";
    const mainBodyText = `of Second Year ${year} ${course} from ${college} attended the Industrial Visit programme at ${company}, at 27, 3rd Cross Brindavan, Pondicherry on ${formatDateWithSuffix(new Date(startDate))}.`;

    const prefixWidth = config.fonts.regular.widthOfTextAtSize(prefixText, bodyFontSize);
    const nameWidth = config.fonts.bold.widthOfTextAtSize(name, bodyFontSize);
    const spaceWidth = config.fonts.regular.widthOfTextAtSize(' ', bodyFontSize);

    // Draw prefix (regular) and name (bold) on the same line
    page.drawText(prefixText, {
        x: marginLeft,
        y: currentY,
        size: bodyFontSize,
        font: config.fonts.regular,
        color: config.colors.text
    });
    page.drawText(name, {
        x: marginLeft + prefixWidth,
        y: currentY,
        size: bodyFontSize,
        font: config.fonts.bold,
        color: config.colors.boldText
    });

    // Draw the rest of the paragraph, starting after the name and wrapping
    const initialXForBody = marginLeft + prefixWidth + nameWidth + spaceWidth;
    currentY = drawWrappedText(page, mainBodyText, {
        x: marginLeft, // Base X for subsequent lines
        y: currentY,   // Starting Y for the whole block
        font: config.fonts.regular,
        size: bodyFontSize,
        color: config.colors.text,
        maxWidth: contentWidth,
        lineHeight: bodyLineHeight,
        initialX: initialXForBody // Start first segment after the name
    });
    // drawWrappedText returns Y below the text, so no need to subtract lineHeight here

    // --- Technical Session Section ---
    currentY -= config.spacing.afterMainBody; // Space after main paragraph
    const techIntro = 'During the Industrial Visit, the students participated in a technical session on topics:';

    // Draw intro line first
    let introEndY = drawWrappedText(page, techIntro, {
        x: marginLeft,
        y: currentY,
        font: config.fonts.regular,
        size: bodyFontSize,
        color: config.colors.text,
        maxWidth: contentWidth,
        lineHeight: bodyLineHeight,
    });

    // Add specific extra space *before* the list items
    currentY = introEndY - config.spacing.beforeTechList;

    // Format and draw the project list (bold)
    // Ensure clean numbering: Assumes input like "Topic A, Topic B and Topic C"
    // 1) Topic A, 2) Topic B and 3) Topic C
    let formattedProject = `1) ${project}`;
    formattedProject = formattedProject.replace(/,\s*and\s+/gi, ", 2) and "); // Handle 'and' between 1 and 2 if present
    formattedProject = formattedProject.replace(/,\s*/g, ", 2) "); // Basic comma separation
    formattedProject = formattedProject.replace(/and\s+/gi, "and 3) "); // Find remaining 'and' for the third item
    // This regex approach is brittle; a more robust solution would parse the string properly.
    // Assuming the input format is consistent for now.

    currentY = drawWrappedText(page, formattedProject, {
        x: marginLeft + 15, // Indent list items
        y: currentY,
        font: config.fonts.bold, // List items are bold
        size: bodyFontSize,
        color: config.colors.boldText,
        maxWidth: contentWidth - 15, // Adjust maxWidth for indentation
        lineHeight: bodyLineHeight,
    });

    // --- Closing Line ---
    currentY -= config.spacing.afterTechList; // Space after list
    const closingLine = "We wish him/her great success in all of his/her future endeavours.";
    currentY = drawWrappedText(page, closingLine, {
        x: marginLeft,
        y: currentY,
        font: config.fonts.regular,
        size: bodyFontSize,
        color: config.colors.text,
        maxWidth: contentWidth,
        lineHeight: bodyLineHeight,
    });

    return currentY; // Return Y position below the closing line
};


/**
 * Draws the signature block (Regards, Image, Name, Title).
 * Returns the Y position below the signature content.
 */
const drawSignature = async (page, pdfDoc, config, signatureImageInput, startY) => {
    let currentY = startY;
    const { left: marginLeft } = config.margins;
    const sigLineHeight = config.lineHeights.signature;
    const sigFontSize = config.fontSizes.signatureDetails; // Use details size for consistency
    const sigNameFontSize = config.fontSizes.signatureName;

    // --- Calculate starting Y, ensuring minimum space from bottom ---
    const signatureBlockHeightEstimate =
        sigLineHeight * 1 // "Kind Regards,"
        + config.signature.imageMaxHeight // Signature image space
        + sigLineHeight * 1 // Name
        + sigLineHeight * 1 // Title
        + sigLineHeight * 1; // Location
    const minSignatureStartY = config.signature.minYFromBottom + signatureBlockHeightEstimate;

    // Adjust starting Y if the content above finished too low
    currentY -= config.spacing.beforeSignature; // Space before "Kind Regards,"
    currentY = Math.min(currentY, config.page.height - minSignatureStartY);

    // --- Draw Signature Elements ---
    page.drawText("Kind Regards,", {
        x: marginLeft,
        y: currentY,
        size: sigFontSize,
        font: config.fonts.regular,
        color: config.colors.text,
    });
    currentY -= sigLineHeight * 1.2; // Slightly more space after Regards

    // --- Signature Image ---
    let signatureImageBottomY = currentY - config.signature.imageMaxHeight; // Reserve space even if error/no image
    if (signatureImageInput) {
        try {
            const signatureImage = await pdfDoc.embedPng(signatureImageInput);
            const sigScaleH = config.signature.imageMaxHeight / signatureImage.height;
            const sigScaleW = config.signature.imageMaxWidth / signatureImage.width;
            const sigScale = Math.min(sigScaleH, sigScaleW, 1); // Don't scale up
            const sigDims = signatureImage.scale(sigScale);

            page.drawImage(signatureImage, {
                x: marginLeft,
                y: currentY - sigDims.height, // Draw upwards from bottom edge
                width: sigDims.width,
                height: sigDims.height,
            });
            signatureImageBottomY = currentY - sigDims.height; // Actual bottom Y
        } catch (imgError) {
            console.error("Error embedding signature:", imgError);
            page.drawText("[Signature Error]", {
                x: marginLeft,
                y: currentY - sigLineHeight, // Placeholder text position
                size: 10, font: config.fonts.regular, color: config.colors.error
            });
            signatureImageBottomY = currentY - sigLineHeight * 1.5; // Adjust bottom Y for error text
        }
    } else {
         // No signature image provided, leave the reserved space empty or add placeholder
         signatureImageBottomY = currentY - sigLineHeight * 1.5; // Slightly less space if no image planned
    }

    currentY = signatureImageBottomY - sigLineHeight; // Space below image/placeholder before name

    // --- Signature Text ---
    page.drawText(config.signature.fixedName, {
        x: marginLeft,
        y: currentY,
        size: sigNameFontSize,
        font: config.fonts.bold, // Name is bold
        color: config.colors.boldText,
    });
    currentY -= sigLineHeight;

    page.drawText(config.signature.fixedTitle, {
        x: marginLeft,
        y: currentY,
        size: sigFontSize,
        font: config.fonts.regular,
        color: config.colors.text,
    });
    currentY -= sigLineHeight;

    page.drawText(config.signature.fixedLocation, {
        x: marginLeft,
        y: currentY,
        size: sigFontSize,
        font: config.fonts.regular,
        color: config.colors.text,
    });
    currentY -= sigLineHeight; // Position below the last line

    return currentY;
};

/**
 * Draws the footer section (Background, Capsule, Text).
 */
const drawFooter = (page, config) => {
    const { width: pageWidth, height: pageHeight } = config.page; // Added pageHeight
    const { height: footerHeight, capsuleHeight, col1Text, col2Text, col3Text } = config.footer;
    const { left: marginLeft, right: marginRight } = config.margins; // Use page margins for padding
    const borderRadius = capsuleHeight / 2; // Automatically adjusts with new capsuleHeight
    const footerY = 0; // Footer background starts at the bottom

    // --- Adjustments based on request ---
    const verticalOffset = 25; // Keep the existing vertical offset
    const whiteShapeY = footerY + footerHeight - capsuleHeight + verticalOffset; // Position white shape slightly higher (uses new capsuleHeight)
    const whiteShapeWidth = pageWidth * 0.70; // Increase width to 75% of page width

    // --- Footer Background ---
    page.drawRectangle({
        x: 0,
        y: footerY,
        width: pageWidth, // Background still full width
        height: footerHeight,
        color: config.colors.footerBackground,
    });

    // --- New White Shape (Top-aligned, straight left, round right, 75%-width) ---
    // Rectangle part
    page.drawRectangle({
        x: 0,
        y: whiteShapeY,
        width: whiteShapeWidth - borderRadius, // Stop before the rounded corner starts (uses new width and radius)
        height: capsuleHeight, // Uses new height
        color: config.colors.footerCapsule,
    });
    // Right rounded end (ellipse)
    page.drawEllipse({
        x: whiteShapeWidth - borderRadius, // Center X of ellipse is at the start of the curve (adjusted for new width)
        y: whiteShapeY + borderRadius,   // Center Y of ellipse is halfway up the shape's height (uses new Y and radius)
        xScale: borderRadius, // Uses new radius
        yScale: borderRadius, // Uses new radius
        color: config.colors.footerCapsule,
    });


    // --- Footer Text Layout (Adjusted for new 75%-width shape and page margins) ---
    const footerFontSize = config.fontSizes.footer;
    const footerLineHeight = config.lineHeights.footer;
    const footerTextColor = config.colors.footerText;
    const regularFont = config.fonts.regular;

    // Calculate positioning constraints
    const totalInnerWidth = whiteShapeWidth - marginLeft - marginRight; // Available space between margins
    const verticalPadding = 4; // Adjusted padding top/bottom inside the shape
    const lineSpacing = 6; // Adjusted extra space between lines

    // Define X positions for the first two columns
    const col1StartX = marginLeft;
    const col2StartX = marginLeft + totalInnerWidth * 0.5; // Start second column around the midpoint

    // Calculate Vertical Positions within the new White Shape
    const textBaseY = whiteShapeY; // Bottom Y of the shape
    const availableTextHeight = capsuleHeight - 2 * verticalPadding;

    // Position the top two lines
    const textTopY = textBaseY + availableTextHeight + verticalPadding - footerFontSize*0.2; // Fine-tuned starting point
    const textMidY = textTopY - footerLineHeight - lineSpacing; // Y for the second line

    // Position the address line(s) - Starts below the second line
    const addressStartY = textMidY - footerLineHeight - lineSpacing * 1.5; // Adjusted space before address


    // --- Column 1: Website (Left Aligned at page margin) ---
    page.drawText(col1Text[0], { x: col1StartX, y: textTopY, size: footerFontSize, font: regularFont, color: footerTextColor });
    page.drawText(col1Text[1], { x: col1StartX, y: textMidY, size: footerFontSize, font: regularFont, color: footerTextColor });

    // --- Column 2: Email & Phone (Left Aligned at col2StartX) ---
    const email = col2Text[0];
    const phone = col2Text[1];
    // Draw left-aligned at col2StartX
    page.drawText(email, { x: col2StartX, y: textTopY, size: footerFontSize, font: regularFont, color: footerTextColor });
    page.drawText(phone, { x: col2StartX, y: textMidY, size: footerFontSize, font: regularFont, color: footerTextColor });

    // --- Row 3: Address (Wrapped, spans available width) ---
    const addressText = col3Text;
    drawWrappedText(page, addressText, {
        x: col1StartX, // Start from the left margin
        y: addressStartY, // Start below the previous lines
        font: regularFont,
        size: footerFontSize,
        color: footerTextColor,
        maxWidth: totalInnerWidth, // Use the full available width for wrapping
        lineHeight: footerLineHeight,
    });
};


// --- Main PDF Generation Function ---

/**
 * Generates an industrial visit certificate PDF based on provided data.
 * @param {Object} certificateData - Data for the certificate (name, college, etc.)
 * @returns {Promise<Blob>} - A promise resolving to the generated PDF blob.
 */
export const generateCertificatePDF = async (certificateData) => {
  const { logo, signature, ...bodyData } = certificateData; // Separate images from text data

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([pdfConfig.page.width, pdfConfig.page.height]);

    // --- Embed Fonts ---
    // Store embedded fonts in the config for easy access by drawing functions
    pdfConfig.fonts.regular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    pdfConfig.fonts.bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // --- Calculate Derived Config Values ---
    pdfConfig.contentWidth = pdfConfig.page.width - pdfConfig.margins.left - pdfConfig.margins.right;
    pdfConfig.headerBaseY = pdfConfig.page.height - pdfConfig.margins.top;

    // --- Draw Sections Sequentially ---
    let currentY = pdfConfig.headerBaseY; // Start drawing from the top

    currentY = await drawHeader(page, pdfDoc, pdfConfig, logo);

    // Adjust starting Y for body based on header output, plus initial spacing
    // drawHeader returns Y *below* the date line.
    // The title drawing logic in drawBody adds spacing *before* drawing.
    const bodyStartY = currentY; // Start body content calculation from here

    currentY = drawBody(page, pdfConfig, bodyData, bodyStartY);

    // drawBody returns Y *below* the closing line.
    const signatureStartY = currentY; // Start signature calculation from here

    currentY = await drawSignature(page, pdfDoc, pdfConfig, signature, signatureStartY);
    // The Y position returned by drawSignature isn't strictly needed unless more content follows.

    // Footer is drawn at a fixed position (bottom)
    drawFooter(page, pdfConfig);

    // --- Save PDF ---
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });

  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    // Consider returning a specific error object or blob if needed
    throw error; // Re-throw the error for the caller to handle
  }
};