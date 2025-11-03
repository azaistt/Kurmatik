import React from 'react';
import { Stack } from 'expo-router';

export default function PrivacyPolicy() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Privacy Policy - Kurmatik',
          headerShown: false,
        }} 
      />
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '0',
        margin: '0',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '60px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '10px', color: '#1a1a1a' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '40px', fontStyle: 'italic' }}>
            Last Updated: October 14, 2025
          </p>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              1. Introduction
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Welcome to Kurmatik Finance ("we," "our," or "us"). We are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
              currency conversion and financial services platform at <strong>kurmatik.xyz</strong>.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              2. Information We Collect
            </h2>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              2.1 Automatically Collected Information
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Time zone and location data</li>
              <li>Pages visited and time spent on pages</li>
            </ul>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              2.2 Currency Conversion Data
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              We may temporarily store currency conversion requests for performance optimization, but we do not 
              link this data to any personally identifiable information.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              3. How We Use Your Information
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              We use the collected information to:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li>Provide accurate currency conversion services</li>
              <li>Improve our website performance and user experience</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect and prevent technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              4. Third-Party Services
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              We use the following third-party services that may collect information:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li><strong>Yahoo Finance API:</strong> For real-time currency exchange rates</li>
              <li><strong>Vercel Analytics:</strong> For website performance monitoring</li>
              <li><strong>TradingView Widgets:</strong> For financial charts and market data</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              5. Cookies and Tracking
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              We use cookies and similar tracking technologies to enhance your experience. You can control 
              cookie settings through your browser preferences.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              6. Data Security
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              We implement industry-standard security measures to protect your information. However, no method 
              of transmission over the internet is 100% secure.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              7. Your Rights
            </h2>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of data collection</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              8. Contact Us
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li><strong>Email:</strong> info@kurmatik.xyz</li>
              <li><strong>Email:</strong> erolkpln@gmail.com</li>
              <li><strong>Contact Person:</strong> Erol Kaplan</li>
              <li><strong>Phone:</strong> +90 535 611 5641</li>
              <li><strong>Website:</strong> www.kurmatik.xyz</li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '2px solid #e0e0e0', margin: '50px 0' }} />

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              Gizlilik Politikası (Türkçe)
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', fontStyle: 'italic' }}>
              Son Güncelleme: 14 Ekim 2025
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              1. Giriş
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Kurmatik Finance'e hoş geldiniz. Gizliliğinizi korumaya kararlıyız. Bu Gizlilik Politikası, 
              <strong> kurmatik.xyz</strong> adresindeki platformumuzu kullandığınızda bilgilerinizi nasıl 
              topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              2. Topladığımız Bilgiler
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Web sitemizi ziyaret ettiğinizde otomatik olarak cihazınız hakkında bazı bilgileri toplarız: 
              tarayıcı türü, işletim sistemi, IP adresi, zaman dilimi ve konum verileri.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              3. İletişim
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Bu Gizlilik Politikası hakkında sorularınız varsa lütfen bizimle iletişime geçin:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li><strong>E-posta:</strong> info@kurmatik.xyz</li>
              <li><strong>E-posta:</strong> erolkpln@gmail.com</li>
              <li><strong>İletişim:</strong> Erol Kaplan</li>
              <li><strong>Telefon:</strong> 0535 611 5641</li>
              <li><strong>Web:</strong> www.kurmatik.xyz</li>
            </ul>
          </section>

          <footer style={{
            marginTop: '60px',
            paddingTop: '30px',
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center',
            color: '#999',
            fontSize: '14px',
          }}>
            <p>© 2025 Kurmatik Finance. All rights reserved.</p>
            <p style={{ marginTop: '10px' }}>
              <a href="/" style={{ color: '#0066ff', textDecoration: 'none', marginRight: '20px' }}>Home</a>
              <a href="/dashboard" style={{ color: '#0066ff', textDecoration: 'none' }}>Dashboard</a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
