import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const sections = [
    {
      id: 1,
      title: 'Information We Collect',
      content: `When you interact with our website, we may collect personal information such as your name, email address, phone number, billing and shipping address, and payment-related details. We may also collect non-personal information such as browser type, device information, and website usage data to improve our services.`,
    },
    {
      id: 2,
      title: 'How We Use Your Information',
      content: `We use your information to process orders, manage deliveries, communicate with you about your purchases, provide customer support, and improve our products and website experience. Your information may also be used to send updates, promotional messages, or important service-related communications, which you may opt out of at any time.`,
    },
    {
      id: 3,
      title: 'Payment Information',
      content: `We do not store or process your payment card details directly. All payments are securely handled through trusted third-party payment gateways that comply with industry security standards.`,
    },
    {
      id: 4,
      title: 'Sharing of Information',
      content: `We do not sell, rent, or trade your personal information to third parties. Your data may be shared only with service providers such as payment processors, courier companies, and technology partners strictly for order fulfillment and service operations.`,
    },
    {
      id: 5,
      title: 'Cookies & Tracking Technologies',
      content: `Our website may use cookies and similar technologies to enhance user experience, analyze website traffic, and understand customer preferences. You may choose to disable cookies through your browser settings, though this may affect certain website features.`,
    },
    {
      id: 6,
      title: 'Data Security',
      content: `We take reasonable technical and organizational measures to protect your personal information from unauthorized access, misuse, loss, or disclosure. However, no method of data transmission over the internet is completely secure.`,
    },
    {
      id: 7,
      title: 'Your Rights',
      content: `You have the right to access, update, or request deletion of your personal information, subject to applicable laws. To make such a request, please contact us using the details provided on our website.`,
    },
    {
      id: 8,
      title: 'Third-Party Links',
      content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites.`,
    },
    {
      id: 9,
      title: 'Changes to This Policy',
      content: `We reserve the right to update or modify this Privacy Policy at any time. Changes will be effective immediately upon posting on this page.`,
    },
    {
      id: 10,
      title: 'Contact Us',
      content: `If you have any questions or concerns regarding this Privacy Policy or how your information is handled, please contact us through the details provided on our website.`,
    },
  ];

  return (
    <div style={{ backgroundColor: '#f2e0c0', fontFamily: "'Georgia', 'Times New Roman', serif", color: '#2e1503', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <section style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '24px' }}>
            <Link to="/" style={{ color: '#7a4018', textDecoration: 'none', transition: 'color 0.2s' }}>
              Home
            </Link>
            <span style={{ color: '#c4a06a' }}>/</span>
            <span style={{ color: '#2e1503', fontWeight: '500' }}>Privacy Policy</span>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            backgroundColor: '#d9c4a0',
            borderRadius: '50px',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#2e1503' }}>📜</span>
            <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', color: '#2e1503' }}>PRIVACY POLICY</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#2e1503',
            marginBottom: '16px',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: '-0.02em',
          }}>
            Privacy{' '}
            <span style={{
              background: 'linear-gradient(135deg, #b5722a, #7a4018)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Policy
            </span>
          </h1>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#4a2800',
            maxWidth: '700px',
            marginBottom: '40px',
          }}>
            We respect your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you 
            visit or make a purchase from our website.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          {/* Content Card */}
          <div style={{
            backgroundColor: '#fff8ed',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #d9c4a0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}>
            {sections.map((section, index) => (
              <div 
                key={section.id}
                style={{
                  padding: '28px 32px',
                  borderBottom: index < sections.length - 1 ? '1px solid #e8dcc8' : 'none',
                }}
              >
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2e1503',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#f2e0c0',
                    borderRadius: '50%',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#7a4018',
                  }}>
                    {section.id}
                  </span>
                  {section.title}
                </h2>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#4a2800',
                  marginLeft: '44px',
                }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '48px',
          }}>
            {[
              { icon: '🔒', label: 'Secure Data', desc: 'Bank-level encryption' },
              { icon: '👁️', label: 'Privacy First', desc: 'We never sell your data' },
              { icon: '💾', label: 'Data Protected', desc: 'GDPR compliant practices' },
              { icon: '🍪', label: 'Cookie Control', desc: 'Manage your preferences' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#fff8ed',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid #d9c4a0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2e1503', marginBottom: '6px' }}>{item.label}</h3>
                <p style={{ fontSize: '12px', color: '#7a4018' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;