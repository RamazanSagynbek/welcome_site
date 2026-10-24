(function(){
"use strict";

/* ====== Cafe info: edit here ====== */
var INFO = {
  menu: "https://rinatdidar800-dot.github.io/chailat-menu/",
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
