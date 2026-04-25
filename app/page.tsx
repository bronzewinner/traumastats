"use client";
import React, { useEffect, useMemo, useState } from "react";

type Entry = {
  id: number;
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  gold: number;
  wards: number;
  mitigated: number;
  healing: number;
  structure: number;
  minion: number;
};

export default function Page() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({
    game: "",
    name: "",
    kills: "",
    deaths: "",
    assists: "",
    damage: "",
    gold: "",
    wards: "",
    mitigated: "",
    healing: "",
    structure: "",
    minion: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("traumastats_entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("traumastats_entries", JSON.stringify(entries));
  }, [entries]);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const saveEntry = () => {
    if (!form.name.trim()) return;

    const newEntry: Entry = {
      id: Date.now(),
      name: form.name.trim(),
      kills: Number(form.kills) || 0,
      deaths: Number(form.deaths) || 0,
      assists: Number(form.assists) || 0,
      damage: Number(form.damage) || 0,
      gold: Number(form.gold) || 0,
      wards: Number(form.wards) || 0,
      mitigated: Number(form.mitigated) || 0,
      healing: Number(form.healing) || 0,
      structure: Number(form.structure) || 0,
      minion: Number(form.minion) || 0,
    };

    setEntries([newEntry, ...entries]);

    setForm({
      game: "",
      name: "",
      kills: "",
      deaths: "",
      assists: "",
      damage: "",
      gold: "",
      wards: "",
      mitigated: "",
      healing: "",
      structure: "",
      minion: "",
    });
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };
  const profiles = useMemo(() => {
    const map: any = {};

    entries.forEach((e) => {
      if (!map[e.name]) {
        map[e.name] = {
          name: e.name,
          games: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
          damage: 0,
        };
      }

      map[e.name].games += 1;
      map[e.name].kills += e.kills;
      map[e.name].deaths += e.deaths;
      map[e.name].assists += e.assists;
      map[e.name].damage += e.damage;
    });

    return Object.values(map)
      .map((p: any) => ({
        ...p,
        avgDamage: Math.round(p.damage / p.games || 0),
      }))
      .sort((a: any, b: any) => b.avgDamage - a.avgDamage);
  }, [entries]);

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <h1 style={styles.logo}>⚡ TraumaStats</h1>
        <p style={styles.small}>History + Profiles</p>
      </aside>

      <section style={styles.content}>
        <h2 style={styles.title}>Full Game Mode</h2>
<div style={styles.panel}>
  <h3 style={{ marginTop: 0 }}>📸 Screenshot Import</h3>
  <p style={{ opacity: 0.75, marginBottom: "12px" }}>
    Upload your Smite scoreboard screenshot to import stats faster.
  </p>

  <input
    type="file"
    accept="image/*"
    style={styles.input}
  />

  <button style={{ ...styles.button, marginTop: "12px" }}>
    Import Screenshot
  </button>
</div>

<div style={styles.panel}>
  <div style={styles.form}>
    <input
      style={styles.input}
      placeholder="Game Number"
      value={form.game || ""}
      onChange={(e) => update("game", e.target.value)}
    />

    <input
      style={styles.input}
      placeholder="Winner (Green / Red)"
      value={form.winner || ""}
      onChange={(e) => update("winner", e.target.value)}
    />
  </div>

  <h3 style={{ margin: "12px 0" }}>Enter Player Stats</h3>

  <div style={styles.form}>
    <input style={styles.input} placeholder="Player Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
    <input style={styles.input} placeholder="Kills" value={form.kills} onChange={(e) => update("kills", e.target.value)} />
    <input style={styles.input} placeholder="Deaths" value={form.deaths} onChange={(e) => update("deaths", e.target.value)} />
    <input style={styles.input} placeholder="Assists" value={form.assists} onChange={(e) => update("assists", e.target.value)} />
    <input style={styles.input} placeholder="Damage" value={form.damage} onChange={(e) => update("damage", e.target.value)} />
    <input style={styles.input} placeholder="Gold" value={form.gold} onChange={(e) => update("gold", e.target.value)} />
    <button style={styles.button} onClick={saveEntry}>Add Player</button>
  </div>
</div>
        <h2 style={styles.title}>Player Profiles</h2>
        <div style={styles.panel}>
          {profiles.map((p: any, i: number) => (
            <div key={p.name} style={styles.row}>
              <span style={styles.rank}>#{i + 1}</span>
              <span style={{ flex: 1 }}>{p.name}</span>
              <span>{p.games} GP</span>
              <span>{p.avgDamage.toLocaleString()} Avg Dmg</span>
              <span>{p.kills}/{p.deaths}/{p.assists}</span>
            </div>
          ))}
        </div>
        <h2 style={styles.title}>Match History</h2>
        <div style={styles.panel}>
          {entries.map((e) => (
            <div key={e.id} style={styles.row}>
              <span style={{ flex: 1 }}>{e.name}</span>
              <span>{e.kills}/{e.deaths}/{e.assists}</span>
              <span>{e.damage.toLocaleString()} dmg</span>
              <button style={styles.deleteBtn} onClick={() => deleteEntry(e.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
const styles: any = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#020617,#0f172a,#111827)",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "220px",
    padding: "24px",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
  },
  logo: { fontSize: "28px", fontWeight: "bold", color: "#8b5cf6" },
  small: { opacity: 0.7, marginTop: "6px" },
  content: { flex: 1, padding: "30px" },
  title: { fontSize: "28px", margin: "18px 0 12px" },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#111827",
    color: "white",
  },
  button: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#7c3aed",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteBtn: {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "none",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
  panel: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "18px",
  },
  row: {
    display: "flex",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    alignItems: "center",
    flexWrap: "wrap",
  },
  rank: {
    width: "40px",
    color: "#8b5cf6",
    fontWeight: "bold",
  },
};
