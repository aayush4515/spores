import pptxgen from "pptxgenjs";
import fs from "fs";

const pptx = new pptxgen();

// ── Design tokens ──
const BG       = "F5F4F0";
const BG_CARD  = "FDFCFA";
const TEXT      = "2C2C28";
const TEXT_SOFT = "5C5A54";
const MUTED     = "7A7870";
const GREEN     = "5C7D5F";
const GREEN_S   = "E3EBE4";
const GREEN_D   = "4D6B50";
const BLUE      = "6B87A2";
const BLUE_S    = "E4ECF4";
const AMBER     = "C4A574";
const AMBER_S   = "F5EBE0";
const ROSE      = "B87A7A";
const ROSE_S    = "F3E8E8";

const FONT_H = "Plus Jakarta Sans";
const FONT_B = "Be Vietnam Pro";

pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "Spore Team";
pptx.title = "Spore — Hackathon Pitch";

function bg(slide) {
  slide.background = { color: BG };
}

function slideNum(slide, n, total) {
  slide.addText(`${n} / ${total}`, {
    x: 11.8, y: 7.0, w: 1.3, h: 0.3,
    fontSize: 9, fontFace: FONT_B, color: MUTED, align: "right",
  });
}

const TOTAL = 6;

// ══════════════════════════════════════════
// SLIDE 1 — TITLE
// ══════════════════════════════════════════
const s1 = pptx.addSlide();
bg(s1);
slideNum(s1, 1, TOTAL);

// Green logo square
s1.addShape(pptx.ShapeType.roundRect, {
  x: 5.9, y: 1.2, w: 0.85, h: 0.85,
  fill: { color: GREEN }, rectRadius: 0.15,
});
s1.addText("🌿", {
  x: 5.9, y: 1.22, w: 0.85, h: 0.85,
  fontSize: 28, align: "center", valign: "middle",
});

s1.addText("Spore", {
  x: 1, y: 2.3, w: 11.33, h: 1.2,
  fontSize: 60, fontFace: FONT_H, bold: true, color: GREEN_D,
  align: "center", letterSpacing: -2,
});

s1.addText("Small circles. Steady support.", {
  x: 1, y: 3.5, w: 11.33, h: 0.7,
  fontSize: 24, fontFace: FONT_H, color: TEXT_SOFT, align: "center",
});

s1.addText("A private, calm companion for the people you trust.", {
  x: 2.5, y: 4.3, w: 8.33, h: 0.5,
  fontSize: 14, fontFace: FONT_B, color: MUTED, align: "center",
});

s1.addText("TEAM NAME  ·  HACKATHON 2026", {
  x: 2.5, y: 5.5, w: 8.33, h: 0.4,
  fontSize: 11, fontFace: FONT_B, bold: true, color: MUTED,
  align: "center", charSpacing: 3,
});

// ══════════════════════════════════════════
// SLIDE 2 — PROBLEM
// ══════════════════════════════════════════
const s2 = pptx.addSlide();
bg(s2);
slideNum(s2, 2, TOTAL);

s2.addText("THE PROBLEM", {
  x: 0.8, y: 0.6, w: 4, h: 0.3,
  fontSize: 10, fontFace: FONT_B, bold: true, color: GREEN, charSpacing: 4,
});

s2.addText("We're bad at noticing.", {
  x: 0.8, y: 1.1, w: 11, h: 0.9,
  fontSize: 40, fontFace: FONT_H, bold: true, color: TEXT,
});

const problems = [
  { icon: "⚠️", text: "60% of people wouldn't know if a close friend was struggling" },
  { icon: "📢", text: "Group chats are noisy. Social media is public. Therapy apps are clinical." },
  { icon: "🔍", text: "No tool exists for small, private circles to gently care for each other" },
];

problems.forEach((p, i) => {
  const y = 2.4 + i * 0.75;
  s2.addText(`${p.icon}  ${p.text}`, {
    x: 1.0, y, w: 10.5, h: 0.6,
    fontSize: 16, fontFace: FONT_B, color: TEXT_SOFT, valign: "middle",
  });
});

