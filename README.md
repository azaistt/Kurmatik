# 💰 Kurmatik - Modern Finans Uygulaması

**Real-time Currency & Gold Price Converter with Smart Alerts**

Kurmatik, Yahoo Finance API'sini kullanarak gerçek zamanlı döviz kurları ve altın fiyatları sunan, akıllı uyarı sistemi ile donatılmış modern bir React Native uygulamasıdır.

## 🚀 Özellikler

### 💱 Döviz Çevirici
- **Desteklenen Para Birimleri**: USD, EUR, TRY, GBP, QAR, IRR, IQD, RUB
- **Gerçek Zamanlı Kurlar**: Yahoo Finance API entegrasyonu
- **Çapraz Kurlar**: Herhangi bir para biriminden diğerine çevrim
- **Compact Design**: Mobil-optimized modern arayüz
- **Otomatik Güncelleme**: Canlı piyasa verileri

### 🥇 Altın Fiyatları
- **Gram Altın**: Anlık TL fiyatı
- **Çeyrek Altın**: 1.608 gram
- **Yarım Altın**: 3.216 gram
- **Tam Altın**: 6.432 gram
- **Cumhuriyet Altını**: 6.615 gram
- **Ons Altın**: 31.1035 gram (Troy ons)
- **XAU Entegrasyonu**: Ons bazlı uluslararası fiyatlar

### 🔔 Akıllı Uyarı Sistemi
- **Fiyat Uyarıları**: Kur ve altın fiyatları için hedef değer belirleme
- **Koşul Bazlı**: Üstüne çıkınca / altına düşünce bildirim
- **Kalıcı Depolama**: AsyncStorage ile uyarıları kaydetme
- **Fallback Support**: AsyncStorage yoksa in-memory storage
- **Real-time Monitoring**: Otomatik fiyat kontrolü

### 🎨 Modern UI/UX
- **Swipe Navigation**: Sayfa geçişi için sağa-sola kaydırma
- **Card-based Tasarım**: Profesyonel finans uygulaması görünümü
- **Tema Sistemi**: Light/Dark mode desteği
- **Responsive**: Mobil ve web uyumlu
- **Compact Converter**: Küçük ekranda optimize edilmiş tasarım
- **Pull-to-Refresh**: Verileri yenileme
- **Keyboard Handling**: Otomatik klavye yönetimi

### 🔧 Teknik Özellikler
- **Lazy Loading**: Sayfa komponentleri için performans optimizasyonu
- **Error Boundaries**: Kapsamlı hata yakalama
- **Fallback APIs**: Birden fazla API kaynağı ile güvenilirlik
- **Offline Support**: İnternet yokken static değerler
- **TypeScript Support**: Tip güvenliği

## 🏃‍♂️ Çalıştırma

### Kurulum
```bash
# Projeyi klonlayın
git clone https://github.com/azaistt/Kurmatik.git
cd Kurmatik

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npx expo start
```

### Test Etme
- **Mobil**: QR kodu Expo Go ile tarayın
- **Web**: Tarayıcıda açın (http://localhost:8081)
- **Android**: Terminal'de `a` tuşuna basın
- **iOS**: Terminal'de `i` tuşuna basın

### Navigasyon
- **Swipe**: Sayfa geçişi için sağa-sola kaydırın
- **Home**: Ana sayfa - döviz ve altın çevirici
- **Uyarılar**: İkinci sayfa - fiyat uyarıları

## 📱 Uygulama Yapısı

```
Kurmatik/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx    # Ana navigasyon (TabView + Swipe)
│   │   ├── index.tsx      # Ana sayfa
│   │   └── explore.tsx    # Uyarılar sayfası
│   └── _layout.tsx
├── src/
│   ├── components/        # Yeniden kullanılabilir komponentler
│   │   ├── Card.js
│   │   ├── CompactConverter.js
│   │   ├── CompactResult.js
│   │   └── Header.js
│   ├── lib/               # Yardımcı fonksiyonlar
│   │   ├── api.js         # API entegrasyonları
│   │   ├── alertBus.js    # Uyarı sistemi
│   │   ├── format.js      # Veri formatlaması
│   │   └── yahoo/         # Yahoo Finance API
│   ├── screens/           # Sayfa komponentleri
│   └── theme/             # Tema sistemi
└── assets/                # Görseller ve ikonlar
```

## 🔌 API Entegrasyonları

Bu projede birden fazla ücretsiz API kaynağı kullanılmıştır:

### Birincil API'ler
- **Yahoo Finance**: Döviz kurları için (`src/lib/yahoo/fx.js`)
- **Truncgil**: Altın fiyatları için (`https://finans.truncgil.com/v4/today.json`)
- **ExchangeRate API**: Fallback döviz kurları

### Yardımcı Fonksiyonlar

#### Ana API Fonksiyonları (`src/lib/api.js`)
- `fetchFx(from, to, amount)` → Döviz çevirimi
- `fetchGoldToday()` → Günlük altın fiyatları (TL)
- `fetchGoldXau(to)` → XAU bazlı fiyatlar

#### Veri Formatlama (`src/lib/format.js`)
- `parseTr(string)` → TR formatından sayıya ("2.547,50" → 2547.5)
- `num(number, digits)` → Sayıyı TR formatına

#### Uyarı Sistemi (`src/lib/alertBus.js`)
- `subscribe(callback)` → Uyarı sayısı değişikliklerini dinleme
- `publish(count)` → Uyarı sayısını güncelleme

### Test Scripti

Windows PowerShell ile API'leri test edin:

```powershell
# Temel test
node .\test-api.js

# Yahoo Finance test
node .\test-yahoo-comprehensive.js

# XAU altın test
node .\test-yahoo-xau.js
```

### Fallback Mekanizması

Uygulama internet bağlantısı olmadığında veya API'ler yanıt vermediğinde static değerler kullanır:

```javascript
// Örnek fallback döviz kurları
const staticRates = {
  'USD': { 'TRY': 41.41, 'EUR': 0.92 },
  'EUR': { 'TRY': 45.20, 'USD': 1.09 }
};
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## 🥇 Altın Fiyatları Entegrasyonu

### API Kaynağı
- **Truncgil API**: `https://finans.truncgil.com/v4/today.json`
- **Dönen Veriler**: Gram, Çeyrek, Yarım, Tam, Cumhuriyet, Ons altın fiyatları
- **Format**: TR sayı formatı ("2.547,50")

### Kullanım Örneği

```javascript
import { fetchGoldToday } from './src/lib/api';
import { parseTr } from './src/lib/format';

const gold = await fetchGoldToday();
const prices = {
  gram: parseTr(gold.gram?.Satış),
  ceyrek: parseTr(gold.ceyrek?.Satış),
  yarim: parseTr(gold.yarim?.Satış),
  tam: parseTr(gold.tam?.Satış),
  cumhuriyet: parseTr(gold.cumhuriyet?.Satış),
  ons: parseTr(gold.ons?.Satış)
};
```

### XAU Entegrasyonu

Ons bazlı uluslararası fiyatlar için:

```javascript
import { fetchGoldXau } from './src/lib/api';

const xauPrice = await fetchGoldXau('TRY'); // TRY cinsinden 1 ons fiyatı
const gramPrice = xauPrice / 31.1035; // 1 gram fiyatı
```
