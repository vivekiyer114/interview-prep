(function () {
  "use strict";

  var STORE_KEY = "khyaal-prep:v1";
  var CHECK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var TIER_LABELS = { core: "Core", google: "Google", stretch: "Stretch", awareness: "Awareness" };
  var DIFF_LABELS = { E: "Easy", M: "Medium", H: "Hard" };

  var tabs = window.CONCEPTS || [];
  var $ = function (id) { return document.getElementById(id); };

  function slug(text) {
    return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // LeetCode URL slugs drop punctuation rather than turning it into hyphens: "Pow(x, n)" -> "powx-n".
  function leetcodeSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9 -]/g, "").trim().replace(/[\s-]+/g, "-");
  }

  function problemId(problem) {
    return "problem/" + (problem.lc != null ? problem.lc : slug(problem.title));
  }

  // Number each concept within its tab and give it an id that survives reordering.
  // Optional third element of an item holds deep-dive details (patterns, tools, blocks).
  tabs.forEach(function (tab) {
    var n = 0;
    tab.byTitle = {};
    tab.problems = {};
    tab.problemOwners = {};
    tab.categories.forEach(function (cat) {
      cat.slug = slug(cat.name);
      cat.concepts = cat.items.map(function (item) {
        n += 1;
        var concept = {
          id: tab.id + "/" + slug(item[0]),
          domId: "card-" + tab.id + "-" + slug(item[0]),
          num: n,
          title: item[0],
          desc: item[1],
          details: item[2] || null,
          cat: cat,
          pids: [],
          usedBy: []
        };
        tab.byTitle[concept.title] = concept;
        if (concept.details && concept.details.problems) {
          concept.details.problems.forEach(function (problem) {
            var pid = tab.id + "/" + problemId(problem);
            problem.pid = pid;
            if (concept.pids.indexOf(pid) === -1) concept.pids.push(pid);
            tab.problems[pid] = problem;
            (tab.problemOwners[pid] = tab.problemOwners[pid] || []).push(concept);
          });
        }
        return concept;
      });
    });
    tab.total = n;
    tab.problemCount = Object.keys(tab.problems).length;

    // Resolve tool and block chips to their cards, and record back-links ("Used by").
    tab.categories.forEach(function (cat) {
      cat.concepts.forEach(function (concept) {
        var d = concept.details;
        if (!d) return;
        concept.links = [];
        ["tools", "blocks"].forEach(function (kind) {
          (d[kind] || []).forEach(function (title) {
            var target = tab.byTitle[title];
            if (!target) {
              if (window.console) console.warn("Prep Desk: no card titled \"" + title + "\" (from " + concept.title + ")");
              return;
            }
            concept.links.push({ kind: kind, concept: target });
            if (target.usedBy.indexOf(concept) === -1) target.usedBy.push(concept);
          });
        });
      });
    });
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
  var state = { tab: tabs[0], category: null, query: "", filter: "all", open: new Set() };
  var pendingScroll = null;

  function readHash() {
    var parts = decodeURIComponent(location.hash.slice(1)).split("/");
    state.tab = tabs.find(function (t) { return t.id === parts[0]; }) || tabs[0];
    state.category = state.tab.categories.find(function (c) { return c.slug === parts[1]; }) || null;
  }

  function countDone(concepts) {
    return concepts.filter(function (c) { return done.has(c.id); }).length;
  }

  function countSolved(pids) {
    return pids.filter(function (pid) { return done.has(pid); }).length;
  }

  function allConcepts(tab) {
    return tab.categories.reduce(function (list, cat) { return list.concat(cat.concepts); }, []);
  }

  function searchText(concept) {
    if (concept.searchText) return concept.searchText;
    var parts = [concept.title, concept.desc];
    var d = concept.details;
    if (d) {
      if (d.tier) parts.push(TIER_LABELS[d.tier] || d.tier);
      (d.problems || []).forEach(function (p) { parts.push((p.lc != null ? p.lc + " " : "") + p.title); });
    }
    concept.searchText = parts.join(" \n ").toLowerCase();
    return concept.searchText;
  }

  function matches(concept) {
    if (state.filter === "done" && !done.has(concept.id)) return false;
    if (state.filter === "todo" && done.has(concept.id)) return false;
    if (!state.query) return true;
    return searchText(concept).indexOf(state.query.toLowerCase()) !== -1;
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
    var layer = null;
    nav.textContent = "";
    nav.appendChild(sidebarLink("All concepts", "#" + state.tab.id, allConcepts(state.tab), !state.category || searching));
    state.tab.categories.forEach(function (cat) {
      if (cat.layer && cat.layer !== layer) {
        layer = cat.layer;
        nav.appendChild(el("p", "layer-heading", layer));
      }
      nav.appendChild(sidebarLink(cat.name, "#" + state.tab.id + "/" + cat.slug, cat.concepts, cat === state.category && !searching));
    });
  }

  function renderHero() {
    var tab = state.tab;
    var kicker = tab.total + " concepts · " + tab.categories.length + " categories";
    if (tab.problemCount) kicker += " · " + tab.problemCount + " problems";
    $("kicker").textContent = kicker;
    $("title").textContent = tab.title.replace("{n}", tab.total);
    $("intro").textContent = tab.intro;
    document.title = "Prep Desk · " + tab.label;
  }

  function renderProgress() {
    var tab = state.tab;
    var finished = countDone(allConcepts(tab));
    var text = $("progress-text");
    $("bar-fill").style.width = (tab.total ? (finished / tab.total) * 100 : 0) + "%";
    $("bar").setAttribute("aria-valuemax", tab.total);
    $("bar").setAttribute("aria-valuenow", finished);
    text.textContent = finished + " / " + tab.total + " concepts done";
    if (tab.problemCount) {
      text.appendChild(document.createElement("br"));
      text.appendChild(document.createTextNode(countSolved(Object.keys(tab.problems)) + " / " + tab.problemCount + " problems solved"));
    }
  }

  // ------------------------------------------------------------------ Deep dive

  function field(container, label, text) {
    if (!text) return;
    container.appendChild(el("h4", "", label));
    container.appendChild(el("p", "", text));
  }

  function chip(concept) {
    var a = el("a", "chip", concept.title);
    a.href = "#" + state.tab.id + "/" + concept.cat.slug;
    a.dataset.target = concept.domId;
    return a;
  }

  function chipRow(container, label, concepts) {
    if (!concepts.length) return;
    var row = el("div", "chips");
    container.appendChild(el("h4", "", label));
    concepts.forEach(function (c) { row.appendChild(chip(c)); });
    container.appendChild(row);
  }

  function problemRow(problem) {
    var solved = done.has(problem.pid);
    var li = el("li", "problem" + (solved ? " is-solved" : ""));
    var button = el("button", "pcheck");
    button.type = "button";
    button.dataset.pid = problem.pid;
    button.setAttribute("aria-pressed", String(solved));
    button.setAttribute("aria-label", "Mark " + problem.title + " as solved");
    button.innerHTML = CHECK_SVG;
    li.appendChild(button);
    li.appendChild(el("span", "lc mono", problem.lc != null ? String(problem.lc) : "—"));
    if (problem.lc != null) {
      var link = el("a", "ptitle", problem.title);
      link.href = "https://leetcode.com/problems/" + leetcodeSlug(problem.title) + "/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      li.appendChild(link);
    } else {
      li.appendChild(el("span", "ptitle", problem.title));
    }
    var meta = el("span", "pmeta");
    if (problem.diff) meta.appendChild(el("span", "diff diff-" + problem.diff, DIFF_LABELS[problem.diff] || problem.diff));
    (problem.flags || []).forEach(function (flag) {
      var badge = el("span", "flag flag-" + flag.toLowerCase(), flag);
      badge.title = flag === "G" ? "Reported in Google interviews" : flag === "B75" ? "Blind 75" : flag;
      meta.appendChild(badge);
    });
    li.appendChild(meta);
    return li;
  }

  function deepDive(concept) {
    var d = concept.details || {};
    var isPattern = Boolean(d.problems || d.template || d.recognize);
    if (!isPattern && !d.idea && !concept.usedBy.length) return null;

    var details = el("details", "dive");
    details.dataset.id = concept.id;
    if (state.open.has(concept.id)) details.open = true;
    details.appendChild(el("summary", "", isPattern ? "Deep dive" : "Details"));
    var body = el("div", "dive-body");

    field(body, "Recognize it", d.recognize);
    field(body, isPattern ? "Core idea" : "Key operations", d.idea);
    if (d.template) {
      body.appendChild(el("h4", "", "Template"));
      var pre = el("pre", "template");
      pre.appendChild(el("code", "", d.template.replace(/^\n+|\s+$/g, "")));
      body.appendChild(pre);
    }
    field(body, "Pitfalls", d.pitfalls);
    field(body, "Staff follow-up", d.staff);

    if (d.problems && d.problems.length) {
      body.appendChild(el("h4", "", "Problems"));
      var list = el("ul", "problems");
      d.problems.forEach(function (p) { list.appendChild(problemRow(p)); });
      body.appendChild(list);
    }

    var links = concept.links || [];
    chipRow(body, "Tools", links.filter(function (l) { return l.kind === "tools"; }).map(function (l) { return l.concept; }));
    chipRow(body, "Blocks", links.filter(function (l) { return l.kind === "blocks"; }).map(function (l) { return l.concept; }));
    chipRow(body, "Used by", concept.usedBy);

    details.appendChild(body);
    return details;
  }

  function problemSummaryText(concept) {
    return countSolved(concept.pids) + "/" + concept.pids.length + " problems";
  }

  function card(concept) {
    var isDone = done.has(concept.id);
    var d = concept.details;
    var article = el("article", "card" + (isDone ? " is-done" : ""));
    var body = el("div", "card-body");
    var button = el("button", "check");
    article.id = concept.domId;
    article.appendChild(el("span", "num", String(concept.num)));

    body.appendChild(el("h3", "", concept.title));
    if (d && (d.tier || concept.pids.length)) {
      var meta = el("div", "card-meta");
      if (d.tier) meta.appendChild(el("span", "tier tier-" + d.tier, TIER_LABELS[d.tier] || d.tier));
      if (concept.pids.length) {
        var count = el("span", "pcount mono", problemSummaryText(concept));
        count.dataset.countFor = concept.id;
        meta.appendChild(count);
      }
      body.appendChild(meta);
    }
    body.appendChild(el("p", "", concept.desc));
    article.appendChild(body);

    button.type = "button";
    button.dataset.id = concept.id;
    button.setAttribute("aria-pressed", String(isDone));
    button.setAttribute("aria-label", "Mark " + concept.title + " as done");
    button.innerHTML = CHECK_SVG;
    article.appendChild(button);

    var dive = deepDive(concept);
    if (dive) {
      article.appendChild(dive);
      if (dive.open) article.classList.add("is-open");
    }
    return article;
  }

  function renderSections() {
    var container = $("sections");
    var shown = 0;
    // A search looks across the whole tab, not just the selected category.
    var categories = state.category && !state.query ? [state.category] : state.tab.categories;
    var layer = null;
    container.textContent = "";
    categories.forEach(function (cat) {
      var visible = cat.concepts.filter(matches);
      if (!visible.length) return;
      shown += visible.length;
      if (cat.layer && cat.layer !== layer && categories.length > 1) {
        layer = cat.layer;
        container.appendChild(el("p", "layer-divider kicker mono", layer));
      }
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

  // A problem can sit under several patterns; update every copy of it on the page.
  function toggleProblem(button) {
    var pid = button.dataset.pid;
    if (done.has(pid)) done.delete(pid); else done.add(pid);
    saveDone();
    var solved = done.has(pid);
    document.querySelectorAll('.pcheck[data-pid="' + pid + '"]').forEach(function (b) {
      b.setAttribute("aria-pressed", String(solved));
      b.closest(".problem").classList.toggle("is-solved", solved);
    });
    (state.tab.problemOwners[pid] || []).forEach(function (concept) {
      var count = document.querySelector('[data-count-for="' + concept.id + '"]');
      if (count) count.textContent = problemSummaryText(concept);
    });
    renderProgress();
  }

  function scrollToCard(domId) {
    var target = $(domId);
    if (!target) return false;
    target.scrollIntoView({ block: "start" });
    target.classList.remove("flash");
    void target.offsetWidth; // restart the highlight animation
    target.classList.add("flash");
    return true;
  }

  function followChip(link) {
    var target = link.dataset.target;
    var hash = link.getAttribute("href");
    state.query = "";
    $("search").value = "";
    state.filter = "all";
    if (location.hash === hash) {
      render();
      scrollToCard(target);
    } else {
      pendingScroll = target;
      location.hash = hash;
    }
  }

  $("sections").addEventListener("click", function (event) {
    var button = event.target.closest(".check");
    if (button) { toggle(button); return; }
    var pcheck = event.target.closest(".pcheck");
    if (pcheck) { toggleProblem(pcheck); return; }
    var link = event.target.closest(".chip");
    if (link) {
      event.preventDefault();
      followChip(link);
    }
  });

  // Remember which deep dives are open so they survive re-renders; open ones span the full row.
  $("sections").addEventListener("toggle", function (event) {
    var details = event.target;
    if (!details.classList || !details.classList.contains("dive")) return;
    if (details.open) state.open.add(details.dataset.id); else state.open.delete(details.dataset.id);
    details.closest(".card").classList.toggle("is-open", details.open);
  }, true);

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
    if (!window.confirm("Clear every done mark on all tabs?")) return;
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
    if (!(pendingScroll && scrollToCard(pendingScroll))) window.scrollTo({ top: 0 });
    pendingScroll = null;
  });

  readHash();
  render();
})();
