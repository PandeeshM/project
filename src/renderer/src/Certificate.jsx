// import React from "react";

// const Certificate = ({ name, course, college, project, internship, startDate, endDate, date, signature }) => {
//   return (
//     <div className="bg-white border-2 border-gray-300 shadow-lg rounded-lg w-[900px] h-[1273px] mx-auto p-12 font-sans relative">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         {/* Logo */}
//         <div className="flex items-center">
//           <img src="/logo.png" alt="Logo" className="w-52" /> 
//         </div>
//         <div className="text-right">
//           <p className="text-gray-600 text-md font-bold">DATED {date}</p>
//           <p className="text-gray-600 text-md">PONDICHERRY</p>
//         </div>
//       </div>

//       <hr className="my-6 border-gray-400" />

//       {/* Certificate Title */}
//       <h1 className="text-center text-2xl font-bold tracking-wide">
//         CERTIFICATE OF COMPLETION
//       </h1>

//       {/* Certificate Content */}
//       <p className="mt-8 text-justify leading-relaxed text-lg">
//         This certificate is presented to <span className="font-bold">{name}</span> from <span className="font-bold">{college}</span> studying II year <span className="font-bold">{course}</span> course, for she has successfully completed the internship in <span className="font-bold">{internship}</span> in our company during the period 
//         <span className="font-bold"> {startDate} to {endDate}</span> and has worked in the project 
//         <span className="font-bold"> “{project}”</span>.
//       </p>

//       {/* Signature */}
//       <div className="mt-12">
//         <p className="text-md">Authorised Signatory</p>
//         <img src={signature} alt="Signature" className="w-40 mt-2" />
//         <p className="mt-2 text-lg font-bold">K.R.SRIDHAR,</p>
//         <p>Business Development Manager,</p>
//         <p>AAHA Solutions</p>
//       </div>

//       {/* Footer */}
//       <div className="absolute bottom-0 left-0 w-full">
//         <div className="bg-green-100 p-6">
//           <div className="flex justify-between text-sm">
//             <div className="flex items-center gap-2">
//               <img src="/icons/web.png" alt="web" className="w-5" />
//               <p>www.aahasolutions.com</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <img src="/icons/email.png" alt="email" className="w-5" />
//               <p>info@aahasolutions.com</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <img src="/icons/phone.png" alt="phone" className="w-5" />
//               <p>+91 809 829 9921</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <img src="/icons/location.png" alt="location" className="w-5" />
//               <p>No: 27, 3rd Cross, SithanKudi, Brindavan Colony, Puducherry - 605 013.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Certificate;

// import React, { useRef } from "react";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// const Certificate = () => {
//   const certificateRef = useRef(null);

//   const generatePDF = () => {
//     const input = certificateRef.current;
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save("certificate.pdf");
//     });
//   };

//   return (
//     <div>
//       <div className="certificate" ref={certificateRef}>
//         <h2>AAHA SOLUTIONS</h2>
//         <p>DATE: 18/02/2025</p>
//         <h3>CERTIFICATE OF COMPLETION</h3>
//         <p>
//           This certificate is presented to <b>Ms. Divya S</b> from IFET
//           College of Engineering, Villupuram studying II year B.Tech
//           Artificial Intelligence and Data Science course, for successfully
//           completing the internship in "Software Development" in our company
//           during the period 12/02/2025 to 18/02/2025.
//         </p>
//         <p><b>K.R. Sridhar</b></p>
//         <p>Business Development Manager,</p>
//           <p>AAHA Solutions</p>
//       </div>
//       <button onClick={generatePDF}>Download PDF</button>
//     </div>
//   );
// };

// export default Certificate;
import React from 'react';
import './Certificate.css';  // Import your styles

const Certificate= () => {
  return (
    <div className="certificate-container">

      {/* Header */}
      <div className="certificate-header">
        <img src="/path-to-logo.png" alt="Company Logo" />
        <div className="date-location">
          <p>DATED 18/02/2025,</p>
          <p>PONDICHERRY</p>
        </div>
      </div>

      {/* Title */}
      <div className="certificate-title">CERTIFICATE OF COMPLETION</div>

      {/* Body */}
      <div className="certificate-body">
        <p>
          This certificate is presented to <strong>Ms Divya S</strong> from IFET College of Engineering, Villupuram
          studying II year B.Tech Artificial Intelligence and Data Science course, for she has successfully completed
          the internship in <strong>“software development”</strong> in our company during the period <strong>12/02/2025</strong> to 
          <strong>18/02/2025</strong> and has worked in the project <strong>“Guest House Booking and Transactions Tracking”</strong>.
        </p>
      </div>

      {/* Signature */}
      <div className="signature">
        <div>
          <p>Authorised Signatory</p>
          <img src="/path-to-signature.png" alt="Signature" />
          <p>
            <strong>K.R. SRIDHAR</strong><br />
            Business Development Manager,<br />
            AAHA Solutions
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div>
          <img src="/path-to-icon-skype.png" alt="Skype Icon" />
          <span>aahasolutions.com</span>
        </div>
        <div>
          <img src="/path-to-icon-email.png" alt="Email Icon" />
          <span>info@aahasolutions.com</span>
        </div>
        <div>
          <img src="/path-to-icon-phone.png" alt="Phone Icon" />
          <span>+91 809 829 9921</span>
        </div>
        <div>
          <img src="/path-to-icon-location.png" alt="Location Icon" />
          <span>No: 27, 3rd Cross, SithanKudi, Brindavan Colony, Puducherry - 605 013</span>
        </div>
      </div>

    </div>
  );
};

export default Certificate;