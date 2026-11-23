/* B01 console and vessel pages — Arabic / English switch.

   Arabic is the pages' own text. Each page loads a table of English text,
   keyed by the Arabic (window.B01_EN = { "نص": "text", ... }) plus optional
   patterns for text that contains numbers (window.B01_EN_RE = [[/regex/, fn]]).
   This script:
     - adds the language button to the page's top bar (.lang-slot),
     - swaps every text node and the alt / aria-label / title / placeholder
       attributes, and puts the Arabic back on the way back,
     - keeps translating text the page writes later (live panels), and
     - switches the page direction, remembers the choice on this device and
       fires "sitelang" so a page can redraw canvases.
   Same behaviour as the booth simulator and the project site. */
(function () {
  "use strict";

  var STORE = "b01gcs.lang";
  var EN = window.B01_EN || {};
  var RE = window.B01_EN_RE || [];
  var ATTRS = ["alt", "aria-label", "title", "placeholder"];
  var root = document.documentElement;
  var lang = "ar";
  var orig = new WeakMap();      // text node -> its Arabic text
  var origAttr = new WeakMap();  // element -> { attr: Arabic value }
  var written = new WeakMap();   // text node -> the English this script wrote
  var writing = false;

  function english(s) {
    var key = s.replace(/\s+/g, " ").trim();
    if (!key || !/[؀-ۿ]/.test(key)) return null;
    if (EN[key] != null) return s.replace(key.length === s.length ? s : s.trim(), EN[key]);
    for (var i = 0; i < RE.length; i++) {
      var m = key.match(RE[i][0]);
      if (m) return s.replace(s.trim(), RE[i][1].apply(null, m));
    }
    return null;
  }

  function skip(node) {
    var p = node.parentNode;
    return !p || p.nodeName === "SCRIPT" || p.nodeName === "STYLE" || (p.closest && p.closest("[data-noi18n]"));
  }

  function doText(node) {
    if (skip(node)) return;
    if (lang === "en") {
      var en = english(node.nodeValue);
      if (en != null && en !== node.nodeValue) { orig.set(node, node.nodeValue); node.nodeValue = en; written.set(node, en); }
    } else if (orig.has(node)) {
      node.nodeValue = orig.get(node);
      orig.delete(node);
    }
  }

  function doAttrs(el) {
    if (!el.getAttribute || (el.closest && el.closest("[data-noi18n]"))) return;
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (v == null) return;
      var saved = origAttr.get(el) || {};
      if (lang === "en") {
        var en = english(v);
        if (en != null && en !== v) { saved[a] = v; origAttr.set(el, saved); el.setAttribute(a, en); }
      } else if (saved[a] != null) {
        el.setAttribute(a, saved[a]);
        delete saved[a];
      }
    });
  }

  function walk(rootNode) {
    if (rootNode.nodeType === 3) { doText(rootNode); return; }
    if (rootNode.nodeType !== 1) return;
    doAttrs(rootNode);
    var w = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }

  var observer = new MutationObserver(function (list) {
    if (writing || lang !== "en") return;
    writing = true;
    list.forEach(function (m) {
      if (m.type === "characterData") { if (written.get(m.target) !== m.target.nodeValue) { orig.delete(m.target); doText(m.target); } }
      else if (m.type === "attributes") doAttrs(m.target);
      else m.addedNodes.forEach(walk);
    });
    observer.takeRecords();
    writing = false;
  });

  var button = document.createElement("button");
  button.type = "button";
  button.className = "lang-btn";
  button.setAttribute("data-noi18n", "");

  function apply(next) {
    lang = next === "en" ? "en" : "ar";
    writing = true;
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";
    walk(document.body);
    if (document.title && EN["doc.title"]) {
      if (!root.hasAttribute("data-title-ar")) root.setAttribute("data-title-ar", document.title);
      document.title = lang === "en" ? EN["doc.title"] : root.getAttribute("data-title-ar");
    }
    button.textContent = lang === "en" ? "العربية" : "English";
    button.setAttribute("lang", lang === "en" ? "ar" : "en");
    observer.takeRecords();
    writing = false;
    try { document.dispatchEvent(new CustomEvent("sitelang", { detail: { lang: lang } })); } catch (e) { /* old browser */ }
  }

  window.PageLang = { get: function () { return lang; }, t: function (s) { return lang === "en" ? (english(s) || s) : s; } };

  var slot = document.querySelector(".lang-slot");
  if (slot) slot.appendChild(button);
  button.addEventListener("click", function () {
    apply(lang === "en" ? "ar" : "en");
    try { localStorage.setItem(STORE, lang); } catch (e) { /* private mode */ }
  });

  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  var saved = "ar";
  try { saved = localStorage.getItem(STORE) === "en" ? "en" : "ar"; } catch (e) { /* ignore */ }
  if (saved === "en") apply("en"); else apply("ar");
})();
