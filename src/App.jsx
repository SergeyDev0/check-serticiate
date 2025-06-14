import { useState } from "react";
import axios from "axios";
import "./styles/index.scss";

const App = () => {
  const [certificate, setCertificate] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [certificatesList, setCertificatesList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);

    try {
      const response = await axios.get("http://81.19.135.141/certificates.json");
      const certificates = response.data;
      setCertificatesList(certificates);

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!certificate.trim()) {
        setVerificationResult('empty');
      } else {
        const certExists = certificates.some(
          cert => cert.toLowerCase() === certificate.trim().toLowerCase()
        );
        
        setVerificationResult(certExists ? 'valid' : 'invalid');
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
        return <span>Please enter a certificate code</span>;
      case 'valid':
        return <span>Certificate verified successfully</span>;
      case 'invalid':
        return <span>Certificate not found</span>;
      case 'error':
        return <span>Verification service unavailable</span>;
      default:
        return null;
    }
  };

  return (
    <div className="certificate-page">
      <main className="main-content">
        <div className="logo">CERTIFY CHECK</div>
        
        <form onSubmit={handleSubmit} className="certificate-form">
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
            <label htmlFor="certificate">Certificate Verification</label>
            <div className="underline"></div>
          </div>
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