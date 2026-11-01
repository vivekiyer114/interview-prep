(function () {
  "use strict";

  var STORE_KEY = "khyaal-prep:v1";
  var CHECK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var tabs = window.CONCEPTS || [];
  var $ = function (id) { return document.getElementById(id); };

  function slug(text) {
    return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Number each concept within its tab and give it an id that survives reordering.
  tabs.forEach(function (tab) {
    var n = 0;
    tab.categories.forEach(function (cat) {
      cat.slug = slug(cat.name);
      cat.concepts = cat.items.map(function (item) {
        n += 1;
        return { id: tab.id + "/" + slug(item[0]), num: n, title: item[0], desc: item[1] };
      });
    });
    tab.total = n;
  });

  // Done state lives in localStorage; the page still works if storage is blocked.
  function loadDone() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return new Set(Array.isArray(saved) ? saved : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveDone() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(Array.from(done)));
    } catch (e) { /* storage unavailable: keep state for this visit only */ }
  }

  var done = loadDone();
  var state = { tab: tabs[0], category: null, query: "", filter: "all" };

  function readHash() {
    var parts = decodeURIComponent(location.hash.slice(1)).split("/");
    state.tab = tabs.find(function (t) { return t.id === parts[0]; }) || tabs[0];
    state.category = state.tab.categories.find(function (c) { return c.slug === parts[1]; }) || null;
  }

  function countDone(concepts) {
    return concepts.filter(function (c) { return done.has(c.id); }).length;
  }

  function allConcepts(tab) {
    return tab.categories.reduce(function (list, cat) { return list.concat(cat.concepts); }, []);
  }

  function matches(concept) {
    if (state.filter === "done" && !done.has(concept.id)) return false;
    if (state.filter === "todo" && done.has(concept.id)) return false;
    if (!state.query) return true;
    var q = state.query.toLowerCase();
    return concept.title.toLowerCase().indexOf(q) !== -1 || concept.desc.toLowerCase().indexOf(q) !== -1;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderTabs() {
    var nav = $("tabs");
    nav.textContent = "";
    tabs.forEach(function (tab) {
      var a = el("a", "", tab.label);
      a.href = "#" + tab.id;
      if (tab === state.tab) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
  }

  function sidebarLink(label, href, concepts, current) {
    var a = el("a");
    a.href = href;
    if (current) a.setAttribute("aria-current", "true");
    var finished = countDone(concepts);
    var count = el("span", "count" + (finished === concepts.length ? " complete" : ""), finished + "/" + concepts.length);
    a.appendChild(el("span", "", label));
    a.appendChild(count);
    return a;
  }

  function renderSidebar() {
    var nav = $("categories");
    var searching = Boolean(state.query);
    nav.textContent = "";
    nav.appendChild(sidebarLink("All concepts", "#" + state.tab.id, allConcepts(state.tab), !state.category || searching));
    state.tab.categories.forEach(function (cat) {
      nav.appendChild(sidebarLink(cat.name, "#" + state.tab.id + "/" + cat.slug, cat.concepts, cat === state.category && !searching));
    });
  }

  function renderHero() {
    var tab = state.tab;
    $("kicker").textContent = tab.total + " concepts · " + tab.categories.length + " categories";
    $("title").textContent = tab.title.replace("{n}", tab.total);
    $("intro").textContent = tab.intro;
    document.title = "Prep Desk · " + tab.label;
  }

  function renderProgress() {
    var tab = state.tab;
    var finished = countDone(allConcepts(tab));
    $("bar-fill").style.width = (tab.total ? (finished / tab.total) * 100 : 0) + "%";
    $("bar").setAttribute("aria-valuemax", tab.total);
    $("bar").setAttribute("aria-valuenow", finished);
    $("progress-text").textContent = finished + " / " + tab.total + " concepts done";
  }

  function card(concept) {
    var isDone = done.has(concept.id);
    var article = el("article", "card" + (isDone ? " is-done" : ""));
    var body = el("div");
    var button = el("button", "check");
    article.appendChild(el("span", "num", String(concept.num)));
    body.appendChild(el("h3", "", concept.title));
    body.appendChild(el("p", "", concept.desc));
    article.appendChild(body);
    button.type = "button";
    button.dataset.id = concept.id;
    button.setAttribute("aria-pressed", String(isDone));
    button.setAttribute("aria-label", "Mark " + concept.title + " as done");
    button.innerHTML = CHECK_SVG;
    article.appendChild(button);
    return article;
  }

  function renderSections() {
    var container = $("sections");
    var shown = 0;
    // A search looks across the whole tab, not just the selected category.
    var categories = state.category && !state.query ? [state.category] : state.tab.categories;
    container.textContent = "";
    categories.forEach(function (cat) {
      var visible = cat.concepts.filter(matches);
      if (!visible.length) return;
      shown += visible.length;
      var section = el("section", "category");
      var grid = el("div", "grid");
      section.id = cat.slug;
      section.appendChild(el("h2", "", cat.name));
      section.appendChild(el("p", "blurb", cat.blurb));
      visible.forEach(function (concept) { grid.appendChild(card(concept)); });
      section.appendChild(grid);
      container.appendChild(section);
    });
    var empty = $("empty");
    empty.hidden = shown > 0;
    empty.textContent = state.query ? "No concepts match that search." : "Nothing here yet.";
  }

  function renderFilters() {
    document.querySelectorAll(".filters button").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === state.filter));
    });
  }

  function render() {
    renderTabs();
    renderSidebar();
    renderHero();
    renderProgress();
    renderFilters();
    renderSections();
  }

  function toggle(button) {
    var id = button.dataset.id;
    if (done.has(id)) done.delete(id); else done.add(id);
    saveDone();
    if (state.filter !== "all") {
      renderSections();
    } else {
      var isDone = done.has(id);
      button.setAttribute("aria-pressed", String(isDone));
      button.closest(".card").classList.toggle("is-done", isDone);
    }
    renderSidebar();
    renderProgress();
  }

  $("sections").addEventListener("click", function (event) {
    var button = event.target.closest(".check");
    if (button) toggle(button);
  });

  $("search").addEventListener("input", function (event) {
    state.query = event.target.value.trim();
    renderSidebar();
    renderSections();
  });

  $("search").addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.target.value = "";
      state.query = "";
      renderSidebar();
      renderSections();
    }
  });

  document.querySelector(".filters").addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    state.filter = button.dataset.filter;
    renderFilters();
    renderSections();
  });

  $("reset").addEventListener("click", function () {
    if (!window.confirm("Clear every done mark on both tabs?")) return;
    done = new Set();
    saveDone();
    render();
  });

  document.addEventListener("keydown", function (event) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      $("search").focus();
    }
  });

  window.addEventListener("hashchange", function () {
    var previousTab = state.tab;
    readHash();
    if (state.tab !== previousTab) {
      state.query = "";
      $("search").value = "";
    }
    render();
    window.scrollTo({ top: 0 });
  });

  readHash();
  render();
})();
