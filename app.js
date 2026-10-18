/* Dandelune v2 — a dreamy little notebook. Notes stay on this device (IndexedDB),
   with backups, an optional notes file, offline install, and a sticker maker. */
(() => {
"use strict";

/* ================= stickers (hand-drawn SVG) ================= */
const W = s => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#4b3546" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${s}</svg>`;
const eyes = (y, a = 27, b = 37) => `<circle cx="${a}" cy="${y}" r="1.7" fill="#4b3546" stroke="none"/><circle cx="${b}" cy="${y}" r="1.7" fill="#4b3546" stroke="none"/>`;
const cheeks = (y, a = 22, b = 42) => `<ellipse cx="${a}" cy="${y}" rx="3" ry="2" fill="#ffb3c7" stroke="none"/><ellipse cx="${b}" cy="${y}" rx="3" ry="2" fill="#ffb3c7" stroke="none"/>`;
const smile = (x, y) => `<path d="M${x - 2} ${y}c1.5 1.5 3 1.5 4 0"/>`;
const cloudBit = `<path d="M5 52c-1-4 3-7 7-5 2-4 9-4 10 1 4 0 5 4 3 6H7c-1 0-2 0-2-2Z" fill="#fff"/>`;
const dandelionSVG = (() => { let r = ""; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, x = 32 + Math.cos(a) * 13, y = 22 + Math.sin(a) * 13; r += `<path d="M32 22L${x.toFixed(1)} ${y.toFixed(1)}" stroke-width="1.6"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="#fff" stroke-width="1.4"/>`; }
  return W(`<path d="M32 60c-1-12 1-22 0-30"/><path d="M32 50c-6-1-10-5-11-9 5 0 9 3 11 7" fill="#a9c79a"/>${r}<circle cx="32" cy="22" r="3.4" fill="#e4b33f"/><path d="M51 9l1 3M51 12l-2 2M51 12l3 1" stroke-width="1.4"/><circle cx="51" cy="9" r="1.6" fill="#fff" stroke-width="1.2"/>`); })();
const STICKERS = [
  {id:"dandelion", name:"Dandelion", svg:dandelionSVG},
  {id:"heart", name:"Heart", svg:W(`<path d="M32 53C14 42 7 31 10 22c3-9 14-11 22-2 8-9 19-7 22 2 3 9-4 20-22 31Z" fill="#ff9fb8"/><path d="M18 24c1-3 4-5 7-4" stroke="#fff" stroke-width="3"/>`)},
  {id:"star", name:"Star", svg:W(`<path d="M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2z" fill="#ffd86b"/>${eyes(31)}<path d="M29 36c2 2 4 2 6 0"/>`)},
  {id:"cloud", name:"Cloud", svg:W(`<path d="M18 47c-7 0-11-5-10-10 1-5 6-8 11-7 1-8 9-13 17-10 5 2 8 6 8 10 6-1 12 3 12 9 0 5-4 8-9 8z" fill="#fff"/>${eyes(37)}<path d="M30 41c1.5 1.5 3 1.5 4 0"/>${cheeks(41)}`)},
  {id:"flower", name:"Flower", svg:W(`<circle cx="32" cy="18" r="9" fill="#ffb6d5"/><circle cx="45" cy="28" r="9" fill="#ffb6d5"/><circle cx="40" cy="43" r="9" fill="#ffb6d5"/><circle cx="24" cy="43" r="9" fill="#ffb6d5"/><circle cx="19" cy="28" r="9" fill="#ffb6d5"/><circle cx="32" cy="31" r="8" fill="#ffe07a"/>`)},
  {id:"strawberry", name:"Strawberry", svg:W(`<path d="M32 56C20 50 13 38 15 28c1-6 8-8 17-8s16 2 17 8c2 10-5 22-17 28Z" fill="#ff7a93"/><path d="M24 30v2M32 28v2M40 30v2M27 38v2M37 38v2M32 46v2" stroke="#fff3b0"/><path d="M21 21c3-5 8-6 11-3 3-3 8-2 11 3-5 4-17 4-22 0Z" fill="#8ad9a8"/><path d="M32 17v-6"/>`)},
  {id:"cat", name:"Kitty", svg:W(`<path d="M14 50c-3-10-1-22 3-30l7 8c5-2 11-2 16 0l7-8c4 8 6 20 3 30-4 4-12 5-18 5s-14-1-18-5Z" fill="#f8d6b8"/>${eyes(37,25,39)}<path d="M30 42l2 2 2-2"/><path d="M8 40l10 1M8 46l10-2M56 40l-10 1M56 46l-10-2"/>${cheeks(44,21,43)}`)},
  {id:"bunny", name:"Bunny", svg:W(`<ellipse cx="24" cy="17" rx="5" ry="13" fill="#fff"/><ellipse cx="40" cy="17" rx="5" ry="13" fill="#fff"/><ellipse cx="24" cy="18" rx="2" ry="8" fill="#ffc2d1" stroke="none"/><ellipse cx="40" cy="18" rx="2" ry="8" fill="#ffc2d1" stroke="none"/><circle cx="32" cy="41" r="15" fill="#fff"/>${eyes(39)}<path d="M30 44c1 1.5 3 1.5 4 0"/>${cheeks(45,23,41)}`)},
  {id:"sparkle", name:"Sparkles", svg:W(`<path d="M27 8c2 12 5 15 17 17-12 2-15 5-17 17-2-12-5-15-17-17 12-2 15-5 17-17Z" fill="#c9b6ff"/><path d="M48 38c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9Z" fill="#a8e6ff"/>`)},
  {id:"rainbow", name:"Rainbow", svg:W(`<path d="M11 48a21 21 0 0 1 42 0" stroke="#ff8fa3" stroke-width="6"/><path d="M18 48a14 14 0 0 1 28 0" stroke="#ffd86b" stroke-width="6"/><path d="M25 48a7 7 0 0 1 14 0" stroke="#8fd3ff" stroke-width="6"/>${cloudBit}<g transform="translate(37 0)">${cloudBit}</g>`)},
  {id:"boba", name:"Boba tea", svg:W(`<path d="M36 22l7-16"/><path d="M18 24h28l-4 30c0 2-2 3-4 3H26c-2 0-4-1-4-3z" fill="#f3d9bd"/><path d="M16 24c2-6 8-9 16-9s14 3 16 9z" fill="#e8f6ff"/>${eyes(35,27,37)}<path d="M30 39c1.5 1.5 3 1.5 4 0"/><circle cx="27" cy="50" r="2.4" fill="#4b3546" stroke="none"/><circle cx="33" cy="51" r="2.4" fill="#4b3546" stroke="none"/><circle cx="38" cy="49" r="2.4" fill="#4b3546" stroke="none"/>`)},
  {id:"moon", name:"Moon", svg:W(`<path d="M40 9a23 23 0 1 0 15 35A18 18 0 0 1 40 9Z" fill="#ffe58f"/><path d="M22 33c2 2 4 2 6 0M33 35c2 2 4 2 6 0"/><path d="M28 42c2 2 5 2 7 0"/><path d="M50 14l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#c9b6ff" stroke-width="1.6"/>`)},
  {id:"bow", name:"Bow", svg:W(`<path d="M29 34l-6 17 6-3 3 5 1-17M35 34l5 16-5-3-2 5" fill="#ff9fb8"/><path d="M32 32C24 22 12 18 10 26s4 16 22 6Z" fill="#ff9fb8"/><path d="M32 32c8-10 20-14 22-6s-4 16-22 6Z" fill="#ff9fb8"/><circle cx="32" cy="32" r="4.6" fill="#ff7a9a"/>`)},
  {id:"cherry", name:"Cherries", svg:W(`<path d="M22 35c2-10 8-18 14-24M42 37c-2-10-4-18-6-26"/><path d="M36 11c6-2 12 0 14 5-6 2-11 0-14-5Z" fill="#8ad9a8"/><circle cx="22" cy="44" r="9" fill="#ff5e7e"/><circle cx="42" cy="46" r="9" fill="#ff5e7e"/><path d="M17 41c1-2 3-3 5-3M37 43c1-2 3-3 5-3" stroke="#fff"/>`)},
  {id:"mushroom", name:"Mushroom", svg:W(`<path d="M24 35c-1 8-2 13 0 17 4 3 12 3 16 0 2-4 1-9 0-17" fill="#fff3e0"/><path d="M8 33C8 19 20 10 32 10s24 9 24 23c-6 3-42 3-48 0Z" fill="#ff7a7a"/><circle cx="22" cy="23" r="3.5" fill="#fff" stroke="none"/><circle cx="38" cy="17" r="3" fill="#fff" stroke="none"/><circle cx="45" cy="27" r="3" fill="#fff" stroke="none"/>${eyes(43,29,35)}`)},
  {id:"sun", name:"Sunshine", svg:W(`<path d="M32 7v7M32 50v7M7 32h7M50 32h7M14 14l5 5M45 45l5 5M50 14l-5 5M19 45l-5 5"/><circle cx="32" cy="32" r="13" fill="#ffd36b"/>${eyes(30,28,36)}<path d="M29 35c2 2 4 2 6 0"/>${cheeks(35,24,40)}`)},
  {id:"tulip", name:"Tulip", svg:W(`<path d="M32 58V34"/><path d="M32 47c-6-6-12-6-14-4 4 6 10 7 14 6M32 51c6-6 12-6 14-4-4 6-10 7-14 6" fill="#8ad9a8"/><path d="M20 15l6 6 6-10 6 10 6-6c2 12-2 21-12 21s-14-9-12-21Z" fill="#ffb3c7"/>`)},
  {id:"pencil", name:"Pencil", svg:W(`<path d="M14 50l4-12 26-26 8 8-26 26z" fill="#ffd86b"/><path d="M14 50l4-12 8 8z" fill="#f3d9bd"/><path d="M14 50l2-5 3 3z" fill="#4b3546"/><path d="M44 12l3-3c2-2 4-2 6 0l2 2c2 2 2 4 0 6l-3 3z" fill="#ff9fb8"/>`)},
  {id:"letter", name:"Love letter", svg:W(`<rect x="10" y="18" width="44" height="30" rx="3" fill="#fff"/><path d="M11 20l21 16 21-16"/><path d="M32 46c-6-3-8-7-6-9 1.5-1.5 4-1 6 1 2-2 4.5-2.5 6-1 2 2 0 6-6 9Z" fill="#ff7a9a"/>`)},
  /* new in v2 */
  {id:"leaf", name:"Leaf", svg:W(`<path d="M12 52C10 30 24 12 52 10c2 26-14 42-40 42Z" fill="#a9d39a"/><path d="M12 52C24 40 34 30 44 18"/><path d="M26 38l-2-9M34 30l-1-8M30 34l9 1" stroke-width="1.8"/>`)},
  {id:"coffee", name:"Cozy cup", svg:W(`<path d="M24 8c-2 3 2 5 0 8M32 6c-2 3 2 5 0 8M40 8c-2 3 2 5 0 8" stroke-width="2"/><path d="M46 30h4c4 0 6 3 6 6s-2 6-6 6h-5"/><path d="M14 24h32v15c0 9-7 16-16 16s-16-7-16-16z" fill="#fff"/><path d="M14 30h32" stroke="#c9b6ff" stroke-width="3"/>${eyes(39,25,35)}${smile(30,44)}${cheeks(43,20,40)}`)},
  {id:"cupcake", name:"Cupcake", svg:W(`<path d="M17 34h30l-4 20H21z" fill="#ffd7a8"/><path d="M24 34l2 20M32 34v20M40 34l-2 20" stroke-width="1.8"/><path d="M14 35c-4-7 2-13 8-12 1-7 8-11 14-9 6-5 15-1 14 7 5 2 6 10 0 14z" fill="#ffb6d5"/><circle cx="34" cy="11" r="4" fill="#ff5e7e"/><path d="M23 27l3-1M39 22l3 1M31 30l1-3M44 30l2-1" stroke="#7cc8f0" stroke-width="2.4"/>`)},
  {id:"butterfly", name:"Butterfly", svg:W(`<path d="M32 30C24 14 8 10 8 22c0 8 10 12 24 10Z" fill="#c9b6ff"/><path d="M32 30C40 14 56 10 56 22c0 8-10 12-24 10Z" fill="#c9b6ff"/><path d="M31 34C22 34 12 40 15 48c3 6 12 2 17-10Z" fill="#a8e6ff"/><path d="M33 34c9 0 19 6 16 14-3 6-12 2-17-10Z" fill="#a8e6ff"/><circle cx="18" cy="22" r="2.6" fill="#fff" stroke="none"/><circle cx="46" cy="22" r="2.6" fill="#fff" stroke="none"/><path d="M32 24v24" stroke-width="3.6"/><path d="M32 24c-2-5-5-8-8-9M32 24c2-5 5-8 8-9"/>`)},
  {id:"snail", name:"Snail", svg:W(`<path d="M6 51c0-4 3-6 8-6h26l12-15c2-3 6-2 6 1v9c0 7-5 11-12 11z" fill="#f8e3b4"/><path d="M50 30l-3-11M55 30l2-11"/><circle cx="47" cy="18" r="2" fill="#4b3546" stroke="none"/><circle cx="57" cy="18" r="2" fill="#4b3546" stroke="none"/><circle cx="27" cy="32" r="15" fill="#ffb3a1"/><path d="M27 32c0-3 4-3 4 0 0 5-9 5-9 0 0-8 14-8 14 0 0 10-19 10-19 0" stroke-width="2.2"/>`)},
  {id:"frog", name:"Froggy", svg:W(`<circle cx="21" cy="24" r="8" fill="#9fd89a"/><circle cx="43" cy="24" r="8" fill="#9fd89a"/><ellipse cx="32" cy="41" rx="22" ry="16" fill="#9fd89a"/><circle cx="21" cy="24" r="3" fill="#4b3546" stroke="none"/><circle cx="43" cy="24" r="3" fill="#4b3546" stroke="none"/><path d="M24 40c4 4 12 4 16 0"/>${cheeks(43,16,48)}`)},
  {id:"bee", name:"Bee", svg:W(`<ellipse cx="27" cy="20" rx="7" ry="10" fill="#e8f6ff" transform="rotate(-20 27 20)"/><ellipse cx="41" cy="20" rx="7" ry="10" fill="#e8f6ff" transform="rotate(20 41 20)"/><path d="M56 38l5 1-5 2"/><ellipse cx="34" cy="38" rx="21" ry="14" fill="#ffd86b"/><path d="M36 25c-2 8-2 18 0 26M46 28c-2 6-2 14 0 20" stroke-width="4.2"/><circle cx="18" cy="36" r="1.7" fill="#4b3546" stroke="none"/><circle cx="25" cy="36" r="1.7" fill="#4b3546" stroke="none"/>${smile(21.5,41)}<ellipse cx="16" cy="41" rx="2.6" ry="1.8" fill="#ffb3c7" stroke="none"/>`)},
  {id:"cactus", name:"Cactus", svg:W(`<path d="M20 46h24l-3 13H23z" fill="#f1a07a"/><path d="M18 42h28v5H18z" fill="#f1a07a"/><path d="M25 42V20c0-5 3-8 7-8s7 3 7 8v22" fill="#9fd89a"/><path d="M25 32h-5c-3 0-5-2-5-5v-5c0-3 4-3 4 0v4h6M39 28h5v-5c0-3 4-3 4 0v5c0 3-2 5-5 5h-4" fill="#9fd89a"/>${eyes(26,29,35)}${smile(32,30)}<path d="M32 12l-2-4M32 12l2-4" stroke="#ff9fb8" stroke-width="2.4"/>`)},
  {id:"umbrella", name:"Umbrella", svg:W(`<path d="M32 9V5"/><path d="M32 32v18c0 5-8 5-8 0"/><path d="M8 32C8 18 19 9 32 9s24 9 24 23c-4-3-8-3-12 0-4-3-8-3-12 0-4-3-8-3-12 0-4-3-8-3-12 0Z" fill="#8fd3ff"/><path d="M32 9c-6 6-8 14-8 23M32 9c6 6 8 14 8 23" stroke-width="1.8"/><path d="M50 44v3M56 50v3M44 52v3" stroke="#8fd3ff" stroke-width="2.4"/>`)},
  {id:"music", name:"Music", svg:W(`<path d="M24 46V16l26-7v30"/><path d="M24 24l26-7" stroke-width="4"/><ellipse cx="18" cy="46" rx="7" ry="5.5" fill="#c9b6ff"/><ellipse cx="44" cy="39" rx="7" ry="5.5" fill="#c9b6ff"/><path d="M10 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#ffd86b" stroke-width="1.4"/>`)},
  {id:"book", name:"Open book", svg:W(`<path d="M32 16C26 11 16 10 8 12v36c8-2 18-1 24 4 6-5 16-6 24-4V12c-8-2-18-1-24 4Z" fill="#fff"/><path d="M32 16v36"/><path d="M14 22c4-1 8-1 12 1M14 30c4-1 8-1 12 1M14 38c4-1 8-1 12 1M38 23c4-2 8-2 12-1M38 31c4-2 8-2 12-1" stroke-width="1.8"/><path d="M44 36c-3-2-4-4-3-5 1-1 2-.5 3 .5 1-1 2-1.5 3-.5 1 1 0 3-3 5Z" fill="#ff7a9a" stroke-width="1.4"/>`)},
  {id:"planet", name:"Planet", svg:W(`<circle cx="32" cy="32" r="14" fill="#ffc2a1"/><path d="M19 37c-9 6-10 11-1 9 9-1 24-8 32-15 7-6 6-10-2-8" /><circle cx="51" cy="12" r="2.2" fill="#ffd86b"/><circle cx="12" cy="17" r="1.8" fill="#a8e6ff"/><circle cx="54" cy="50" r="1.6" fill="#c9b6ff"/>${eyes(30,28,36)}${smile(32,34)}`)},
  {id:"paw", name:"Paw print", svg:W(`<path d="M32 33c-8 0-15 7-15 13 0 5 4 7 8 6 3-1 5-2 7-2s4 1 7 2c4 1 8-1 8-6 0-6-7-13-15-13Z" fill="#ffc2d1"/><ellipse cx="15" cy="30" rx="5" ry="6.5" fill="#ffc2d1"/><ellipse cx="25" cy="18" rx="5" ry="6.5" fill="#ffc2d1"/><ellipse cx="39" cy="18" rx="5" ry="6.5" fill="#ffc2d1"/><ellipse cx="49" cy="30" rx="5" ry="6.5" fill="#ffc2d1"/>`)},
  {id:"bear", name:"Teddy", svg:W(`<circle cx="17" cy="18" r="7" fill="#d9a77a"/><circle cx="47" cy="18" r="7" fill="#d9a77a"/><circle cx="17" cy="18" r="3" fill="#f3d9bd" stroke="none"/><circle cx="47" cy="18" r="3" fill="#f3d9bd" stroke="none"/><circle cx="32" cy="35" r="20" fill="#d9a77a"/><ellipse cx="32" cy="42" rx="9" ry="7" fill="#f3d9bd"/>${eyes(32,24,40)}<path d="M30 39h4l-2 2z" fill="#4b3546"/><path d="M32 41v2c-1 2-3 2-4 1M32 43c1 2 3 2 4 1" stroke-width="2"/>`)},
  {id:"avocado", name:"Avocado", svg:W(`<path d="M32 6c-8 0-12 10-14 20-3 14 2 30 14 30s17-16 14-30C44 16 40 6 32 6Z" fill="#a9d39a"/><path d="M32 14c-6 0-9 8-10 16-2 10 2 20 10 20s12-10 10-20c-1-8-4-16-10-16Z" fill="#f4f1b0" stroke="none"/><circle cx="32" cy="42" r="6" fill="#b07a4f"/>${eyes(25,28,36)}${smile(32,29)}`)},
];
const uri = svg => "data:image/svg+xml;utf8," + encodeURIComponent(svg);
const STK = Object.fromEntries(STICKERS.map(s => [s.id, s]));
const stkHTML = (id, size = "m") => `<img class="stk stk-${size}" src="${uri(STK[id].svg)}" alt="${STK[id].name} sticker" draggable="false">`;

/* ================= page styles ================= */
const PAPERS = {
  milk:{name:"Moonmilk",bg:"#fdfcf7",ink:"#2f3b44",line:"rgba(95,125,185,.30)",margin:"rgba(214,120,110,.45)",acc:"#5b6fb8"},
  mint:{name:"Sage",bg:"#eff4ea",ink:"#2d3d35",line:"rgba(90,130,95,.28)",margin:"rgba(214,120,110,.40)",acc:"#6a9471"},
  sky:{name:"Dusk blue",bg:"#ecf0f8",ink:"#283650",line:"rgba(80,110,175,.28)",margin:"rgba(214,120,110,.40)",acc:"#5468b0"},
  lilac:{name:"Lavender haze",bg:"#f1eff6",ink:"#353350",line:"rgba(120,110,175,.26)",margin:"rgba(214,120,110,.40)",acc:"#7c71b5"},
  butter:{name:"Dandelion",bg:"#fbf5dd",ink:"#4a4028",line:"rgba(190,150,60,.30)",margin:"rgba(214,120,110,.40)",acc:"#c99a2e"},
  blush:{name:"Peach dust",bg:"#f9eee8",ink:"#45342f",line:"rgba(200,130,110,.26)",margin:"rgba(200,110,100,.45)",acc:"#c27a66"},
  midnight:{name:"Night sky",bg:"#1f2638",ink:"#eef0fb",line:"rgba(200,210,255,.16)",margin:"rgba(240,200,110,.40)",acc:"#f0c65a"},
};
const PATTERNS = [["blank","Blank"],["lined","Lined"],["grid","Grid"],["dots","Dotted"]];
const FONTS = [
  {id:"patrick",name:"Patrick Hand",css:"'Patrick Hand','Comic Sans MS',cursive",scale:1.05},
  {id:"caveat",name:"Caveat",css:"'Caveat','Segoe Print',cursive",scale:1.3},
  {id:"gaegu",name:"Gaegu",css:"'Gaegu','Comic Sans MS',cursive",scale:1.2},
  {id:"indie",name:"Indie Flower",css:"'Indie Flower','Comic Sans MS',cursive",scale:1},
  {id:"fredoka",name:"Fredoka",css:"'Fredoka','Nunito',sans-serif",scale:.95},
  {id:"dancing",name:"Dancing Script",css:"'Dancing Script','Brush Script MT',cursive",scale:1.2},
  {id:"pacifico",name:"Pacifico",css:"'Pacifico','Brush Script MT',cursive",scale:.88},
  {id:"elite",name:"Typewriter",css:"'Special Elite','Courier New',monospace",scale:.92},
];
const FONT = Object.fromEntries(FONTS.map(f => [f.id, f]));
const INKS = ["#2f3b44","#4f60a6","#7c71b5","#5e8f6b","#c99a2e","#c27a66","#8a5a3c","#ffffff"];
const HILITES = ["#f8e7a2","#d6e6cc","#d5ddf5","#e2dcf0","#f5d9cc"];
const FOLDER_COLORS = ["#c9d8b6","#f2d58a","#b8c7e8","#d6cdea","#f1c6a8","#bfe0dc"];
const tileSVG = (kind, c) => {
  const T = s => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">${s}</svg>`;
  switch (kind) {
    case "hearts": return T(`<path d="M10 15.5C4.5 12 2.6 9 3.4 6.6 4.3 4 7.6 3.6 10 6.4 12.4 3.6 15.7 4 16.6 6.6 17.4 9 15.5 12 10 15.5Z" fill="${c}"/>`);
    case "stars": return T(`<path d="M10 3l2 4.4 4.8.6-3.5 3.3 1 4.7L10 13.6 5.7 16l1-4.7L3.2 8l4.8-.6z" fill="#ffcf4d" stroke="#e8a92b" stroke-width=".8" stroke-linejoin="round"/>`);
    case "flowers": return T(`<g fill="${c}"><circle cx="10" cy="5.6" r="3"/><circle cx="14.2" cy="8.7" r="3"/><circle cx="12.6" cy="13.6" r="3"/><circle cx="7.4" cy="13.6" r="3"/><circle cx="5.8" cy="8.7" r="3"/></g><circle cx="10" cy="10" r="2.4" fill="#ffe07a"/>`);
    case "lace": return T(`<path d="M0 10a5 5 0 0 1 10 0a5 5 0 0 1 10 0" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="5" cy="13" r="1.3" fill="${c}"/><circle cx="15" cy="13" r="1.3" fill="${c}"/>`);
    case "dots": return T(`<circle cx="10" cy="10" r="3.4" fill="${c}"/>`);
  }
  return null;
};
const BORDERS = [["none","None"],["stitch","Stitched"],["doodle","Doodle"],["hearts","Hearts"],["stars","Stars"],["flowers","Flowers"],["lace","Lace"],["dots","Polka"],["washi","Washi tape"]];
const BORDER_IDS = new Set(BORDERS.map(b => b[0]));
const PATTERN_IDS = new Set(PATTERNS.map(p => p[0]));
const DEFAULT_STYLE = {paper:"lined", color:"milk", border:"none", font:"patrick"};

/* ================= helpers ================= */
const $ = s => document.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const k in props) {
    const v = props[k];
    if (v == null) continue;
    if (k === "class") e.className = v;
    else if (k === "text") e.textContent = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (k === "style") e.setAttribute("style", v);
    else e.setAttribute(k, v);
  }
  for (const c of kids) if (c != null) e.append(c);
  return e;
};
const newId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmtDate = t => { try { return new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric"}).format(new Date(t)); } catch { return ""; } };
const textOf = html => { const t = document.createElement("template"); t.innerHTML = html || ""; return (t.content.textContent || "").replace(/\s+/g," ").trim(); };
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const str = (v, max) => (typeof v === "string" ? v : "").slice(0, max);
const num = v => (typeof v === "number" && isFinite(v) ? v : 0);

/* ================= safety: clean any page HTML before it is shown or saved ================= */
// Only simple formatting, checkboxes and sticker images survive. Scripts, links, frames,
// event handlers, outside images and unknown styles are all removed.
const KEEP_TAGS = new Set(["DIV","P","BR","B","STRONG","I","EM","U","H2","H3","UL","OL","LI","SPAN","FONT","IMG"]);
const KEEP_CLASSES = new Set(["stk","stk-s","stk-m","stk-l","chk"]);
const CSS_OK = new Set(["font-family","font-size","color","background-color","font-weight","font-style","text-decoration","text-decoration-line"]);
const IMG_OK = /^data:image\/(?:svg\+xml(?:;charset=utf-8|;utf8)?(?:;base64)?|png;base64|jpeg;base64|webp;base64|gif;base64),/i;
const STICKER_SRC_OK = /^data:image\/(?:png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/;
const MAX_IMG = 600000;
const HTML_NS = "http://www.w3.org/1999/xhtml";
function cleanStyle(s) {
  return String(s).split(";").map(d => {
    const i = d.indexOf(":"); if (i < 0) return "";
    const p = d.slice(0, i).trim().toLowerCase(), v = d.slice(i + 1).trim();
    if (!CSS_OK.has(p) || !v || v.length > 160 || /url\s*\(|expression|javascript:|image-set|[<>\\@{}]|\/\*/i.test(v)) return "";
    return p + ": " + v;
  }).filter(Boolean).join("; ");
}
function cleanAttrs(e, tag) {
  const isChk = tag === "SPAN" && e.classList.contains("chk");
  for (const a of [...e.attributes]) {
    const n = a.name.toLowerCase(), v = a.value;
    let keep = null;
    if (n === "class") { const c = v.split(/\s+/).filter(x => KEEP_CLASSES.has(x)).join(" "); keep = c || null; }
    else if (n === "style") { const c = cleanStyle(v); keep = c || null; }
    else if (tag === "IMG" && n === "src") keep = (IMG_OK.test(v) && v.length <= MAX_IMG) ? v : null;
    else if (tag === "IMG" && n === "alt") keep = v.slice(0, 80);
    else if (tag === "IMG" && n === "draggable") keep = "false";
    else if (isChk && n === "data-on") keep = v === "1" ? "1" : "0";
    else if (isChk && n === "contenteditable") keep = "false";
    else if (tag === "FONT" && n === "size") keep = /^[1-7]$/.test(v) ? v : null;
    else if (tag === "FONT" && n === "color") keep = /^(#[0-9a-f]{3,8}|[a-z]{3,20}|rgba?\([\d\s.,%]+\))$/i.test(v) ? v : null;
    else if (tag === "FONT" && n === "face") keep = /^[\w\s,'"-]{1,120}$/.test(v) ? v : null;
    if (keep == null) e.removeAttribute(a.name); else if (keep !== v) e.setAttribute(a.name, keep);
  }
}
function cleanTree(node) {
  for (const c of [...node.childNodes]) {
    if (c.nodeType === 3) continue;
    if (c.nodeType !== 1) { c.remove(); continue; }
    const tag = c.tagName.toUpperCase();
    if (c.namespaceURI !== HTML_NS || /^(SCRIPT|STYLE|IFRAME|FRAME|FRAMESET|OBJECT|EMBED|TEMPLATE|NOSCRIPT|LINK|META|BASE|TITLE|HEAD|FORM|INPUT|TEXTAREA|SELECT|BUTTON|OPTION|VIDEO|AUDIO|SOURCE|TRACK|CANVAS|PICTURE|MAP|AREA|PORTAL|DIALOG)$/.test(tag)) { c.remove(); continue; }
    if (!KEEP_TAGS.has(tag)) { cleanTree(c); c.replaceWith(...c.childNodes); continue; }
    cleanAttrs(c, tag);
    if (tag === "IMG" && !c.getAttribute("src")) { c.remove(); continue; }
    cleanTree(c);
  }
}
function sanitize(html) {
  const t = document.createElement("template");
  t.innerHTML = String(html || "").slice(0, 8_000_000);
  cleanTree(t.content);
  return t.innerHTML;
}

// Check every saved item has the right shape (protects against broken or tampered backups).
const ID_OK = /^[A-Za-z0-9_-]{1,80}$/;
const HEX_OK = /^#[0-9a-f]{3,8}$/i;
function validItem(v) {
  if (!v || typeof v !== "object") return null;
  const _t = num(v._t);
  if (v.type === "tomb") return {type:"tomb", _t};
  if (v.type === "folder") return {type:"folder", name: str(v.name, 60) || "Folder", parentId: ID_OK.test(v.parentId || "") ? v.parentId : null,
    color: HEX_OK.test(v.color || "") ? v.color : FOLDER_COLORS[0], created: num(v.created), _t};
  if (v.type === "note") return {type:"note", folderId: ID_OK.test(v.folderId || "") ? v.folderId : null, title: str(v.title, 120), html: sanitize(v.html),
    paper: PATTERN_IDS.has(v.paper) ? v.paper : "lined", color: PAPERS[v.color] ? v.color : "milk", border: BORDER_IDS.has(v.border) ? v.border : "none",
    font: FONT[v.font] ? v.font : "patrick", created: num(v.created), updated: num(v.updated), _t};
  if (v.type === "sticker") return (typeof v.src === "string" && v.src.length <= MAX_IMG && STICKER_SRC_OK.test(v.src))
    ? {type:"sticker", name: str(v.name, 40) || "My sticker", src: v.src, created: num(v.created), _t} : null;
  return null;
}

/* ================= storage: IndexedDB on this device, with a localStorage safety copy ================= */
const OLD_LS_KEY = "petal-notes-device-v1";      // v1 notes live here
const MIRROR_KEY = "dandelune-mirror-v2";
const MIRROR_MAX = 2_500_000;
let store = new Map();                            // id -> item (including tombs)
let ready = false, saveState = "idle", saveErr = "";
const kv = (() => {
  let p;
  const open = () => p || (p = new Promise((res, rej) => {
    if (!("indexedDB" in window)) return rej(new Error("no idb"));
    const r = indexedDB.open("dandelune", 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains("kv")) r.result.createObjectStore("kv"); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); r.onblocked = () => rej(new Error("blocked"));
  }));
  const tx = (mode, fn) => open().then(db => new Promise((res, rej) => { const t = db.transaction("kv", mode); const q = fn(t.objectStore("kv")); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }));
  return { get: k => tx("readonly", s => s.get(k)), set: (k, v) => tx("readwrite", s => s.put(v, k)), del: k => tx("readwrite", s => s.delete(k)) };
})();
let idbOK = true;
const chan = (() => { try { return new BroadcastChannel("dandelune"); } catch { return null; } })();

function items() { const m = new Map(); for (const [k, v] of store) if (v && v.type !== "tomb") m.set(k, v); return m; }
const stamp = v => (v && (v._t || v.updated || v.created)) || 0;
function mergeIn(obj) {
  let n = 0;
  for (const [k, raw] of Object.entries(obj || {})) {
    if (!ID_OK.test(k)) continue;
    const v = validItem(raw); if (!v) continue;
    const cur = store.get(k);
    if (!cur || stamp(v) > stamp(cur)) { store.set(k, v); if (v.type !== "tomb") n++; }
  }
  return n;
}
function snapshot() { return Object.fromEntries(store); }

function setStatus() {
  const s = $("#status");
  if (saveErr) { s.textContent = saveErr; s.dataset.s = "err"; return; }
  s.dataset.s = "";
  if (!ready) s.textContent = "Opening…";
  else if (saveState === "saving") s.textContent = "Saving…";
  else if (fileState === "linked") s.textContent = "Saved to your file";
  else if (fileState === "needs-permission") s.textContent = "File not connected";
  else s.textContent = "Saved on this device";
}

let saveTimerStore = null;
function put(id, data) {
  store.set(id, data === null ? {type:"tomb", _t:Date.now()} : {...data, _t:Date.now()});
  saveState = "saving"; setStatus();
  clearTimeout(saveTimerStore); saveTimerStore = setTimeout(saveNow, 250);
}
async function saveNow() {
  clearTimeout(saveTimerStore);
  const snap = snapshot();
  const json = JSON.stringify(snap);
  const mirrored = json.length < MIRROR_MAX ? lsSet(MIRROR_KEY, json) : false;
  let ok = mirrored;
  if (idbOK) {
    try { await kv.set("items", snap); ok = true; }
    catch (e) { idbOK = false; ok = mirrored; }
  }
  saveErr = ok ? "" : "Not saved: storage is full. Back up, then delete a few pages";
  saveState = "idle"; setStatus();
  try { chan && chan.postMessage({t: Date.now()}); } catch {}
  queueFileWrite();
}
async function loadAll() {
  let fromIdb = null;
  try { fromIdb = await kv.get("items"); } catch { idbOK = false; }
  if (fromIdb) mergeIn(fromIdb);
  for (const key of [MIRROR_KEY, OLD_LS_KEY]) {
    try { const raw = lsGet(key); if (raw) mergeIn(JSON.parse(raw)); } catch {}
  }
}
async function initStore() {
  await loadAll();
  ready = true;
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch {}
  if (store.size) saveNow();           // moves v1 notes into the new storage
  setStatus(); onData(); initFile();
}
if (chan) chan.onmessage = async () => {   // another tab saved: pull its changes in
  try { const d = await kv.get("items"); if (d && mergeIn(d) >= 0) onData(); } catch {}
};

/* ================= toasts ================= */
function toast(t, action, fn) {
  let e = $("#toast");
  if (!e) { e = el("div", {id:"toast", class:"toast", role:"status", "aria-live":"polite"}); document.body.append(e); }
  e.replaceChildren(el("span", {text:t}));
  if (action) e.append(el("button", {type:"button", text:action, onclick: () => { e.hidden = true; fn(); }}));
  e.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { e.hidden = true; }, action ? 6000 : 3200);
}

/* ================= backups and notes file ================= */
function exportJSON() { return JSON.stringify({app:"dandelune", version:2, exported:new Date().toISOString(), items:snapshot()}); }
function parseBackup(text) {
  const d = JSON.parse(text);
  if (!d || typeof d.items !== "object" || !d.items) throw new Error("not a backup");
  return d.items;
}
function downloadBackup() {
  commitNote();
  const blob = new Blob([exportJSON()], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = el("a", {href:url, download:`dandelune-backup-${new Date().toISOString().slice(0,10)}.json`});
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  lsSet("dandelune-last-backup", String(Date.now()));
  toast("Backup saved to your downloads"); renderLib();
}
const restoreIn = el("input", {type:"file", accept:".json,application/json", hidden:"", id:"restoreIn"});
restoreIn.addEventListener("change", async () => {
  const f = restoreIn.files && restoreIn.files[0]; restoreIn.value = "";
  if (!f) return;
  if (f.size > 60_000_000) { toast("That file is too big to be a Dandelune backup."); return; }
  try {
    const n = mergeIn(parseBackup(await f.text()));
    await saveNow(); onData();
    toast(n ? `Restored ${n} item${n > 1 ? "s" : ""} from your backup` : "Everything in that backup is already here");
  } catch { toast("That file isn't a Dandelune backup. Pick a file named dandelune-backup."); }
});

// Save straight into a file on this computer (Chrome and Edge on a computer)
const fsSupported = typeof window.showSaveFilePicker === "function" && typeof window.showOpenFilePicker === "function";
let fileHandle = null, fileState = "none"; // none | linked | needs-permission
const FILE_TYPES = [{description:"Dandelune notes", accept:{"application/json":[".json"]}}];
async function linkFile(h, read) {
  fileHandle = h;
  if (read) { const txt = await (await h.getFile()).text(); if (txt.trim()) mergeIn(parseBackup(txt)); }
  fileState = "linked";
  try { await kv.set("file", h); } catch {}
  await saveNow(); await writeFileNow(); onData();
}
let fileTimer = null, writing = false, writeAgain = false;
function queueFileWrite() { if (fileState !== "linked") return; clearTimeout(fileTimer); fileTimer = setTimeout(writeFileNow, 500); }
async function writeFileNow() {
  if (fileState !== "linked" || !fileHandle) return;
  if (writing) { writeAgain = true; return; }
  writing = true;
  try { const w = await fileHandle.createWritable(); await w.write(exportJSON()); await w.close(); }
  catch { fileState = "needs-permission"; renderLib(); }
  writing = false; setStatus();
  if (writeAgain) { writeAgain = false; writeFileNow(); }
}
async function createFile() {
  try {
    const h = await window.showSaveFilePicker({suggestedName:"dandelune-notes.json", types:FILE_TYPES});
    await linkFile(h, false); toast("Your notes now save to " + h.name);
  } catch (e) { if (!e || e.name !== "AbortError") toast("Couldn't create the file. Try a folder like Documents."); }
}
async function openFile() {
  try {
    const [h] = await window.showOpenFilePicker({types:FILE_TYPES, multiple:false});
    if ((await h.requestPermission({mode:"readwrite"})) !== "granted") return;
    await linkFile(h, true); toast("Notes file connected");
  } catch (e) { if (!e || e.name !== "AbortError") toast("That file couldn't be opened. Pick your dandelune-notes file."); }
}
async function reconnectFile() {
  try {
    if ((await fileHandle.requestPermission({mode:"readwrite"})) === "granted") { await linkFile(fileHandle, true); toast("Notes file reconnected"); }
  } catch { toast("Couldn't reach the file. It may have been moved or renamed."); }
}
async function unlinkFile() {
  fileHandle = null; fileState = "none";
  try { await kv.del("file"); } catch {}
  setStatus(); renderLib(); toast("File disconnected. Notes still save on this device.");
}
async function initFile() {
  if (!fsSupported) return;
  try {
    const h = await kv.get("file"); if (!h) return;
    fileHandle = h;
    if ((await h.queryPermission({mode:"readwrite"})) === "granted") await linkFile(h, true);
    else { fileState = "needs-permission"; setStatus(); renderLib(); }
  } catch {}
}
function safetyCard() {
  const box = el("section", {class:"safe"}, el("div", {class:"sec-head"}, el("h2", {text:"Keep my notes safe"})));
  const b = (t, fn, alt) => el("button", {class:"big" + (alt ? " alt" : ""), type:"button", text:t, onclick:fn});
  box.append(el("p", {class:"safe-note", text:"Your notes stay private on this device. Nothing is uploaded anywhere."}));
  if (fsSupported) {
    if (fileState === "linked") box.append(el("p", {class:"safe-note", text:`Every change also saves to “${fileHandle.name}” on this computer.`}), el("div", {class:"row"}, b("Disconnect file", unlinkFile, true)));
    else if (fileState !== "needs-permission") box.append(el("p", {class:"safe-note", text:"Also save into a real file on this computer, so clearing the browser can't erase your notes."}),
      el("div", {class:"row"}, b("Create notes file", createFile), b("Open notes file", openFile, true)));
  }
  const last = +(lsGet("dandelune-last-backup") || 0);
  const old = last && Date.now() - last > 14 * 864e5;
  box.append(el("p", {class:"safe-note", text: !last ? "No backup yet. Save one now and then, especially on your phone." : old ? `Last backup: ${fmtDate(last)}. Time for a fresh one.` : `Last backup: ${fmtDate(last)}.`}),
    el("div", {class:"row"}, b("Back up my notes", downloadBackup), b("Restore from backup", () => restoreIn.click(), true)));
  return box;
}

/* ================= install as an app ================= */
let installEvt = null;
const isStandalone = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; renderLib(); });
window.addEventListener("appinstalled", () => { installEvt = null; toast("Dandelune is installed"); renderLib(); });
function installCard() {
  if (isStandalone() || lsGet("dandelune-hide-install") === "1") return null;
  const hide = el("button", {class:"big alt", type:"button", text:"Not now", onclick: () => { lsSet("dandelune-hide-install", "1"); renderLib(); }});
  const box = el("section", {class:"install"}, el("h2", {text:"Get Dandelune as an app"}));
  if (installEvt) {
    box.append(el("p", {text:"Install it to open from your home screen, full screen, even with no internet."}),
      el("div", {class:"row"}, el("button", {class:"big", type:"button", text:"Install app", onclick: async () => {
        const e = installEvt; installEvt = null;
        try { await e.prompt(); await e.userChoice; } catch {}
        renderLib();
      }}), hide));
  } else if (isIOS) {
    box.append(el("p", {text:"In Safari, tap the Share button, then “Add to Home Screen”. If this opened inside another app, open it in Safari first."}),
      el("p", {text:"The home-screen app keeps its own notes, separate from Safari. Use Back up and Restore to move notes between them."}),
      el("div", {class:"row"}, hide));
  } else {
    box.append(el("p", {text:"Open your browser menu and choose “Install app” or “Add to Home screen”."}), el("div", {class:"row"}, hide));
  }
  return box;
}
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}

/* ================= state ================= */
const app = $("#app"), ed = $("#ed"), titleIn = $("#title"), paper = $("#paper"), frame = $("#frame"), panel = $("#panel");
let selFolder = lsGet("petal-folder") || "all";
let curNote = null, dirty = false, saveTimer = null;
let query = "", menuFor = null, renaming = null, confirmDel = null, openPanel = null, stkSize = "m", stkEdit = false;

const allFolders = m => [...m.values()].filter(x => x.type === "folder");
const allNotes = m => [...m.values()].filter(x => x.type === "note");
function entries(m, type) { return [...m.entries()].filter(([, v]) => v.type === type); }
function descendants(m, fid) {
  const out = [fid];
  for (let i = 0; i < out.length; i++) for (const [k, v] of entries(m, "folder")) if (v.parentId === out[i] && !out.includes(k)) out.push(k);
  return out;
}

function onData() {
  setStatus();
  const m = items();
  if (selFolder !== "all" && !(m.get(selFolder) && m.get(selFolder).type === "folder")) selFolder = "all";
  renderLib();
  if (curNote) {
    const n = m.get(curNote);
    if (!n) { closeNote(); return; }
    const editing = document.activeElement === ed || document.activeElement === titleIn;
    if (!dirty && !editing) {
      if (n.html !== ed.innerHTML) ed.innerHTML = n.html || "";
      if ((n.title || "") !== titleIn.value) titleIn.value = n.title || "";
      applyPage(n);
    }
    fillMoveTo(m, n);
  }
  if (openPanel === "sticker") renderPanel();
}

/* ================= library rendering ================= */
function renderLib() {
  const body = $("#libBody");
  const ae = document.activeElement;
  if (ae && ae.classList && ae.classList.contains("frename") && renaming) return;
  if (ae && ae.id === "q") { renderNotes(); return; }
  const m = items();
  const fs = entries(m, "folder"), ns = entries(m, "note");
  body.replaceChildren();
  if (!ready) { body.append(el("p", {class:"empty-note", text:"Opening your notebook…"})); return; }
  if (!fs.length && !ns.length) { body.append(welcomeCard()); const ic = installCard(); if (ic) { ic.style.marginTop = "18px"; body.append(ic); } return; }

  const wrap = el("div", {style:"display:flex;flex-direction:column;gap:18px"});
  if (fileState === "needs-permission") wrap.append(el("div", {class:"banner"}, el("span", {text:"Your notes file is waiting"}),
    el("button", {class:"big", type:"button", text:"Reconnect file", onclick: reconnectFile})));
  const search = el("div", {class:"search"}, el("input", {id:"q", type:"search", placeholder:"Search all notes", "aria-label":"Search notes", autocomplete:"off"}));
  const qi = search.querySelector("input"); qi.value = query;
  qi.addEventListener("input", () => { query = qi.value; renderNotes(); });
  wrap.append(search);

  const fsec = el("section", {}, el("div", {class:"sec-head"}, el("h2", {text:"Folders"}),
    el("button", {class:"pill", type:"button", text:"+ Folder", onclick: () => addFolder(null)})));
  const tree = el("ul", {id:"tree"});
  tree.append(folderRow(m, "all", {name:"All notes"}, 0, ns.length));
  const seen = new Set();
  const walk = (pid, d) => {
    fs.filter(([id, f]) => (f.parentId || null) === pid && !seen.has(id)).sort((a, b) => (a[1].created || 0) - (b[1].created || 0)).forEach(([id, f]) => {
      seen.add(id);
      const count = ns.filter(([, n]) => n.folderId === id).length;
      tree.append(folderRow(m, id, f, d, count));
      if (menuFor === id) tree.append(folderMenu(m, id, f, d));
      walk(id, d + 1);
    });
  };
  walk(null, 0);
  // folders whose parent went missing still show at the top level
  fs.filter(([id]) => !seen.has(id)).forEach(([id, f]) => { seen.add(id); tree.append(folderRow(m, id, f, 0, ns.filter(([, n]) => n.folderId === id).length)); if (menuFor === id) tree.append(folderMenu(m, id, f, 0)); });
  fsec.append(tree); wrap.append(fsec);

  const nsec = el("section", {}, el("div", {class:"sec-head"}, el("h2", {id:"notesHead"}),
    el("button", {class:"pill", type:"button", text:"+ Page", onclick: newNote})), el("div", {id:"noteList"}));
  wrap.append(nsec, safetyCard());
  const ic = installCard(); if (ic) wrap.append(ic);
  body.append(wrap);
  renderNotes();
  if (renaming) { const r = body.querySelector(".frename"); if (r) { r.focus(); r.select(); } }
}

function folderRow(m, id, f, d, count) {
  const li = el("li", {class:"frow", "data-sel": selFolder === id ? "1" : "0", style:`--d:${d}`});
  if (renaming === id) {
    const inp = el("input", {class:"frename", maxlength:"60", "aria-label":"Folder name"}); inp.value = f.name || "";
    let done = false;
    const commit = keep => {
      if (done) return; done = true; renaming = null;
      const v = inp.value.trim();
      if (keep && v && v !== f.name) put(id, {...f, name:v});
      renderLib();
    };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") commit(true); if (e.key === "Escape") commit(false); });
    inp.addEventListener("blur", () => commit(true));
    const ico = el("span", {class:"fico"}); ico.style.setProperty("--fc", f.color);
    li.append(ico, inp);
    li.style.gap = "10px"; li.style.paddingLeft = `calc(${d} * 18px + 10px)`;
    return li;
  }
  const ico = el("span", {class: "fico" + (id === "all" ? " all" : "")}); if (f.color) ico.style.setProperty("--fc", f.color);
  const sel = el("button", {class:"fsel", type:"button", onclick: () => {
    selFolder = id; lsSet("petal-folder", id); query = ""; renderLib();
  }}, ico, el("span", {class:"fname", text:f.name || "Untitled folder"}), el("span", {class:"fcount", text:String(count)}));
  li.append(sel);
  if (id !== "all") li.append(el("button", {class:"fmore", type:"button", "aria-label":`Options for ${f.name}`, text:"⋯",
    onclick: () => { menuFor = menuFor === id ? null : id; confirmDel = null; renderLib(); }}));
  return li;
}

function folderMenu(m, id, f, d) {
  const box = el("li", {class:"fmenu", style:`--d:${d}`});
  if (confirmDel === id) {
    const ids = descendants(m, id);
    const nCount = allNotes(m).filter(n => ids.includes(n.folderId)).length;
    box.append(el("span", {class:"msg", text:`Delete “${f.name}”${ids.length > 1 ? " and its subfolders" : ""}${nCount ? ` with ${nCount} page${nCount > 1 ? "s" : ""}` : ""}? You'll have a few seconds to undo.`}),
      el("button", {class:"txt danger", type:"button", text:"Delete", onclick: () => deleteFolder(id)}),
      el("button", {class:"txt", type:"button", text:"Keep it", onclick: () => { confirmDel = null; renderLib(); }}));
    return box;
  }
  box.append(el("button", {class:"txt", type:"button", text:"Rename", onclick: () => { renaming = id; menuFor = null; renderLib(); }}));
  if (d < 2) box.append(el("button", {class:"txt", type:"button", text:"+ Subfolder", onclick: () => addFolder(id)}));
  FOLDER_COLORS.forEach(c => box.append(el("button", {class:"sw", type:"button", style:`background:${c}`, "aria-label":"Folder colour", "aria-pressed": String(f.color === c),
    onclick: () => { put(id, {...f, color:c}); renderLib(); }})));
  box.append(el("button", {class:"txt danger", type:"button", text:"Delete", onclick: () => { confirmDel = id; renderLib(); }}));
  return box;
}

function renderNotes() {
  const list = $("#noteList"); if (!list) return;
  const m = items();
  const q = query.trim().toLowerCase();
  let ns = entries(m, "note");
  const head = $("#notesHead");
  if (q) { ns = ns.filter(([, n]) => ((n.title || "") + " " + textOf(n.html)).toLowerCase().includes(q)); head.textContent = "Search results"; }
  else if (selFolder !== "all") { ns = ns.filter(([, n]) => n.folderId === selFolder); head.textContent = (m.get(selFolder) || {}).name || "Pages"; }
  else head.textContent = "All pages";
  ns.sort((a, b) => (b[1].updated || 0) - (a[1].updated || 0));
  list.replaceChildren();
  if (!ns.length) { list.append(el("div", {class:"empty-note", text: q ? "No pages match that search." : "No pages here yet. Tap “+ Page” to start one."})); return; }
  for (const [id, n] of ns) {
    const p = PAPERS[n.color] || PAPERS.milk;
    const folder = m.get(n.folderId);
    const snip = textOf(n.html);
    const mini = el("span", {class:"mini", "data-pattern":n.paper}); mini.style.setProperty("--pbg", p.bg); mini.style.setProperty("--pline", p.line);
    list.append(el("button", {class:"ncard", type:"button", "data-sel": curNote === id ? "1" : "0", onclick: () => openNote(id)},
      mini,
      el("span", {class:"nbody"},
        el("p", {class:"ntitle", text:n.title || "Untitled page"}),
        el("p", {class:"nsnip", text: snip || "Empty page"}),
        el("p", {class:"nmeta", text: fmtDate(n.updated) + ((selFolder === "all" || q) && folder ? " · " + folder.name : "")}))));
  }
}

function welcomeCard() {
  const st = el("div", {class:"stks"}); ["dandelion","moon","mushroom","star"].forEach(s => st.append(el("img", {src:uri(STK[s].svg), alt:""})));
  return el("div", {class:"welcome"}, st,
    el("h2", {text:"Your little dreamy notebook is ready"}),
    el("p", {text:"Make folders, write on lined or blank paper, add borders, and drop hand-drawn stickers right into your words. You can even draw your own stickers."}),
    el("div", {class:"row"},
      el("button", {class:"big", type:"button", text:"Start with sample pages", onclick: seedStarter}),
      el("button", {class:"big alt", type:"button", text:"Start empty", onclick: () => { const id = addFolderRaw(null, "My notes"); selFolder = id; renderLib(); }})),
    el("p", {text:"Already have notes from another device?"}),
    el("div", {class:"row"},
      el("button", {class:"big alt", type:"button", text:"Restore from backup", onclick: () => restoreIn.click()}),
      fsSupported ? el("button", {class:"big alt", type:"button", text:"Open notes file", onclick: openFile}) : null),
    fileState === "needs-permission" ? el("div", {class:"row"}, el("button", {class:"big", type:"button", text:"Reconnect notes file", onclick: reconnectFile})) : null);
}

/* ================= folder + note actions ================= */
function addFolderRaw(parentId, name, color) {
  const m = items();
  const id = newId("f");
  put(id, {type:"folder", name, parentId: parentId || null, color: color || FOLDER_COLORS[allFolders(m).length % FOLDER_COLORS.length], created: Date.now()});
  return id;
}
function addFolder(parentId) {
  const id = addFolderRaw(parentId, parentId ? "New subfolder" : "New folder");
  menuFor = null; renaming = id; selFolder = id; renderLib();
}
function deleteFolder(id) {
  const m = items();
  const ids = descendants(m, id);
  const undo = [];
  for (const [nid, n] of entries(m, "note")) if (ids.includes(n.folderId)) { undo.push([nid, n]); put(nid, null); if (nid === curNote) { dirty = false; closeNote(); } }
  ids.forEach(fid => { undo.push([fid, m.get(fid)]); put(fid, null); });
  if (ids.includes(selFolder)) selFolder = "all";
  confirmDel = null; menuFor = null; renderLib();
  toast("Folder deleted", "Undo", () => { undo.forEach(([k, v]) => put(k, v)); onData(); });
}
function lastStyle() { try { const s = {...DEFAULT_STYLE, ...JSON.parse(lsGet("petal-style") || "{}")}; return validItem({type:"note", ...s}) ? {paper: PATTERN_IDS.has(s.paper) ? s.paper : "lined", color: PAPERS[s.color] ? s.color : "milk", border: BORDER_IDS.has(s.border) ? s.border : "none", font: FONT[s.font] ? s.font : "patrick"} : {...DEFAULT_STYLE}; } catch { return {...DEFAULT_STYLE}; } }
function newNote() {
  commitNote();
  const m = items();
  let fid = selFolder !== "all" && m.get(selFolder) ? selFolder : null;
  if (!fid) { const f = entries(m, "folder")[0]; fid = f ? f[0] : addFolderRaw(null, "My notes"); }
  const id = newId("n"), now = Date.now();
  put(id, {type:"note", folderId:fid, title:"", html:"", ...lastStyle(), created:now, updated:now});
  query = ""; renderLib(); openNote(id); titleIn.focus();
}

function seedStarter() {
  const now = Date.now();
  const j = addFolderRaw(null, "Journal", "#b8c7e8");
  const oct = addFolderRaw(j, "This month", "#f1c6a8");
  const s = addFolderRaw(null, "Study", "#c9d8b6");
  addFolderRaw(null, "Ideas", "#f2d58a");
  const box = on => `<span class="chk" contenteditable="false" data-on="${on}"></span>&nbsp;`;
  put(newId("n"), {type:"note", folderId:j, title:"Welcome to Dandelune", paper:"lined", color:"sky", border:"stars", font:"patrick", created:now, updated:now+2,
    html:`<h2>Hello, little notebook ${stkHTML("dandelion")}</h2><div>This is a sample page. Tap anywhere on the paper and start writing.</div><h3>Things to try</h3>`+
      `<div>${box(1)}Open <b>Page</b> to switch between lined, blank, grid and dotted paper</div>`+
      `<div>${box(0)}Pick a border, like stars, lace or washi tape</div>`+
      `<div>${box(0)}Tap <b>Stickers</b> to drop doodles while you type ${stkHTML("strawberry")}${stkHTML("frog")}</div>`+
      `<div>${box(0)}Draw your own sticker with <b>Make a sticker</b> ${stkHTML("pencil","s")}</div>`+
      `<div>${box(0)}Select some words and try a new writing style under <b>Style</b></div>`+
      `<div><br></div><div><span style="font-family: 'Caveat', cursive; font-size: x-large; color: rgb(79, 96, 166);">make a wish, write it down</span> ${stkHTML("moon")}</div>`+
      `<div>You can delete these sample pages anytime.</div>`});
  put(newId("n"), {type:"note", folderId:oct, title:"Cozy Sunday", paper:"dots", color:"butter", border:"washi", font:"caveat", created:now, updated:now+1,
    html:`<h2>Sunday list ${stkHTML("sun")}</h2><ul><li>slow morning with tea ${stkHTML("coffee","s")}</li><li>long walk, look at the leaves ${stkHTML("leaf","s")}</li><li>write three good things about this week</li></ul><div><br></div><h3>Three good things</h3><div>1.&nbsp;</div><div>2.&nbsp;</div><div>3.&nbsp;</div>`});
  put(newId("n"), {type:"note", folderId:s, title:"Study plan", paper:"grid", color:"mint", border:"stitch", font:"fredoka", created:now, updated:now,
    html:`<h2>This week ${stkHTML("book")}</h2><h3>Monday</h3><div>${box(0)}Read one chapter</div><div>${box(0)}Make 10 flashcards</div><h3>Wednesday</h3><div>${box(0)}Practice questions</div><div>${box(0)}Review mistakes ${stkHTML("star","s")}</div>`});
  selFolder = j; renderLib();
}

/* ================= editor ================= */
function applyPage(n) {
  const p = PAPERS[n.color] || PAPERS.milk;
  const f = FONT[n.font] || FONT.patrick;
  paper.dataset.pattern = PATTERN_IDS.has(n.paper) ? n.paper : "lined";
  paper.style.setProperty("--pbg", p.bg);
  paper.style.setProperty("--pink-ink", p.ink);
  paper.style.setProperty("--pline", p.line);
  paper.style.setProperty("--pline-strong", p.line.replace(/[\d.]+\)$/, ".9)"));
  paper.style.setProperty("--pdot", p.line.replace(/[\d.]+\)$/, ".8)"));
  paper.style.setProperty("--pmargin", p.margin);
  paper.style.setProperty("--pacc", p.acc);
  ed.style.fontFamily = f.css;
  ed.style.fontSize = (19 * f.scale).toFixed(1) + "px";
  setFrame(frame, BORDER_IDS.has(n.border) ? n.border : "none", p.acc);
}
function setFrame(fr, b, acc) {
  fr.dataset.b = b;
  const t = tileSVG(b, acc);
  if (t) { const u = `url("${uri(t)}")`; fr.classList.add("tiles"); fr.style.backgroundImage = [u,u,u,u].join(","); }
  else { fr.classList.remove("tiles"); fr.style.backgroundImage = ""; }
}
function fillMoveTo(m, n) {
  const sel = $("#moveTo"); sel.replaceChildren();
  const seen = new Set();
  const walk = (pid, d) => entries(m, "folder").filter(([id, f]) => (f.parentId || null) === pid && !seen.has(id)).sort((a, b) => (a[1].created||0) - (b[1].created||0)).forEach(([id, f]) => {
    seen.add(id);
    const o = el("option", {value:id}); o.textContent = "  ".repeat(d) + f.name; if (id === n.folderId) o.selected = true; sel.append(o); walk(id, d + 1);
  });
  walk(null, 0);
}
function openNote(id) {
  if (curNote && curNote !== id) commitNote();
  const m = items(), n = m.get(id); if (!n) return;
  curNote = id; dirty = false;
  ed.innerHTML = sanitize(n.html); titleIn.value = n.title || "";
  applyPage(n); fillMoveTo(m, n); closePanel();
  $("#edEmpty").hidden = true; $("#edWrap").hidden = false;
  app.dataset.view = "editor"; $("#edPane").scrollTop = 0;
  renderNotes(); armDelete(false);
}
function closeNote() {
  curNote = null; dirty = false; closePanel();
  $("#edWrap").hidden = true; $("#edEmpty").hidden = false;
  app.dataset.view = "library"; renderNotes();
}
function markDirty() { dirty = true; clearTimeout(saveTimer); saveTimer = setTimeout(commitNote, 700); }
function commitNote(patch) {
  clearTimeout(saveTimer);
  if (!curNote) return;
  const n = items().get(curNote); if (!n) return;
  if (!dirty && !patch) return;
  const next = {...n, title: titleIn.value.trim().slice(0, 120), html: sanitize(ed.innerHTML), updated: Date.now(), ...(patch || {})};
  dirty = false; put(curNote, next); renderNotes();
}
function setStyle(patch) {
  const n = items().get(curNote); if (!n) return;
  const merged = {...n, ...patch};
  applyPage(merged);
  lsSet("petal-style", JSON.stringify({paper:merged.paper, color:merged.color, border:merged.border, font:merged.font}));
  commitNote(patch); renderPanel();
}

