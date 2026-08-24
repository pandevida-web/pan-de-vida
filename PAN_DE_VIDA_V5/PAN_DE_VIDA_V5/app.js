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
const $ = id => document.getElementById(id);
const grid = $("productGrid"), cartCount=$("cartCount"), cartItems=$("cartItems"), cartTotal=$("cartTotal"), cartEmpty=$("cartEmpty"), cartDrawer=$("cartDrawer"), cartBackdrop=$("cartBackdrop"), toast=$("toast");
function money(v){return `$${v.toFixed(2)}`;}
function renderProducts(){const visible=selectedCategory==="Todos"?products:products.filter(p=>p.category===selectedCategory);grid.innerHTML=visible.map(p=>`<article class="product"><div class="product-art"><span class="product-badge">${p.badge}</span><div class="shape"></div><span class="product-emoji">${p.emoji}</span></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">＋</button></div></div></article>`).join("");}
function renderCart(){const count=cart.reduce((s,i)=>s+i.qty,0),total=cart.reduce((s,i)=>s+i.price*i.qty,0);cartCount.textContent=count;cartTotal.textContent=money(total);cartEmpty.style.display=cart.length?"none":"block";cartItems.style.display=cart.length?"block":"none";cartItems.innerHTML=cart.map(i=>`<div class="cart-row"><div class="mini-art">${i.emoji}</div><div><h4>${i.name}</h4><p>${money(i.price)} c/u</p><div class="qty"><button data-minus="${i.id}">−</button><strong>${i.qty}</strong><button data-plus="${i.id}">＋</button></div><button class="remove" data-remove="${i.id}">Eliminar</button></div><span class="row-price">${money(i.price*i.qty)}</span></div>`).join("");localStorage.setItem("panDeVidaCart",JSON.stringify(cart));}
function addToCart(id){const p=products.find(x=>x.id===id),found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({...p,qty:1});renderCart();showToast(`${p.name} agregado ✦`);}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart();}
function showToast(t){toast.textContent=t;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),1800);}
function openCart(){cartDrawer.classList.add("open");cartBackdrop.classList.add("show");cartDrawer.setAttribute("aria-hidden","false");}
function closeCart(){cartDrawer.classList.remove("open");cartBackdrop.classList.remove("show");cartDrawer.setAttribute("aria-hidden","true");}
$("categoryBar").addEventListener("click",e=>{const b=e.target.closest(".category");if(!b)return;selectedCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
cartItems.addEventListener("click",e=>{const p=e.target.closest("[data-plus]"),m=e.target.closest("[data-minus]"),r=e.target.closest("[data-remove]");if(p)changeQty(Number(p.dataset.plus),1);if(m)changeQty(Number(m.dataset.minus),-1);if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));renderCart();}});
$("cartButton").onclick=openCart;$("closeCart").onclick=closeCart;cartBackdrop.onclick=closeCart;
const mobileMenu=$("mobileMenu"),menuBackdrop=$("menuBackdrop");function openMenu(){mobileMenu.classList.add("open");menuBackdrop.classList.add("show");mobileMenu.setAttribute("aria-hidden","false");$("menuButton").setAttribute("aria-expanded","true");}function closeMenu(){mobileMenu.classList.remove("open");menuBackdrop.classList.remove("show");mobileMenu.setAttribute("aria-hidden","true");$("menuButton").setAttribute("aria-expanded","false");}$("menuButton").onclick=openMenu;$("closeMenu").onclick=closeMenu;menuBackdrop.onclick=closeMenu;document.querySelectorAll(".mobile-menu a").forEach(a=>a.onclick=closeMenu);
$("checkoutButton").onclick=()=>{if(!cart.length){showToast("Agrega productos primero ✦");return;}const lines=cart.map(i=>`• ${i.qty} x ${i.name} — ${money(i.price*i.qty)}`).join("\n"),total=cart.reduce((s,i)=>s+i.price*i.qty,0),message=`Hola, Pan de Vida. Quiero hacer este pedido:\n\n${lines}\n\nTotal: ${money(total)}`;window.open(`https://wa.me/520000000000?text=${encodeURIComponent(message)}`,"_blank");};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installButton").style.display="block";});$("installButton").onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;}else showToast("En Chrome/Edge usa el icono de instalar en la barra del navegador.");};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(e=>console.warn("SW:",e)));

// ===== INTRO V4: automática, 5 segundos + MP3 =====
const introScreen=$("introScreen"), introAudio=$("introAudio"), introStatus=$("introStatus");
let introClosed=false, introTimer=null;
introAudio.volume=1.0;
introAudio.muted=false;

function playIntroAudio(){
  introAudio.muted=false;
  introAudio.currentTime=0;
  const promise=introAudio.play();
  if(promise && promise.catch){
    promise.catch(()=>{
      // Chrome/Edge pueden bloquear audio con sonido sin interacción del usuario.
      // La intro continúa normalmente sin mostrar botones.
      if(introStatus) introStatus.textContent="CARGANDO TU EXPERIENCIA";
    });
  }
}

function closeIntro(){
  if(introClosed)return;
  introClosed=true;
  clearTimeout(introTimer);
  introScreen.classList.add("intro-hide");
  setTimeout(()=>introScreen.remove(),850);
}

function startAutomaticIntro(){
  // Intento de reproducción automática al cargar la página.
  playIntroAudio();
  // Reintentos de carga: algunos navegadores resuelven el MP3 unos instantes después.
  setTimeout(()=>{ if(!introClosed && introAudio.paused) playIntroAudio(); },250);
  setTimeout(()=>{ if(!introClosed && introAudio.paused) playIntroAudio(); },900);
  // La intro permanece exactamente 5 segundos.
  introTimer=setTimeout(closeIntro,5000);
}

introAudio.addEventListener("canplay",()=>{
  if(!introClosed && introAudio.paused) playIntroAudio();
});
introAudio.addEventListener("error",()=>{
  if(introStatus) introStatus.textContent="CARGANDO TU EXPERIENCIA";
});
window.addEventListener("load",()=>{ if(!introClosed && introAudio.paused) playIntroAudio(); },{once:true});
startAutomaticIntro();

$("year").textContent=new Date().getFullYear();renderProducts();renderCart();