// Gap callout
s2.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 4.8, w: 9, h: 0.95,
  fill: { color: GREEN_S }, rectRadius: 0.12,
  line: { color: GREEN, width: 0.5, dashType: "solid" },
});
s2.addShape(pptx.ShapeType.rect, {
  x: 0.8, y: 4.8, w: 0.08, h: 0.95,
  fill: { color: GREEN },
});
s2.addText("The gap: intelligent, calm support between \"I'm fine\" and \"I need help\"", {
  x: 1.15, y: 4.82, w: 8.5, h: 0.9,
  fontSize: 15, fontFace: FONT_B, bold: true, color: TEXT, valign: "middle",
});

// ══════════════════════════════════════════
// SLIDE 3 — SOLUTION
// ══════════════════════════════════════════
const s3 = pptx.addSlide();
bg(s3);
slideNum(s3, 3, TOTAL);

s3.addText("OUR SOLUTION", {
  x: 0.8, y: 0.6, w: 4, h: 0.3,
  fontSize: 10, fontFace: FONT_B, bold: true, color: GREEN, charSpacing: 4,
});

s3.addText("What Spore does", {
  x: 0.8, y: 1.1, w: 11, h: 0.8,
  fontSize: 36, fontFace: FONT_H, bold: true, color: TEXT,
});

const cards = [
  {
    title: "Gentle check-ins",
    body: "Soft mood signals — Good, Okay, Not great.\nNot forced daily logs or journals.",
    emoji: "🙂",
    bg: GREEN_S, accent: GREEN_D,
  },
  {
    title: "Activity intelligence",
    body: "Behavioral patterns surface quiet struggles.\nPrivacy-safe: \"inactive today\" — never raw data.",
    emoji: "📊",
    bg: BLUE_S, accent: BLUE,
  },
  {
    title: "Smart prompts",
    body: "\"Neel has been inactive and missed check-ins\"\n— with one-tap care actions.",
    emoji: "✨",
    bg: AMBER_S, accent: AMBER,
  },
];

cards.forEach((c, i) => {
  const x = 0.8 + i * 4.0;
  const y = 2.3;
  const w = 3.65;
  const h = 3.2;

  // Card bg
  s3.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: BG_CARD },
    shadow: { type: "outer", blur: 8, offset: 2, color: "2C2C28", opacity: 0.04 },
    rectRadius: 0.15,
    line: { color: "EBEBEB", width: 0.5 },
  });

  // Icon circle
  s3.addShape(pptx.ShapeType.roundRect, {
    x: x + 0.3, y: y + 0.35, w: 0.6, h: 0.6,
    fill: { color: c.bg }, rectRadius: 0.1,
  });
  s3.addText(c.emoji, {
    x: x + 0.3, y: y + 0.35, w: 0.6, h: 0.6,
    fontSize: 20, align: "center", valign: "middle",
  });

  // Title
  s3.addText(c.title, {
    x: x + 0.3, y: y + 1.15, w: w - 0.6, h: 0.4,
    fontSize: 15, fontFace: FONT_H, bold: true, color: TEXT,
  });

  // Body
  s3.addText(c.body, {
    x: x + 0.3, y: y + 1.6, w: w - 0.6, h: 1.3,
    fontSize: 12.5, fontFace: FONT_B, color: TEXT_SOFT, lineSpacingMultiple: 1.35,
  });
});

s3.addText("Spore notices what group chats can't.", {
  x: 0.8, y: 5.9, w: 11, h: 0.5,
  fontSize: 15, fontFace: FONT_B, bold: true, color: GREEN_D,
});

// ══════════════════════════════════════════
// SLIDE 4 — TECH + UX
// ══════════════════════════════════════════
const s4 = pptx.addSlide();
bg(s4);
slideNum(s4, 4, TOTAL);

s4.addText("UNDER THE HOOD", {
  x: 0.8, y: 0.6, w: 4, h: 0.3,
  fontSize: 10, fontFace: FONT_B, bold: true, color: GREEN, charSpacing: 4,
});

