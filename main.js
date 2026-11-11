"use strict";

const profile = window.portfolio;
const works = profile.works;
const $ = (selector) => document.querySelector(selector);
const player = $("#player");
const videoFrame = player.closest(".video-frame");
const posterPlay = $("#poster-play");
const defaultPoster = player.getAttribute("poster");
const main = $("#main");
const worksView = $("#works-view");
const workGrid = $("#work-grid");
const sidebar = $(".sidebar");
const menuToggle = $("#menu-toggle");
const previews = new Map();
const desktopCoverDrag = window.matchMedia("(width > 700px) and (hover: hover) and (pointer: fine)");
const coverPositions = new Map();
let activeCoverDrag = null;
let blockedCoverClick = null;
let pendingCoverTap = null;
let coverLayer = 0;
let currentWork = null;
let renderedHash;
const isLocal = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

$("#local-tools").hidden = !isLocal || new URLSearchParams(location.search).get("preview") !== "1";

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function workName(work) {
  return work.titleEn ? work.title + " " + work.titleEn : work.title;
}

function renderIndex() {
  const links = $("#work-links");
  resetCoverPositions();
  clearCoverTap();
  workGrid.replaceChildren();
  links.replaceChildren();
  works.forEach((work, index) => {
    const href = "#work/" + work.id;
    const link = element("a", workName(work));
    link.href = href;
    links.append(link);
    const card = $("#card-template").content.cloneNode(true);
    const coverFrame = card.querySelector(".cover");
    const updateCoverPreview = () => {
      coverFrame.classList.toggle("directory-preview", link.matches(":hover, :focus-visible"));
    };
    for (const eventName of ["pointerenter", "pointerleave", "focus", "blur"]) {
      link.addEventListener(eventName, updateCoverPreview);
    }
    card.querySelector("a").href = href;
    card.querySelector(".card-title-zh").textContent = work.title;
    const titleEn = card.querySelector(".card-title-en");
    titleEn.textContent = work.titleEn || "";
    titleEn.hidden = !work.titleEn;
    card.querySelector(".card-year").textContent = work.year || "年份待填写";
    card.querySelector(".cover-number").textContent = String(index + 1).padStart(2, "0");
    const cover = previews.get(work.id)?.cover || work.cover;
    if (cover) {
      const img = card.querySelector("img");
      img.hidden = false;
      img.addEventListener("error", () => { img.hidden = true; });
      img.src = cover;
    }
    workGrid.append(card);
  });
}

function fitHomeGrid() {
  if (worksView.hidden || !workGrid.childElementCount) return;
  workGrid.classList.remove("compact-cards");
  workGrid.style.removeProperty("--work-fit-width");
  const gridStyle = getComputedStyle(workGrid);
  if (gridStyle.getPropertyValue("--stack-unit")) return;
  const columns = Number.parseInt(gridStyle.getPropertyValue("--work-columns"), 10);
  const rows = Math.ceil(workGrid.childElementCount / columns);
  const gap = Number.parseFloat(gridStyle.columnGap);
  const layoutStyle = getComputedStyle(workGrid.closest(".site-layout"));
  const top = workGrid.getBoundingClientRect().top + window.scrollY;
  const available = Math.floor(document.documentElement.clientHeight - top - Number.parseFloat(layoutStyle.paddingBottom));
  const maxWidth = Number.parseFloat(gridStyle.getPropertyValue("--work-max-width"));
  let width = Math.min(maxWidth, Math.floor(workGrid.getBoundingClientRect().width));
  const minimum = Math.min(width, columns * 56 + (columns - 1) * gap);

  // Recheck the height after shrinking because the bilingual captions can wrap.
  for (let attempt = 0; attempt < 6 && width > minimum; attempt += 1) {
    const overflow = workGrid.getBoundingClientRect().height - available;
    if (overflow <= 0) break;
    width = Math.max(minimum, width - Math.ceil(overflow * columns / rows));
    workGrid.style.setProperty("--work-fit-width", `${width}px`);
  }
  if (workGrid.getBoundingClientRect().height > available) {
    workGrid.style.removeProperty("--work-fit-width");
    workGrid.classList.add("compact-cards");
  }
}

function renderProfile() {
  $("#about-name").textContent = profile.name;
  $("#about-copy").textContent = profile.about || "个人简介待补充。";
  if (profile.portfolioPdf) {
    const pdfLink = element("a", "作品集文件（PDF）");
    pdfLink.href = profile.portfolioPdf;
    pdfLink.target = "_blank";
    pdfLink.rel = "noopener";
    const pdfEntry = $("#about-pdf");
    pdfEntry.classList.remove("muted");
    pdfEntry.replaceChildren(pdfLink);
  }

  for (const field of ["email", "phone"]) {
    const entry = $("#contact-" + field);
    entry.textContent = profile[field] || "";
    entry.hidden = !entry.textContent;
  }
  if (profile.wechat) {
    const row = element("div");
    row.append(element("dt", "WeChat / 微信"), element("dd", profile.wechat));
    const contactList = $("#contact-list");
    contactList.append(row);
    contactList.hidden = false;
  }
}

