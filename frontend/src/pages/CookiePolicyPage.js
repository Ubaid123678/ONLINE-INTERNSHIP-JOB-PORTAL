import React from 'react';

const CookiePolicyPage = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0" style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div className="card-body p-5">
                <h1 className="mb-4" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>
                  Cookie Policy
                </h1>
                <p className="text-muted mb-4">
                  <small>Last Updated: December 14, 2025</small>
                </p>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>1. What Are Cookies?</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                    They are widely used to make websites work more efficiently and provide a better user experience. Cookies 
                    allow websites to recognize your device and store some information about your preferences or past actions.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>2. How We Use Cookies</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    INTERNSHIP+ PORTAL uses cookies to enhance your experience on our platform. We use cookies for various purposes, including:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>Enabling certain functions of the platform</li>
                    <li>Providing analytics and tracking user behavior</li>
                    <li>Storing your preferences and settings</li>
                    <li>Maintaining your login session</li>
                    <li>Improving the security of our platform</li>
                    <li>Understanding how you interact with our services</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>3. Types of Cookies We Use</h2>
                  
                  <div className="mb-3">
                    <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>Essential Cookies</h3>
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      These cookies are necessary for the platform to function properly. They enable core functionality such as 
                      security, network management, and accessibility. You cannot opt-out of these cookies as they are essential 
                      for the platform to work.
                    </p>
                  </div>

                  <div className="mb-3">
                    <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>Performance and Analytics Cookies</h3>
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      These cookies collect information about how you use our platform, such as which pages you visit most often. 
                      This data helps us improve the platform's performance and user experience. All information collected by 
                      these cookies is aggregated and anonymous.
                    </p>
                  </div>

                  <div className="mb-3">
                    <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>Functional Cookies</h3>
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      These cookies allow the platform to remember choices you make (such as your username, language, or region) 
                      and provide enhanced, more personalized features. They may also be used to provide services you have requested, 
                      such as watching a video or commenting on a blog.
                    </p>
                  </div>

                  <div className="mb-3">
                    <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>Targeting and Advertising Cookies</h3>
                    <p className="text-muted" style={{ lineHeight: '1.8' }}>
                      These cookies are used to deliver advertisements that are more relevant to you and your interests. They are 
                      also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising 
                      campaigns.
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>4. Third-Party Cookies</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
                    deliver advertisements, and provide other services. These third parties include:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li>Google Analytics - for website analytics and performance tracking</li>
                    <li>Social media platforms - for social sharing features</li>
                    <li>Advertising partners - for targeted advertising</li>
                    <li>Payment processors - for secure payment processing</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>5. How Long Do Cookies Last?</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    The length of time a cookie will stay on your device depends on its type:
                  </p>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li><strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser. 
                    They allow us to link your actions during a browsing session.</li>
                    <li><strong>Persistent Cookies:</strong> These remain on your device for a set period specified in the cookie. 
                    They are activated each time you visit the website that created that particular cookie.</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>6. Managing Cookies</h2>
                  <p className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    Most web browsers allow you to control cookies through their settings preferences. However, if you choose to 
                    disable cookies, some features of our platform may not function properly, and you may not be able to access 
                    certain parts of our website.
                  </p>
                  
                  <h3 className="h6 fw-bold mb-2" style={{ color: '#2c3e50' }}>How to Control Cookies in Your Browser:</h3>
                  <ul className="text-muted mb-3" style={{ lineHeight: '1.8' }}>
                    <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                    <li><strong>Microsoft Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>7. Do Not Track Signals</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. 
                    Currently, there is no industry standard for how to respond to DNT signals. At this time, our platform does not 
                    respond to DNT browser signals or mechanisms.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>8. Updates to This Policy</h2>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, 
                    or for other reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and 
                    updating the "Last Updated" date.
                  </p>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>9. Contact Us</h2>
                  <p className="text-muted mb-2" style={{ lineHeight: '1.8' }}>
                    If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                  </p>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    <strong>Email:</strong> support@internshipplus.com<br />
                    <strong>Phone:</strong> +1 (234) 567-890<br />
                    <strong>Address:</strong> 123 Business Street, City, State 12345
                  </p>
                </div>

                <div className="alert alert-success" role="alert" style={{ background: 'linear-gradient(135deg, rgba(0, 200, 150, 0.1), rgba(32, 201, 151, 0.1))', border: 'none', borderRadius: '10px' }}>
                  <strong>Your Consent:</strong> By continuing to use INTERNSHIP+ PORTAL, you consent to our use of cookies as described 
                  in this Cookie Policy. If you do not agree to our use of cookies, you should adjust your browser settings accordingly 
                  or refrain from using our platform.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
