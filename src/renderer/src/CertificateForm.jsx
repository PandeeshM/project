import React, { useState, useEffect } from "react";
import '../src/assets/main.css';
import { generateCertificatePDF } from "./components/certificate";

const CertificatePDF = () => {
  // Form state
  const [name, setName] = useState("Ms Jane Doe");
  const [college, setCollege] = useState("IFET College of Engineering, Villupuram");
  const [year, setYear] = useState("II year B.Tech");
  const [course, setCourse] = useState("Artificial Intelligence and Data Science");
  const [company, setCompany] = useState("AAHA Solutions.");
  const [project, setProject] = useState("1) React.js,2) Redux and 3)Test Automation using selenium");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-06-01");
  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'college':
        if (!value.trim()) error = 'College name is required';
        break;
      case 'year':
        if (!value.trim()) error = 'Year is required';
        break;
      case 'course':
        if (!value.trim()) error = 'Course is required';
        break;
      case 'company':
        if (!value.trim()) error = 'Company name is required';
        break;
      case 'project':
        if (!value.trim()) error = 'Technical topics are required';
        break;
      case 'startDate':
        if (!value) error = 'Visit date is required';
        break;
      case 'endDate':
        if (!value) error = 'Issue date is required';
        break;
      default:
        break;
    }
    
    return error;
  };

  // Handle field change and validation
  const handleFieldChange = (field, value) => {
    // Update form state based on field
    switch (field) {
      case 'name': setName(value); break;
      case 'college': setCollege(value); break;
      case 'year': setYear(value); break;
      case 'course': setCourse(value); break;
      case 'company': setCompany(value); break;
      case 'project': setProject(value); break;
      case 'startDate': setStartDate(value); break;
      case 'endDate': setEndDate(value); break;
      default: break;
    }
    
    // Mark field as touched
    setFormTouched({ ...formTouched, [field]: true });
    
    // Validate field
    const error = validateField(field, value);
    setFormErrors({ ...formErrors, [field]: error });
  };

  // Handle image upload (logo/signature)
  const handleFileChange = (e, setter, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        showToast('Please upload an image file', 'error');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
        showToast(`${type} uploaded successfully`, 'success');
      };
      reader.onerror = () => {
        showToast(`Failed to upload ${type}`, 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate entire form before submission
  const validateForm = () => {
    const fields = ['name', 'college', 'year', 'course', 'company', 'project', 'startDate', 'endDate'];
    const errors = {};
    let isValid = true;
    
    fields.forEach(field => {
      let value;
      switch (field) {
        case 'name': value = name; break;
        case 'college': value = college; break;
        case 'year': value = year; break;
        case 'course': value = course; break;
        case 'company': value = company; break;
        case 'project': value = project; break;
        case 'startDate': value = startDate; break;
        case 'endDate': value = endDate; break;
        default: value = ''; break;
      }
      
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    setFormErrors(errors);
    
    // Mark all fields as touched
    const touched = {};
    fields.forEach(field => {
      touched[field] = true;
    });
    setFormTouched(touched);
    
    return isValid;
  };
  
  // Reset form to default values
  const resetForm = () => {
    setName("Ms Jane Doe");
    setCollege("IFET College of Engineering, Villupuram");
    setYear("II year B.Tech");
    setCourse("Artificial Intelligence and Data Science");
    setCompany("AAHA Solutions.");
    setProject("1) React.js,2) Redux and 3)Test Automation using selenium");
    setStartDate("2025-01-01");
    setEndDate("2025-06-01");
    setLogo(null);
    setSignature(null);
    setFormErrors({});
    setFormTouched({});
    setPreviewImg(null);
    showToast('Form has been reset', 'info');
  };

  const generatePDF = async () => {
    // Validate form before generating PDF
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    
    // Start generating PDF
    setIsGenerating(true);
    showToast('Generating your certificate...', 'info');
    
    try {
      // Prepare certificate data
      const certificateData = {
        name,
        college,
        year,
        course, 
        company,
        project,
        startDate,
        endDate,
        logo,
        signature
      };
      
      // Generate PDF using the template component
      const pdfBlob = await generateCertificatePDF(certificateData);
      
      // Create a preview thumbnail
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPreviewImg(pdfUrl);
      
      // Create download link
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `certificate_${name.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      // Show success message
      showToast('Certificate generated successfully!', 'success');
      
      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
        setIsGenerating(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGenerating(false);
      showToast('Error generating certificate. Please try again.', 'error');
    }
  };

  return (
    <div className="certificate-container">
      <div className="page-header">
        <h1>Certificate Generator</h1>
        <p>Create professional certificates with just a few clicks</p>
      </div>

      <div className="certificate-workspace">
        <div className="card">
          <div className="card-header">
            <h2>Certificate Details</h2>
          </div>
          <div className="card-body">
            <div className="form-container">
              {/* Student Information */}
              <div className="form-group">
                <label htmlFor="name">Student Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={formTouched.name && formErrors.name ? 'error' : ''}
                  placeholder="Enter student's full name"
                />
                {formTouched.name && formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="college">College/Institution</label>
                <input
                  id="college"
                  type="text"
                  value={college}
                  onChange={(e) => handleFieldChange('college', e.target.value)}
                  className={formTouched.college && formErrors.college ? 'error' : ''}
                  placeholder="Enter college name"
                />
                {formTouched.college && formErrors.college && <div className="error-message">{formErrors.college}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="year">Year & Department</label>
                <input
                  id="year"
                  type="text"
                  value={year}
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                  className={formTouched.year && formErrors.year ? 'error' : ''}
                  placeholder="e.g. II year B.Tech"
                />
                {formTouched.year && formErrors.year && <div className="error-message">{formErrors.year}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="course">Course/Program</label>
                <input
                  id="course"
                  type="text"
                  value={course}
                  onChange={(e) => handleFieldChange('course', e.target.value)}
                  className={formTouched.course && formErrors.course ? 'error' : ''}
                  placeholder="e.g. Computer Science"
                />
                {formTouched.course && formErrors.course && <div className="error-message">{formErrors.course}</div>}
              </div>

              {/* Visit Information */}
              <div className="form-group">
                <label htmlFor="company">Company/Organization</label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className={formTouched.company && formErrors.company ? 'error' : ''}
                  placeholder="Enter company name"
                />
                {formTouched.company && formErrors.company && <div className="error-message">{formErrors.company}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Visit Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  className={formTouched.startDate && formErrors.startDate ? 'error' : ''}
                />
                {formTouched.startDate && formErrors.startDate && <div className="error-message">{formErrors.startDate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Certificate Issue Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => handleFieldChange('endDate', e.target.value)}
                  className={formTouched.endDate && formErrors.endDate ? 'error' : ''}
                />
                {formTouched.endDate && formErrors.endDate && <div className="error-message">{formErrors.endDate}</div>}
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label htmlFor="project">Technical Topics Covered</label>
                <textarea
                  id="project"
                  value={project}
                  onChange={(e) => handleFieldChange('project', e.target.value)}
                  placeholder="Enter comma-separated topics covered during the visit"
                  rows="3"
                  className={formTouched.project && formErrors.project ? 'error' : ''}
                />
                {formTouched.project && formErrors.project && <div className="error-message">{formErrors.project}</div>}
              </div>

              {/* Certificate Assets */}
              <div className="form-group file-upload">
                <label htmlFor="logo">Company Logo</label>
                <div className="file-input-container">
                  <input
                    id="logo"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => handleFileChange(e, setLogo, 'Logo')}
                  />
                  <div className="file-preview">
                    {logo ? (
                      <img src={logo} alt="Logo preview" />
                    ) : (
                      <div className="placeholder-text">Upload logo</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group file-upload">
                <label htmlFor="signature">Signature</label>
                <div className="file-input-container">
                  <input
                    id="signature"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => handleFileChange(e, setSignature, 'Signature')}
                  />
                  <div className="file-preview">
                    {signature ? (
                      <img src={signature} alt="Signature preview" />
                    ) : (
                      <div className="placeholder-text">Upload signature</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="actions-bar">
              <button 
                onClick={resetForm} 
                className="btn btn-secondary"
                disabled={isGenerating}
              >
                Reset
              </button>
              <button 
                onClick={generatePDF}
                disabled={isGenerating}
                className="btn btn-primary"
              >
                {isGenerating ? 'Generating...' : 'Generate Certificate'}
              </button>
            </div>
          </div>
        </div>

        <div className="card preview-card">
          <div className="card-header">
            <h2>Certificate Preview</h2>
            {previewImg && (
              <a 
                href={previewImg} 
                download={`certificate_${name.replace(/\s+/g, '_')}.pdf`}
                className="btn btn-accent"
                title="Download PDF"
              >
                Download PDF
              </a>
            )}
          </div>
          <div className="preview-container">
            {isGenerating && (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
              </div>
            )}
            {previewImg ? (
              <object
                data={previewImg}
                type="application/pdf"
                width="100%"
                height="100%"
                title="Certificate Preview"
              >
                <p>Unable to display PDF. <a href={previewImg} target="_blank" rel="noopener noreferrer">Download</a> instead.</p>
              </object>
            ) : (
              <div className="preview-placeholder">
                <p>Certificate Preview</p>
                <p className="hint">Certificate will appear here after generation</p>
                <div className="preview-mockup">
                  <div className="mockup-header"></div>
                  <div className="mockup-content">
                    <div className="mockup-title"></div>
                    <div className="mockup-text"></div>
                    <div className="mockup-text"></div>
                    <div className="mockup-signature">
                      <div className="mockup-sign"></div>
                      <div className="mockup-sign-line"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-message">{toast.message}</div>
        </div>
      )}
    </div>
  );
};

export default CertificatePDF;