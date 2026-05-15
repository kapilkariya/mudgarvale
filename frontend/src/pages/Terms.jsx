import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const sections = [
    {
      id: 1,
      title: 'General',
      content: `These Terms & Conditions govern your use of our website and the purchase of our products. By placing an order, you confirm that you are legally capable of entering into a binding agreement. We reserve the right to update or modify these terms at any time without prior notice.`,
    },
    {
      id: 2,
      title: 'Products & Craftsmanship',
      content: `All products sold on this website are traditional fitness tools handcrafted from natural hardwood. As each item is handmade, slight variations in size, weight, color, grain, and finish are natural and should not be considered defects. These variations are a mark of authentic craftsmanship.`,
    },
    {
      id: 3,
      title: 'Made-to-Order & Manufacturing Time',
      content: `Most of our products are made to order. Manufacturing begins after an order is placed to ensure accurate weight, balance, and quality. Estimated production and delivery timelines are provided on the product page and may vary depending on design, weight, or order volume.`,
    },
    {
      id: 4,
      title: 'Pricing & Payment',
      content: `All prices listed on the website are in the applicable currency and are subject to change without notice. Payments must be completed at the time of purchase. We reserve the right to cancel or refuse any order at our discretion.`,
    },
    {
      id: 5,
      title: 'Shipping & Delivery',
      content: `Delivery timelines are estimates and may vary due to manufacturing time, logistics, or unforeseen circumstances. Once an order is dispatched, tracking details will be shared. We are not responsible for delays caused by courier services, customs, or factors beyond our control.`,
    },
    {
      id: 6,
      title: 'Returns, Exchanges & Cancellations',
      content: `Due to the made-to-order and handcrafted nature of our products, cancellations, returns, or exchanges may not be accepted once manufacturing has started. If a product arrives damaged or defective, customers must contact us within a specified time frame with supporting images for assistance.`,
    },
    {
      id: 7,
      title: 'Product Use & Safety',
      content: `Our products are fitness training tools and must be used responsibly. Proper technique, warm-up, and supervision are recommended, especially for beginners. We are not liable for injuries, misuse, or damages resulting from improper use of the products.`,
    },
    {
      id: 8,
      title: 'Intellectual Property',
      content: `All content on this website, including text, images, logos, and designs, is the intellectual property of the website owner and may not be copied, reproduced, or used without prior written permission.`,
    },
    {
      id: 9,
      title: 'Limitation of Liability',
      content: `We shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our liability, if any, is limited to the value of the product purchased.`,
    },
    {
      id: 10,
      title: 'Governing Law',
      content: `These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of the appropriate courts.`,
    },
    {
      id: 11,
      title: 'Contact Information',
      content: `For any questions regarding these Terms & Conditions, please contact us through the details provided on our website.`,
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
            <span style={{ color: '#2e1503', fontWeight: '500' }}>Terms & Conditions</span>
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
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#2e1503' }}>⚖️</span>
            <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: '0.5px', color: '#2e1503' }}>LEGAL · UPDATED 2025</span>
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
            Terms &{' '}
            <span style={{
              background: 'linear-gradient(135deg, #b5722a, #7a4018)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Conditions
            </span>
          </h1>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#4a2800',
            maxWidth: '700px',
            marginBottom: '40px',
          }}>
            Welcome to our website. By accessing or using our website and purchasing our products, 
            you agree to be bound by the following Terms & Conditions. Please read them carefully 
            before using our services.
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

          {/* Legal Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '48px',
          }}>
            {[
              { icon: '🪵', label: 'Handcrafted', desc: 'Authentic traditional craft' },
              { icon: '🤝', label: 'Fair Trade', desc: 'Ethically sourced materials' },
              { icon: '⏱️', label: 'Made to Order', desc: 'Custom crafted for you' },
              { icon: '📜', label: 'Legal Compliance', desc: 'Fully compliant with laws' },
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

          {/* Important Notice */}
          <div style={{
            marginTop: '32px',
            backgroundColor: '#fff0e0',
            borderRadius: '12px',
            padding: '20px 24px',
            border: '1px solid #e8c4a0',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2e1503', marginBottom: '6px' }}>
                  Important: Made-to-Order Products
                </h3>
                <p style={{ fontSize: '14px', color: '#4a2800', lineHeight: '1.6' }}>
                  Due to the handcrafted nature of our equipment, cancellations may not be accepted once manufacturing has begun. 
                  Please review your order carefully before completing purchase. For any questions, contact us before placing your order.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div style={{
            marginTop: '32px',
            backgroundColor: '#fff8ed',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #d9c4a0',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2e1503', marginBottom: '6px' }}>
              Questions About Our Terms?
            </h3>
            <p style={{ fontSize: '14px', color: '#4a2800' }}>
              Contact us through our website's contact page for any clarification regarding these Terms & Conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;