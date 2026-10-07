import { events } from "./data.js";

// Tarihi "12 Ekim 2026" biçiminde gösterir.
function formatDate(date) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Bir etkinlik nesnesinden kart HTML'i üretir.
function createCard(event) {
  return `
    <article class="kart">
      <h2>${event.title}</h2>
      <p class="kart-kategori">${event.category}</p>
      <p>Tarih: <time datetime="${event.date}T${event.time}">${formatDate(event.date)}, ${event.time}</time></p>
      <p>Yer: ${event.location}</p>
      <p>Kontenjan: ${event.capacity} kişi</p>
      <p>${event.description}</p>
      <p><a class="kart-link" href="etkinlik-detay.html?id=${event.id}">Detayları gör</a></p>
    </article>
  `;
}

const list = document.querySelector("#etkinlik-listesi");
const searchInput = document.querySelector("#arama");
const categorySelect = document.querySelector("#kategori-filtre");
const resultText = document.querySelector("#sonuc");

// Kartları listeye yazar.
function render(items) {
  list.innerHTML = items.map(createCard).join("");
}

// Arama ve kategoriyi birlikte uygular; events dizisini değiştirmez.
function applyFilters() {
  const text = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  const category = categorySelect.value;

  const filtered = events.filter((event) => {
    const matchesText =
      event.title.toLocaleLowerCase("tr-TR").includes(text) ||
      event.description.toLocaleLowerCase("tr-TR").includes(text);
    const matchesCategory = category === "" || event.category === category;
    return matchesText && matchesCategory;
  });

  render(filtered);
  resultText.textContent =
    filtered.length === 0
      ? "Aramanıza uygun etkinlik bulunamadı."
      : `${filtered.length} etkinlik listeleniyor.`;
}

// Ana sayfa: yalnızca en yakın 2 etkinlik.
if (list.dataset.limit) {
  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, Number(list.dataset.limit));
  render(upcoming);
} else {
  // Etkinlikler sayfası: kategori seçeneklerini veriden üret, filtreyi bağla.
  const categories = [...new Set(events.map((event) => event.category))];
  categories.forEach((category) => {
    categorySelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${category}">${category}</option>`
    );
  });

  // Enter'a basınca sayfa yenilenmesin
  document.querySelector("#filtre-formu").addEventListener("submit", (e) => e.preventDefault());
  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
  applyFilters();
}