let savedRange = null;
document.addEventListener("selectionchange", () => {
  const s = getSelection();
  if (s.rangeCount && ed.contains(s.anchorNode)) { savedRange = s.getRangeAt(0).cloneRange(); updateStates(); }
});
function restore() {
  ed.focus({preventScroll:true});
  const s = getSelection();
  if (savedRange && ed.contains(savedRange.startContainer)) { s.removeAllRanges(); s.addRange(savedRange); }
  else { const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); s.removeAllRanges(); s.addRange(r); }
}
function exec(cmd, val) {
  restore();
  try { document.execCommand("styleWithCSS", false, true); } catch {}
  document.execCommand(cmd, false, val);
  markDirty(); updateStates();
}
function hasSelection() { return savedRange && !savedRange.collapsed && ed.contains(savedRange.commonAncestorContainer); }
function updateStates() {
  ["bold","italic","underline"].forEach(c => { const b = $(`[data-cmd="${c}"]`); try { b.setAttribute("aria-pressed", String(document.queryCommandState(c))); } catch {} });
}

ed.addEventListener("input", markDirty);
titleIn.addEventListener("input", markDirty);
titleIn.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); ed.focus(); } });
ed.addEventListener("blur", () => { if (dirty) commitNote(); });
// Paste and drop come in as plain text only, so nothing outside can sneak into a page.
ed.addEventListener("paste", e => {
  e.preventDefault();
  const t = (e.clipboardData || window.clipboardData).getData("text/plain");
  document.execCommand("insertText", false, t);
});
ed.addEventListener("dragover", e => e.preventDefault());
ed.addEventListener("drop", e => {
  e.preventDefault();
  const t = e.dataTransfer && e.dataTransfer.getData("text/plain");
  if (t) document.execCommand("insertText", false, t);
});
ed.addEventListener("click", e => {
  const c = e.target.closest(".chk");
  if (c) { c.dataset.on = c.dataset.on === "1" ? "0" : "1"; markDirty(); }
});
try { document.execCommand("defaultParagraphSeparator", false, "div"); } catch {}
document.addEventListener("visibilitychange", () => { if (document.hidden) { commitNote(); saveNow(); } });
window.addEventListener("pagehide", () => { commitNote(); saveNow(); });