function renderProject(work) {
  const preview = previews.get(work.id) || {};
  $("#project-title-zh").textContent = work.title;
  const titleEn = $("#project-title-en");
  titleEn.textContent = work.titleEn || "";
  titleEn.hidden = !work.titleEn;
  $("#project-year").textContent = work.year || "年份待填写";
  $("#project-description").textContent = work.description || "作品简介待补充。";
  $("#project-role").textContent = work.role || "待填写";
  $("#project-medium").textContent = work.medium || "待填写";
  const video = preview.video || work.video;
  videoFrame.style.aspectRatio = preview.video ? "" : work.videoAspect || "";
  const showPosterPlay = Boolean(video);
  player.hidden = !video;
  player.controls = !showPosterPlay;
  posterPlay.hidden = !showPosterPlay;
  $("#video-placeholder").hidden = Boolean(video);
  player.poster = work.poster || defaultPoster;
  if (video) player.src = video;
  $("#local-message").textContent = preview.filename ? "当前本机视频：" + preview.filename : "";
  const gallery = $("#project-gallery");
  gallery.replaceChildren();
  (work.images || []).forEach((item) => {
    const figure = element("figure");
    const img = element("img");
    img.src = item.src;
    img.alt = item.caption || workName(work);
    img.loading = "lazy";
    figure.append(img);
    if (item.caption) figure.append(element("figcaption", item.caption));
    gallery.append(figure);
  });
}

