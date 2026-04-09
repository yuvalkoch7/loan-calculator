import { useState } from "react";

export default function App() {
  const [loan, setLoan] = useState(300000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const [monthly, setMonthly] = useState(null);
  const [total, setTotal] = useState(null);
  const [interest, setInterest] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const WEBHOOK = "https://hook.eu1.make.com/u8vaclr33g6j7uyyvcg17khqhtdlb6fc";

  const format = (n) =>
    new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(n);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;

    const m = (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const t = m * n;

    setMonthly(m);
    setTotal(t);
    setInterest(t - loan);
  };

  const sendLead = async () => {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, loan }),
    });

    window.open(
      "https://wa.me/972501234567?text=שלום אני רוצה הצעה להלוואה",
      "_blank"
    );
  };

  const interestPercent = total ? Math.round((interest / total) * 100) : 0;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>💸 מחשבון הלוואה חכם</h1>

        {/* סליידרים */}
        <Slider
          label="סכום הלוואה"
          value={loan}
          setValue={setLoan}
          min={50000}
          max={3000000}
          step={1000}
        />
        <Slider
          label="ריבית (%)"
          value={rate}
          setValue={setRate}
          min={1}
          max={12}
          step={0.1}
        />
        <Slider
          label="שנים"
          value={years}
          setValue={setYears}
          min={1}
          max={30}
        />

        <button style={styles.button} onClick={calculate}>
          חשב עכשיו
        </button>

        {monthly && (
          <>
            <div style={styles.mainResult}>
              {format(monthly)}
              <span> לחודש</span>
            </div>

            {/* בר ריבית */}
            <div style={styles.bar}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${interestPercent}%`,
                }}
              />
            </div>
            <p style={{ fontSize: 13 }}>
              {interestPercent}% מהתשלום הוא ריבית 😳
            </p>

            <div style={styles.results}>
              <Box label="סה״כ תשלום" value={format(total)} />
              <Box label="ריבית" value={format(interest)} />
            </div>
          </>
        )}

        {/* לידים */}
        <div style={styles.leadBox}>
          <h3>🔥 אפשר לחסוך לך אלפי שקלים</h3>

          <input
            style={styles.input}
            placeholder="שם"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="טלפון"
            onChange={(e) => setPhone(e.target.value)}
          />

          <button style={styles.cta} onClick={sendLead}>
            קבל הצעה משתלמת 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, setValue, min, max, step }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ fontSize: 14 }}>
        {label}: {value.toLocaleString()}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function Box({ label, value }) {
  return (
    <div style={styles.resultBox}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#020617,#0f172a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
    color: "white",
    direction: "rtl",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    padding: 25,
    borderRadius: 20,
    width: 360,
  },

  title: {
    textAlign: "center",
    marginBottom: 15,
  },

  button: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#22c55e",
    color: "white",
    marginTop: 10,
  },

  mainResult: {
    textAlign: "center",
    fontSize: 28,
    marginTop: 15,
  },

  bar: {
    height: 8,
    background: "#1e293b",
    borderRadius: 10,
    marginTop: 10,
  },

  barFill: {
    height: "100%",
    background: "#ef4444",
    borderRadius: 10,
  },

  results: {
    marginTop: 15,
    display: "flex",
    justifyContent: "space-between",
  },

  resultBox: {
    background: "#1e293b",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },

  leadBox: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  input: {
    padding: 10,
    borderRadius: 10,
    border: "none",
  },

  cta: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#3b82f6",
    color: "white",
  },
};