$("#back").addEventListener("click", () => { commitNote(); closeNote(); });
$("#moveTo").addEventListener("change", e => { commitNote({folderId: e.target.value}); renderLib(); });
let armTimer = null;
function armDelete(on) {
  const b = $("#delNote"); clearTimeout(armTimer);
  b.dataset.armed = on ? "1" : "0"; b.textContent = on ? "Tap again to delete" : "Delete page";
  if (on) armTimer = setTimeout(() => armDelete(false), 3500);
}
$("#delNote").addEventListener("click", () => {
  const b = $("#delNote");
  if (b.dataset.armed !== "1") { armDelete(true); return; }
  commitNote();
  const id = curNote, copy = items().get(id);
  armDelete(false); dirty = false; closeNote(); put(id, null); renderLib();
  toast("Page deleted", "Undo", () => { put(id, copy); onData(); openNote(id); });
});

/* ================= toolbar + option panels ================= */
const tb = $("#tb");
["pointerdown","mousedown"].forEach(t => tb.addEventListener(t, e => { if (e.target.closest("button")) e.preventDefault(); }));
tb.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.panel) { if (openPanel === b.dataset.panel) closePanel(); else { openPanel = b.dataset.panel; stkEdit = false; renderPanel(); } return; }
  closePanel();
  const c = b.dataset.cmd;
  if (c === "bold" || c === "italic" || c === "underline") exec(c);
  else if (c === "h2" || c === "h3") {
    restore(); let cur = ""; try { cur = (document.queryCommandValue("formatBlock") || "").toLowerCase(); } catch {}
    exec("formatBlock", cur === c ? "<div>" : `<${c}>`);
  }
  else if (c === "list") exec("insertUnorderedList");
  else if (c === "check") exec("insertHTML", `<span class="chk" contenteditable="false" data-on="0"></span>&nbsp;`);
});
["pointerdown","mousedown"].forEach(t => panel.addEventListener(t, e => { if (e.target.closest("button[data-keep]")) e.preventDefault(); }));

