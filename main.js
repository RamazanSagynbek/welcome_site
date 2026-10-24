(function(){
"use strict";

/* ====== Cafe info: edit here ====== */
var INFO = {
  menu: "https://chailat-menu.github.io/site/",
  hours: "08:00–02:00",
  phone: "+7 (700) 635-67-41",
  instagram: "https://www.instagram.com/chailat.kz/",
  whatsapp: "https://wa.me/77006356741",
  map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("CHAILAT kitchen & lounge, проспект Жамбыла 162")
};

var L = window.CHAILAT_I18N;
var LANGS = ["kk","ru","en"], LABEL = {kk:"KZ",ru:"RU",en:"EN"};
var lang = "kk"; /* Kazakh by default, like the menu */

function load(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function save(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
function $$(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }

var saved = load("chailat_site_lang");
if(LANGS.indexOf(saved) > -1) lang = saved;
var ql = (location.search.match(/[?&]lang=(kk|ru|en)/)||[])[1];
if(ql) lang = ql;

/* ---------- static links ---------- */
function setLinks(sel, href){ $$(sel).forEach(function(a){ a.href = href; }); }
setLinks(".js-map", INFO.map);
setLinks(".js-ig", INFO.instagram);
setLinks(".js-wa", INFO.whatsapp);
setLinks(".js-tel", "tel:" + INFO.phone.replace(/[^+\d]/g,""));
$$(".js-tel").forEach(function(a){ a.textContent = INFO.phone; });
$$(".js-hours").forEach(function(b){ b.textContent = INFO.hours; });
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- language ---------- */
var langBox = document.getElementById("lang"), langBtn = document.getElementById("langBtn");
function render(){
  var t = L[lang];
  $$("[data-i18n]").forEach(function(el){
    var v = t[el.getAttribute("data-i18n")];
    if(v != null) el.textContent = v;
  });
  /* the menu opens in the same language */
  setLinks(".js-menu", INFO.menu + "?lang=" + lang);
  document.documentElement.lang = lang;
  document.getElementById("langCur").textContent = LABEL[lang];
  $$("#langMenu button").forEach(function(b){ b.setAttribute("aria-selected", b.dataset.lang === lang); });
}
function toggleLang(open){
  langBox.classList.toggle("open", open);
  langBtn.setAttribute("aria-expanded", open);
}
langBtn.addEventListener("click", function(e){ e.stopPropagation(); toggleLang(!langBox.classList.contains("open")); });
document.getElementById("langMenu").addEventListener("click", function(e){
  var b = e.target.closest("button[data-lang]");
  if(!b) return;
  lang = b.dataset.lang; save("chailat_site_lang", lang); render(); toggleLang(false);
});
document.addEventListener("click", function(){ toggleLang(false); });
render();

/* ---------- header ---------- */
var head = document.getElementById("head"), burger = document.getElementById("burger");
function onScroll(){ head.classList.toggle("solid", window.scrollY > 40); }
window.addEventListener("scroll", onScroll, {passive:true});
onScroll();
function toggleNav(open){
  head.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
}
burger.addEventListener("click", function(){ toggleNav(!head.classList.contains("open")); });
$$("#nav a").forEach(function(a){ a.addEventListener("click", function(){ toggleNav(false); }); });
document.addEventListener("keydown", function(e){ if(e.key === "Escape"){ toggleNav(false); toggleLang(false); } });

/* ---------- logo: letters fly in from every side ---------- */
var logo = document.getElementById("logo");
var still = !window.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches;
var chars = [];
if(logo && logo.animate){
  logo.innerHTML = logo.textContent.split("").map(function(c){ return '<span class="ch" aria-hidden="true">'+c+'</span>'; }).join("");
  logo.classList.add("letters");
  chars = Array.prototype.slice.call(logo.children);
}
function rnd(a, b){ return a + Math.random() * (b - a); }

/* a point just outside the screen edge, taken in turn: top, right, bottom, left */
function offscreen(el, i){
  var r = el.getBoundingClientRect(), W = innerWidth, H = innerHeight, x, y;
  switch(i % 4){
    case 0: x = rnd(0, W); y = -rnd(80, 220); break;
    case 1: x = W + rnd(80, 220); y = rnd(0, H); break;
    case 2: x = rnd(0, W); y = H + rnd(80, 220); break;
    default: x = -rnd(80, 220); y = rnd(0, H);
  }
  return {x: x - (r.left + r.width / 2), y: y - (r.top + r.height / 2)};
}
function flyIn(){
  /* random order so neighbouring letters come from different sides */
  var order = chars.map(function(_, i){ return i; }).sort(function(){ return Math.random() - .5; });
  var last = 0;
  chars.forEach(function(el, i){
    var p = offscreen(el, order[i]), delay = 150 + i * 110, dur = 1300;
    last = Math.max(last, delay + dur);
    el.animate([
      {transform:"translate("+p.x+"px,"+p.y+"px) rotate("+rnd(-540, 540)+"deg) scale("+rnd(.3, 2.4)+")", opacity:0, filter:"blur(8px)"},
      {opacity:1, filter:"blur(0)", offset:.55},
      {transform:"none", opacity:1, filter:"blur(0)"}
    ], {duration:dur, delay:delay, easing:"cubic-bezier(.16,1,.3,1)", fill:"backwards"})
      .finished.then(function(){ glow(el); });
  });
  setTimeout(function(){ document.documentElement.classList.remove("intro"); }, last - 500);
}
function glow(el){
  el.classList.remove("glow"); void el.offsetWidth; el.classList.add("glow");
}

/* click / tap: letters burst apart and snap back */
var busy = false;
function scatter(){
  if(busy) return;
  busy = true;
  chars.forEach(function(el, i){
    var a = rnd(0, Math.PI * 2), d = rnd(120, Math.min(innerWidth, 700) * .6);
    el.animate([
      {transform:"none"},
      {transform:"translate("+Math.cos(a) * d+"px,"+Math.sin(a) * d+"px) rotate("+rnd(-360, 360)+"deg) scale("+rnd(.5, 1.8)+")", offset:.35},
      {transform:"none"}
    ], {duration:1400, delay:i * 30, easing:"cubic-bezier(.3,.7,.2,1)"})
      .finished.then(function(){ glow(el); if(i === chars.length - 1) busy = false; });
  });
}

/* mouse: letters dodge the cursor (desktop only) */
function dodge(e){
  chars.forEach(function(el){
    var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dx = cx - e.clientX, dy = cy - e.clientY, d = Math.sqrt(dx * dx + dy * dy), R = 170;
    if(d < R){
      var f = (1 - d / R) * 38 / (d || 1);
      el.style.translate = (dx * f).toFixed(1) + "px " + (dy * f).toFixed(1) + "px";
    } else el.style.translate = "";
  });
}

if(chars.length){
  if(still) document.documentElement.classList.remove("intro");
  else flyIn();
  logo.addEventListener("click", function(){ if(!still) scatter(); });
  if(!still && matchMedia("(hover: hover) and (pointer: fine)").matches){
    var hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", dodge);
    hero.addEventListener("pointerleave", function(){ chars.forEach(function(el){ el.style.translate = ""; }); });
  }
}

/* ---------- reveal on scroll ---------- */
var items = $$(".reveal");
if("IntersectionObserver" in window){
  document.documentElement.classList.add("js");
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, {rootMargin:"0px 0px -8% 0px"});
  items.forEach(function(el){ io.observe(el); });
}

/* ---------- gallery lightbox ---------- */
var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lbImg");
if(lb.showModal){
  document.getElementById("gallery-grid").addEventListener("click", function(e){
    var b = e.target.closest("button");
    if(!b) return;
    lbImg.src = b.querySelector("img").src;
    lb.showModal();
  });
  document.getElementById("lbClose").addEventListener("click", function(){ lb.close(); });
  lb.addEventListener("click", function(e){ if(e.target === lb) lb.close(); });
}
})();
