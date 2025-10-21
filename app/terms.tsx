import React from 'react';
import { Stack } from 'expo-router';

export default function TermsOfService() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Terms of Service - Kurmatik',
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
            Terms of Service
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '40px', fontStyle: 'italic' }}>
            Last Updated: October 21, 2025
          </p>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              By accessing and using Kurmatik Finance ("Service") at <strong>kurmatik.xyz</strong>, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              2. Service Description
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Kurmatik Finance provides:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li>Real-time currency conversion services</li>
              <li>Gold price information</li>
              <li>Financial market data</li>
              <li>AI-powered financial assistant</li>
              <li>TradingView charts and widgets</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              3. Data Accuracy
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              While we strive to provide accurate financial data, exchange rates and market information are for informational purposes only. We cannot guarantee the accuracy, completeness, or timeliness of the data provided.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              4. User Responsibilities
            </h2>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li>Use the service for lawful purposes only</li>
              <li>Not attempt to disrupt or harm the service</li>
              <li>Verify financial information from official sources before making decisions</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              5. Limitation of Liability
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Kurmatik Finance shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              6. Intellectual Property
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              All content, features, and functionality are owned by Kurmatik Finance and protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              7. Third-Party Services
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Our service integrates with third-party providers including Yahoo Finance, TradingView, and Groq AI. Use of these services is subject to their respective terms of service.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              8. Modifications
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              9. Contact Information
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              For questions about these Terms of Service, please contact us:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li><strong>Email:</strong> legal@kurmatik.xyz</li>
              <li><strong>Email:</strong> erolkpln@gmail.com</li>
              <li><strong>Contact Person:</strong> Erol Kaplan</li>
              <li><strong>Phone:</strong> +90 535 611 5641</li>
              <li><strong>Website:</strong> www.kurmatik.xyz</li>
            </ul>
          </section>

          <hr style={{ border: 'none', borderTop: '2px solid #e0e0e0', margin: '50px 0' }} />

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              Kullanım Şartları (Türkçe)
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', fontStyle: 'italic' }}>
              Son Güncelleme: 21 Ekim 2025
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              1. Şartların Kabulü
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <strong>kurmatik.xyz</strong> adresindeki Kurmatik Finance hizmetini kullanarak bu şartları kabul etmiş sayılırsınız.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              2. Hizmet Açıklaması
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Kurmatik Finance şunları sağlar: Gerçek zamanlı döviz çevirisi, altın fiyat bilgileri, finansal piyasa verileri ve AI destekli finansal asistan.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              3. Sorumluluk Reddi
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Sağlanan finansal veriler yalnızca bilgilendirme amaçlıdır. Yatırım kararları vermeden önce resmi kaynaklardan doğrulama yapın.
            </p>

            <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#333' }}>
              4. İletişim
            </h3>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li><strong>E-posta:</strong> legal@kurmatik.xyz</li>
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
              <a href="/dashboard" style={{ color: '#0066ff', textDecoration: 'none', marginRight: '20px' }}>Dashboard</a>
              <a href="/privacy" style={{ color: '#0066ff', textDecoration: 'none' }}>Privacy Policy</a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}