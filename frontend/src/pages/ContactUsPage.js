import { useState } from 'react';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh', paddingTop: '70px', paddingBottom: '20px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-3">
              <h1 className="mb-2" style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', fontSize: '2rem' }}>
                Contact Us
              </h1>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="row g-3">
              {/* Contact Information */}
              <div className="col-lg-4">
                <div className="card border-0 h-100" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <div className="card-body p-3">
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--brand-blue)', fontSize: '1rem' }}>Get in Touch</h5>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start mb-2">
                        <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', flexShrink: 0 }}>
                          <svg width="16" height="16" fill="white" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                          </svg>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Email</h6>
                          <a href="mailto:support@internshipplus.com" className="text-muted text-decoration-none" style={{ fontSize: '0.8rem' }}>support@internshipplus.com</a>
                        </div>
                      </div>

                      <div className="d-flex align-items-start mb-2">
                        <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', flexShrink: 0 }}>
                          <svg width="16" height="16" fill="white" viewBox="0 0 16 16">
                            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                          </svg>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Phone</h6>
                          <a href="tel:+1234567890" className="text-muted text-decoration-none" style={{ fontSize: '0.8rem' }}>+1 (234) 567-890</a>
                        </div>
                      </div>

                      <div className="d-flex align-items-start">
                        <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', flexShrink: 0 }}>
                          <svg width="16" height="16" fill="white" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                          </svg>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '0.85rem' }}>Address</h6>
                          <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>123 Business Street<br/>City, State 12345</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-top">
                      <h6 className="fw-bold mb-2" style={{ fontSize: '0.85rem' }}>Follow Us</h6>
                      <div className="d-flex gap-2">
                        <a href="#" className="btn btn-sm" style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                          </svg>
                        </a>
                        <a href="#" className="btn btn-sm" style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                          </svg>
                        </a>
                        <a href="#" className="btn btn-sm" style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-8">
                <div className="card border-0" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <div className="card-body p-3">
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--brand-blue)', fontSize: '1rem' }}>Send us a Message</h5>
                    
                    {submitted && (
                      <div className="alert alert-success mb-3 py-2" role="alert" style={{ fontSize: '0.85rem' }}>
                        <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        Thank you for your message! We'll get back to you soon.
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Name *</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email *</label>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="subject" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Subject *</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="What is this regarding?"
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="message" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Message *</label>
                          <textarea
                            className="form-control form-control-sm"
                            id="message"
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell us more about your inquiry..."
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button 
                            type="submit" 
                            className="btn text-white btn-sm px-3 py-2"
                            style={{ background: 'linear-gradient(135deg, var(--brand-green), var(--brand-blue))', border: 'none', fontSize: '0.85rem' }}
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
