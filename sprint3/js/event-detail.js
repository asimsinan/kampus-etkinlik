import { events } from "./data.js";

const container = document.querySelector("#detay");
const pageTitle = document.querySelector("#sayfa-basligi");

function formatDate(date) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function showError(message) {
  pageTitle.textContent = "Etkinlik bulunamadı";
  container.innerHTML = `
    <div class="mesaj mesaj-hata" role="alert">
      <p>${message}</p>
    </div>
    <p><a class="buton" href="etkinlikler.html">&larr; Listeye dön</a></p>
  `;
}

// 1. URL'deki id değerini oku: etkinlik-detay.html?id=event-3
const id = new URLSearchParams(window.location.search).get("id");

// 2. İlgili etkinliği bul
const event = events.find((item) => item.id === id);

// 3. Bulunamazsa anlaşılır hata, bulunursa içeriği yaz
if (!id) {
  showError("Hangi etkinliği görmek istediğiniz belirtilmemiş. Listeden bir etkinlik seçin.");
} else if (!event) {
  showError(`"${id}" numaralı bir etkinlik yok. Listeden bir etkinlik seçin.`);
} else {
  document.title = `Kampüs Etkinlikleri — ${event.title}`;
  pageTitle.textContent = event.title;

  const figure = event.image
    ? `<figure>
         <img src="${event.image}" alt="${event.title} afişi" width="480" height="270">
         <figcaption>${event.title} afişi</figcaption>
       </figure>`
    : "";

  container.innerHTML = `
    <div class="detay-ust">
      ${figure}
      <section class="kunye">
        <h2>Etkinlik Künyesi</h2>
        <dl>
          <dt>Tarih</dt>
          <dd><time datetime="${event.date}T${event.time}">${formatDate(event.date)}, ${event.time}</time></dd>
          <dt>Yer</dt>
          <dd>${event.location}</dd>
          <dt>Kategori</dt>
          <dd>${event.category}</dd>
          <dt>Kontenjan</dt>
          <dd>${event.capacity} kişi</dd>
        </dl>
      </section>
    </div>
    <h2>Açıklama</h2>
    <p>${event.description}</p>
    <p class="form-butonlar">
      <a class="buton" href="etkinlikler.html">&larr; Listeye dön</a>
      <a class="buton" href="etkinlik-guncelle.html?id=${event.id}">Bu etkinliği güncelle</a>
    </p>
  `;
}
