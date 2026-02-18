import "./pokecard.css";
import { useState, useEffect } from "react";

// Type colour map
const typeColors = {
  fire:     { bg: "#ff6b35", light: "#ffb347", dark: "#8a2500" },
  water:    { bg: "#4a90d9", light: "#7ec8e3", dark: "#1a3d6e" },
  grass:    { bg: "#56ab2f", light: "#a8e063", dark: "#1e5c00" },
  electric: { bg: "#f7c948", light: "#ffe87c", dark: "#7a5f00" },
  psychic:  { bg: "#c94098", light: "#e87cc3", dark: "#6a0040" },
  ice:      { bg: "#74d7e8", light: "#b3ecf7", dark: "#1a6070" },
  dragon:   { bg: "#5b5de8", light: "#9898f0", dark: "#1a1a80" },
  dark:     { bg: "#3d2b1f", light: "#7a5c4a", dark: "#180e08" },
  fairy:    { bg: "#e87cc3", light: "#f7b3dc", dark: "#7a1860" },
  fighting: { bg: "#c03028", light: "#e05848", dark: "#6a0800" },
  poison:   { bg: "#9a4dc8", light: "#c380e8", dark: "#4a0878" },
  ground:   { bg: "#d4a038", light: "#e8c870", dark: "#6a4800" },
  rock:     { bg: "#b8a038", light: "#d4c070", dark: "#584800" },
  bug:      { bg: "#8db82a", light: "#bee050", dark: "#3a5800" },
  ghost:    { bg: "#5c3d82", light: "#9a70c0", dark: "#200a40" },
  steel:    { bg: "#8888a0", light: "#b8b8d0", dark: "#303050" },
  flying:   { bg: "#6898d8", light: "#98c0f0", dark: "#203870" },
  normal:   { bg: "#a8a878", light: "#d0d0a8", dark: "#484830" },
};

const getColors = (types) => {
  const primary = types?.[0]?.type?.name;
  return typeColors[primary] || typeColors.normal;
};

function StatBar({ name, value }) {
  const [width, setWidth] = useState(0);
  const pct = Math.min((value / 255) * 100, 100);
  const shortNames = {
    hp: "HP", attack: "ATK", defense: "DEF",
    "special-attack": "SpA", "special-defense": "SpD", speed: "SPD",
  };
  const short = shortNames[name] || name.slice(0, 3).toUpperCase();
  const barColor = value > 100 ? "#4ade80" : value > 60 ? "#facc15" : "#f87171";

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="stat-row">
      <span className="stat-name">{short}</span>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{
            width: `${width}%`,
            background: barColor,
            boxShadow: `0 0 6px ${barColor}`,
          }}
        />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function Pokecard({ pokemonda, index }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  const colors = getColors(pokemonda.types);
  const typeNames = pokemonda.types.map((t) => t.type.name);
  const imgSrc =
    pokemonda.sprites?.other?.dream_world?.front_default ||
    pokemonda.sprites?.other?.["official-artwork"]?.front_default ||
    pokemonda.sprites?.front_default;

  return (
    <div
      className="card-wrapper"
      style={{ animationDelay: `${(index % 20) * 0.045}s` }}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`card-inner ${flipped ? "flipped" : ""} ${hovered ? "hovered" : ""}`}>

        {/* ===== FRONT FACE ===== */}
        <div
          className="card-face card-front"
          style={{
            background: `linear-gradient(145deg, ${colors.dark} 0%, ${colors.bg} 55%, ${colors.light} 100%)`,
            boxShadow: hovered
              ? `0 24px 60px ${colors.bg}99, 0 0 0 1px ${colors.light}44`
              : `0 8px 28px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Decorative blobs */}
          <div className="card-blob card-blob--tl" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="card-blob card-blob--br" style={{ background: "rgba(0,0,0,0.15)" }} />

          {/* Top row */}
          <div className="card-top-row">
            <span className="card-id">#{String(pokemonda.id).padStart(3, "0")}</span>
            <div className="type-badges">
              {typeNames.map((t) => (
                <span key={t} className="type-badge">{t}</span>
              ))}
            </div>
          </div>

          {/* Pokemon image */}
          <div className="card-image-area">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={pokemonda.name}
                className={`card-img ${hovered ? "card-img--hovered" : ""}`}
                style={{ filter: `drop-shadow(0 0 14px ${colors.light})` }}
              />
            ) : (
              <span className="card-img-missing">?</span>
            )}
          </div>

          {/* Name */}
          <div className="card-name-area">
            <h2 className="card-name">{pokemonda.name}</h2>
          </div>

          {/* Stats row on front */}
          <div className="card-quick-stats">
            <div className="quick-stat">
              <span className="qs-label">HT</span>
              <span className="qs-value">{pokemonda.height / 10}m</span>
            </div>
            <div className="qs-divider" />
            <div className="quick-stat">
              <span className="qs-label">WT</span>
              <span className="qs-value">{pokemonda.weight / 10}kg</span>
            </div>
            <div className="qs-divider" />
            <div className="quick-stat">
              <span className="qs-label">SPD</span>
              <span
                className="qs-value"
                style={{ color: pokemonda.stats[5].base_stat > 70 ? "#f87171" : "#4ade80" }}
              >
                {pokemonda.stats[5].base_stat}
              </span>
            </div>
          </div>

          <p className="flip-hint">Tap to see stats →</p>
        </div>

        {/* ===== BACK FACE ===== */}
        <div
          className="card-face card-back"
          style={{
            background: `linear-gradient(145deg, #0b0c1a 0%, #12142a 60%, ${colors.dark} 100%)`,
            boxShadow: `0 8px 28px rgba(0,0,0,0.6), 0 0 0 1px ${colors.bg}44`,
          }}
        >
          {/* Header */}
          <div className="back-header">
            <h2 className="back-name" style={{ color: colors.light }}>{pokemonda.name}</h2>
            <span className="back-id" style={{ color: colors.bg }}>#{String(pokemonda.id).padStart(3, "0")}</span>
          </div>

          {/* Image small */}
          <div className="back-img-area">
            {imgSrc && (
              <img
                src={imgSrc}
                alt={pokemonda.name}
                className="back-img"
                style={{ filter: `drop-shadow(0 0 8px ${colors.bg})` }}
              />
            )}
          </div>

          {/* Stat bars */}
          <div className="back-stats" style={{ borderColor: `${colors.bg}33` }}>
            {pokemonda.stats.map((s) => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </div>

          {/* Extra info */}
          <div className="back-info" style={{ borderColor: `${colors.bg}33` }}>
            <div className="info-cell">
              <span className="info-label">EXP</span>
              <span className="info-val" style={{ color: colors.light }}>{pokemonda.base_experience}</span>
            </div>
            <div className="info-cell">
              <span className="info-label">ATK</span>
              <span className="info-val" style={{ color: colors.light }}>{pokemonda.stats[1].base_stat}</span>
            </div>
            <div className="info-cell">
              <span className="info-label">ABL</span>
              <span className="info-val" style={{ color: colors.light }}>{pokemonda.abilities[0]?.ability?.name}</span>
            </div>
          </div>

          <p className="flip-hint">Tap to flip back ←</p>
        </div>
      </div>
    </div>
  );
}

export default Pokecard;