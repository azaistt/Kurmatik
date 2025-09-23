# 💰 Kurmatik - Modern Finans Uygulaması

**Real-time Currency & Gold Price Converter**

Kurmatik, Yahoo Finance API'sini kullanarak gerçek zamanlı döviz kurları ve altın fiyatları sunan modern bir React Native uygulamasıdır.

## 🚀 Özellikler

### 💱 Döviz Çevirici
- **Desteklenen Para Birimleri**: USD, EUR, TRY
- **Gerçek Zamanlı Kurlar**: Yahoo Finance API
- **Çapraz Kurlar**: Herhangi bir para biriminden diğerine çevrim
- **Otomatik Güncelleme**: Canlı piyasa verileri

### 🥇 Altın Fiyatları
- **Gram Altın**: Anlık TL fiyatı
- **Çeyrek Altın**: 1.608 gram
- **Yarım Altın**: 3.216 gram  
- **Tam Altın**: 6.432 gram
- **Cumhuriyet Altını**: 6.615 gram
- **Ons Altın**: 31.1035 gram (Troy ons)

### 🎨 Modern UI/UX
- **Card-based Tasarım**: Profesyonel finans uygulaması görünümü
- **Tema Sistemi**: Light/Dark mode desteği
- **Responsive**: Mobil ve web uyumlu
- **Logo Entegrasyonu**: Marka kimliği
- **Pull-to-Refresh**: Verileri yenileme

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
- **Web**: http://localhost:8081
- **Android**: `a` tuşuna basın
- **iOS**: `i` tuşuna basın
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Altın ve Döviz API Kullanımı

Bu projede ücretsiz kaynaklar tercih edilmiştir:

- Altın (TL bazlı): `https://finans.truncgil.com/v4/today.json`
- XAU (Ons/Gram ve farklı para birimleri): `https://api.exchangerate.host/latest?base=XAU`
- Opsiyonel NosyAPI (ek ücret gerektirmeyen ücretsiz katman): `https://www.nosyapi.com/apiv2/service`

Uygulama içindeki başlıca fonksiyonlar:

- `fetchGoldToday()` → Truncgil'den gram/çeyrek/yarım/tam/cumhuriyet/ons fiyatlarını çeker (TL).
- `fetchGoldXau(to)` → XAU bazlı 1 ons ve 1 gram fiyatını hedef para biriminde döner (örn. `USD`, `TRY`, `EUR`).
- `fetchFx(from, to, amount)` → Döviz çevirir; ayarlıysa önce NosyAPI, aksi halde public FX API kullanılır.
- `setNosyApiKey(key)` / `fetchNosyCurrencies()` → NosyAPI ile çalışmak için yardımcılar.

TR sayı formatından (örn. `"2.547,50"`) sayıya dönüştürmek için `parseTr(s)` fonksiyonunu kullanın.

### Test scripti

Windows PowerShell ile test scriptini çalıştırın:

```powershell
node .\test-api.js
```

NosyAPI anahtarınız varsa ortam değişkeni ile birlikte çalıştırın:

```powershell
$env:NOSY_API_KEY = "YOUR_NOSY_API_KEY"; node .\test-api.js
```

NosyAPI için örnek cURL (ikisi de çalışır):

```bash
curl --location "https://www.nosyapi.com/apiv2/service/economy/currency/list?apiKey=APIKEY"

curl --location "https://www.nosyapi.com/apiv2/service/economy/currency/list" \
   --header "X-NSYP: APIKEY"
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Altın (Gold) Fiyatları – Ücretsiz API

- Kaynak: `https://finans.truncgil.com/v4/today.json`
- Dönen JSON anahtarları: `"Gram Altın"`, `"Çeyrek Altın"`, `"Yarım Altın"`, `"Tam Altın"`, `"Cumhuriyet Altını"`, `"Ons Altın"`, `"Update_Date"` vb.
- Alanlar: `Alış`, `Satış`, `Değişim` ve değerler TR formatında gelir (örn. `"2.547,50"`).

Kodda ilgili fonksiyonlar:

- API erişimi: `src/lib/api.js` → `fetchGoldToday()` ve `fetchGoldXau(to)`
- TR sayı dönüştürme: `src/lib/format.js` → `parseTr()`

Örnek kullanım:

```js
import { fetchGoldToday } from './src/lib/api';
import { parseTr } from './src/lib/format';

const gold = await fetchGoldToday();
const gramTL = parseTr(gold.gram.Satış);       // 1 gram altın TL
const ceyrekTL = parseTr(gold.ceyrek.Satış);   // 1 çeyrek altın TL
```

Hızlı test çalıştırma:

```powershell
node .\test-api.js
```

Uygulama içi entegrasyon örneği: `src/screens/HomeScreen.js`.
