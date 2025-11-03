# 💰 Kurmatik - Modern Finans Platformu

**Gerçek Zamanlı Döviz, Altın ve AI Finansal Asistan**

Kurmatik, canlı döviz kurları, altın fiyatları ve yapay zeka destekli finansal asistan ile donatılmış modern bir finans platformudur.

🌐 **Canlı Site**: [kurmatik.xyz](https://kurmatik.xyz)  
📱 **App Store**: Yakında...  
🤖 **Google Play**: Yakında...

## 📄 Yasal Sayfalar

- [Gizlilik Politikası](https://kurmatik.xyz/privacy.html)
- [Destek Sayfası](https://kurmatik.xyz/support.html)
- [Kullanım Koşulları](https://kurmatik.xyz/terms.html)

## ✨ Özellikler

### 💱 Canlı Döviz Kurları
- **USD/TRY, EUR/TRY** ve diğer döviz çiftleri
- **Gerçek zamanlı** market ticker
- **Anında çevirici** - hızlı hesaplama

### 🥇 Altın Fiyatları
- **Gram Altın** canlı TL fiyatı
- Otomatik güncelleme
- TradingView chart entegrasyonu

### 🤖 AI Finansal Asistan
- **Groq AI** (llama-3.3-70b-versatile)
- Türkçe finansal danışmanlık
- Hisse senedi, kripto, piyasa analizi
- **Ücretsiz** (30 req/dk, 6000 token/dk)

### � TradingView Widget'ları
- Hisse senedi fiyatları
- Kripto para grafikleri
- Forex piyasası
- Market heat map

### � Teknik
- **Vercel Serverless Functions** (/api/fx, /api/gold, /api/chat)
- **Expo + React Native Web**
- **TypeScript** desteği
- **Responsive** tasarım

## 🚀 Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/azaistt/Kurmatik.git
cd Kurmatik/Kurmatik_

# Bağımlılıkları yükleyin
npm install

# Environment variables oluşturun
echo "GROQ_API_KEY=your_groq_api_key" > .env

# Geliştirme sunucusunu başlatın
npx expo start

# Web için
npx expo start --web
```

## � Proje Yapısı

```
Kurmatik/
├── api/                   # Vercel Serverless Functions
│   ├── fx.js             # Döviz API
│   ├── gold.js           # Altın API  
│   └── chat.js           # AI Chat API
├── app/                   # Expo Router sayfaları
│   ├── dashboard.tsx     # Ana finans sayfası
│   ├── index.tsx         # Uygulama ana sayfa
│   └── (tabs)/
├── components/            # React komponentleri
│   ├── AIChat.tsx        # AI asistan
│   ├── InstantConverter.tsx
│   ├── TradingViewTicker.tsx
│   └── market-widgets/   # TradingView widgets
├── src/
│   └── screens/
│       └── FinanceDashboard.tsx  # Ana dashboard
├── index.html            # Web landing page
├── privacy.html          # Gizlilik politikası
├── support.html          # Destek sayfası
├── terms.html            # Kullanım koşulları
├── landing.css           # Landing page stilleri
└── vercel.json           # Vercel konfigürasyonu
```

## 🔌 API Endpoints

### `/api/fx` - Döviz Kurları
```javascript
// GET /api/fx?from=USD&to=TRY&amount=100
{
  "result": 4179.5,
  "rate": 41.795,
  "from": "USD",
  "to": "TRY"
}
```

### `/api/gold` - Altın Fiyatları
```javascript
// GET /api/gold
{
  "gram_altin": 5670.17,
  "updated": "2025-10-15T12:00:00Z"
}
```

### `/api/chat` - AI Asistan
```javascript
// POST /api/chat
{
  "message": "Apple hisse senedi fiyatı nedir?",
  "conversationId": "main-chat"
}

// Response
{
  "response": "Apple (AAPL) hisse senedi...",
  "cached": false,
  "model": "llama-3.3-70b-versatile"
}
```

## 📊 Kullanılan Teknolojiler

- **Frontend**: React Native + Expo
- **Backend**: Vercel Serverless Functions
- **AI**: Groq API (llama-3.3-70b)
- **Charts**: TradingView Widgets
- **APIs**: Yahoo Finance, Truncgil
- **Deployment**: Vercel

## 📝 Lisans

MIT License - Açık kaynak projedir.

## � İletişim

- **E-posta**: [erolkpln@gmail.com](mailto:erolkpln@gmail.com) | [info@kurmatik.xyz](mailto:info@kurmatik.xyz)
- **Web**: [www.kurmatik.xyz](https://www.kurmatik.xyz)
- **Telefon**: +90 535 611 56 41
- **Konum**: İstanbul, Türkiye
- **GitHub**: [github.com/azaistt/Kurmatik](https://github.com/azaistt/Kurmatik)

## �👤 Geliştirici

**azaistt** - [GitHub](https://github.com/azaistt)
