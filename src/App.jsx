import { useState } from "react";
import axios from "axios";
import "./styles/index.scss";

const App = () => {
  const [certificate, setCertificate] = useState('');
  const [name, setName] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('number');
  const [certificateData, setCertificateData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);

    try {
      const response = await axios.get("http://81.19.135.141/data/certificates.json");
      const certificates = response.data;

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (activeTab === 'number' && !certificate.trim()) {
        setVerificationResult('empty');
      } else if (activeTab === 'name' && !name.trim()) {
        setVerificationResult('empty');
      } else {
        let foundCert = null;
        
        if (activeTab === 'number') {
          foundCert = certificates.find(cert => 
            cert.code.toLowerCase() === certificate.trim().toLowerCase()
          );
        } else {
          const searchName = name.trim().toLowerCase();
          foundCert = certificates.find(cert => {
            const fullName = `${cert.surname} ${cert.name} ${cert.patronymic}`.toLowerCase();
            return fullName.includes(searchName);
          });
        }
        
        if (foundCert) {
          setCertificateData({
            fullName: `${foundCert.surname} ${foundCert.name} ${foundCert.patronymic}`,
            code: foundCert.code,
            date: foundCert.date,
            qualification: foundCert.qualification
          });
          setVerificationResult('valid');
        } else {
          setVerificationResult('invalid');
        }
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setVerificationResult('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getResultMessage = () => {
    switch (verificationResult) {
      case 'empty':
        return <span>Please enter a {activeTab === 'number' ? 'certificate code' : 'name'}</span>;
      case 'valid':
        return <span>Certificate verified successfully</span>;
      case 'invalid':
        return <span>{activeTab === 'number' ? 'Certificate not found' : 'No certificates found for this name'}</span>;
      case 'error':
        return <span>Verification service unavailable</span>;
      default:
        return null;
    }
  };

  const resetForm = () => {
    setCertificate('');
    setName('');
    setVerificationResult(null);
    setIsSubmitted(false);
    setCertificateData(null);
  };

  return (
    <div className="certificate-page">
      <main className="main-content">
        <div className="logo">CERTIFY CHECK</div>
        
        {!certificateData ? (
          <>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'number' ? 'active' : ''}`}
                onClick={() => setActiveTab('number')}
              >
                By Certificate Number
              </button>
              <button
                className={`tab ${activeTab === 'name' ? 'active' : ''}`}
                onClick={() => setActiveTab('name')}
              >
                By Name
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="certificate-form">
              {activeTab === 'number' ? (
                <div className="form-group">
                  <input
                    type="text"
                    id="certificate"
                    value={certificate}
                    onChange={(e) => setCertificate(e.target.value)}
                    placeholder="Enter certificate code"
                    className={isSubmitted ? 'submitted' : ''}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <label htmlFor="certificate">Certificate Number</label>
                  <div className="underline"></div>
                </div>
              ) : (
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter surname or full name"
                    className={isSubmitted ? 'submitted' : ''}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <label htmlFor="name">Full Name</label>
                  <div className="underline"></div>
                </div>
              )}
              
              <button 
                type="submit" 
                className={`verify-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span className="btn-text">Verifying...</span>
                  </>
                ) : (
                  <span className="btn-text">Verify Certificate</span>
                )}
              </button>
            </form>

            {isSubmitted && !isLoading && (
              <div className={`result-block ${verificationResult}`}>
                {getResultMessage()}
              </div>
            )}
          </>
        ) : (
          <div className="certificate-details">
            <h2 className="details-title">Certificate Details</h2>
            
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{certificateData.fullName}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Certificate Number:</span>
              <span className="detail-value">{certificateData.code}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Issue Date:</span>
              <span className="detail-value">{certificateData.date}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Qualification:</span>
              <span className="detail-value">{certificateData.qualification}</span>
            </div>
            
            <button 
              onClick={resetForm}
              className="back-button"
            >
              Back to Verification
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="copyright">
          © {new Date().getFullYear()} Certify Validation System
        </div>
      </footer>
    </div>
  );
};

export default App;