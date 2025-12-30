import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0" style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div className="card-body p-5">
                <h1 className="mb-4" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>
                  Privacy Policy
                </h1>
                <p className="text-muted mb-4">
                  <small>Last Updated: December 14, 2025</small>
                </p>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>1. Introduction</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    Welcome to INTERNSHIP+ PORTAL. We are committed to protecting your personal information and your right to privacy. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                    and use our services.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>2. Information We Collect</h2>
                  <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>Personal Information</h3>
                  <p className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    We collect personal information that you voluntarily provide to us when you register on the platform, 
                    express an interest in obtaining information about us or our services, or otherwise contact us.
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Educational background and qualifications</li>
                    <li>Work experience and resume/CV</li>
                    <li>Profile picture and other profile details</li>
                    <li>Company information (for employers)</li>
                  </ul>

                  <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>Automatically Collected Information</h3>
                  <p className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    We automatically collect certain information when you visit, use, or navigate our platform. This information 
                    does not reveal your specific identity but may include device and usage information.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>3. How We Use Your Information</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    We use the information we collect or receive:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>To facilitate account creation and the login process</li>
                    <li>To send you marketing and promotional communications</li>
                    <li>To send administrative information to you</li>
                    <li>To fulfill and manage your applications and job postings</li>
                    <li>To post testimonials with your consent</li>
                    <li>To protect our services and ensure security</li>
                    <li>To enforce our terms, conditions, and policies</li>
                    <li>To respond to legal requests and prevent harm</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>4. Sharing Your Information</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    We may process or share your data based on the following legal basis:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
                    <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                    <li><strong>Performance of a Contract:</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you.</li>
                    <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law.</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>5. Data Security</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    We have implemented appropriate technical and organizational security measures designed to protect the security 
                    of any personal information we process. However, please also remember that we cannot guarantee that the internet 
                    itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal 
                    information to and from our platform is at your own risk.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>6. Your Privacy Rights</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    You have certain rights regarding your personal information, including:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>The right to access – You have the right to request copies of your personal data.</li>
                    <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                    <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                    <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data.</li>
                    <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization.</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>7. Cookies and Tracking Technologies</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    We may use cookies and similar tracking technologies to access or store information. Please see our Cookie Policy 
                    for more information about how we use cookies.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>8. Updates to This Policy</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    We may update this privacy policy from time to time. The updated version will be indicated by an updated 
                    "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you 
                    to review this privacy policy frequently to be informed of how we are protecting your information.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>9. Contact Us</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    If you have questions or comments about this policy, you may contact us at:
                  </p>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    <strong>Email:</strong> support@internshipplus.com<br />
                    <strong>Phone:</strong> +1 (234) 567-890<br />
                    <strong>Address:</strong> 123 Business Street, City, State 12345
                  </p>
                </div>

                <div className="alert alert-info" role="alert" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 150, 0.1), rgba(13, 110, 253, 0.1))', border: 'none', borderRadius: '10px' }}>
                  <strong>Note:</strong> By using INTERNSHIP+ PORTAL, you consent to the terms of this Privacy Policy and agree to our collection, 
                  use, and disclosure of information in accordance with this policy.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