// The panel closes when you tap Done, tap the same button again, tap the paper, press Escape,
// or after you pick a font, colour, size or sticker.
function closePanel() { openPanel = null; stkEdit = false; panel.hidden = true; panel.replaceChildren(); tb.querySelectorAll("[data-panel]").forEach(b => b.setAttribute("aria-pressed","false")); }
paper.addEventListener("pointerdown", () => { if (openPanel) closePanel(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && openPanel && !$(".modal")) closePanel(); });
const pick = fn => () => { fn(); closePanel(); };

function renderPanel() {
  if (!openPanel || !curNote) return;
  tb.querySelectorAll("[data-panel]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.panel === openPanel)));
  const n = items().get(curNote) || {};
  const keepScroll = panel.scrollTop;
  panel.replaceChildren(); panel.hidden = false;
  const btn = (props, ...kids) => el("button", {type:"button", "data-keep":"1", ...props}, ...kids);
  const head = title => el("div", {class:"p-head"}, el("h3", {text:title}), btn({class:"p-done", onclick: closePanel, "aria-label":"Close options"}, "Done ✕"));
  if (openPanel === "style") {
    panel.append(head("Writing style"), el("p", {class:"hint", text: "Select words to restyle just them. With nothing selected, it changes the whole page."}));
    const chips = el("div", {class:"chips"});
    FONTS.forEach(f => chips.append(btn({class:"chip", style:`font-family:${f.css}`, "aria-pressed": String(n.font === f.id), onclick: pick(() => {
      if (hasSelection()) exec("fontName", f.css); else setStyle({font:f.id});
    })}, f.name)));
    const sizes = el("div", {class:"chips"});
    [["Small","2"],["Normal","4"],["Big","5"],["Huge","6"]].forEach(([l, v]) => sizes.append(btn({class:"chip sm", onclick: pick(() => exec("fontSize", v))}, l)));
    panel.append(chips, el("h3", {text:"Size"}), sizes);
  }
  else if (openPanel === "color") {
    const inks = el("div", {class:"chips"});
    INKS.forEach(c => inks.append(btn({class:"ink", style:`background:${c}`, "aria-label":`Ink ${c}`, onclick: pick(() => exec("foreColor", c))})));
    const hl = el("div", {class:"chips"});
    HILITES.forEach(c => hl.append(btn({class:"ink", style:`background:${c}`, "aria-label":`Highlighter ${c}`, onclick: pick(() => exec("hiliteColor", c))})));
    hl.append(btn({class:"ink none", "aria-label":"Remove highlight", onclick: pick(() => exec("hiliteColor", "transparent"))}));
    panel.append(head("Ink"), inks, el("h3", {text:"Highlighter"}), hl, el("p", {class:"hint", style:"margin:0", text:"Select words first, or pick a colour and keep typing."}));
  }
  else if (openPanel === "sticker") {
    const mine = entries(items(), "sticker").sort((a, b) => (b[1].created || 0) - (a[1].created || 0));
    const myGrid = el("div", {class:"stk-grid"});
    myGrid.append(btn({class:"stk-btn make", "aria-label":"Make a sticker", onclick: () => openMaker()}, el("span", {}, el("b", {text:"+"}), "Make")));
    mine.forEach(([id, s]) => {
      const tile = btn({class:"stk-btn", title:s.name, "aria-label": stkEdit ? `Delete ${s.name}` : `Add ${s.name} sticker`, onclick: () => {
        if (stkEdit) { const copy = s; put(id, null); renderPanel(); toast("Sticker deleted", "Undo", () => { put(id, copy); renderPanel(); }); return; }
        exec("insertHTML", `<img class="stk stk-${stkSize}" src="${s.src}" alt="" draggable="false">&nbsp;`); closePanel();
      }}, el("img", {src:s.src, alt:""}));
      if (stkEdit) tile.append(el("span", {class:"x", "aria-hidden":"true", text:"✕"}));
      myGrid.append(tile);
    });
    const myHead = el("div", {class:"stk-sec"}, el("h3", {text:"My stickers"}),
      mine.length ? btn({class:"chip sm", "aria-pressed": String(stkEdit), onclick: () => { stkEdit = !stkEdit; renderPanel(); }}, stkEdit ? "Done editing" : "Edit") : null);
    const sizes = el("div", {class:"chips"});
    [["Small","s"],["Medium","m"],["Large","l"]].forEach(([l, v]) => sizes.append(btn({class:"chip sm", "aria-pressed": String(stkSize === v), onclick: () => { stkSize = v; renderPanel(); }}, l)));
    const grid = el("div", {class:"stk-grid"});
    STICKERS.forEach(s => grid.append(btn({class:"stk-btn", title:s.name, "aria-label":`Add ${s.name} sticker`, onclick: pick(() => exec("insertHTML", stkHTML(s.id, stkSize) + "&nbsp;"))},
      el("img", {src:uri(s.svg), alt:""}))));
    panel.append(head("Stickers"), el("p", {class:"hint", text: stkEdit ? "Tap a sticker to delete it. Pages already using it keep their copy." : "Tap one to drop it where your cursor is. Backspace removes it."}),
      el("h3", {text:"Sticker size"}), sizes, myHead, myGrid, el("h3", {text:"Doodles"}), grid);
  }
  else if (openPanel === "page") {
    const p = PAPERS[n.color] || PAPERS.milk;
    const pats = el("div", {class:"opt-grid"});
    PATTERNS.forEach(([v, l]) => { const mini = el("span", {class:"mini", "data-pattern":v}); mini.style.setProperty("--pbg", p.bg); mini.style.setProperty("--pline", p.line);
      pats.append(btn({class:"opt", "aria-pressed": String(n.paper === v), onclick: () => setStyle({paper:v})}, mini, l)); });
    const cols = el("div", {class:"chips"});
    Object.entries(PAPERS).forEach(([k, v]) => cols.append(btn({class:"psw", style:`background:${v.bg}`, title:v.name, "aria-label":`${v.name} paper`, "aria-pressed": String(n.color === k), onclick: () => setStyle({color:k})})));
    const bords = el("div", {class:"opt-grid"});
    BORDERS.forEach(([v, l]) => {
      const fr = el("span", {class:"frame"}); setFrame(fr, v, p.acc); fr.style.setProperty("--pacc", p.acc);
      bords.append(btn({class:"opt", "aria-pressed": String((n.border || "none") === v), onclick: () => setStyle({border:v})}, el("span", {class:"bprev", style:`background:${p.bg}`}, fr), l));
    });
    panel.append(head("Paper"), pats, el("h3", {text:"Paper colour"}), cols, el("h3", {text:"Border"}), bords);
  }
  panel.scrollTop = keepScroll;
}

/* ================= sticker maker ================= */
const PENS = ["#4b3546","#ff7a93","#ffb6d5","#ffd86b","#f1a07a","#9fd89a","#8fd3ff","#c9b6ff","#d9a77a","#ffffff"];
function openMaker() {
  const caret = savedRange ? savedRange.cloneRange() : null;
  closePanel();
  const S = 512;
  const cv = el("canvas", {width:String(S), height:String(S), "aria-label":"Drawing pad"});
  const cx = cv.getContext("2d", {willReadFrequently:true});
  cx.lineCap = "round"; cx.lineJoin = "round";
  let color = PENS[0], size = 16, erase = false, drawing = false, last = null;
  const undo = [];
  const pushUndo = () => { undo.push(cx.getImageData(0, 0, S, S)); if (undo.length > 25) undo.shift(); };
  const pos = e => { const r = cv.getBoundingClientRect(); return {x:(e.clientX - r.left) * S / r.width, y:(e.clientY - r.top) * S / r.height}; };
  const stroke = (a, b) => {
    cx.globalCompositeOperation = erase ? "destination-out" : "source-over";
    cx.strokeStyle = color; cx.fillStyle = color; cx.lineWidth = size;
    if (a.x === b.x && a.y === b.y) { cx.beginPath(); cx.arc(a.x, a.y, size / 2, 0, Math.PI * 2); cx.fill(); }
    else { cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); }
    cx.globalCompositeOperation = "source-over";
  };
  cv.addEventListener("pointerdown", e => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch {} pushUndo(); drawing = true; last = pos(e); stroke(last, last); });
  cv.addEventListener("pointermove", e => { if (!drawing) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; for (const ev of (evs.length ? evs : [e])) { const p = pos(ev); stroke(last, p); last = p; } });
  const end = () => { drawing = false; last = null; };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);

  const penRow = el("div", {class:"tools"});
  const drawPens = () => { penRow.replaceChildren(...PENS.map(c => el("button", {class:"pen", type:"button", style:`background:${c}`, "aria-label":`Pen colour ${c}`, "aria-pressed": String(!erase && color === c),
    onclick: () => { color = c; erase = false; drawPens(); drawTools(); }}))); };
  const toolRow = el("div", {class:"tools"});
  const drawTools = () => {
    toolRow.replaceChildren(
      ...[["Thin",8],["Medium",16],["Thick",30]].map(([l, v]) => el("button", {class:"tool", type:"button", "aria-label":`${l} brush`, "aria-pressed": String(size === v), onclick: () => { size = v; drawTools(); }},
        el("span", {class:"dot", style:`width:${Math.max(4, v / 3)}px;height:${Math.max(4, v / 3)}px`}))),
      el("button", {class:"tool", type:"button", "aria-pressed": String(erase), text:"Eraser", onclick: () => { erase = !erase; drawPens(); drawTools(); }}),
      el("button", {class:"tool", type:"button", text:"Undo", onclick: () => { const d = undo.pop(); if (d) cx.putImageData(d, 0, 0); }}),
      el("button", {class:"tool", type:"button", text:"Clear", onclick: () => { pushUndo(); cx.clearRect(0, 0, S, S); }}));
  };
  drawPens(); drawTools();

  const photoIn = el("input", {type:"file", accept:"image/*", hidden:""});
  photoIn.addEventListener("change", () => {
    const f = photoIn.files && photoIn.files[0]; photoIn.value = "";
    if (!f || !/^image\//.test(f.type)) { if (f) toast("Pick a picture file"); return; }
    if (f.size > 25_000_000) { toast("That picture is too big"); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      pushUndo();
      const k = Math.min(S / img.naturalWidth, S / img.naturalHeight);
      const w = img.naturalWidth * k, h = img.naturalHeight * k;
      cx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast("That picture couldn't be opened"); };
    img.src = url;
  });
  const edgeBox = el("input", {type:"checkbox", id:"edge"}); edgeBox.checked = true;
  const nameIn = el("input", {type:"text", maxlength:"40", placeholder:"Sticker name (optional)", "aria-label":"Sticker name", autocomplete:"off"});

  const close = () => { modal.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  const save = () => {
    const src = exportSticker(cv, edgeBox.checked);
    if (!src) { toast("Draw something first"); return; }
    if (src.length > MAX_IMG) { toast("That sticker is too detailed. Try a simpler drawing."); return; }
    const id = newId("s");
    const name = nameIn.value.trim() || "My sticker";
    put(id, {type:"sticker", name, src, created: Date.now()});
    close();
    if (caret) savedRange = caret;
    exec("insertHTML", `<img class="stk stk-${stkSize}" src="${src}" alt="" draggable="false">&nbsp;`);
    toast("Sticker saved. Find it under Stickers › My stickers");
  };
  const modal = el("div", {class:"modal", role:"dialog", "aria-modal":"true", "aria-label":"Make a sticker", onclick: e => { if (e.target === modal) close(); }},
    el("div", {class:"sheet"},
      el("div", {class:"sheet-head"}, el("h2", {text:"Make a sticker"}), el("button", {class:"p-done", type:"button", text:"Close ✕", onclick: close})),
      el("div", {class:"pad"}, cv),
      el("p", {class:"lbl", text:"Pen"}), penRow, toolRow,
      el("div", {class:"tools"}, el("button", {class:"tool", type:"button", text:"Use a photo", onclick: () => photoIn.click()}), photoIn,
        el("label", {class:"check-row", for:"edge"}, edgeBox, "White sticker edge")),
      nameIn,
      el("div", {class:"row"}, el("button", {class:"big alt", type:"button", text:"Cancel", onclick: close}), el("button", {class:"big", type:"button", text:"Save sticker", onclick: save}))));
  document.body.append(modal);
}
// Trim empty space, add an optional white edge, shrink to a small PNG.
function exportSticker(cv, edge) {
  const S = cv.width, cx = cv.getContext("2d", {willReadFrequently:true});
  const d = cx.getImageData(0, 0, S, S).data;
  let x0 = S, y0 = S, x1 = -1, y1 = -1;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (d[(y * S + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return null;
  const R = edge ? 12 : 0, pad = R + 4;
  const w = x1 - x0 + 1 + pad * 2, h = y1 - y0 + 1 + pad * 2;
  const crop = document.createElement("canvas"); crop.width = w; crop.height = h;
  const c2 = crop.getContext("2d");
  if (edge) {
    const sil = document.createElement("canvas"); sil.width = w; sil.height = h;
    const s2 = sil.getContext("2d");
    s2.drawImage(cv, x0, y0, x1 - x0 + 1, y1 - y0 + 1, pad, pad, x1 - x0 + 1, y1 - y0 + 1);
    s2.globalCompositeOperation = "source-in"; s2.fillStyle = "#ffffff"; s2.fillRect(0, 0, w, h);
    c2.shadowColor = "rgba(40,40,60,.25)"; c2.shadowBlur = 4;
    for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; c2.drawImage(sil, Math.cos(t) * R, Math.sin(t) * R); }
    c2.shadowColor = "transparent";
  }
  c2.drawImage(cv, x0, y0, x1 - x0 + 1, y1 - y0 + 1, pad, pad, x1 - x0 + 1, y1 - y0 + 1);
  const M = 220, k = Math.min(1, M / Math.max(w, h));
  const out = document.createElement("canvas"); out.width = Math.max(1, Math.round(w * k)); out.height = Math.max(1, Math.round(h * k));
  const o = out.getContext("2d"); o.imageSmoothingQuality = "high"; o.drawImage(crop, 0, 0, out.width, out.height);
  return out.toDataURL("image/png");
}

/* art */
$("#logo").src = uri(STK.dandelion.svg);
$("#emptyArt").src = uri(STK.letter.svg);
$("#tbStk").src = uri(STK.star.svg);
document.body.append(restoreIn);

renderLib(); setStatus(); initStore();

})();
