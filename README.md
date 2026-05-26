# 🚆 MarmarayApp

Marmaray İstanbul'un metro sefer saatlerini gerçek zamanlı olarak gösteren mobil uygulamadır.

## 📱 Özellikler

- **Canlı Sefer Saatleri**: Seçtiğiniz istasyondan kalkacak olan trenlerin saatlerini görüntüleyin
- **İki Yön Desteği**: Halkalı ve Gebze yönlerine ait seferleri ayrı ayrı görebilirsiniz
- **Geri Sayım**: Bir sonraki trenin kaç dakika sonra kalkacağını gerçek zamanlı olarak takip edin
- **Hafta Sonu Tarifesi**: Hafta sonu geçerli olan özel seferleri işaretleme
- **İstasyon Seçimi**: Kolayca istasyon değiştirin ve farklı durakları takip edin
- **Karanlık Tema**: Göz dostu modern tasarım

## 🚀 Nasıl Başlanır

1. **Uygulamayı Başlatın**:
   ```bash
   npm start
   ```

2. **Platform Seçin**:
   - **iOS**: Terminalden `i` yazın veya `npm run ios` komutu kullanın
   - **Android**: Terminalden `a` yazın veya `npm run android` komutu kullanın
   - **Web**: Terminalden `w` yazın veya `npm run web` komutu kullanın

## 📖 Kullanıcı Rehberi

### 1. İstasyon Seçimi
- Uygulamayı açtığınızda "İstasyon Seçin" yazısını görürsünüz
- Başlıktaki istasyon simgesine veya adına dokunarak istasyon seçim ekranını açabilirsiniz
- Listeden istasyonunuzu seçip kaydetmek için istasyon adına dokunun

### 2. Sefer Saatlerini Görüntüleme
- Seçtiğiniz istasyondaki tüm seferleri iki yönde görebilirsiniz:
  - **Halkalı Yönü**: Kırmızı-turuncu renkte
  - **Gebze Yönü**: Altın-sarı renkte
- Her sefer kartında şu bilgiler bulunur:
  - Varış noktası (Destination)
  - Sefer kalkış saati
  - Sonraki kalış saatine kaç dakika kaldığı

### 3. İşaretler
- 🕖 **CANLI**: Uygulamanın canlı olduğunu gösterir
- **H/S**: Yalnızca hafta sonu (cumartesi-pazar) geçerli seferdir
- **Yeşil Badge**: Sefer 2 dakikadan daha kısa sürede kalkacaktır

### 4. Saati Kontrol Edin
- Başlığın sağ üst köşesinde canlı saat gösterilir
- Uygulamanın doğru saati gösterdiğinden emin olun

## 📝 Sefer Saatleri Nasıl Güncellenir

Sefer saatleri `src/app/utils/trainTimes.json` dosyasında saklanır. Yeni istasyonlar eklemek veya seferleri güncellemek için bu dosyayı düzenleyin.

**JSON Formatı**:
```json
{
  "stations": {
    "İstasyonAdı": {
      "halkali": [
        { "departure": "06:30", "destination": "Hedef", "weekendOnly": false }
      ],
      "gebze": [
        { "departure": "06:45", "destination": "Hedef", "weekendOnly": false }
      ]
    }
  }
}
```

## 🛠️ Teknik Bilgiler

- **Framework**: React Native / Expo
- **Dil**: TypeScript
- **Navigasyon**: Expo Router
- **Tasarım**: React Native StyleSheet

## 📦 Gereksinimler

- Node.js 16+
- npm veya yarn
- Expo CLI (opsiyonel)

## 🤝 Geri Bildirim

Uygulama hakkında geri bildirim ve önerileriniz için lütfen proje sahibi ile iletişime geçin.

---

**Sürüm**: 1.0.1  
**Son Güncelleme**: 2026
