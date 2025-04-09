

import React from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import'../src/assets/main.css';


const PDFLibCertificate = async ({ name, course, logo, signature ,}) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 600]);
  const date = new Date().toLocaleDateString(); // Formats today's date

  // Colors
  const black = rgb(0, 0, 0);
  const blue = rgb(0.1, 0.4, 0.8);
  const gray = rgb(0.6, 0.6, 0.6);

  // Fonts
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Page Dimensions
  const { width, height } = page.getSize();

  // ✅ Add Logo (Ensure it's properly embedded)
  if (logo) {
    try {
      const logoImageBytes = logo.startsWith("data:image")
        ? atob(logo.split(",")[1])
        : await fetch(logo).then((res) => res.arrayBuffer());

      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      page.drawImage(logoImage, {
        x: 50,
        y: height - 120,
        width: 100,
        height: 100,
      });
    } catch (error){
      console.error("Failed to load logo:", error);
    }
  }

  // ✅ Add Certificate Title
  const titleText = "INDURSTIAL VISIT CERTIFICATE";
  const textWidth =  helveticaBold.widthOfTextAtSize(titleText, 20);
  const centerX = (width - textWidth) / 2; 
  
  page.drawText(titleText, {
    x: centerX,
    y: height - 80,
    size: 30,
    font: titleFont,
    color: blue,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: rgb(0.9, 0.9, 0.9), // Light gray background
  });
  
  

  // ✅ Certificate Body
  page.drawText(`This certifies that`, {
    x: 200,
    y: height - 130,
    size: 16,
    font: bodyFont,
    color: black,
  });

  page.drawText(`${name}`, {
    x: 200,
    y: height - 160,
    size: 24,
    font: helveticaBold,
    color: blue,
  });

  page.drawText(`has successfully completed the`, {
    x: 200,
    y: height - 190,
    size: 16,
    font: bodyFont,
    color: black,
  });

  page.drawText(`${course}`, {
    x: 200,
    y: height - 220,
    size: 20,
    font: titleFont,
    color: black,
  });

  page.drawText(`on ${date}`, {
    x: 200,
    y: height - 250,
    size: 14,
    font: bodyFont,
    color: gray,
  });

 // ✅ Add Signature (Ensure Proper Embedding)
  if (signature) {
    try {
      const signatureImageBytes = signature.startsWith("data:image")
        ? atob(signature.split(",")[1])
        : await fetch(signature).then((res) => res.arrayBuffer());

      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
      page.drawImage(signatureImage, {
        x: 550,
        y: footerY + 50, // Adjusted so it's clearly visible
        width: 150,
        height: 50,
      });

      page.drawText("Kind Regards", {
        x: 550,
        y: footerY + 30,
        size: 10,
        font: bodyFont,
        color: black,
      });
    } catch (error) {
      console.error("Failed to load signature:", error);
    }
  }
  
// Draw the green curve using SVG path
// ✅ Add Green Curved Footer Directly
// const footerHeight = 80; // Adjust as needed
// const footerY = 0; // Positioned at the bottom

// // Draw a smooth curved footer using SVG path
// page.drawRectangle(
//   // "M0,0 C200,150 600,-50 800,0 L800,100 L0,100 Z",
//   {
//     x: 0,
//     y: 0, // Bottom of the page
//     width:width,
//     height:footerY,
//     // scale: 1,
//     color: rgb(0.3, 0.6, 0.3), // Green Color
//   }
// );





 // ✅ Save and Download PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  // Download the PDF after a slight delay
  setTimeout(() => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `Certificate_${name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

export default PDFLibCertificate;

