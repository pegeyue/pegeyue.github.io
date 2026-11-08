"use strict";

const profile = window.portfolio;
const works = profile.works;
const $ = (selector) => document.querySelector(selector);
const player = $("#player");
const main = $("#main");
const sidebar = $(".sidebar");
const menuToggle = $("#menu-toggle");
const previews = new Map();
let currentWork = null;
const isLocal = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

$("#site-name").textContent = profile.name;
$("#local-tools").hidden = !isLocal;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderIndex() {
  const grid = $("#work-grid");
  const links = $("#work-links");
  grid.replaceChildren();
  links.replaceChildren();
  works.forEach((work, index) => {
    const href = "#work/" + work.id;
    const link = element("a", work.title + (work.year ? " (" + work.year + ")" : ""));
    link.href = href;
    links.append(link);
    const card = $("#card-template").content.cloneNode(true);
    card.querySelector("a").href = href;
    card.querySelector("h2").textContent = work.title;
    card.querySelector(".card-year").textContent = work.year || "年份待填写";
    card.querySelector(".cover-number").textContent = String(index + 1).padStart(2, "0");
    const cover = previews.get(work.id)?.cover || work.cover;
    if (cover) {
      const img = card.querySelector("img");
      img.hidden = false;
      img.addEventListener("error", () => { img.hidden = true; });
      img.src = cover;
    }
    grid.append(card);
  });
}

function renderProfile() {
  $("#about-copy").textContent = profile.about || "个人简介待补充。";
  if (profile.cvFile) {
    $("#cv-download").href = profile.cvFile;
    $("#cv-download").hidden = false;
  }
  profile.cv.forEach((section) => {
    const block = element("section", undefined, "cv-section");
    block.append(element("h2", section.heading));
    if (!section.entries.length) block.append(element("p", "待填写", "muted"));
    section.entries.forEach((entry) => {
      const row = element("div", undefined, "cv-row");
      const detail = element("div");
      detail.append(element("p", entry.title));
      if (entry.detail) detail.append(element("p", entry.detail, "muted preserve-lines"));
      row.append(element("span", entry.date, "muted"), detail);
      block.append(row);
    });
    $("#cv-sections").append(block);
  });
  $("#contact-intro").textContent = profile.contactIntro;
  const emailRow = element("div");
  const emailValue = element("dd");
  if (profile.email) {
    const link = element("a", profile.email);
    link.href = "mailto:" + profile.email;
    emailValue.append(link);
  } else {
    emailValue.textContent = "邮箱待填写";
  }
  emailRow.append(element("dt", "Email"), emailValue);
  $("#contact-list").append(emailRow);
  if (profile.wechat) {
    const row = element("div");
    row.append(element("dt", "WeChat / 微信"), element("dd", profile.wechat));
    $("#contact-list").append(row);
  }
}

function renderProject(work) {
  const preview = previews.get(work.id) || {};
  $("#project-title").textContent = work.title;
  $("#project-meta").textContent = [work.year || "年份待填写", work.duration].filter(Boolean).join(" · ");
  $("#project-description").textContent = work.description || "作品简介待补充。";
  $("#project-role").textContent = work.role || "待填写";
  $("#project-medium").textContent = work.medium || "待填写";
  const video = preview.video || work.video;
  const cover = preview.cover || work.cover;
  player.hidden = !video;
  $("#video-placeholder").hidden = Boolean(video);
  if (cover) player.poster = cover;
  if (video) player.src = video;
  $("#local-message").textContent = preview.filename ? "当前本机视频：" + preview.filename : "";
  const gallery = $("#project-gallery");
  gallery.replaceChildren();
  (work.images || []).forEach((item) => {
    const figure = element("figure");
    const img = element("img");
    img.src = item.src;
    img.alt = item.caption || work.title;
    img.loading = "lazy";
    figure.append(img);
    if (item.caption) figure.append(element("figcaption", item.caption));
    gallery.append(figure);
  });
  const index = works.indexOf(work);
  const previous = $("#previous-work");
  const next = $("#next-work");
  previous.hidden = index === 0;
  next.hidden = index === works.length - 1;
  if (index > 0) {
    previous.href = "#work/" + works[index - 1].id;
    previous.textContent = "← " + works[index - 1].title;
  }
  if (index < works.length - 1) {
    next.href = "#work/" + works[index + 1].id;
    next.textContent = works[index + 1].title + " →";
  }
}

function markNavigation() {
  document.querySelectorAll("#navigation a").forEach((link) => {
    if (link.hash === location.hash) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function renderRoute(focusContent = false) {
  // 切换页面时停止播放，并释放上一个视频的请求。
  player.pause();
  player.removeAttribute("src");
  player.removeAttribute("poster");
  player.load();
  $("#video-message").hidden = true;
  $("#local-tools").open = false;
  document.querySelectorAll("main > section, main > article").forEach((view) => { view.hidden = true; });
  const route = location.hash.slice(1) || "works";
  currentWork = works.find((work) => route === "work/" + work.id) || null;
  let viewName = "works";
  let pageTitle = "作品";
  if (currentWork) {
    viewName = "project";
    pageTitle = currentWork.title;
    renderProject(currentWork);
  } else if (["about", "cv", "contact"].includes(route)) {
    viewName = route;
    pageTitle = { about: "About", cv: "CV", contact: "Contact" }[route];
  }
  $("#" + viewName + "-view").hidden = false;
  document.title = pageTitle + " — " + profile.name;
  markNavigation();
  sidebar.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (focusContent) {
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

menuToggle.addEventListener("click", () => {
  const open = sidebar.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.querySelector("span").textContent = open ? "−" : "＋";
});

$("#local-video").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file || !currentWork) return;
  const preview = previews.get(currentWork.id) || {};
  if (preview.video) URL.revokeObjectURL(preview.video);
  preview.video = URL.createObjectURL(file);
  preview.filename = file.name;
  previews.set(currentWork.id, preview);
  $("#video-message").hidden = true;
  renderProject(currentWork);
  event.target.value = "";
});

$("#local-cover").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file || !currentWork) return;
  const preview = previews.get(currentWork.id) || {};
  if (preview.cover) URL.revokeObjectURL(preview.cover);
  preview.cover = URL.createObjectURL(file);
  previews.set(currentWork.id, preview);
  player.poster = preview.cover;
  renderIndex();
  markNavigation();
  event.target.value = "";
});

player.addEventListener("error", () => {
  if (!player.getAttribute("src")) return;
  $("#video-message").textContent = "视频暂时无法播放，请检查文件路径，或使用 H.264 编码的 MP4 文件。";
  $("#video-message").hidden = false;
});
window.addEventListener("hashchange", () => renderRoute(true));
renderIndex();
renderProfile();
renderRoute();
