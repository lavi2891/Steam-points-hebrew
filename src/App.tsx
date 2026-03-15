import { useMemo, useState } from "react";
import { STEAM_POINTS_CSV } from "./data/steamPointsCsv";
import { groupTriggers, parseTriggerCsv } from "./lib/csv";
import {
  calculateScore,
  getItemKey,
  getSteamLevel,
  getTopTriggers,
  renderStarRating,
  renderSteamIcons,
} from "./lib/scoring";
import { buildShareText, shareResult } from "./lib/share";

export default function App() {
  const items = useMemo(() => parseTriggerCsv(STEAM_POINTS_CSV), []);
  const groups = useMemo(() => groupTriggers(items), [items]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [shareState, setShareState] = useState<"" | "copied" | "shared">("");

  const score = useMemo(() => calculateScore(items, selectedKeys), [items, selectedKeys]);
  const level = useMemo(() => getSteamLevel(score), [score]);
  const topTriggers = useMemo(() => getTopTriggers(items, selectedKeys), [items, selectedKeys]);
  const shareText = useMemo(
    () =>
      buildShareText({
        score,
        level,
        topTriggers,
        url: typeof window !== "undefined" ? window.location.href : "https://example.com",
      }),
    [level, score, topTriggers],
  );

  function toggleItem(key: string) {
    setSelectedKeys((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  function resetSelection() {
    setSelectedKeys(new Set());
    setShareState("");
  }

  function exportCsv() {
    const blob = new Blob([STEAM_POINTS_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "steam-points-hebrew.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    const status = await shareResult(
      shareText,
      window.location.href,
      `הנק״ט שלי: ${score} נקודות קיטור`,
    );

    if (status === "copied" || status === "shared") {
      setShareState(status);
      window.setTimeout(() => setShareState(""), 2200);
    }
  }

  return (
    <main className="app-shell">
      <div className="page-glow page-glow-top" />
      <div className="page-glow page-glow-bottom" />

      <section className={`hero-card ${level.accentClass}`}>
        <div className="hero-copy">
          <span className="eyebrow">מחשבון קיטור אישי</span>
          <h1>מחשבון הארי המקטר</h1>
          <p>
            מסמנים מה באמת מדליק אתכם, מקבלים ניקוד קיטור, ומשתפים תוצאה שנראית טוב גם
            בוואטסאפ וגם בסטורי.
          </p>
          <a
            className="source-link"
            href="https://x.com/i/status/2033176544391184536"
            target="_blank"
            rel="noreferrer"
          >
            לציוץ שהדליק את הרעיון
          </a>
        </div>

        <div className="score-chip">
          <span className="score-chip-label">הניקוד שלך</span>
          <strong>{score}</strong>
          <span className="score-chip-title">
            {level.badge} {level.title}
          </span>
          <span className="score-chip-subtitle">{level.subtitle}</span>
        </div>
      </section>

      <section className="result-card">
        <div className="result-card-header">
          <div>
            <span className="eyebrow">כרטיס תוצאה</span>
            <h2>מוכן לצילום מסך</h2>
          </div>
          <div className="rating-block">
            <span>{renderStarRating(level.stars)}</span>
            <strong>{renderSteamIcons(level.stars)}</strong>
          </div>
        </div>

        <div className="result-grid">
          <article className="result-stat">
            <span>סה״כ נקודות קיטור</span>
            <strong>{score}</strong>
          </article>

          <article className="result-stat">
            <span>הדרגה שלך</span>
            <strong>{level.title}</strong>
          </article>

          <article className="result-stat result-stat-wide">
            <span>3 הטריגרים המובילים</span>
            <div className="trigger-list">
              {topTriggers.length ? (
                topTriggers.map((trigger) => (
                  <span key={trigger.item} className="trigger-pill">
                    {trigger.item}
                  </span>
                ))
              ) : (
                <span className="muted-text">עוד לא בחרת טריגרים.</span>
              )}
            </div>
          </article>
        </div>

        <div className="actions-row">
          <button type="button" className="primary-button" onClick={handleShare}>
            שתפו את התוצאה
          </button>
          <button type="button" className="secondary-button" onClick={exportCsv}>
            הורדת CSV
          </button>
          <button type="button" className="secondary-button" onClick={resetSelection}>
            איפוס
          </button>
          {shareState === "copied" ? <span className="feedback-badge">הטקסט הועתק ללוח</span> : null}
          {shareState === "shared" ? <span className="feedback-badge">השיתוף נפתח</span> : null}
        </div>

        <div className="share-preview">
          <pre>{shareText}</pre>
        </div>
      </section>

      <section className="form-section">
        <div className="form-header">
          <div>
            <span className="eyebrow">שאלון הטריגרים</span>
            <h2>בחרו את כל מה שרלוונטי</h2>
          </div>
          <p>הניקוד מתעדכן אוטומטית בכל בחירה.</p>
        </div>

        <div className="groups-grid">
          {groups.map((group) => (
            <article key={group.section} className="group-card">
              <header className="group-header">
                <h3>{group.section}</h3>
                <span>{group.items.length} סעיפים</span>
              </header>

              <div className="checkbox-list">
                {group.items.map((item) => {
                  const key = getItemKey(item);
                  const checked = selectedKeys.has(key);

                  return (
                    <label key={key} className={`checkbox-card ${checked ? "checkbox-card-selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(key)}
                      />
                      <div className="checkbox-copy">
                        <strong>{item.item}</strong>
                        <span>+{item.points} נק׳ קיטור</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
