import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cancellation = () => {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const sections = [
    {
      id: 1,
      title: 'No Returns After Shipment',
      content: `Once your order has been shipped, returns are not accepted. Please ensure you have selected the correct product, weight, and specifications before completing your purchase. We do not accept returns for change of mind or incorrect selection after shipment.`,
      icon: '🚚',
      highlight: true,
    },
    {
      id: 2,
      title: 'Pre-Shipment Cancellations',
      content: `Orders may be cancelled only if the request is made before the order has been shipped. Once shipped, the order cannot be cancelled or returned. Contact us immediately if you need to cancel your order.`,
      icon: '📦',
    },
    {
      id: 3,
      title: 'Damaged or Defective Products',
      content: `If your product arrives damaged or defective due to manufacturing issues, please contact us within 48 hours of delivery with clear photos or videos of the product and packaging. After verification, we will offer a replacement or an appropriate resolution at our discretion. This is the only exception to our no-return policy.`,
      icon: '⚠️',
    },
    {
      id: 4,
      title: 'Natural Variations',
      content: `As our products are handcrafted from natural hardwood, slight variations in color, wood grain, finish, and minor dimensional differences are normal and are not considered defects. Such variations are a natural part of handcrafted craftsmanship and do not qualify for returns or Cancellations.`,
      icon: '🪵',
    },
    {
      id: 5,
      title: 'Incorrect or Incomplete Orders',
      content: `If you receive an incorrect product or your order is incomplete, please notify us within 48 hours of delivery. We will arrange a replacement or appropriate resolution after verification.`,
      icon: '📋',
    },
    {
      id: 6,
      title: 'Made-to-Order Products',
      content: `All our products are handcrafted and made to order. Due to the custom nature of our traditional fitness equipment, returns are not accepted once production and shipping have commenced.`,
      icon: '🔨',
    },
    {
      id: 7,
      title: 'Product Use & Liability',
      content: `We are not responsible for damage caused by improper use, misuse, or normal wear and tear. Returns or Cancellations will not be accepted for products damaged after use.`,
      icon: '🛡️',
    },
    {
      id: 8,
      title: 'Contact Us',
      content: `For any questions regarding our no-return policy or to request a pre-shipment cancellation, please contact us through the details provided on our website. We are committed to resolving concerns fairly and transparently.`,
      icon: '📧',
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
            <span style={{ color: '#2e1503', fontWeight: '500' }}>Cancellation & Returns</span>
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
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#2e1503' }}>🔄</span>
            <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', color: '#2e1503' }}>NO RETURNS AFTER SHIPMENT · UPDATED 2025</span>
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
            Cancellation &{' '}
            <span style={{
              background: 'linear-gradient(135deg, #b5722a, #7a4018)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Returns
            </span>
          </h1>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#4a2800',
            maxWidth: '700px',
            marginBottom: '24px',
          }}>
            We take great pride in the craftsmanship and quality of our traditional fitness equipment. 
            Please read our Cancellation & Returns Policy carefully before placing an order.
          </p>
          
          {/* Important Notice Box */}
          <div style={{
            backgroundColor: '#fff0e0',
            borderRadius: '12px',
            padding: '16px 20px',
            borderLeft: '4px solid #b5722a',
            border: '1px solid #e8c4a0',
            borderLeftWidth: '4px',
          }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#7a4018', marginBottom: '4px' }}>
              ⚠️ Important: No returns accepted after shipment
            </p>
            <p style={{ fontSize: '13px', color: '#4a2800' }}>
              Please double-check your product selection, weight, and specifications before completing your purchase.
            </p>
          </div>
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
            {sections.map((section, index) => {
              const isHighlighted = section.highlight;
              
              return (
                <div 
                  key={section.id}
                  style={{
                    padding: '28px 32px',
                    borderBottom: index < sections.length - 1 ? '1px solid #e8dcc8' : 'none',
                    backgroundColor: isHighlighted ? '#fff0e0' : 'transparent',
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
                      backgroundColor: isHighlighted ? '#e8c4a0' : '#f2e0c0',
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
              );
            })}
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
              <span style={{ fontSize: '13px', color: '#4a2800' }}>Handcrafted with tradition · No returns after shipment</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cancellation;