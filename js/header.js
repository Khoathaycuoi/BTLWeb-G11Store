// Gắn link index cho logo //
document.querySelector("#logo-store").addEventListener("click", () => {
  window.location.href = "./index.html";
});

const searchInput = document.getElementById("search-input");
const popup = document.getElementById("search-popup");

// --- Gom dữ liệu từ nhiều file JS -----
const allProducts = [
  ...(typeof ipProducts !== "undefined" ? ipProducts : []),
  ...(typeof macProducts !== "undefined" ? macProducts : []),
  ...(typeof ipadProducts !== "undefined" ? ipadProducts : []),
  ...(typeof watchProducts !== "undefined" ? watchProducts : []),
  ...(typeof phukienProducts !== "undefined" ? phukienProducts : []),
];

// --- Lấy danh sách tên sản phẩm ---
const productNames = allProducts.map((p) => p.name);

// --- Hàm bôi đậm phần tìm kiếm trùng ---
function highlightMatch(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

// --- Hiển thị gợi ý ---
function showSuggestions(keyword = "") {
  const value = keyword.trim().toLowerCase();
  let filtered;

  if (value === "") {
    // 1. Khi chưa nhập, lấy 5 SẢN PHẨM đầu tiên từ allProducts
    filtered = allProducts.slice(0, 5);
  } else {
    // 2. Lọc 5 SẢN PHẨM có tên chứa từ khóa
    filtered = allProducts
      .filter((p) => p.name.toLowerCase().includes(value))
      .slice(0, 5);
  }

  popup.innerHTML =
    filtered.length > 0
      ? filtered
          .map(
            (p) => `
          <div class="suggest-item">
            <img src="${p.img}" class="suggest-img" alt="${p.name}" /> 
            <div class="suggest-info-wrapper">
              <p class="suggest-name">${highlightMatch(p.name, value)}</p>
              <span class="suggest-price">${(
                p.price || 0
              ).toLocaleString()}₫</span>

            </div>
          </div>`
          )
          .join("")
      : "<p class='no-result'>Không tìm thấy sản phẩm nào trùng khớp</p>";

  popup.style.display = "block";
}

// --- Sự kiện tìm kiếm ---
searchInput.addEventListener("focus", () => showSuggestions()); // Hiển thị gợi ý khi focus
searchInput.addEventListener("input", (e) => showSuggestions(e.target.value)); // Cập nhật gợi ý khi nhập

popup.addEventListener("click", (e) => {
  if (e.target.tagName === "P" || e.target.tagName === "STRONG") {
    const text = e.target.closest("p").textContent;
    searchInput.value = text;
    popup.style.display = "none";
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box")) popup.style.display = "none";
});

// ------------------- Giỏ hàng --------------------- //
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
const cartPopup = document.getElementById("cart-popup");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const closeCartBtn = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout");

// Hiển thị giỏ hàng
function renderCart() {
  cartItemsEl.innerHTML =
    cart.length > 0
      ? cart
          .map(
            (item, i) => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" />
          <p class="cart-item-name">${item.name}</p>
          <p>${item.price.toLocaleString()}đ</p>
          <div class="cart-item-qty">
            <button onclick="changeQty(${i}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${i}, 1)">+</button>
          </div>
          <p>${(item.price * item.qty).toLocaleString()}đ</p>
        </div>`
          )
          .join("")
      : `<p class="text-center text-muted py-3">Giỏ hàng trống</p>`;

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotalEl.textContent = total.toLocaleString();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Thêm vào giỏ
function addToCart(product) {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((p) => p.name === product.name);
  if (existing) existing.qty += product.qty || 1;
  else cart.push({ ...product, qty: product.qty || 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Cho phép main.js gọi được
window.addToCart = addToCart;

// Thay đổi số lượng
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

// Hiện popup
document.querySelector(".giohang").addEventListener("click", () => {
  renderCart();
  cartPopup.style.display = "flex";
  document.body.style.overflow = "hidden";
});

// Đóng popup
closeCartBtn.addEventListener("click", () => {
  cartPopup.style.display = "none";
  document.body.style.overflow = "";
});

// Nút Đặt hàng
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return alert("Giỏ hàng trống! Vui lòng thêm sản phẩm");
  const Dathang = confirm("Bạn có chắc muốn đặt hàng?");
  if (Dathang) {
    alert("Thông tin đơn hàng đã được gửi, vui lòng chờ liên hệ từ cửa hàng!");
    cart.length = 0;
    renderCart();
    localStorage.removeItem("cart");
  } else {
    return alert("Đã hủy đặt hàng");
  }
});

// Ẩn khi click nền ngoài
cartPopup.addEventListener("click", (e) => {
  if (e.target === cartPopup) {
    cartPopup.style.display = "none";
    document.body.style.overflow = "";
  }
});

// ------------------- Popup đăng nhập/đăng ký --------------------- //
const loginPopup = document.getElementById("login-popup");
const registerPopup = document.getElementById("register-popup");
let signinBtn = document.querySelector(".signin");
const userPopup = document.getElementById("user-popup");

// Regex kiểm tra dữ liệu
const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
const phoneRegex = /^0\d{9}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
const addressRegex = /^[A-Za-z0-9À-ỹ\s,.-]+$/;
// Hàm mở popup đăng nhập
function openLogin() {
  loginPopup.style.display = "flex";
  userPopup.style.display = "none";
}

// Hàm toggle popup đăng xuất
function toggleLogoutMenu() {
  userPopup.style.display =
    userPopup.style.display === "block" ? "none" : "block";
}

// Chỉ 1 sự kiện duy nhất cho signin(Đăng nhập/Đăng xuất)
signinBtn.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (user) toggleLogoutMenu();
  else openLogin();
});

// ---------------------- Chuyển popup ----------------- //
document.getElementById("open-register").addEventListener("click", () => {
  loginPopup.style.display = "none";
  registerPopup.style.display = "flex";
});

document.getElementById("open-login").addEventListener("click", () => {
  registerPopup.style.display = "none";
  loginPopup.style.display = "flex";
});

// Click nền để đóng popup
document.querySelectorAll(".popup-bg").forEach((bg) => {
  bg.addEventListener("click", (e) => {
    if (e.target === bg) bg.style.display = "none";
  });
});

// -------------------- ĐĂNG KÝ------------------------ //
document.getElementById("btn-register").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const fullname = document.getElementById("reg-fullname").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const confirmPassword = document
    .getElementById("reg-confirm-password")
    .value.trim();
  const address = document.getElementById("reg-address").value.trim();

  if (
    !fullname ||
    !phone ||
    !password ||
    !email ||
    !confirmPassword ||
    !address
  )
    return alert("Vui lòng điền đầy đủ thông tin!");

  if (!emailRegex.test(email)) return alert("Email không hợp lệ!");
  if (!nameRegex.test(fullname)) return alert("Họ tên không hợp lệ!");
  if (!phoneRegex.test(phone)) return alert("Số điện thoại không hợp lệ!");
  if (!passwordRegex.test(password))
    return alert("Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ và số!");

  if (!addressRegex.test(address)) return alert("Địa chỉ không hợp lệ!");
  if (password !== confirmPassword)
    return alert("Mật khẩu xác nhận không khớp!");
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((u) => u.phone === phone))
    return alert("SĐT đã được đăng ký!");

  users.push({ fullname, email, phone, password, address });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Đăng ký thành công!");

  registerPopup.style.display = "none";
  loginPopup.style.display = "flex";
});

// ----------------- ĐĂNG NHẬP--------------------- //
document.getElementById("btn-login").addEventListener("click", () => {
  const phone = document.getElementById("login-phone").value.trim();
  const password = document.getElementById("login-password").value.trim();

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const found = users.find((u) => u.phone === phone && u.password === password);

  if (!phone || !password) return alert("Vui lòng điền đầy đủ thông tin!");
  if (!found) return alert("SĐT hoặc mật khẩu sai!");

  localStorage.setItem("loggedUser", JSON.stringify(found));
  loginPopup.style.display = "none";
  alert("Đăng nhập thành công!");
  showLoggedUser(found.fullname);
});

// ------------------- HIỂN THỊ USER SAU KHI ĐĂNG NHẬP -------------------- //
function showLoggedUser(name) {
  signinBtn.innerHTML = `
    <p>${name}</p>
    <img src="./assets/icons/header/Dangnhap.png" alt="" />
  `;
  signinBtn.classList.add("user-logged");
}

// ================= ĐĂNG XUẤT ================= //
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  userPopup.style.display = "none";

  signinBtn.innerHTML = `
    <p>Đăng nhập</p>
    <img src="./assets/icons/header/Dangnhap.png" alt="" />
  `;
  signinBtn.classList.remove("user-logged");

  alert("Bạn đã đăng xuất!");
});

// Khi load lại trang → giữ trạng thái đăng nhập
window.addEventListener("load", () => {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (user) showLoggedUser(user.fullname);
});
