import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Shipping = () => {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const sections = [
    {
      id: 1,
      title: 'Order Processing',
      content: `All orders are processed within 1–2 business days after payment confirmation. Orders are not processed or shipped on Sundays or public holidays.`,
      icon: '📋',
    },
    {
      id: 2,
      title: 'Shipping Time',
      content: `Once shipped, orders are typically delivered within 3–7 business days, depending on the delivery location.`,
      icon: '⏱️',
    },
    {
      id: 3,
      title: 'Shipping Charges',
      content: `Shipping charges, if applicable, will be clearly displayed at checkout before completing the order.`,
      icon: '💰',
    },
    {
      id: 4,
      title: 'Order Tracking',
      content: `After your order is shipped, you will receive a tracking ID or tracking link via email or SMS, allowing you to monitor your shipment status.`,
      icon: '📍',
    },
    {
      id: 5,
      title: 'Delivery Delays',
      content: `Delivery times may occasionally be affected due to logistics issues, weather conditions, or other unforeseen circumstances.`,
      icon: '⚠️',
    },
    {
      id: 6,
      title: 'Contact Us',
      content: `If you have any questions about your order or shipping process, please contact us through the Contact Us page on our website.`,
      icon: '📞',
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
            <span style={{ color: '#2e1503', fontWeight: '500' }}>Shipping & Delivery Policy</span>
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
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#2e1503' }}>🚚</span>
            <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', color: '#2e1503' }}>POLICY · UPDATED 2025</span>
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
            Shipping &{' '}
            <span style={{
              background: 'linear-gradient(135deg, #b5722a, #7a4018)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Delivery
            </span>
          </h1>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#4a2800',
            maxWidth: '700px',
            marginBottom: '24px',
          }}>
            Thank you for shopping with us. This Shipping & Delivery Policy explains how orders are processed and delivered.
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
                  <span style={{ fontSize: '18px' }}>{section.icon}</span>
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

          {/* Shipping Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '48px',
          }}>
            {[
              { icon: '📦', label: 'Tracked Shipping', desc: 'Real-time tracking updates' },
              { icon: '⚡', label: 'Fast Delivery', desc: '3-7 business days' },
              { icon: '🇮🇳', label: 'Pan India', desc: 'Shipping across India' },
              { icon: '🎧', label: '24/7 Support', desc: 'Dedicated customer care' },
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

          {/* Free Shipping Notice */}
          <div style={{
            marginTop: '32px',
            backgroundColor: '#fff0e0',
            borderRadius: '12px',
            padding: '20px 24px',
            border: '1px solid #e8c4a0',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🚚</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2e1503', marginBottom: '6px' }}>
                  Free Shipping on Orders Above ₹2000
                </h3>
                <p style={{ fontSize: '14px', color: '#4a2800', lineHeight: '1.6' }}>
                  Enjoy complimentary shipping on all orders exceeding ₹2000. Terms and conditions apply.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Note */}
          <div style={{
            marginTop: '32px',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              backgroundColor: '#fff8ed',
              borderRadius: '50px',
              border: '1px solid #d9c4a0',
            }}>
              <span style={{ fontSize: '14px', color: '#7a4018' }}>🏛️</span>
              <span style={{ fontSize: '13px', color: '#4a2800' }}>Handcrafted with tradition · Shipped with care</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shipping;