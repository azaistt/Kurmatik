Kurmatik - Final Test & Run Instructions

Bu döküman, yaptığımız değişiklikleri test etmeniz ve prod/dev ortamınızı ayarlamanız için kısa bir rehber içerir.

1) Ortam değişkenleri
- (Opsiyonel) `EXCHANGE_RATE_HOST_KEY` veya `EXCHANGERATE_HOST_KEY` : `exchangerate.host` için API anahtarı (isteğe bağlı). Eğer set edilirse `fetchGoldXau` bu anahtarı kullanır.
- (Opsiyonel) `NOSY_API_KEY` : NosyAPI kullanmak istiyorsanız bu anahtarı set edin.

PowerShell örnekleri:

```powershell
# Geçici olarak terminal oturumunda ayarla
$env:EXCHANGE_RATE_HOST_KEY = 'YOUR_KEY_HERE'
# veya
$env:NOSY_API_KEY = 'YOUR_NOSY_KEY'

# Test çalıştır
node ./test-api.js
```

2) Beklenen test çıktısı
- `FX API` bölümünde HTTP 200 ve USD->TRY gibi oranlar görünmelidir.
- `Gold API` bölümünde `Gold keys:` dizisi ve `Gram Altın Satış`, `Çeyrek Altın Satış` gibi değerler görünmelidir.
- `XAU via exchangerate.host` bölümünde: eğer `EXCHANGE_RATE_HOST_KEY` set edilmemişse `missing_access_key` hatası alırsınız; anahtar eklerseniz gerçek `rates` gelmeli.
- `NOSY_API_KEY` set edilmemişse Nosy kısmı `skipping` diye atlar.

3) Nasıl ilerlenir
- Eğer `exchangerate.host` için anahtarınız varsa env'e ekleyip `node ./test-api.js` çalıştırın. Ben sonucu kontrol edip gerektiğinde kodu anahtar param biçimine göre düzeltirim.
- Self-host kurulum için `docs/TRUNCGIL-self-host.md` ve `docs/config.finance.example.php` hazır. İsterseniz ben Dockerfile / systemd örneği ekleyeyim.

4) Sık karşılaşılan sorunlar
- `Ons Altın Satış: 0` geliyorsa: Truncgil ham verisinde ONS anahtarı ya 0 ya string farklı formatta olabilir. Bunu incelememi isterseniz raw `j['ONS']` içeriğini konsola bastırıp sizinle paylaşırım.

5) Son adım
- Onay verirseniz D maddesini tamamlayıp repoda küçük bir `CHANGELOG.md` oluşturup yapılan değişiklikleri listeleyebilirim.
