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
  const [footer, setFooter] = useState(null);
  
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
    const fields = ['name', 'college', 'year', 'course', 'company', 'project', 'startDate'];
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
      <div className="certificate-header">
        <h1>Certificate Generator</h1>
        <p>Create professional certificates for industrial visits</p>
      </div>

      <div className="certificate-content">
        <div className="certificate-form">
          <div className="form-section">
            <h2>Student Information</h2>
            <div>
              <div className="form-group">
                <label htmlFor="name">Student Name</label>
        <input
                  id="name"
          type="text"
          value={name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={formTouched.name && formErrors.name ? 'error' : ''}
        />
                {formTouched.name && formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="college">College</label>
        <input
                  id="college"
          type="text"
          value={college}
                  onChange={(e) => handleFieldChange('college', e.target.value)}
                  className={formTouched.college && formErrors.college ? 'error' : ''}
                />
                {formTouched.college && formErrors.college && <div className="error-message">{formErrors.college}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year</label>
        <input
                    id="year"
          type="text"
          value={year}
                    onChange={(e) => handleFieldChange('year', e.target.value)}
                    className={formTouched.year && formErrors.year ? 'error' : ''}
        />
                  {formTouched.year && formErrors.year && <div className="error-message">{formErrors.year}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="course">Course</label>
        <input
                    id="course"
          type="text"
          value={course}
                    onChange={(e) => handleFieldChange('course', e.target.value)}
                    className={formTouched.course && formErrors.course ? 'error' : ''}
                  />
                  {formTouched.course && formErrors.course && <div className="error-message">{formErrors.course}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Visit Details</h2>
            <div>
              <div className="form-group">
                <label htmlFor="company">Company</label>
        <input
                  id="company"
          type="text"
          value={company}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className={formTouched.company && formErrors.company ? 'error' : ''}
        />
                {formTouched.company && formErrors.company && <div className="error-message">{formErrors.company}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="project">Technical Topics</label>
                <textarea
                  id="project"
          value={project}
                  onChange={(e) => handleFieldChange('project', e.target.value)}
                  placeholder="Enter comma-separated topics"
                  rows="3"
                  className={formTouched.project && formErrors.project ? 'error' : ''}
                />
                {formTouched.project && formErrors.project && <div className="error-message">{formErrors.project}</div>}
              </div>
              
              <div className="form-row">
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
                  <label htmlFor="endDate">End Date (if applicable)</label>
        <input
                    id="endDate"
          type="date"
          value={endDate}
                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Certificate Assets</h2>
            <div>
              <div className="form-row">
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
                        <div className="placeholder-text">Upload company logo</div>
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
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              onClick={generatePDF} 
              disabled={isGenerating}
              className="generate-btn"
            >
              {isGenerating ? 'Generating...' : 'Generate Certificate'}
            </button>
            <button 
              onClick={resetForm} 
              className="reset-btn"
              disabled={isGenerating}
            >
              Reset Form
            </button>
          </div>
        </div>
        
        <div className="certificate-preview-container">
          <div className="certificate-preview-header">
            <h2>Certificate Preview</h2>
            {previewImg && (
              <a 
                href={previewImg} 
                download={`certificate_${name.replace(/\s+/g, '_')}.pdf`}
                className="download-btn"
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
                <p>Your certificate preview will appear here</p>
                <p className="hint">Fill in the form and click "Generate Certificate"</p>
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