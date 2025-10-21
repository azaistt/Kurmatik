import React from 'react';
import { Stack } from 'expo-router';

export default function AboutUs() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'About Us - Kurmatik Finance',
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
            Hakkımızda
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
            Kurmatik Finance - Güvenilir finansal veriler ve AI destekli danışmanlık
          </p>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              Misyonumuz
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Kurmatik Finance olarak, finansal piyasalardaki karmaşıklığı basitleştirmeyi ve kullanıcılarımıza 
              doğru, güncel ve kolay anlaşılır finansal bilgiler sunmayı amaçlıyoruz. Modern teknoloji ile 
              geleneksel finans anlayışını birleştirerek, herkesin finansal kararlarını daha bilinçli 
              verebilmesini sağlıyoruz.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              Hizmetlerimiz
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>💱 Döviz Çevirici</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Gerçek zamanlı döviz kurları ile anında çeviri. USD, EUR, TRY ve diğer major para birimlerini destekliyoruz.
                </p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>🥇 Altın Fiyatları</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Gram altın, çeyrek altın ve ons altın fiyatlarını canlı olarak takip edin.
                </p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>🤖 AI Asistan</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Groq AI teknolojisi ile finansal sorularınıza Türkçe yanıtlar alın.
                </p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>📊 Market Verileri</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  TradingView entegrasyonu ile hisse senedi, kripto ve forex verilerini görüntüleyin.
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              Teknoloji
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Kurmatik Finance, en son teknolojiler kullanılarak geliştirilmiştir:
            </p>
            <ul style={{ marginLeft: '30px', fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              <li><strong>React Native & Expo:</strong> Cross-platform uygulama geliştirme</li>
              <li><strong>Vercel Serverless:</strong> Ölçeklenebilir backend altyapısı</li>
              <li><strong>Yahoo Finance API:</strong> Güvenilir finansal veri kaynağı</li>
              <li><strong>Groq AI:</strong> Hızlı ve akıllı sohbet asistanı</li>
              <li><strong>TradingView:</strong> Profesyonel finansal grafikler</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              İletişim
            </h2>
            <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>📧 E-posta</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>info@kurmatik.xyz</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>erolkpln@gmail.com</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>📞 Telefon</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>+90 535 611 5641</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>👤 İletişim Kişisi</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Erol Kaplan</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>Kurmatik Finance Kurucusu</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>🌐 Web</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>www.kurmatik.xyz</p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#0066ff' }}>
              Güvenlik & Gizlilik
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '15px' }}>
              Kullanıcı verilerinin güvenliği bizim için önceliktir. SSL şifreleme, güvenli API entegrasyonları 
              ve KVKK uyumlu veri işleme politikalarımız ile bilgilerinizi koruyoruz. Detaylı bilgi için 
              <a href="/privacy" style={{ color: '#0066ff', textDecoration: 'none', marginLeft: '4px' }}>
                Gizlilik Politikamızı
              </a> inceleyebilirsiniz.
            </p>
          </section>

          <footer style={{
            marginTop: '60px',
            paddingTop: '30px',
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center',
            color: '#999',
            fontSize: '14px',
          }}>
            <p>© 2025 Kurmatik Finance. Tüm hakları saklıdır.</p>
            <p style={{ marginTop: '10px' }}>
              <a href="/" style={{ color: '#0066ff', textDecoration: 'none', marginRight: '20px' }}>Ana Sayfa</a>
              <a href="/dashboard" style={{ color: '#0066ff', textDecoration: 'none', marginRight: '20px' }}>Dashboard</a>
              <a href="/privacy" style={{ color: '#0066ff', textDecoration: 'none', marginRight: '20px' }}>Gizlilik</a>
              <a href="/terms" style={{ color: '#0066ff', textDecoration: 'none' }}>Kullanım Şartları</a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}