const products = [
  {id:1,name:"Pan de chocolate",category:"Pan",price:38,emoji:"🥐",desc:"Masa suave, chocolate y un horneado dorado.",badge:"FAVORITO"},
  {id:2,name:"Concha rosa",category:"Dulce",price:22,emoji:"🌸",desc:"Clásica, esponjosa y con cobertura de vainilla.",badge:"NUEVO"},
  {id:3,name:"Pan artesanal",category:"Pan",price:32,emoji:"🍞",desc:"Corteza crujiente y miga suave, recién horneado.",badge:"FRESCO"},
  {id:4,name:"Pastel de frutos rojos",category:"Pasteles",price:280,emoji:"🍰",desc:"Bizcocho ligero, crema y frutos rojos.",badge:"ESPECIAL"},
  {id:5,name:"Croissant",category:"Pan",price:35,emoji:"🥐",desc:"Capas delicadas, mantequilla y textura crujiente.",badge:"FAVORITO"},
  {id:6,name:"Roles de canela",category:"Dulce",price:42,emoji:"🍥",desc:"Canela, azúcar y glaseado cremoso.",badge:"HORNEADO HOY"},
  {id:7,name:"Pastel de chocolate",category:"Pasteles",price:320,emoji:"🍫",desc:"Chocolate intenso, crema suave y acabado elegante.",badge:"ESPECIAL"},
  {id:8,name:"Café de la casa",category:"Bebidas",price:35,emoji:"☕",desc:"Café aromático para acompañar tu pan favorito.",badge:"CALIENTE"}
];

let cart = JSON.parse(localStorage.getItem("panDeVidaCart") || "[]");
let selectedCategory = "Todos";
let deferredInstallPrompt = null;

const $ = (id) => document.getElementById(id);
const grid = $("productGrid");
const cartCount = $("cartCount");
const cartItems = $("cartItems");
const cartTotal = $("cartTotal");
const cartEmpty = $("cartEmpty");
const cartDrawer = $("cartDrawer");
const cartBackdrop = $("cartBackdrop");
const toast = $("toast");

function money(value){ return `$${Number(value).toFixed(2)}`; }

function renderProducts(){
  const visible = selectedCategory === "Todos"
    ? products
    : products.filter(p => p.category === selectedCategory);

  grid.innerHTML = visible.map(p => `
    <article class="product">
      <div class="product-art">
        <span class="product-badge">${p.badge}</span>
        <div class="shape" aria-hidden="true"></div>
        <span class="product-emoji">${p.emoji}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-btn" data-add="${p.id}" aria-label="Agregar ${p.name}">＋</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart(){
  const count = cart.reduce((sum,item) => sum + item.qty, 0);
  const total = cart.reduce((sum,item) => sum + item.price * item.qty, 0);

  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  cartEmpty.style.display = cart.length ? "none" : "block";
  cartItems.style.display = cart.length ? "block" : "none";

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div class="mini-art">${item.emoji}</div>
      <div>
        <h4>${item.name}</h4>
        <p>${money(item.price)} c/u</p>
        <div class="qty">
          <button data-minus="${item.id}" aria-label="Disminuir">−</button>
          <strong>${item.qty}</strong>
          <button data-plus="${item.id}" aria-label="Aumentar">＋</button>
        </div>
        <button class="remove" data-remove="${item.id}">Eliminar</button>
      </div>
      <span class="row-price">${money(item.price * item.qty)}</span>
    </div>
  `).join("");

  localStorage.setItem("panDeVidaCart", JSON.stringify(cart));
}

function addToCart(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  const found = cart.find(x => x.id === id);
  if(found) found.qty++;
  else cart.push({...p, qty:1});
  renderCart();
  showToast(`${p.name} agregado ✦`);
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}

function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function openCart(){
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("show");
  cartDrawer.setAttribute("aria-hidden","false");
}

function closeCart(){
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden","true");
}

$("categoryBar").addEventListener("click", e => {
  const btn = e.target.closest(".category");
  if(!btn) return;
  selectedCategory = btn.dataset.category;
  document.querySelectorAll(".category").forEach(b => b.classList.toggle("active", b === btn));
  renderProducts();
});

grid.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if(btn) addToCart(Number(btn.dataset.add));
});

cartItems.addEventListener("click", e => {
  const plus = e.target.closest("[data-plus]");
  const minus = e.target.closest("[data-minus]");
  const remove = e.target.closest("[data-remove]");

  if(plus) changeQty(Number(plus.dataset.plus), 1);
  if(minus) changeQty(Number(minus.dataset.minus), -1);
  if(remove){
    cart = cart.filter(x => x.id !== Number(remove.dataset.remove));
    renderCart();
  }
});

