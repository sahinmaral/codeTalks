# codeTalks

🇬🇧 [Read this document in English](README.md)

**codeTalks**, geliştiriciler için tasarlanmış gerçek zamanlı bir sohbet uygulamasıdır. Bu depo mobil istemciyi barındırır: Expo ile geliştirilmiş bir React Native uygulaması. Firebase gibi hazır bir servis yerine özel olarak yazılmış bir .NET API ile haberleşir ve gerçek zamanlı mesajlaşma SignalR üzerinden sağlanır.

Back-end tarafı [codeTalks.Backend](https://github.com/sahinmaral/codeTalks.Backend) deposunda yer alır.

## Teknolojiler

| Konu | Tercih |
|---|---|
| Çalışma ortamı | Expo SDK 52 üzerinde React Native 0.76 (TypeScript) |
| Workflow | Expo CNG — `android/` ve `ios/` klasörleri `expo prebuild` ile üretilir, depoya eklenmez |
| Navigasyon | React Navigation — native stack + bottom tabs, özel tab bar ile |
| State yönetimi | Redux Toolkit + redux-persist (AsyncStorage) |
| Ağ katmanı | axios; auth, refresh token rotasyonu ve `Accept-Language` için interceptor'lar |
| Gerçek zamanlılık | `@microsoft/signalr` — chat hub ve notification hub |
| Form & doğrulama | Formik + Yup, çeviri anahtarı tabanlı hata mesajları |
| Yerelleştirme | i18next / react-i18next — İngilizce + Türkçe, `expo-localization` ile cihaz dili algılama |
| Tema | Açık / koyu / sistem; `useThemedStyles` + `makeStyles` factory deseni |
| Push bildirimleri | `expo-notifications` (Expo push servisi, Android'de FCM) |
| Arayüz | `@gorhom/bottom-sheet`, Reanimated, Lottie, Remix icons, Montserrat |
| Hata takibi | Sentry (`@sentry/react-native`) |
| Test | Jest (`jest-expo`) + React Native Testing Library |
| Build | EAS Build (development / preview / production profilleri) |

## Özellikler

- **Kimlik doğrulama** — iki adımlı kayıt (önce hesap bilgileri, sonra ad-soyad), giriş, çıkış, şifre değiştirme; JWT access token'ları ve dönen (rotating) refresh token'lar arka planda yönetilir
- **Kanallar** — oluşturma, katılma (açık ya da istek onaylı), ayrılma, keşfetme; kanal bazlı roller (Owner/Moderator/User) ile üye yönetimi, katılım isteği onayı ve yasaklama
- **Mesajlar** — SignalR üzerinden gerçek zamanlı kanal mesajlaşması, sayfalanmış geçmiş, göreli zaman damgaları
- **Profil** — profil bilgileri, fotoğraf yükleme, çevrimiçi durumu, bildirim ve kanal bazlı sessize alma ayarları
- **Bildirimler** — push bildirimleri, kanal bazlı ve toplam okunmamış sayaçları, bildirime dokunulduğunda ilgili kanala yönlendirme
- **Uygulama iskeleti** — internet bağlantısı kontrol ekranı, tema ve dil değiştirme, kullanım koşulları ve gizlilik politikası ekranları

## Mimari

```
src/
  components/   yeniden kullanılabilir arayüz bileşenleri (kendi stilleri ve testleriyle)
  screens/      özellik bazlı gruplanmış ekran bileşenleri
  hooks/        SignalR bağlantıları, push bildirimleri, tema, dil, çıkış
  redux/        store ve kalıcı reducer'lar (app, activeChannel, theme, language)
  services/     axios örneği ve her back-end kaynağı için bir API modülü
  schemas/      Yup doğrulama şemaları
  localization/ i18n kurulumu ve en/tr dil dosyaları
  styles/       renkler, tipografi, temalı stil yardımcıları
  utils/        token yöneticisi, hata eşleme, görsel seçici, Sentry, navigation ref
```

Özellikle iki noktanın altını çizmek gerekir:

- **`src/utils/tokenManager.ts`**, refresh token'ın harcandığı tek yerdir. Eş zamanlı çağrılar — axios'tan gelen 401 yığını ve SignalR access-token factory'sinden gelen proaktif yenileme — tek bir istekte birleştirilir; böylece dönen refresh token iki kez harcanmaz ve kullanıcı bir yarış durumu yüzünden oturumundan düşmez. Ağ hatası veya 5xx durumunda oturum bilinçli olarak korunur; yalnızca sunucu kimlik bilgisini gerçekten reddettiğinde oturum sonlandırılır.
- **`useSignalRConnection` / `useNotificationHub`**, chat ve bildirim hub'larının yaşam döngüsünü yönetir; güncel access token ile yeniden bağlanır ve kalıcı oturum durumuyla senkron kalır.

## Yerelde çalıştırma

Node 18+, Yarn ve çalışır durumda bir [codeTalks.Backend](https://github.com/sahinmaral/codeTalks.Backend) örneği gerekir.

```bash
yarn install
```

Kök dizinde bir `.env` dosyası oluşturun:

```env
EXPO_PUBLIC_API_BASE_URL=   # back-end temel URL'i, /api olmadan (örn. http://192.168.1.20:5050)
EXPO_PUBLIC_SENTRY_DSN=     # opsiyonel; gerçek bir DSN girilmediği sürece Sentry devre dışı kalır
```

`EXPO_PUBLIC_API_BASE_URL` hem REST istekleri (`/api/...`) hem de SignalR hub'ları (`/hubs/chat`, `/hubs/notifications`) için kullanılır. Bu yüzden fiziksel bir cihazda `localhost` yerine bilgisayarınızın yerel ağ adresini yazmanız gerekir.

Uygulama native modüller kullandığı için development build gerektirir; Expo Go ile çalışmaz. Cihazda veya simülatörde çalıştırmak için:

```bash
yarn ios       # expo run:ios
yarn android   # expo run:android
```

`android/` ve `ios/` klasörleri üretilir, depoya eklenmez. Native yapılandırma değiştiğinde (ya da klasörler yoksa) `npx expo prebuild --clean` ile yeniden üretin. Android push bildirimleri için ayrıca kök dizinde bir `google-services.json` gerekir; bu dosya gitignore'dadır ve paket adı `app.json` içindeki `com.sahinmaral.codetalks` ile eşleşmelidir.

Native build bir kez kurulduktan sonra günlük geliştirme için `yarn start` yeterlidir.

## Test

```bash
yarn test         # 61 suite içinde 349 test
yarn test:watch
```

Otomatik testler cihaz gerektirmeyen her şeyi kapsar: doğrulama şemaları, reducer'lar, hook'lar, API hata eşlemesi ve React Native Testing Library ile bileşen render/etkileşim testleri. Gerçekten donanım gerektiren kısımlar — push bildirimleri, gerçek zamanlı mesaj iletimi, native izinler — her sürüm öncesi elle yürütülmek üzere [docs/qa-test-plan.md](docs/qa-test-plan.md) içindeki kontrol listesinde yer alır.

## Build alma

EAS Build profilleri `eas.json` içinde tanımlıdır (`development`, `preview`, `production`). Her profil kendi `EXPO_PUBLIC_API_BASE_URL` ve `EXPO_PUBLIC_SENTRY_DSN` değerini taşır; build almadan önce placeholder değerleri doldurun.

```bash
eas build --profile development --platform ios
eas build --profile production --platform android
```

## Notlar

- Kod formatı Prettier ile denetlenir — `yarn format` / `yarn format:check`.
- `patch-package` kurulum sırasında çalışır; şu an yeni Xcode SDK'larındaki bir Swift derleme hatası için `expo-localization` paketini yamalar.

## Yol haritası

Proje ilerleyişini [GitHub Projects](https://github.com/users/sahinmaral/projects/4) üzerinden takip edebilirsiniz.

## İlgili repo

Back-end kaynak koduna ulaşmak için: [codeTalks.Backend](https://github.com/sahinmaral/codeTalks.Backend)
