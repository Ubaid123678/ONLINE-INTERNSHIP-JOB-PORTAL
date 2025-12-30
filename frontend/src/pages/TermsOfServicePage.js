import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0" style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div className="card-body p-5">
                <h1 className="mb-4" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>
                  Terms of Service
                </h1>
                <p className="text-muted mb-4">
                  <small>Last Updated: December 14, 2025</small>
                </p>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>1. Agreement to Terms</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf 
                    of an entity ("you") and INTERNSHIP+ PORTAL ("we," "us" or "our"), concerning your access to and use of our website 
                    and services. You agree that by accessing the platform, you have read, understood, and agree to be bound by all of 
                    these Terms of Service.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>2. User Registration</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    To access certain features of our platform, you must register for an account. When you register, you agree to:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Accept all responsibility for activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>3. User Responsibilities</h2>
                  <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>For Students:</h3>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>Provide truthful and accurate information in your profile and applications</li>
                    <li>Upload authentic resumes and documents</li>
                    <li>Communicate professionally with potential employers</li>
                    <li>Respect intellectual property rights of others</li>
                    <li>Not misuse or abuse the platform in any way</li>
                  </ul>

                  <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>For Employers:</h3>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>Post only legitimate job opportunities</li>
                    <li>Provide accurate job descriptions and requirements</li>
                    <li>Treat all applicants fairly and without discrimination</li>
                    <li>Protect the privacy of applicant information</li>
                    <li>Comply with all applicable employment laws</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>4. Prohibited Activities</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    You may not access or use the platform for any purpose other than that for which we make it available. 
                    Prohibited activities include:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>Posting false, misleading, or fraudulent information</li>
                    <li>Impersonating another person or entity</li>
                    <li>Harassing, threatening, or discriminating against other users</li>
                    <li>Attempting to gain unauthorized access to the platform or other users' accounts</li>
                    <li>Using automated systems or software to extract data from the platform</li>
                    <li>Posting spam, advertisements, or unsolicited communications</li>
                    <li>Violating any applicable laws or regulations</li>
                    <li>Interfering with the proper functioning of the platform</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>5. Intellectual Property Rights</h2>
                  <p className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    Unless otherwise indicated, the platform and all content, features, and functionality are owned by INTERNSHIP+ PORTAL 
                    and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    You retain all rights to the content you submit to the platform (such as your resume and profile information), 
                    but you grant us a license to use, display, and distribute such content in connection with operating the platform.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>6. Third-Party Services</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    Our platform may contain links to third-party websites or services that are not owned or controlled by INTERNSHIP+ PORTAL. 
                    We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party 
                    websites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused 
                    by use of such content or services.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>7. Disclaimer of Warranties</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    The platform is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties or representations about the 
                    accuracy or completeness of the platform's content or the content of any websites linked to the platform. We assume 
                    no liability or responsibility for any errors, mistakes, or inaccuracies of content.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>8. Limitation of Liability</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    To the maximum extent permitted by law, INTERNSHIP+ PORTAL shall not be liable for any indirect, incidental, special, 
                    consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any 
                    loss of data, use, goodwill, or other intangible losses resulting from your access to or use of the platform.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>9. Indemnification</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    You agree to defend, indemnify, and hold harmless INTERNSHIP+ PORTAL and its affiliates from and against any claims, 
                    damages, obligations, losses, liabilities, costs, or debt, and expenses arising from your use of the platform, 
                    violation of these Terms, or violation of any third-party rights.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>10. Termination</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    We may terminate or suspend your account and access to the platform immediately, without prior notice or liability, 
                    for any reason whatsoever, including without limitation if you breach these Terms of Service. Upon termination, 
                    your right to use the platform will immediately cease.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>11. Governing Law</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which INTERNSHIP+ PORTAL 
                    operates, without regard to its conflict of law provisions.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>12. Changes to Terms</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes 
                    by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the platform after 
                    any such changes constitutes your acceptance of the new Terms.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>13. Contact Us</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    <strong>Email:</strong> support@internshipplus.com<br />
                    <strong>Phone:</strong> +1 (234) 567-890<br />
                    <strong>Address:</strong> 123 Business Street, City, State 12345
                  </p>
                </div>

                <div className="alert alert-warning" role="alert" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))', border: 'none', borderRadius: '10px' }}>
                  <strong>Important:</strong> By using INTERNSHIP+ PORTAL, you acknowledge that you have read, understood, and agree to be bound 
                  by these Terms of Service. If you do not agree to these Terms, please do not use our platform.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
