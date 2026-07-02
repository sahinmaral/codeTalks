# codeTalks

**codeTalks**, geliştiriciler için tasarlanmış gerçek zamanlı bir sohbet uygulamasıdır. Firebase gibi hazır bir servis kullanmak yerine back-end servisi özel olarak yazılmış ve içerisine SignalR eklenmiş bir API ile haberleşme sağlanmıştır.

**@microsoft/signalr** paketi sayesinde API'da yer alan Hub servislerine bağlantı kurup bu servisleri dinleyebiliriz.

## Kurulum

Projeyi çalıştırmadan önce kök dizinde bir `.env` dosyası oluşturup aşağıdaki ortam değişkenlerini tanımlamanız gerekmektedir:

```env
EXPO_PUBLIC_API_URL=        # Back-end REST API'nin temel URL'i (örn. http://localhost:5000/api)
```

## Roadmap

Proje ilerleyişini [GitHub Projects](https://github.com/users/sahinmaral/projects/4) üzerinden takip edebilirsiniz.

## İlgili Repo

Back-end kaynak koduna ulaşmak için: [codeTalks.Backend](https://github.com/sahinmaral/codeTalks.Backend)
