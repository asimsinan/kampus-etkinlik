import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const message = document.querySelector("#form-mesaj");

// Güncelleme sayfası: URL'de id varsa formu o etkinlikle doldur.
const id = new URLSearchParams(window.location.search).get("id");
const current = events.find((item) => item.id === id);
// Güncelleme sayfası id'siz veya geçersiz id ile açıldıysa formu gösterme.
if (form.dataset.mode === "guncelle" && !current) {
  form.outerHTML = `
    <div class="mesaj mesaj-hata" role="alert">
      <p>Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.</p>
    </div>
    <p><a class="buton" href="etkinlikler.html">Etkinliklere git</a></p>
  `;
  document.querySelector(".bilgi")?.remove();
}

if (form.dataset.mode === "guncelle" && current) {
  form.elements.ad.value = current.title;
  form.elements.kategori.value = current.category;
  form.elements.tarih.value = current.date;
  form.elements.saat.value = current.time;
  form.elements.yer.value = current.location;
  form.elements.kontenjan.value = current.capacity;
  form.elements.aciklama.value = current.description;
}

// Bir alanın altına hata yazar veya hatayı temizler.
function setError(field, text) {
  const box = form.querySelector(`#${field.id}-hata`);
  box.textContent = text;
  field.setAttribute("aria-invalid", text ? "true" : "false");
}

// Form nesnesini doğrular, alan adı → hata metni döndürür.
function validate(data) {
  const errors = {};
  if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
  if (!data.category) errors.kategori = "Bir kategori seçin.";
  if (!data.date) errors.tarih = "Tarih seçin.";
  if (!data.time) errors.saat = "Saat seçin.";
  if (!data.location) errors.yer = "Yer bilgisini yazın.";
  if (data.capacity !== null && (data.capacity < 1 || data.capacity > 1000)) {
    errors.kontenjan = "Kontenjan 1 ile 1000 arasında olmalı.";
  }
  return errors;
}

form.addEventListener("submit", (e) => {
  e.preventDefault(); // sayfa yenilenmesin

  // Form alanlarını bir nesneye dönüştür
  const fd = new FormData(form);
  const data = {
    id: current ? current.id : `event-${events.length + 1}`,
    title: fd.get("ad").trim(),
    category: fd.get("kategori"),
    date: fd.get("tarih"),
    time: fd.get("saat"),
    location: fd.get("yer").trim(),
    capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : null,
    description: fd.get("aciklama").trim()
  };

  const errors = validate(data);
  ["ad", "kategori", "tarih", "saat", "yer", "kontenjan"].forEach((name) => {
    setError(form.elements[name], errors[name] || "");
  });

  if (Object.keys(errors).length > 0) {
    message.className = "mesaj mesaj-hata";
    message.innerHTML = "<p>Formda hatalı alanlar var, lütfen düzeltin.</p>";
    return;
  }

  message.className = "mesaj mesaj-basari";
  message.innerHTML = `
    <p>${form.dataset.mode === "guncelle" ? "Etkinlik güncellendi" : "Etkinlik oluşturuldu"} (bu sprintte kaydedilmez):</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  `;
});
