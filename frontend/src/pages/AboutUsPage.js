const AboutUsPage = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            About INTERNSHIP+ PORTAL
          </h1>
          <p className="lead text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Connecting Talent with Opportunity
          </p>
        </div>

        {/* Mission Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="card border-0" style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                      <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                    </svg>
                  </div>
                  <h2 className="h3 fw-bold mb-3" style={{ color: 'var(--brand-blue)' }}>Our Mission</h2>
                </div>
                <p className="text-center text-muted" style={{ lineHeight: '1.9', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
                  INTERNSHIP+ PORTAL is dedicated to bridging the gap between talented students and leading companies. 
                  We provide a seamless, intuitive platform where students can discover meaningful internship and job opportunities, 
                  while employers can efficiently connect with qualified candidates who perfectly match their requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <h2 className="h3 fw-bold text-center mb-4" style={{ color: '#2c3e50' }}>What We Offer</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 h-100" style={{ borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <h4 className="fw-bold mb-0" style={{ color: '#667eea', fontSize: '1.3rem' }}>For Students</h4>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2 d-flex align-items-start">
                        <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }}>
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span className="text-muted">Access hundreds of internship & job opportunities</span>
                      </li>
                      <li className="mb-2 d-flex align-items-start">
                        <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }}>
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span className="text-muted">Easy application tracking and management</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }}>
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span className="text-muted">Instant notifications for new opportunities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 h-100" style={{ borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}>
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <h4 className="fw-bold mb-0" style={{ color: 'var(--brand-green)', fontSize: '1.3rem' }}>For Employers</h4>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2 d-flex align-items-start">
                        <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }}>
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span className="text-muted">Post unlimited job openings effortlessly</span>
                      </li>
                      <li className="mb-2 d-flex align-items-start">
                        <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }}>
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span className="text-muted">Review qualified candidates efficiently</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <svg width="20" height="20" fill="var(--brand-green)" viewBox="0 0 16 16" style={{ marginRight: '10px', marginTop: '4px', flexShrink: 0 }}>
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span className="text-muted">Manage applications in one centralized platform</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="card border-0" style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', background: 'white' }}>
              <div className="card-body p-5">
                <h2 className="h3 fw-bold text-center mb-4" style={{ color: '#2c3e50' }}>Why Choose Us?</h2>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', flexShrink: 0 }}>
                        <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
                        </svg>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>User-Friendly Platform</h5>
                        <p className="text-muted mb-0">Intuitive interface designed for seamless navigation, making job searching and posting incredibly simple and efficient.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--brand-green), #20c997)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', flexShrink: 0 }}>
                        <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                          <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                          <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>Secure & Reliable</h5>
                        <p className="text-muted mb-0">Your data is protected with industry-standard security measures, ensuring privacy and confidentiality at every step.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', flexShrink: 0 }}>
                        <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                          <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
                          <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                          <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>Real-Time Updates</h5>
                        <p className="text-muted mb-0">Get instant notifications about application status and new opportunities matching your profile and preferences.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'linear-gradient(135deg, #4facfe, #00f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', flexShrink: 0 }}>
                        <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                          <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                        </svg>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>24/7 Support</h5>
                        <p className="text-muted mb-0">Our dedicated support team is always ready to assist you with any questions or concerns you may have.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center p-5" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <h3 className="fw-bold text-white mb-3" style={{ fontSize: '1.8rem' }}>Join Thousands of Students and Employers</h3>
              <p className="text-white mb-4" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
                Start your journey with INTERNSHIP+ PORTAL today and unlock endless opportunities for growth and success!
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <a href="/register" className="btn btn-light btn-lg px-4" style={{ borderRadius: '10px', fontWeight: '600' }}>
                  Get Started
                </a>
                <a href="/contact" className="btn btn-outline-light btn-lg px-4" style={{ borderRadius: '10px', fontWeight: '600' }}>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
