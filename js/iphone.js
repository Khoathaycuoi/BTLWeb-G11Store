// Render sản phẩm
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);

  const html = `
    <div class="card-container row g-4">
      ${products
        .map(
          (p) => `
          <div class="col-md-4 col-lg-3">
            <div class="card shadow border-0 h-100">
              <img src="${p.img}" class="card-img-top" alt="${p.name}" />
              <div class="card-body text-center">
                <h6 class="card-title mb-2">${p.name}</h6>
                <p class="text-danger fw-bold mb-1">
                  ${(p.price || 0).toLocaleString()}đ
                </p>
                <p class="text-muted text-decoration-line-through mb-1">
                  ${(p.oldPrice || 0).toLocaleString()}đ
                </p>
                <p class="text-success small mb-1">Giảm ${p.discount}%</p>
                <p class="small text-delivery mb-1">${"Trả góp 0% | Miễn phí vận chuyển"}</p>
                <button class="btn btn-outline-danger w-100">Thêm vào giỏ hàng</button>
              </div>
            </div>
          </div>`
        )
        .join("")}
    </div>
  `;

  container.innerHTML = html;
}

renderProducts(ipProducts, "iphone-container");

// --------------- Popup thêm giỏ hàng -----------
const addPopup = document.getElementById("add-popup");
const popupImg = document.getElementById("popup-img");
const popupName = document.getElementById("popup-name");
const popupPrice = document.getElementById("popup-price");
const popupQty = document.getElementById("popup-qty");
const qtyPlus = document.getElementById("qty-plus");
const qtyMinus = document.getElementById("qty-minus");
const confirmAdd = document.getElementById("confirmAdd");
const cancelAdd = document.getElementById("cancelAdd");

let currentProduct = null;

// Khi ấn nút Thêm vào giỏ hàng
document.addEventListener("click", (e) => {
  if (
    e.target.matches(".btn-outline-danger") ||
    e.target.matches(".card-img-top")
  ) {
    const card = e.target.closest(".card");
    const name = card.querySelector(".card-title").textContent;
    const price = parseInt(
      card.querySelector(".text-danger").textContent.replace(/\D/g, "")
    );
    const img = card.querySelector("img").src;

    currentProduct = { name, price, img };
    popupName.textContent = name;
    popupPrice.textContent = price.toLocaleString() + "đ";
    popupImg.src = img;
    popupQty.textContent = 1;

    addPopup.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
});

// Nút tăng giảm
qtyPlus.addEventListener("click", () => {
  popupQty.textContent = parseInt(popupQty.textContent) + 1;
});

qtyMinus.addEventListener("click", () => {
  const value = parseInt(popupQty.textContent);
  if (value > 1) popupQty.textContent = value - 1;
});

// Xác nhận thêm
confirmAdd.addEventListener("click", () => {
  const qty = parseInt(popupQty.textContent);
  if (currentProduct) {
    addToCart({ ...currentProduct, qty });
    alert(`✅ Đã thêm ${qty} x ${currentProduct.name} vào giỏ`);
  }
  addPopup.style.display = "none";
  document.body.style.overflow = "";
});

// Hủy popup
cancelAdd.addEventListener("click", () => {
  addPopup.style.display = "none";
  document.body.style.overflow = "";
});