$("cartButton").onclick = openCart;
$("closeCart").onclick = closeCart;
cartBackdrop.onclick = closeCart;

const mobileMenu = $("mobileMenu");
const menuBackdrop = $("menuBackdrop");

function openMenu(){
  mobileMenu.classList.add("open");
  menuBackdrop.classList.add("show");
  mobileMenu.setAttribute("aria-hidden","false");
  $("menuButton").setAttribute("aria-expanded","true");
}

function closeMenu(){
  mobileMenu.classList.remove("open");
  menuBackdrop.classList.remove("show");
  mobileMenu.setAttribute("aria-hidden","true");
  $("menuButton").setAttribute("aria-expanded","false");
}

$("menuButton").onclick = openMenu;
$("closeMenu").onclick = closeMenu;
menuBackdrop.onclick = closeMenu;
document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", closeMenu));

$("checkoutButton").onclick = () => {
  if(!cart.length){
    showToast("Agrega productos primero ✦");
    return;
  }

  const lines = cart.map(i => `• ${i.qty} x ${i.name} — ${money(i.price * i.qty)}`).join("\n");
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const message = `Hola, Pan de Vida. Quiero hacer este pedido:\n\n${lines}\n\nTotal: ${money(total)}`;

  window.open(`https://wa.me/520000000000?text=${encodeURIComponent(message)}`, "_blank", "noopener");
};

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  $("installButton").style.display = "block";
});

$("installButton").onclick = async () => {
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  }else{
    showToast("En Safari usa Compartir → Añadir a pantalla de inicio.");
  }
};

/* ---------------- INTRO + AUDIO ---------------- */
const introScreen = $("introScreen");
const introAudio = $("introAudio");
const introLoaderFill = $("introLoaderFill");
const introCar = $("introCar");
const introProgress = $("introProgress");
const introStatus = $("introStatus");
const introHint = $("introHint");

let audioUnlocked = false;
let introFinished = false;
const INTRO_MS = 5000;

function tryStartAudio(){
  if(audioUnlocked || !introAudio) return;
  introAudio.volume = 0.9;
  const promise = introAudio.play();

  if(promise && typeof promise.then === "function"){
    promise.then(() => {
      audioUnlocked = true;
      introHint.classList.add("hidden");
      introStatus.textContent = "SONIDO ACTIVO · PAN DE VIDA";
    }).catch(() => {
      introStatus.textContent = "TOCA LA PANTALLA PARA ACTIVAR EL SONIDO";
      introHint.classList.remove("hidden");
    });
  }
}

function unlockAudioFromGesture(){
  if(audioUnlocked) return;
  introAudio.volume = 0.9;
  introAudio.play().then(() => {
    audioUnlocked = true;
    introHint.classList.add("hidden");
    introStatus.textContent = "SONIDO ACTIVO · PAN DE VIDA";
  }).catch(() => {});
}

["pointerdown","touchstart","click","keydown"].forEach(eventName => {
  window.addEventListener(eventName, unlockAudioFromGesture, {once:false, passive:true});
});

function finishIntro(){
  if(introFinished) return;
  introFinished = true;

  introProgress.textContent = "100%";
  introLoaderFill.style.width = "100%";
  introCar.style.left = "calc(100% - 22px)";
  introStatus.textContent = audioUnlocked ? "BIENVENIDO A PAN DE VIDA" : "BIENVENIDO";
  introScreen.classList.add("hide");

  setTimeout(() => {
    introScreen.remove();
    document.body.classList.add("intro-done");
  }, 850);
}

window.addEventListener("load", () => {
  tryStartAudio();

  const started = performance.now();
  const timer = setInterval(() => {
    const elapsed = performance.now() - started;
    const progress = Math.min(100, Math.round((elapsed / INTRO_MS) * 100));

    introProgress.textContent = `${progress}%`;
    introLoaderFill.style.width = `${progress}%`;
    introCar.style.left = `calc(${progress}% - ${Math.min(22, progress * 0.22)}px)`;

    if(progress < 30) introStatus.textContent = "PREPARANDO TU EXPERIENCIA";
    else if(progress < 65) introStatus.textContent = "CALENTANDO EL HORNO";
    else if(progress < 95) introStatus.textContent = "HORNEANDO ALGO ESPECIAL";
    else introStatus.textContent = audioUnlocked ? "CASI LISTO..." : "CASI LISTO · TOCA PARA SONIDO";

    if(elapsed >= INTRO_MS){
      clearInterval(timer);
      finishIntro();
    }
  }, 50);
});

/* ---------------- PWA / SERVICE WORKER ---------------- */
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(err => console.warn("SW:", err));
  });
}

$("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
