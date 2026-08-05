"use client";

import { useEffect, useState } from "react";

type Language = "ja" | "en";

const repository = "https://github.com/sunveda/codex-meetup-tokyo-2026-08-07-fri";
const topic = `${repository}/tree/main/topic-1-codex-for-everyone`;
const pdf = `${repository}/blob/main/topic-1-codex-for-everyone/codex-for-everyone-bilingual.pdf`;
const pptx = `${repository}/blob/main/topic-1-codex-for-everyone/codex-for-everyone-bilingual.pptx`;

const copy = {
  ja: {
    selected: "LT登壇決定",
    eyebrow: "CODEX MEETUP TOKYO #2 · 5分LT",
    title: "Codexはエンジニアだけのものじゃない",
    lead: "会場からテーマをひとつもらい、自然な言葉でCodexに指示。完成を待つ間に、5人のための10の成果を5分で紹介します。",
    viewPdf: "PDFを見る",
    downloadPptx: "PowerPoint",
    source: "GitHubで見る",
    date: "2026年8月7日（金）",
    venue: "Mercari · 六本木",
    duration: "5分間",
    peopleKicker: "5 PEOPLE × 2 OUTCOMES",
    peopleTitle: "5人、10の成果。",
    peopleLead: "コードから始める必要はありません。欲しい結果から始めます。",
    genieKicker: "ONE LAST IDEA",
    genieTitle: "AIは、何度でも願いをかなえる。",
    genieBody: "でも、AIは私たちの心を読めません。欲しい結果、背景、条件を明確に伝えるほど、結果は良くなります。",
    genieLine: "願いの明確さが、結果を決める。",
    communityKicker: "LEARN AI NOW",
    communityTitle: "一緒に学び、一緒に教える。",
    communityBody: "今こそAI｜Learn AI Nowは、誰でも参加できるLINEオープンチャットです。技術者でない方も歓迎します。",
    anyone: "誰でも参加できます",
    scan: "LINEでスキャン",
    madeBy: "Sarveshwar Singh · SunVeda Technologies",
  },
  en: {
    selected: "SELECTED FOR LT",
    eyebrow: "CODEX MEETUP TOKYO #2 · 5-MINUTE LT",
    title: "Codex Isn’t Just for Engineers",
    lead: "The audience gives me one topic. I give Codex one plain-language command. While it builds, I show ten useful outcomes for five kinds of people—all in five minutes.",
    viewPdf: "View PDF",
    downloadPptx: "PowerPoint",
    source: "View on GitHub",
    date: "August 7, 2026 · Friday",
    venue: "Mercari · Roppongi",
    duration: "5 minutes",
    peopleKicker: "5 PEOPLE × 2 OUTCOMES",
    peopleTitle: "Five people. Ten outcomes.",
    peopleLead: "You do not need to begin with code. Begin with the result you want.",
    genieKicker: "ONE LAST IDEA",
    genieTitle: "AI can grant unlimited wishes.",
    genieBody: "But AI cannot read our minds. The clearer we are about the result, context, and constraints, the better the result becomes.",
    genieLine: "Clearer wish → Better result.",
    communityKicker: "LEARN AI NOW",
    communityTitle: "Learn together. Teach together.",
    communityBody: "今こそAI｜Learn AI Now is a LINE OpenChat that anyone can join. People who do not call themselves technical are especially welcome.",
    anyone: "Anyone can join",
    scan: "Scan with LINE",
    madeBy: "Sarveshwar Singh · SunVeda Technologies",
  },
};

const people = [
  { icon: "01", ja: "店主", en: "Owner", jaOut: "メニュー · サイト", enOut: "Menu · Site" },
  { icon: "02", ja: "先生", en: "Teacher", jaOut: "授業 · クイズ", enOut: "Lesson · Quiz" },
  { icon: "03", ja: "分析する人", en: "Analyst", jaOut: "表 · 判断", enOut: "Sheet · Decision" },
  { icon: "04", ja: "クリエイター", en: "Creator", jaOut: "ビジュアル · 計画", enOut: "Visual · Plan" },
  { icon: "05", ja: "主催者", en: "Organizer", jaOut: "イベント · 仲間", enOut: "Event · Community" },
];

export default function Home() {
  const [language, setLanguage] = useState<Language>("ja");
  const text = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="https://sunveda.tech">
          SUNVEDA TECHNOLOGIES
        </a>
        <div className="navActions">
          <div className="languageSwitch" aria-label="Language selector">
            <button type="button" className={language === "ja" ? "active" : ""} aria-pressed={language === "ja"} onClick={() => setLanguage("ja")}>日本語</button>
            <button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
          </div>
          <a className="navLink" href="https://luma.com/p9kfepcf" target="_blank" rel="noreferrer">Event ↗</a>
        </div>
      </nav>

      <section className="hero" aria-labelledby="page-title">
        <div className="heroCopy">
          <div className="status"><span />{text.selected}</div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 id="page-title">{text.title}</h1>
          <p className="heroLead">{text.lead}</p>
          <div className="actions">
            <a className="primaryAction" href={pdf} target="_blank" rel="noreferrer">{text.viewPdf} ↗</a>
            <a className="secondaryAction" href={pptx} target="_blank" rel="noreferrer">{text.downloadPptx} ↗</a>
            <a className="textAction" href={topic} target="_blank" rel="noreferrer">{text.source} ↗</a>
          </div>
        </div>
        <figure className="heroVisual">
          <img src="/mercari-stage-augmented.png" alt="Augmented Codex Meetup stage at Mercari with presenter Sarveshwar Singh" />
        </figure>
      </section>

      <section className="eventStrip" aria-label="Event details">
        <strong>{text.date}</strong><strong>{text.venue}</strong><strong>{text.duration}</strong>
      </section>

      <section className="peopleSection" aria-labelledby="people-title">
        <header className="sectionHeading">
          <p>{text.peopleKicker}</p>
          <h2 id="people-title">{text.peopleTitle}</h2>
          <span>{text.peopleLead}</span>
        </header>
        <div className="peopleGrid">
          {people.map((person) => (
            <article className="personCard" key={person.icon}>
              <span className="personNumber">{person.icon}</span>
              <h3>{language === "ja" ? person.ja : person.en}</h3>
              <p>{language === "ja" ? person.en : person.ja}</p>
              <strong>{language === "ja" ? person.jaOut : person.enOut}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="genieSection" aria-labelledby="genie-title">
        <img src="/ai-genie-unlimited-wishes.png" alt="A luminous digital genie emerging from a laptop" />
        <div className="genieCopy">
          <p className="sectionKicker">{text.genieKicker}</p>
          <h2 id="genie-title">{text.genieTitle}</h2>
          <p>{text.genieBody}</p>
          <strong>{text.genieLine}</strong>
        </div>
      </section>

      <section className="communitySection" aria-labelledby="community-title">
        <div>
          <p className="sectionKicker">{text.communityKicker}</p>
          <h2 id="community-title">{text.communityTitle}</h2>
          <p>{text.communityBody}</p>
          <span className="anyoneBadge">{text.anyone}</span>
        </div>
        <figure className="qrCard">
          <img src="/line-openchat-qr.jpeg" alt="LINE OpenChat QR code for 今こそAI Learn AI Now" />
          <figcaption><strong>今こそAI｜Learn AI Now</strong><span>{text.scan}</span></figcaption>
        </figure>
      </section>

      <footer>
        <p>{text.madeBy}</p>
        <div>
          <a href={repository} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://sunveda.tech">sunveda.tech ↗</a>
        </div>
      </footer>
    </main>
  );
}
