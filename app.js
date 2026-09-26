/* ==========================================================================
   SkillNest — shared behaviour
   Demo-only front end: the "account" lives in localStorage, so it is not a
   real authentication system. Swap store.signUp / store.logIn for API calls
   when you add a backend, and never keep a password in the browser.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "skillnest:user";

  /* ---- Course catalog (shared by Explore and Dashboard) ---- */
  var CATALOG = [
    { id: "uiux",    title: "UI/UX Design Fundamentals", blurb: "Build intuitive digital experiences from the ground up.", icon: "✦",   tone: "purple", hours: 6.3,  lessons: 12, level: "Beginner",     category: "design" },
    { id: "js",      title: "Modern JavaScript",         blurb: "Master the language that powers the web today.",         icon: "</>", tone: "blue",   hours: 8.75, lessons: 18, level: "Intermediate", category: "development" },
    { id: "html",    title: "HTML & CSS in Practice",    blurb: "Lay out real pages that hold up on any screen size.",    icon: "▤",   tone: "green",  hours: 5.5,  lessons: 14, level: "Beginner",     category: "development" },
    { id: "pm",      title: "Project Management Essentials", blurb: "Plan work, set scope, and ship without the chaos.",  tone: "orange", icon: "◒",   hours: 4.8,  lessons: 10, level: "Intermediate", category: "business" },
    { id: "market",  title: "Marketing That Works",      blurb: "Practical ways to grow a brand people remember.",        icon: "↗",   tone: "yellow", hours: 4.2,  lessons: 9,  level: "Beginner",     category: "marketing" },
    { id: "habits",  title: "Build Better Habits",       blurb: "A simple, science-backed system for lasting change.",     icon: "◎",   tone: "green",  hours: 3.1,  lessons: 7,  level: "All levels",   category: "growth" },
    { id: "content", title: "Content Creation",          blurb: "Turn your ideas into content people want to see.",       icon: "▣",   tone: "pink",   hours: 5.5,  lessons: 11, level: "Beginner",     category: "marketing" },
    { id: "data",    title: "Data Storytelling",         blurb: "Make complex information clear and memorable.",          icon: "◔",   tone: "blue",   hours: 6.0,  lessons: 13, level: "Intermediate", category: "business" },
    { id: "brand",   title: "Brand Identity Basics",     blurb: "Give a product a look that stays recognisable.",         icon: "◆",   tone: "purple", hours: 3.9,  lessons: 8,  level: "Beginner",     category: "design" }
  ];

  /* ---- Storage ---- */
  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function write(user) {
    try {
      localStorage.setItem(KEY, JSON.stringify(user));
    } catch (e) {
      /* private mode / storage full — the page still works, it just won't persist */
    }
    return user;
  }

  var store = {
    get: read,
    save: write,

    signUp: function (username, email, password) {
      var parts = username.trim().split(/\s+/);
      return write({
        firstName: parts[0] || username.trim(),
        lastName: parts.slice(1).join(" "),
        email: email.trim().toLowerCase(),
        password: password,
        loggedIn: true,
        bio: "Always learning, always growing.",
        photo: "",
        joined: new Date().toISOString(),
        darkMode: document.documentElement.classList.contains("dark"),
        emails: true,
        streak: 1,
        enrolled: [],
        activity: [{ text: "Joined SkillNest", when: "Just now", tone: "" }]
      });
    },

    logIn: function (identifier, password) {
      var user = read();
      if (!user) return "no-account";
      var id = identifier.trim().toLowerCase();
      var matches = id === user.email || id === (user.firstName + " " + user.lastName).trim().toLowerCase() || id === user.firstName.toLowerCase();
      if (!matches || user.password !== password) return "bad-credentials";
      user.loggedIn = true;
      write(user);
      return "ok";
    },

    logOut: function () {
      var user = read();
      if (user) { user.loggedIn = false; write(user); }
      location.href = "login.html";
    },

    fullName: function (user) {
      return ((user.firstName || "") + " " + (user.lastName || "")).trim() || "Your name";
    },

    initials: function (user) {
      return store.fullName(user).split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase() || "SN";
    },

    course: function (id) {
      for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i];
      return null;
    },

    logActivity: function (user, text, tone) {
      user.activity = user.activity || [];
      user.activity.unshift({ text: text, when: "Just now", tone: tone || "" });
      user.activity = user.activity.slice(0, 6);
    }
  };

  /* ---- Theme (applied before paint to avoid a flash) ---- */
  var saved = read();
  if (saved && saved.darkMode) document.documentElement.classList.add("dark");

  /* ---- Shell: route guard, mobile nav, user chrome ---- */
  function boot() {
    var body = document.body;
    var user = read();

    if (body.dataset.auth === "required" && (!user || !user.loggedIn)) {
      location.replace("login.html");
      return;
    }
    if (body.dataset.auth === "guest" && user && user.loggedIn) {
      location.replace("dashboard.html");
      return;
    }

    // Mobile navigation
    var menu = document.getElementById("menuBtn");
    var scrim = document.getElementById("scrim");
    function closeNav() {
      body.classList.remove("nav-open");
      if (menu) menu.setAttribute("aria-expanded", "false");
    }
    if (menu) {
      menu.addEventListener("click", function () {
        var open = body.classList.toggle("nav-open");
        menu.setAttribute("aria-expanded", String(open));
      });
    }
    if (scrim) scrim.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) closeNav(); });

    // Fill name / initials / avatar everywhere they appear
    if (user) {
      document.querySelectorAll("[data-user]").forEach(function (el) {
        var what = el.dataset.user;
        if (what === "name") el.textContent = store.fullName(user);
        else if (what === "first") el.textContent = user.firstName || "there";
        else if (what === "email") el.textContent = user.email || "";
        else if (what === "initials") {
          if (user.photo) el.innerHTML = '<img src="' + user.photo + '" alt="">';
          else el.textContent = store.initials(user);
        }
      });
    }

    var out = document.getElementById("logout");
    if (out) out.addEventListener("click", store.logOut);

    if (typeof window.pageInit === "function") window.pageInit(user, store, CATALOG);
  }

  /* ---- Small helpers used by pages ---- */
  window.toast = function (message) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("show"); }, 1800);
  };

  window.SkillNest = { store: store, catalog: CATALOG };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
