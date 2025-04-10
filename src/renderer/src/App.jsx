import React, { useState } from 'react';
import CertificateForm from './CertificateForm';

const App = () => {
  const [activeTab, setActiveTab] = useState('generator');
  
  return (
    <div className="app">
      <nav className="app-header">
        <div className="app-logo">
          <span>Certificate</span>
          <span className="logo-accent">Generator</span>
        </div>
        <div className="app-nav">
          <a 
            href="#" 
            className={activeTab === 'generator' ? 'active' : ''} 
            onClick={(e) => {
              e.preventDefault(); 
              setActiveTab('generator');
            }}
          >
            Generator
          </a>
          <a 
            href="#" 
            className={activeTab === 'templates' ? 'active' : ''} 
            onClick={(e) => {
              e.preventDefault(); 
              setActiveTab('templates');
            }}
          >
            Templates
          </a>
          <a 
            href="#" 
            className={activeTab === 'help' ? 'active' : ''} 
            onClick={(e) => {
              e.preventDefault(); 
              setActiveTab('help');
            }}
          >
            Help
          </a>
        </div>
      </nav>
      <main className="app-content">
        {activeTab === 'generator' && <CertificateForm />}
        {activeTab === 'templates' && (
          <div className="templates-container">
            <div className="certificate-header">
              <h1>Certificate Templates</h1>
              <p>Choose a template for your certificate</p>
            </div>
            <div className="templates-grid">
              <div className="template-card active">
                <div className="template-preview">
                  <div className="template-image industrial-visit"></div>
                </div>
                <div className="template-info">
                  <h3>Industrial Visit</h3>
                  <p>Certificate for industrial visits and technical sessions</p>
                </div>
                <div className="template-badge">Active</div>
              </div>
              <div className="template-card">
                <div className="template-preview">
                  <div className="template-image coming-soon"></div>
                </div>
                <div className="template-info">
                  <h3>Completion Certificate</h3>
                  <p>Coming soon</p>
                </div>
              </div>
              <div className="template-card">
                <div className="template-preview">
                  <div className="template-image coming-soon"></div>
                </div>
                <div className="template-info">
                  <h3>Achievement Award</h3>
                  <p>Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'help' && (
          <div className="help-container">
            <div className="certificate-header">
              <h1>Help & Instructions</h1>
              <p>Learn how to use the Certificate Generator</p>
            </div>
            <div className="help-content">
              <div className="help-section">
                <h2>Getting Started</h2>
                <p>Generate professional certificates in three simple steps:</p>
                <ol>
                  <li>Fill in the student and visit details</li>
                  <li>Upload your company logo and signature</li>
                  <li>Click the "Generate Certificate" button</li>
                </ol>
              </div>
              <div className="help-section">
                <h2>Customizing Your Certificate</h2>
                <p>All fields in the form can be customized to fit your needs:</p>
                <ul>
                  <li>The student name will appear in bold on the certificate</li>
                  <li>Technical topics should be separated by commas</li>
                  <li>Date will be automatically formatted for the certificate</li>
                </ul>
              </div>
              <div className="help-section">
                <h2>Uploading Images</h2>
                <p>For best results:</p>
                <ul>
                  <li>Use PNG images with transparent backgrounds</li>
                  <li>Logo should be at least 250×250 pixels</li>
                  <li>Signature should be at least 150×60 pixels</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Certificate Generator | Create Professional Certificates with Ease</p>
      </footer>
    </div>
  );
};

export default App;