function markNavigation() {
  document.querySelectorAll("#navigation a").forEach((link) => {
    if (link.hash === location.hash) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function renderRoute(focusContent = false) {
  const hash = location.hash;
  if (hash === renderedHash) return;
  renderedHash = hash;
  clearCoverTap();

  // 切换页面时停止播放，并释放上一个视频的请求。
  player.pause();
  player.removeAttribute("src");
  player.load();
  $("#video-message").hidden = true;
  $("#local-tools").open = false;
  document.querySelectorAll("main > section, main > article").forEach((view) => { view.hidden = true; });
  const route = hash.slice(1) || "works";
  currentWork = works.find((work) => route === "work/" + work.id) || null;
  const background = currentWork?.background;
  if (background) {
    document.body.dataset.projectBackground = background.tone;
  } else {
    delete document.body.dataset.projectBackground;
  }
  if (background?.src) {
    const source = new URL(background.src, document.baseURI).href;
    document.body.style.setProperty("--project-background", `url(${JSON.stringify(source)})`);
  } else {
    document.body.style.removeProperty("--project-background");
  }
  let viewName = "works";
  let pageTitle = "作品";
  if (currentWork) {
    viewName = "project";
    pageTitle = workName(currentWork);
    renderProject(currentWork);
  } else if (["about", "contact"].includes(route)) {
    viewName = route;
    pageTitle = $("#" + route + "-view").getAttribute("aria-label");
  }
  $("#" + viewName + "-view").hidden = false;
  $("#back-link").hidden = viewName === "works";
  document.title = pageTitle + " — " + profile.name;
  markNavigation();
  sidebar.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector("span").textContent = "＋";
  if (focusContent) {
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  if (viewName === "works") fitHomeGrid();
}

function transitionRoute() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderRoute(true);
  } else if (document.startViewTransition) {
    const transition = document.startViewTransition(() => renderRoute(true));
    // Rapid navigation can supersede a pending transition.
    transition.ready.catch(() => {});
  } else {
    renderRoute(true);
    main.animate?.([{ opacity: 0.82 }, { opacity: 1 }], { duration: 220, easing: "ease-out" });
  }
}

function stopCoverDrag() {
  const drag = activeCoverDrag;
  if (!drag) return;
  activeCoverDrag = null;
  drag.card.classList.remove("is-dragging");
  if (drag.handle.hasPointerCapture(drag.pointerId)) {
    drag.handle.releasePointerCapture(drag.pointerId);
  }
}

function resetCoverPositions() {
  if (activeCoverDrag?.moved) blockedCoverClick = activeCoverDrag.card;
  stopCoverDrag();
  for (const card of coverPositions.keys()) {
    card.style.removeProperty("--drag-x");
    card.style.removeProperty("--drag-y");
    card.style.removeProperty("--cover-layer");
  }
  coverPositions.clear();
  coverLayer = 0;
  workGrid.style.removeProperty("--top-cover-layer");
}

workGrid.addEventListener("pointerdown", (event) => {
  if (activeCoverDrag || !event.isPrimary) return;
  blockedCoverClick = null;
  if (!desktopCoverDrag.matches || event.pointerType === "touch" || event.button !== 0) return;
  const handle = event.target.closest(".cover");
  if (!handle) return;

  const card = handle.closest(".work-card");
  const bounds = card.getBoundingClientRect();
  const viewport = document.documentElement;
  const gutter = Number.parseFloat(getComputedStyle(workGrid.closest(".site-layout")).getPropertyValue("--page-gutter"));
  activeCoverDrag = {
    handle,
    card,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    bounds,
    gutter,
    maxLeft: Math.max(gutter, viewport.clientWidth - gutter - bounds.width),
    maxTop: Math.max(gutter, viewport.clientHeight - gutter - bounds.height),
    offset: coverPositions.get(card) || { x: 0, y: 0 },
    moved: false,
  };
  handle.setPointerCapture(event.pointerId);
});

workGrid.addEventListener("pointermove", (event) => {
  const drag = activeCoverDrag;
  if (!drag || event.pointerId !== drag.pointerId) return;
  const deltaX = event.clientX - drag.startX;
  const deltaY = event.clientY - drag.startY;
  if (!drag.moved) {
    if (Math.hypot(deltaX, deltaY) < 5) return;
    drag.moved = true;
    drag.card.classList.add("is-dragging");
    coverLayer += 1;
    drag.card.style.setProperty("--cover-layer", String(coverLayer));
    workGrid.style.setProperty("--top-cover-layer", String(coverLayer));
  }

  const left = Math.min(drag.maxLeft, Math.max(drag.gutter, drag.bounds.left + deltaX));
  const top = Math.min(drag.maxTop, Math.max(drag.gutter, drag.bounds.top + deltaY));
  const x = drag.offset.x + left - drag.bounds.left;
  const y = drag.offset.y + top - drag.bounds.top;
  coverPositions.set(drag.card, { x, y });
  // Keep covers and captions in separate layers while moving the card.
  drag.card.style.setProperty("--drag-x", `${x}px`);
  drag.card.style.setProperty("--drag-y", `${y}px`);
  event.preventDefault();
});

for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
  workGrid.addEventListener(type, (event) => {
    const drag = activeCoverDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (type === "pointerup" && drag.moved) blockedCoverClick = drag.card;
    stopCoverDrag();
  });
}

function clearCoverTap() {
  if (!pendingCoverTap) return;
  window.clearTimeout(pendingCoverTap.timer);
  pendingCoverTap.card.classList.remove("tap-preview");
  pendingCoverTap = null;
}

workGrid.addEventListener("click", (event) => {
  const link = event.target.closest(".card-link");
  if (!link) return;
  const card = link.closest(".work-card");
  if (event.detail > 0 && card === blockedCoverClick) {
    event.preventDefault();
    blockedCoverClick = null;
    return;
  }
  const clickedCover = event.target.closest(".cover");
  if (desktopCoverDrag.matches && event.pointerType !== "touch" && !clickedCover) return;
  if (event.defaultPrevented || event.detail === 0 || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  clearCoverTap();
  card.classList.add("tap-preview");
  const previousHash = location.hash;
  const timer = window.setTimeout(() => {
    if (location.hash === previousHash && link.hash !== previousHash) {
      location.hash = link.hash;
    } else {
      clearCoverTap();
    }
  }, 200);
  pendingCoverTap = { card, timer };
}, true);

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
  renderIndex();
  markNavigation();
  event.target.value = "";
});

posterPlay.addEventListener("click", () => {
  const moveFocus = document.activeElement === posterPlay;
  player.controls = true;
  posterPlay.hidden = true;
  if (moveFocus) player.focus({ preventScroll: true });
  // The native controls are available while buffering and if playback needs a retry.
  player.play().catch(() => {});
});
player.addEventListener("error", () => {
  if (!player.getAttribute("src")) return;
  $("#video-message").textContent = "视频暂时无法播放，请检查文件路径，或使用 H.264 编码的 MP4 文件。";
  $("#video-message").hidden = false;
});
function updateWindowWidth() {
  document.documentElement.style.setProperty("--window-width", window.innerWidth + "px");
}

window.addEventListener("hashchange", transitionRoute);
window.addEventListener("resize", () => {
  updateWindowWidth();
  resetCoverPositions();
  fitHomeGrid();
});
updateWindowWidth();
renderIndex();
renderProfile();
renderRoute();
document.fonts?.ready.then(fitHomeGrid);
