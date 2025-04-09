import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts, TextAlignment,} from "pdf-lib";
import '../src/assets/main.css';

const CertificatePDF = () => {
  const [name, setName] = useState("Ms Jane Doe");
  const [college, setCollege] = useState("IFET College of Engineering, Villupuram");
  const [year, setYear] = useState("II year B.Tech");
  const [course, setCourse] = useState("Artificial Intelligence and Data Science");
  const [company, setCompany] = useState("AAHA Solutions.");
  const [project, setProject] = useState("1) React.js,2) Redux and 3)Test Automation using selenium");
  const [startDate, setStartDate] = useState("01-01-2025");
  const [endDate, setEndDate] = useState("01-06-2025");
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const[footer,setfooter]=useState(null);

  


  // Handle image upload (logo/signature)
  const handleFileChange = (e, setter) => {
  const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    const username = name
    console.log("username",username)
    try{
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let startY = height - 250;
    const lineHeight = 20;
    const fontSize = 12;
    const regularFont = font;
    const boldFont = helveticaBold;
    const footerY = 100; // Adjust this as needed
    const footerHeight = 80;
    const whiteBoxHeight = 100;
   const whiteBoxY = 0 + footerHeight - 40; // slight overlap
   const boxMargin = 80;
    
   // Background
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(248 / 255, 249 / 255, 247 / 255) });

    // Title
    // page.drawText("Certificate of Completion", { x: 250, y: height - 70, size: 30, font, color: rgb(0, 0, 0) });
    const title = "INDUSTRIAL VISIT CERTIFICATE";
    const titleWidth = helveticaBold.widthOfTextAtSize(title, 20);
    page.drawText(title, { x: (width - titleWidth) / 2, y: height - 200, size: 16,font: helveticaBold, color: rgb(0, 0, 0) });
  
    
    
    // First line with bold name
    let certificateContent=
    page.drawText("This is to Certify that ", { x: 40, y: startY, size: fontSize, font: regularFont, color: rgb(0, 0, 0) });
    
    const nameWidth = boldFont.widthOfTextAtSize(name, fontSize);
    const prefixWidth = regularFont.widthOfTextAtSize("This is to Certify that ", fontSize);
    page.drawText(name, {
      x: 40 + prefixWidth,
      y: startY,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    startY -= lineHeight;
    page.drawText(`from ${college} studying ${year} and ${course},`, {
      x: 40,
      y: startY,
      size: fontSize,
      font: regularFont,
      color: rgb(0, 0, 0),
    });
    
    startY -= lineHeight;
    page.drawText(`industrial visit programme at "${company}", at 27, 3rd cross Brindavan, Pondicherry on ${startDate}`, {
      x: 40,
      y: startY,
      size: fontSize,
      font: regularFont,
      color: rgb(0, 0, 0),
    });
    // Line 1: "During the industrial visit the students participated in a technical session on topics"
startY -= 30;
const line1 = 'During the industrial visit the students participated in a technical session on topics';
const line1Width = regularFont.widthOfTextAtSize(line1, fontSize);
const line1X = (width- line1Width) / 2-40;

page.drawText(line1, {
  x: line1X,
  y: startY,
  size: fontSize,
  font: regularFont,
  color: rgb(0, 0, 0),
});

// Line 2: project name in bold inside quotes
startY -= lineHeight;
const quotedProject = `"${project}"`;
const line2Width = boldFont.widthOfTextAtSize(quotedProject, fontSize);
const line2X = (width - line2Width) / 2-80;

page.drawText(quotedProject, {
  x: line2X,
  y: startY,
  size: fontSize,
  font: boldFont,
  color: rgb(0, 0, 0),
});

    
    // startY -= 30;
    // const projectPrefix = 'During the industrial visit the students participated in a technical session  on topics "';
    // const projectPrefixWidth = regularFont.widthOfTextAtSize(projectPrefix, fontSize);
    // const projectWidth = boldFont.widthOfTextAtSize(project, fontSize);
   
    
    // page.drawText(projectPrefix, {
    //   x: 40,
    //   y: startY,
    //   size: fontSize,
    //   font: regularFont,
    //   color: rgb(0, 0, 0),
    // });
    
    // page.drawText(project, {
    //   x: 40 + projectPrefixWidth,
    //   y: startY,
    //   size: fontSize,
    //   font: boldFont,
    //   color: rgb(0, 0, 0),
    // });
    
    // page.drawText('".', {
    //   x: 40 + projectPrefixWidth + projectWidth,
    //   y: startY,
    //   size: fontSize,
    //   font: regularFont,
    //   color: rgb(0, 0, 0),
    // });
    
    startY -= 30;
    page.drawText("We wish him/her great success in all of his/her future endeavours.", {
      x: 40,
      y: startY,
      size: fontSize,
      font: regularFont,
      color: rgb(0, 0, 0),
    });
    
//  CertificatePDF Content
//    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    // let certificateContent = 
    //  `This to Certify that ${name} from ${college} studying ${year}and ${course}, 
    //   industrial vist programme at "${company}", at 27, 3rd cross Brindavan,pondicherry on${startDate} to ${endDate}, 

    //   During the industrial vist the students participated in a technical session on topics"${project}".

    //   We wish him /her great Success in all of his/her future endeavours.`;
       

    // Handle multi-line text
    // const words = certificateContent.split(" ");
    // let line = "";
    // let startY = height - 150;

    // words.forEach((word)=> {
    //   if ((line + word).length > 70) { 
    //     page.drawText(line, { x: 50, y: startY, size: 14, font, color: rgb(0, 0, 0) });
    //     startY -= 20;
    //     line = word + " ";
    //   } else {
    //     line += word + " ";
    //   }
    // });
    // page.drawText(line, { x: 50, y: startY, size: 14, font, color: rgb(0, 0, 0) });
    // const textSize = 14;
    // const textWidth = font.widthOfTextAtSize(certificateContent, textSize);
    // const maxWidth = width - 100; // Leaving some margin

    // let startY = height - 200; // Positioning text properly
    // const lines = certificateContent.match (/.{1,70}(\s|$)/g) || []; // Splitting into lines

    // lines.forEach((line) => {
    //   const lineWidth = font.widthOfTextAtSize(line, textSize);
    //   page.drawText(line, { x: (width - lineWidth) / 2, y: startY, size: textSize, font, color: rgb(0, 0, 0) });
    //   startY -= 20;
    // });
    // certificateContent = certificateContent.replace(/\n/g, " "); // Remove newlines

   // Start position for text
    // startY-=lineHeight;
    // const textSize = 14;
    // const maxWidth = width - 100; // Keep margins
    // let words = certificateContent.split(" ");
    // let line = "";

    // for (let word of words) {
    //   if (font.widthOfTextAtSize(line + " " + word, textSize) > maxWidth) {
    //     page.drawText(line, { x: 50, y: startY, size: textSize, font, color: rgb(0, 0, 0) });
    //     startY -= 20;
    //     line = word;
    //   } else {
    //     line += " " + word;
    //   }
    // }
    // page.drawText(line, { x: 50, y: startY, size: textSize, font, color: rgb(0, 0, 0) });


    // Add Logo
    if (logo) {
      const logoImage = await pdfDoc.embedPng(logo);
      page.drawImage(logoImage, { x: 10, y: height - 180, width: 250, height:250 });
    }
    page.drawLine({
      start:{ x: 230, y: height - 80 },
      end: { x: width - 30, y: height - 80 },
      thickness: 2,
      color: rgb(0.4, 0.4, 0.4),
    });
    // Create the formatted date string
const dateText = "Date: ";
const day = "4";
const suffix = "th"; // You can make this dynamic
const monthYear = " April 2025";

// Set X, Y position based on page width and desired top padding
const pageWidth = page.getWidth();
const dateX = pageWidth - 180;  // Adjust to align to the right
const dateY = page.getHeight() - 120;

// Draw "Date: "
page.drawText(dateText, {
  x: dateX,
  y: dateY,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});

// Draw "4"
page.drawText(day, {
  x: dateX + 38,
  y: dateY,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});

// Draw superscript "th"
page.drawText(suffix, {
  x: dateX + 48,
  y: dateY + 4, // Slightly higher for superscript
  size: 8,
  font,
  color: rgb(0, 0, 0),
});

// Draw " April 2025"
page.drawText(monthYear, {
  x: dateX + 60,
  y: dateY,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});

    // Add Signature
    if (signature) {
      const leftMargin = 50, bottomMargin = 50;
      const signatureImage = await pdfDoc.embedPng(signature);
      page.drawImage(signatureImage, { x: leftMargin, y: bottomMargin + 220, width: 150, height: 60 });

      page.drawText("Kind Regadrs", { x: leftMargin, y: bottomMargin + 280, size: 12, font, color: rgb(0, 0, 0.5) });
      page.drawText("K.R. SRIDHAR", { x: leftMargin, y: bottomMargin + 230, size: 12, font, color: rgb(0, 0, 0) });
      page.drawText("Business Development Manager", { x: leftMargin, y: bottomMargin + 210, size: 12, font, color: rgb(0, 0, 0) });
      page.drawText("AAHA Solutions pondicherry", { x: leftMargin, y: bottomMargin+190, size: 12, font, color: rgb(0, 0, 0) });
    }
    // ✅ Footer Section


// Green footer rectangle
page.drawRectangle({
  x: 0,
  y: 0,
  width: width,
  height: footerHeight,
  color: rgb(0.3, 0.7, 0.2),
});



// Dimensions
const capsuleWidth = width - 200;
const capsuleHeight = 70;
// const capsuleX = (width - capsuleWidth) / 2;
const capsuleX = 0;
const capsuleY = footerHeight - capsuleHeight / 2;

// Left rounded end
page.drawEllipse({
  x: capsuleX + capsuleHeight / 2,
  y: capsuleY + capsuleHeight / 2,
  xScale: capsuleHeight / 2,
  yScale: capsuleHeight / 2,
  color: rgb(1, 1, 1),
});

// Right rounded end
page.drawEllipse({
  x: capsuleX + capsuleWidth - capsuleHeight / 2,
  y: capsuleY + capsuleHeight / 2,
  xScale: capsuleHeight / 2,
  yScale: capsuleHeight / 2,
  color: rgb(1, 1, 1),
});

// Center rectangle
page.drawRectangle({
  x: capsuleX + capsuleHeight / 2,
  y: capsuleY,
  width: capsuleWidth - capsuleHeight,
  height: capsuleHeight,
  color: rgb(1, 1, 1),
});

    // 3. Add Text inside the capsule
    const textStartY = capsuleY + capsuleHeight / 2 + 5; // Start text slightly above the vertical center
    const textLineHeight = 15;
    const textLeftMargin = capsuleX + 20;
    const textRightMargin = capsuleX + capsuleWidth - 200; // Adjust as needed
    const footerFontSize = 9;
    


    page.drawText("aahasolutions.com", { x: textLeftMargin + 20 , y: textStartY + textLineHeight / 2, size: footerFontSize, font, color: rgb(0, 0, 0) }); // Placeholder, Skipped Skype icon logic
    page.drawText("www.aahasolutions.com", { x: textLeftMargin+20, y: textStartY - textLineHeight / 2, size: footerFontSize, font, color: rgb(0, 0, 0) });

    page.drawText("info@aahasolutions.com", { x: textRightMargin - 50, y: textStartY + textLineHeight / 2, size: footerFontSize, font, color: rgb(0, 0, 0) });
    page.drawText("+918098299921", { x: textRightMargin -50, y: textStartY - textLineHeight / 2, size: footerFontSize, font, color: rgb(0, 0, 0) });

    page.drawText("No:27,3rdCross,SithanKudi,BrindavanColony,Puducherry-605013.", { x: textLeftMargin+20, y: textStartY - textLineHeight * 1.5, size: footerFontSize-1, font, color: rgb(0, 0, 0) });







// Save and Download PDF
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "certificate.pdf";
    link.click();
    URL.revokeObjectURL(link.href);
  }catch(error){
    console.error("error generatingPDF:",error);
  }
}
return (
    <div className="certificate-generator">
      <h1>PDFLib Certificate Generator</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="College"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"

          placeholder="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <div className="file-upload">
          <label>Logo:</label>
          <input type="file" onChange={(e) => handleFileChange(e, setLogo)} />
        </div>

        <div className="file-upload">
          <label>Signature:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setSignature)}
          />
        </div>
        

        <button onClick={() => generatePDF()}>
          Download Certificate</button>      </div>
    
    </div>

  );
};
   
    
   

export default CertificatePDF;