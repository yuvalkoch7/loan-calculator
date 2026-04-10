import { useState } from "react";
import "./styles.css";

export default function App() {
  const [loan, setLoan] = useState("200,000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");

  const [monthly, setMonthly] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [interest, setInterest] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const formatNumber = (value: string) => {
    const num = value.replace(/,/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("en-US");
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/,/g, ""));
  };

  const calculate = () => {
    const L = parseNumber(loan);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;

    const m = (L * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const t = m * n;

    setMonthly(m);
    setTotal(t);
    setInterest(t - L);
  };

  const sendLead = async () => {
    const data = {
      name,
      phone,
      loan,
      rate,
      years,
      date: new Date().toLocaleString(),
    };

    await fetch("https://hook.eu1.make.com/u8vaclr33g6j7uyyvcg17khqhtdlb6fc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const message = `🔥 ליד חדש!
שם: ${name}
טלפון: ${phone}
סכום: ${loan}`;

    window.open(
      `https://wa.me/972501234567?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="container" dir="rtl">
      <h1>💸 מחשבון הלוואות חכם</h1>

      <div className="card">
        <label>סכום הלוואה</label>
        <input
          value={loan}
          onChange={(e) => setLoan(formatNumber(e.target.value))}
        />

        <label>ריבית שנתית (%)</label>
        <input value={rate} onChange={(e) => setRate(e.target.value)} />

        <label>משך הלוואה (שנים)</label>
        <input value={years} onChange={(e) => setYears(e.target.value)} />

        <button onClick={calculate}>חשב עכשיו</button>
      </div>

      {monthly && (
        <div className="results">
          <div className="result-box">
            <span className="label">תשלום חודשי</span>
            <strong className="value">
              ₪{Math.round(monthly).toLocaleString()}
            </strong>
          </div>

          <div className="result-box">
            <span className="label">סה״כ תשלומים</span>
            <strong className="value">
              ₪{Math.round(total!).toLocaleString()}
            </strong>
          </div>

          <div className="result-box highlight">
            <span className="label">ריבית שתשלם</span>
            <strong className="value">
              ₪{Math.round(interest!).toLocaleString()}
            </strong>
          </div>
        </div>
      )}

      <div className="lead-box">
        <h2>🔥 אפשר לחסוך לך אלפי שקלים</h2>

        <p className="sub">מאות לקוחות כבר הורידו את ההחזר החודשי שלהם 💸</p>

        <p className="urgent">⏳ בדיקת זכאות חינם לזמן מוגבל</p>

        <input
          placeholder="שם מלא"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="טלפון"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="cta" onClick={sendLead}>
          🚀 שלח ונציג יחזור אליך בהקדם
        </button>

        {name && phone && (
          <div className="success">✔ פרטיך מוכנים – לחץ לשליחה</div>
        )}
      </div>
    </div>
  );
}
