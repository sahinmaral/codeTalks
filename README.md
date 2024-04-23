# codeTalks

Bu uygulama, Patika.dev React Native patikası içerisinde yer alan ödevlerden biri olan codeTalks adlı projedir. Ödevden ayrıca olarak firebase gibi bir servis kullanmak yerine back-end servisini kendim yazdığım ve içerisine signalR eklediğim bir API ile haberleşmesi sağlanmıştır. 
<br />
Ödevin linki : 
https://academy.patika.dev/courses/react-native/odev_5

<b>@microsoft/signalr</b> paketi sayesinde API da yer alan Hub servislerine bağlantı kurup bu servisleri dinleyebiliriz.

## TODO

### Yapılacaklar

- [ ] Kullanıcı profili 
- [ ] Kullanıcıda yer alan token bilgilerinin süresi geçmediği taktirde giriş yap ekranına girmeden direkt olarak kanalların listelendiği kısma yönlendirilmesi
- [ ] Kanal listesinin çok olması durumunda sayfalama özelliği eklenmesi
- [ ] Bazı ekranlarda yazılan inline stillendirmelerin ayrı bir style dosyasında yazılması 

### Yapım Aşamasında
- [ ] Kanala atılan isteklerin kabul ve ret işlemlerinin moderatörler tarafından sağlanması
- [ ] Moderatörlerin kanaldan birini çıkartabilme özelliği
- [ ] Moderatörlerin birini bloklama özelliği

### Bitti ✓

- [X] Kanalların listelenmesinde kanalların yanında yer alan seçenek menüsü
    - Mesela kullanıcı, o kanalda moderatör rolünde ise kanalı sil gibi onun rölüne özgü seçenekler olabilir.
    - Kullanıcı; normal bir kullanıcı rolünde ise kanaldan çık gibi sade işlemler , seçenek olarak verilebilir.
- [X] Kanal adının değiştirme özelliği
- [X] Kanala istek atma (ID ile)