s4.addText("Tech + Design", {
  x: 0.8, y: 1.1, w: 11, h: 0.8,
  fontSize: 36, fontFace: FONT_H, bold: true, color: TEXT,
});

// Left col header
s4.addText("TECHNICAL ARCHITECTURE", {
  x: 0.8, y: 2.2, w: 5.5, h: 0.3,
  fontSize: 9, fontFace: FONT_B, bold: true, color: GREEN, charSpacing: 3,
});

const techItems = [
  "5-factor health scoring — check-in × activity × signals × recency × engagement",
  "4-tier support severity with automatic activity-based escalation",
  "Privacy layer — all raw data becomes qualitative labels only",
];

techItems.forEach((t, i) => {
  s4.addText(`●  ${t}`, {
    x: 1.0, y: 2.7 + i * 0.65, w: 5.5, h: 0.55,
    fontSize: 13, fontFace: FONT_B, color: TEXT_SOFT, valign: "top",
    lineSpacingMultiple: 1.3,
  });
});

s4.addText("React 18  ·  Vite  ·  Context API  ·  Hand-crafted CSS design system", {
  x: 1.0, y: 4.8, w: 5.5, h: 0.35,
  fontSize: 10, fontFace: FONT_B, color: MUTED,
});

// Right col header
s4.addText("UX PRINCIPLES", {
  x: 7.0, y: 2.2, w: 5.5, h: 0.3,
  fontSize: 9, fontFace: FONT_B, bold: true, color: BLUE, charSpacing: 3,
});

const uxItems = [
  { label: "Calm > Urgent", desc: "No red alerts, no notification counts" },
  { label: "Qualitative > Quantitative", desc: "\"Growing warmth\" not \"50/100\"" },
  { label: "Optional > Mandatory", desc: "Every prompt says \"at your pace\"" },
];

uxItems.forEach((u, i) => {
  const y = 2.7 + i * 0.85;
  s4.addText(u.label, {
    x: 7.2, y, w: 5.3, h: 0.3,
    fontSize: 14, fontFace: FONT_B, bold: true, color: TEXT,
  });
  s4.addText(u.desc, {
    x: 7.2, y: y + 0.3, w: 5.3, h: 0.3,
    fontSize: 12, fontFace: FONT_B, color: TEXT_SOFT,
  });
});

// ══════════════════════════════════════════
// SLIDE 5 — BUSINESS + ROADMAP
// ══════════════════════════════════════════
const s5 = pptx.addSlide();
bg(s5);
slideNum(s5, 5, TOTAL);

s5.addText("WHERE THIS GOES", {
  x: 0.8, y: 0.6, w: 4, h: 0.3,
  fontSize: 10, fontFace: FONT_B, bold: true, color: GREEN, charSpacing: 4,
});

s5.addText("Impact + Roadmap", {
  x: 0.8, y: 1.1, w: 11, h: 0.8,
  fontSize: 36, fontFace: FONT_H, bold: true, color: TEXT,
});

s5.addText(
  "Target:  Families with aging parents, close friend groups, caregiving circles, university wellness\n" +
  "Gap:  Nothing sits between Life360 (surveillance) and group chats (chaos)",
  {
    x: 0.8, y: 2.1, w: 11, h: 0.9,
    fontSize: 13, fontFace: FONT_B, color: TEXT_SOFT, lineSpacingMultiple: 1.45,
  }
);

// V1 card
s5.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 3.3, w: 5.6, h: 3.2,
  fill: { color: BG_CARD }, rectRadius: 0.15,
  shadow: { type: "outer", blur: 6, offset: 2, color: "2C2C28", opacity: 0.04 },
  line: { color: "EBEBEB", width: 0.5 },
});

// V1 badge
s5.addShape(pptx.ShapeType.roundRect, {
  x: 3.05, y: 3.55, w: 0.5, h: 0.3,
  fill: { color: GREEN_S }, rectRadius: 0.12,
});
s5.addText("V1", {
  x: 3.05, y: 3.55, w: 0.5, h: 0.3,
  fontSize: 9, fontFace: FONT_B, bold: true, color: GREEN_D, align: "center", valign: "middle",
});

s5.addText("Go to market", {
  x: 1.15, y: 3.5, w: 2, h: 0.4,
  fontSize: 14, fontFace: FONT_H, bold: true, color: TEXT,
});

const v1Items = [
  "End-to-end encrypted cloud sync",
  "Push notifications for support prompts",
  "Wearable / phone sensor integration (with consent)",
  "Onboarding + invite flow",
];

v1Items.forEach((item, i) => {
  s5.addShape(pptx.ShapeType.ellipse, {
    x: 1.35, y: 4.22 + i * 0.5, w: 0.1, h: 0.1,
    fill: { color: GREEN },
  });
  s5.addText(item, {
    x: 1.6, y: 4.08 + i * 0.5, w: 4.5, h: 0.4,
    fontSize: 12.5, fontFace: FONT_B, color: TEXT_SOFT, valign: "middle",
  });
});

// V2 card
s5.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 3.3, w: 5.6, h: 3.2,
  fill: { color: BG_CARD }, rectRadius: 0.15,
  shadow: { type: "outer", blur: 6, offset: 2, color: "2C2C28", opacity: 0.04 },
  line: { color: "EBEBEB", width: 0.5 },
});

// V2 badge
s5.addShape(pptx.ShapeType.roundRect, {
  x: 9.65, y: 3.55, w: 0.5, h: 0.3,
  fill: { color: BLUE_S }, rectRadius: 0.12,
});
s5.addText("V2", {
  x: 9.65, y: 3.55, w: 0.5, h: 0.3,
  fontSize: 9, fontFace: FONT_B, bold: true, color: BLUE, align: "center", valign: "middle",
});

s5.addText("Future vision", {
  x: 7.25, y: 3.5, w: 2.5, h: 0.4,
  fontSize: 14, fontFace: FONT_H, bold: true, color: TEXT,
});

const v2Items = [
  "AI-personalized prompt timing and tone",
  "Spore health trends over weeks",
  "Crisis escalation to emergency contacts",
  "Community templates (grief, elder care, new parents)",
];

v2Items.forEach((item, i) => {
  s5.addShape(pptx.ShapeType.ellipse, {
    x: 7.45, y: 4.22 + i * 0.5, w: 0.1, h: 0.1,
    fill: { color: BLUE },
  });
  s5.addText(item, {
    x: 7.7, y: 4.08 + i * 0.5, w: 4.5, h: 0.4,
    fontSize: 12.5, fontFace: FONT_B, color: TEXT_SOFT, valign: "middle",
  });
});

// ══════════════════════════════════════════
// SLIDE 6 — CLOSE
// ══════════════════════════════════════════
const s6 = pptx.addSlide();
bg(s6);
slideNum(s6, 6, TOTAL);

// Logo
s6.addShape(pptx.ShapeType.roundRect, {
  x: 5.9, y: 1.5, w: 0.85, h: 0.85,
  fill: { color: GREEN }, rectRadius: 0.15,
});
s6.addText("🌿", {
  x: 5.9, y: 1.52, w: 0.85, h: 0.85,
  fontSize: 28, align: "center", valign: "middle",
});

s6.addText("\"Not every app needs to be\nloud to be useful.\"", {
  x: 1.5, y: 2.8, w: 10.33, h: 1.4,
  fontSize: 32, fontFace: FONT_H, italic: true, color: TEXT_SOFT,
  align: "center", lineSpacingMultiple: 1.3,
});

s6.addText("▶  Let us show you.", {
  x: 1.5, y: 4.5, w: 10.33, h: 0.5,
  fontSize: 16, fontFace: FONT_B, bold: true, color: GREEN, align: "center",
});

s6.addText("TEAM NAME  ·  CONTACT  ·  GITHUB.COM/YOUR-REPO", {
  x: 1.5, y: 5.8, w: 10.33, h: 0.4,
  fontSize: 10, fontFace: FONT_B, color: MUTED,
  align: "center", charSpacing: 2,
});

// ── Write file ──
const outPath = "Spore-Pitch.pptx";
await pptx.writeFile({ fileName: outPath });
console.log(`✅ Created ${outPath}`);
