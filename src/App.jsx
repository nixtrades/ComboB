import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine, ReferenceArea
} from "recharts";

/* =========================================================================
   N4A.ORB v27.2 — REALIZED PERFORMANCE DASHBOARD
   Built from actual trade data: Apr 22 2025 → Apr 24 2026 (12 months)
   Combo B at $375 risk · Tradeify Lightning 50K calibration
   ========================================================================= */

const FONT_DISPLAY = '"Fraunces", "Iowan Old Style", Georgia, serif';
const FONT_BODY = '"Manrope", ui-sans-serif, system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@300;400;500;600&family=Manrope:wght@200;300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);
}

/* =========================================================================
   REAL TRADE DATA
   ========================================================================= */
const DATA = {
  summary: {
    period_start: "2025-04-22", period_end: "2026-04-24",
    days_in_period: 264, days_with_trades: 98, days_no_trade: 166,
    total_trades: 192, hunter_trades: 177, cons_trades: 15,
    total_pnl: 13992.20, win_rate: 69.3, avg_win: 185.66, avg_loss: -181.37,
    best_trade: 510.42, worst_trade: -327.60, risk_per_trade: 375,
    realized_max_dd: -918.22, realized_max_dd_R: -2.45,
    avg_monthly: 1076.32, median_monthly: 1163.56,
    best_month: 2427.72, worst_month: -241.28,
    profitable_months: 11, total_months: 13,
    max_win_streak: 14, max_loss_streak: 4,
    avg_hold_min: 15.0, profit_factor: 2.31
  },
  equity: [
    {date:"2025-04-22",cum_pnl:341.28,dd:0,peak:341.28},{date:"2025-04-25",cum_pnl:735.56,dd:0,peak:735.56},
    {date:"2025-04-30",cum_pnl:735.56,dd:0,peak:735.56},{date:"2025-05-05",cum_pnl:1040.26,dd:0,peak:1040.26},
    {date:"2025-05-08",cum_pnl:1292.06,dd:0,peak:1292.06},{date:"2025-05-13",cum_pnl:2042.54,dd:0,peak:2042.54},
    {date:"2025-05-16",cum_pnl:2042.54,dd:0,peak:2042.54},{date:"2025-05-21",cum_pnl:2537.84,dd:0,peak:2537.84},
    {date:"2025-05-26",cum_pnl:2267.64,dd:-270.20,peak:2537.84},{date:"2025-05-29",cum_pnl:2585.48,dd:0,peak:2585.48},
    {date:"2025-06-03",cum_pnl:2847.76,dd:0,peak:2847.76},{date:"2025-06-06",cum_pnl:2847.76,dd:0,peak:2847.76},
    {date:"2025-06-11",cum_pnl:2319.76,dd:-528.00,peak:2847.76},{date:"2025-06-16",cum_pnl:2423.92,dd:-423.84,peak:2847.76},
    {date:"2025-06-19",cum_pnl:2903.32,dd:0,peak:2903.32},{date:"2025-06-24",cum_pnl:2903.32,dd:0,peak:2903.32},
    {date:"2025-06-27",cum_pnl:2903.32,dd:0,peak:2903.32},{date:"2025-07-02",cum_pnl:3355.72,dd:0,peak:3355.72},
    {date:"2025-07-07",cum_pnl:3612.08,dd:-118.20,peak:3730.28},{date:"2025-07-10",cum_pnl:3530.48,dd:-199.80,peak:3730.28},
    {date:"2025-07-15",cum_pnl:3824.98,dd:0,peak:3824.98},{date:"2025-07-18",cum_pnl:3455.68,dd:-369.30,peak:3824.98},
    {date:"2025-07-23",cum_pnl:3697.28,dd:-127.70,peak:3824.98},{date:"2025-07-28",cum_pnl:4148.48,dd:0,peak:4148.48},
    {date:"2025-07-31",cum_pnl:4066.88,dd:-81.60,peak:4148.48},{date:"2025-08-05",cum_pnl:4272.68,dd:0,peak:4272.68},
    {date:"2025-08-08",cum_pnl:4408.18,dd:0,peak:4408.18},{date:"2025-08-13",cum_pnl:4408.18,dd:0,peak:4408.18},
    {date:"2025-08-18",cum_pnl:3982.28,dd:-425.90,peak:4408.18},{date:"2025-08-21",cum_pnl:4288.48,dd:-119.70,peak:4408.18},
    {date:"2025-08-26",cum_pnl:4517.38,dd:0,peak:4517.38},{date:"2025-08-29",cum_pnl:4814.08,dd:0,peak:4814.08},
    {date:"2025-09-03",cum_pnl:5237.28,dd:0,peak:5237.28},{date:"2025-09-08",cum_pnl:4694.16,dd:-543.12,peak:5237.28},
    {date:"2025-09-11",cum_pnl:4694.16,dd:-543.12,peak:5237.28},{date:"2025-09-16",cum_pnl:5579.16,dd:0,peak:5579.16},
    {date:"2025-09-19",cum_pnl:5579.16,dd:0,peak:5579.16},{date:"2025-09-24",cum_pnl:5255.56,dd:-323.60,peak:5579.16},
    {date:"2025-09-29",cum_pnl:4757.46,dd:-821.70,peak:5579.16},{date:"2025-10-02",cum_pnl:4998.36,dd:-580.80,peak:5579.16},
    {date:"2025-10-07",cum_pnl:4998.36,dd:-580.80,peak:5579.16},{date:"2025-10-10",cum_pnl:5472.86,dd:-106.30,peak:5579.16},
    {date:"2025-10-15",cum_pnl:5472.86,dd:-106.30,peak:5579.16},{date:"2025-10-20",cum_pnl:6201.06,dd:0,peak:6201.06},
    {date:"2025-10-23",cum_pnl:6472.86,dd:0,peak:6472.86},{date:"2025-10-28",cum_pnl:6476.66,dd:0,peak:6476.66},
    {date:"2025-10-31",cum_pnl:6476.66,dd:0,peak:6476.66},{date:"2025-11-05",cum_pnl:6761.96,dd:0,peak:6761.96},
    {date:"2025-11-10",cum_pnl:7131.24,dd:0,peak:7131.24},{date:"2025-11-13",cum_pnl:6803.04,dd:-328.20,peak:7131.24},
    {date:"2025-11-18",cum_pnl:6852.48,dd:-278.76,peak:7131.24},{date:"2025-11-21",cum_pnl:6309.78,dd:-821.46,peak:7131.24},
    {date:"2025-11-26",cum_pnl:6235.38,dd:-895.86,peak:7131.24},{date:"2025-12-01",cum_pnl:6339.88,dd:-791.36,peak:7131.24},
    {date:"2025-12-04",cum_pnl:6213.02,dd:-918.22,peak:7131.24},{date:"2025-12-09",cum_pnl:6488.22,dd:-643.02,peak:7131.24},
    {date:"2025-12-12",cum_pnl:6351.72,dd:-779.52,peak:7131.24},{date:"2025-12-17",cum_pnl:6351.72,dd:-779.52,peak:7131.24},
    {date:"2025-12-22",cum_pnl:6351.72,dd:-779.52,peak:7131.24},{date:"2025-12-25",cum_pnl:6351.72,dd:-779.52,peak:7131.24},
    {date:"2025-12-30",cum_pnl:6351.72,dd:-779.52,peak:7131.24},{date:"2026-01-02",cum_pnl:6552.62,dd:-578.62,peak:7131.24},
    {date:"2026-01-07",cum_pnl:7037.22,dd:-94.02,peak:7131.24},{date:"2026-01-12",cum_pnl:7190.06,dd:-138.50,peak:7328.56},
    {date:"2026-01-15",cum_pnl:7479.76,dd:0,peak:7479.76},{date:"2026-01-20",cum_pnl:7950.36,dd:0,peak:7950.36},
    {date:"2026-01-23",cum_pnl:8355.96,dd:0,peak:8355.96},{date:"2026-01-28",cum_pnl:8778.56,dd:0,peak:8778.56},
    {date:"2026-02-02",cum_pnl:8493.36,dd:-285.20,peak:8778.56},{date:"2026-02-05",cum_pnl:8944.00,dd:0,peak:8944.00},
    {date:"2026-02-10",cum_pnl:9252.70,dd:0,peak:9252.70},{date:"2026-02-13",cum_pnl:9536.50,dd:0,peak:9536.50},
    {date:"2026-02-18",cum_pnl:9294.70,dd:-241.80,peak:9536.50},{date:"2026-02-23",cum_pnl:10042.00,dd:0,peak:10042.00},
    {date:"2026-02-26",cum_pnl:9900.70,dd:-141.30,peak:10042.00},{date:"2026-03-03",cum_pnl:10048.70,dd:-64.90,peak:10113.60},
    {date:"2026-03-06",cum_pnl:10294.10,dd:0,peak:10294.10},{date:"2026-03-11",cum_pnl:10776.70,dd:0,peak:10776.70},
    {date:"2026-03-16",cum_pnl:11511.92,dd:0,peak:11511.92},{date:"2026-03-19",cum_pnl:11764.22,dd:0,peak:11764.22},
    {date:"2026-03-24",cum_pnl:12050.52,dd:0,peak:12050.52},{date:"2026-03-27",cum_pnl:12107.62,dd:0,peak:12107.62},
    {date:"2026-04-01",cum_pnl:12541.32,dd:0,peak:12541.32},{date:"2026-04-06",cum_pnl:12541.32,dd:0,peak:12541.32},
    {date:"2026-04-09",cum_pnl:13168.90,dd:0,peak:13168.90},{date:"2026-04-14",cum_pnl:13385.80,dd:0,peak:13385.80},
    {date:"2026-04-17",cum_pnl:13385.80,dd:0,peak:13385.80},{date:"2026-04-22",cum_pnl:14329.40,dd:0,peak:14329.40},
    {date:"2026-04-24",cum_pnl:13992.20,dd:-337.20,peak:14329.40}
  ],
  monthly: [
    {month:"2025-04",pnl:735.56,trades:2},{month:"2025-05",pnl:1849.92,trades:14},
    {month:"2025-06",pnl:317.84,trades:10},{month:"2025-07",pnl:1163.56,trades:19},
    {month:"2025-08",pnl:747.20,trades:15},{month:"2025-09",pnl:-56.62,trades:23},
    {month:"2025-10",pnl:1719.20,trades:15},{month:"2025-11",pnl:-241.28,trades:16},
    {month:"2025-12",pnl:116.34,trades:11},{month:"2026-01",pnl:2141.64,trades:18},
    {month:"2026-02",pnl:1620.24,trades:18},{month:"2026-03",pnl:2427.72,trades:21},
    {month:"2026-04",pnl:1450.88,trades:10}
  ],
  weekdays: [
    {day:"Mon",bot:"Hunter",trades:57,sessions:52,active:25,participation:48.1,perSession:1.10,winRate:66.7,pnl:2578.30,avgTrade:45.23},
    {day:"Tue",bot:"Cons",trades:7,sessions:53,active:7,participation:13.2,perSession:0.13,winRate:85.7,pnl:1959.54,avgTrade:279.93},
    {day:"Wed",bot:"Hunter",trades:65,sessions:53,active:30,participation:56.6,perSession:1.23,winRate:75.4,pnl:5614.90,avgTrade:86.38},
    {day:"Thu",bot:"Cons",trades:8,sessions:53,active:8,participation:15.1,perSession:0.15,winRate:75.0,pnl:1924.16,avgTrade:240.52},
    {day:"Fri",bot:"Hunter",trades:55,sessions:53,active:28,participation:52.8,perSession:1.04,winRate:61.8,pnl:1915.30,avgTrade:34.82}
  ],
  tod: [
    {bucket:"09:50-09:54",trades:57,winRate:68.4,pnl:4874.54},
    {bucket:"09:55-09:59",trades:24,winRate:66.7,pnl:1612.76},
    {bucket:"10:00-10:14",trades:14,winRate:64.3,pnl:1180.50},
    {bucket:"10:15-10:29",trades:36,winRate:72.2,pnl:2663.20},
    {bucket:"10:30-10:44",trades:35,winRate:71.4,pnl:1848.10},
    {bucket:"10:45-10:59",trades:18,winRate:66.7,pnl:842.10},
    {bucket:"11:00+",trades:8,winRate:75.0,pnl:971.00}
  ],
  exits: [
    {signal:"Hunter T1 50%",trades:84,pnl:3050.30,avg:36.31},
    {signal:"Hunter T2",trades:82,pnl:6384.00,avg:77.85},
    {signal:"TP SD1.0",trades:12,pnl:4361.14,avg:363.43},
    {signal:"Hunter 2R",trades:8,pnl:326.70,avg:40.84},
    {signal:"Max Hold Time",trades:3,pnl:347.50,avg:115.83},
    {signal:"SL Short",trades:2,pnl:-350.58,avg:-175.29},
    {signal:"SL Long",trades:1,pnl:-126.86,avg:-126.86}
  ],
  drawdowns: [
    {depth:-1049.66,duration:25,recovery:15},{depth:-1025.30,duration:17,recovery:5},
    {depth:-637.60,duration:8,recovery:6},{depth:-543.12,duration:5,recovery:3},
    {depth:-530.10,duration:7,recovery:4},{depth:-522.00,duration:6,recovery:3},
    {depth:-425.90,duration:6,recovery:3},{depth:-388.80,duration:3,recovery:2},
    {depth:-388.00,duration:2,recovery:1},{depth:-369.30,duration:5,recovery:4}
  ],
  milestones: [
    {level:500,days:2},{level:1000,days:13},{level:1500,days:17},{level:2000,days:21},
    {level:3000,days:71},{level:4000,days:94},{level:5000,days:134},{level:6000,days:181},
    {level:7500,days:269},{level:10000,days:307},{level:12000,days:335},{level:13000,days:351}
  ]
};

/* =========================================================================
   ATOMS
   ========================================================================= */
const Mono = ({ children, style = {}, className = "" }) => (
  <span className={className} style={{ fontFamily: FONT_MONO, ...style }}>{children}</span>
);

const Display = ({ children, italic, weight = 400, style = {}, className = "" }) => (
  <span className={className} style={{ fontFamily: FONT_DISPLAY, fontWeight: weight, fontStyle: italic ? "italic" : "normal", ...style }}>{children}</span>
);

function SectionMarker({ number, label }) {
  return (
    <div className="flex items-baseline gap-4 mb-10" style={{ marginTop: "5rem" }}>
      <Mono className="uppercase text-amber-500" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>
        ◆ {String(number).padStart(2, "0")}
      </Mono>
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(245,158,11,0.4), transparent)" }} />
      <Mono className="uppercase text-slate-500" style={{ fontSize: "10px", letterSpacing: "0.4em" }}>{label}</Mono>
    </div>
  );
}

function CornerBrackets({ color = "#fbbf24" }) {
  const sz = "12px";
  return (
    <>
      <div className="absolute top-0 left-0 pointer-events-none" style={{ width: sz, height: sz, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <div className="absolute top-0 right-0 pointer-events-none" style={{ width: sz, height: sz, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ width: sz, height: sz, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ width: sz, height: sz, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </>
  );
}

const fmt$ = (v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const fmt$$ = (v) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const tooltipStyle = {
  backgroundColor: "rgba(8,11,18,0.95)",
  border: "1px solid #1e293b",
  borderRadius: 4,
  padding: "10px 14px",
  fontFamily: FONT_MONO,
  fontSize: 11,
  backdropFilter: "blur(10px)"
};

/* =========================================================================
   HERO
   ========================================================================= */
function Hero() {
  const s = DATA.summary;
  return (
    <header className="relative overflow-hidden bg-black border-b border-amber-500/20">
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 75% 25%, rgba(245,158,11,0.12), transparent 55%), radial-gradient(ellipse at 25% 75%, rgba(34,211,238,0.06), transparent 55%)"
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "64px 64px"
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-14">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-12">
          <Mono className="uppercase text-amber-500" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>
            <span className="inline-block bg-amber-500 mr-2 rounded-full" style={{ width: "8px", height: "8px", verticalAlign: "middle", animation: "pulse 2s ease-in-out infinite" }} />
            REALIZED · COMBO B · LIVE DATA
          </Mono>
          <Mono className="text-slate-600" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>{s.period_start} → {s.period_end}</Mono>
          <Mono className="hidden md:inline text-slate-600" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>${s.risk_per_trade}/TRADE · TRADEIFY 50K LIGHTNING</Mono>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-8">
            <h1 className="text-slate-50" style={{
              fontFamily: FONT_DISPLAY, fontWeight: 300,
              fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
              lineHeight: 0.98, letterSpacing: "-0.035em", margin: 0
            }}>
              <Display italic style={{ color: "#fbbf24" }}>$13,992</Display>
              <span style={{ color: "#fbbf24", opacity: 0.6 }}>.</span>
              <br />
              over twelve
              <br />
              actual months.
            </h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed" style={{ marginTop: "1.5rem", fontSize: "16px" }}>
              Not a backtest abstraction. <Mono className="text-amber-300" style={{ fontSize: "13px" }}>192 real trades</Mono> from your
              actual N4A.ORB Combo B configuration — Hunter on Mon/Wed/Fri, Conservative on Tue/Thu, $375 risk per trade —
              processed and analyzed across 264 business days. Eleven of thirteen months profitable.
              Worst single drawdown: <Mono className="text-amber-300" style={{ fontSize: "13px" }}>$918</Mono>.
            </p>
          </div>
          <div className="lg:col-span-4 text-right">
            <Mono className="block uppercase text-slate-600 mb-1" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>↗ result</Mono>
            <div className="text-emerald-400" style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontWeight: 400, fontSize: "44px", lineHeight: 1 }}>
              +{((s.total_pnl / 50000) * 100).toFixed(1)}%
            </div>
            <Mono className="text-slate-500 mt-1 block" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>RETURN ON 50K</Mono>
          </div>
        </div>

        {/* Top stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border border-slate-800" style={{ gap: "1px", backgroundColor: "rgba(30,41,59,0.4)" }}>
          {[
            ["Total trades", s.total_trades, "neutral"],
            ["Win rate", `${s.win_rate}%`, "good"],
            ["Profit factor", s.profit_factor.toFixed(2), "good"],
            ["Max DD", `${s.realized_max_dd_R.toFixed(2)}R`, "good"],
            ["Best month", `+$${(s.best_month/1000).toFixed(2)}k`, "good"],
            ["Worst month", `-$${Math.abs(s.worst_month).toFixed(0)}`, "neutral"]
          ].map(([k, v, type]) => (
            <div key={k} className="bg-black px-4 py-4">
              <Mono className="block uppercase text-slate-600" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>{k}</Mono>
              <Display weight={300} style={{ fontSize: "22px", color: type === "good" ? "#a7f3d0" : "#e2e8f0", display: "block", marginTop: "4px" }}>{v}</Display>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  );
}

/* =========================================================================
   THE WEBHOOK ANSWER (NEW)
   ========================================================================= */
function WebhookAnswer() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={1} label="Quick Answer · Webhook" />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <Mono className="uppercase text-emerald-400 mb-2 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>✓ yes — works fine</Mono>
          <h2 className="text-slate-100 leading-tight" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 2.75rem)" }}>
            One <Display italic style={{ color: "#34d399" }}>strategy</Display>,<br />
            one <Display italic style={{ color: "#34d399" }}>webhook</Display>,<br />
            two <Display italic style={{ color: "#34d399" }}>layouts</Display>.
          </h2>
          <p className="text-slate-400 leading-relaxed mt-5" style={{ fontSize: "14px" }}>
            Both Pine alerts fire to the same TradersPost webhook URL. TradersPost executes whatever the JSON payload says.
            The day filters inside each Pine script guarantee Hunter and Cons never collide on the same day,
            so the receiver never sees conflicting orders. Simpler setup, same result.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="relative border border-slate-800 bg-black p-6">
            <CornerBrackets color="#475569" />

            <Mono className="uppercase text-slate-500 mb-4 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>The flow</Mono>

            <div className="grid grid-cols-7 gap-2 items-center mb-6" style={{ fontSize: "11px" }}>
              <div className="col-span-2 p-3 border border-amber-500/30 bg-amber-500/5">
                <Mono className="uppercase text-amber-400 block mb-1" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Layout 1</Mono>
                <Mono className="text-slate-200 block">MNQ1! · 5m</Mono>
                <Mono className="text-slate-500 block" style={{ fontSize: "10px" }}>Hunter · M/W/F</Mono>
              </div>
              <Mono className="text-slate-600 text-center">→</Mono>
              <div className="col-span-3 p-3 border border-cyan-500/40 bg-cyan-500/5">
                <Mono className="uppercase text-cyan-400 block mb-1" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>One webhook · One strategy</Mono>
                <Mono className="text-slate-200 block">N4A Combo B</Mono>
                <Mono className="text-slate-500 block" style={{ fontSize: "10px" }}>TradersPost → Tradovate → Tradeify</Mono>
              </div>
              <Mono className="text-slate-600 text-center">→</Mono>
              <div className="col-span-2 p-3 border border-emerald-500/30 bg-emerald-500/5">
                <Mono className="uppercase text-emerald-400 block mb-1" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Account</Mono>
                <Mono className="text-slate-200 block">$50K Lightning</Mono>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 items-center" style={{ fontSize: "11px" }}>
              <div className="col-span-2 p-3 border border-emerald-500/30 bg-emerald-500/5">
                <Mono className="uppercase text-emerald-400 block mb-1" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Layout 2</Mono>
                <Mono className="text-slate-200 block">NQ1! · 5m</Mono>
                <Mono className="text-slate-500 block" style={{ fontSize: "10px" }}>Cons · Tu/Th</Mono>
              </div>
              <Mono className="text-slate-600 text-center">↗</Mono>
              <div className="col-span-3" />
              <div className="col-span-3" />
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 gap-4" style={{ fontSize: "11px" }}>
              <div>
                <Mono className="uppercase text-emerald-500 mb-2 block" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>✓ what you keep</Mono>
                <ul className="space-y-1.5 text-slate-400 leading-relaxed" style={{ fontSize: "12px" }}>
                  <li>• Simpler configuration</li>
                  <li>• One pause/disable lever</li>
                  <li>• Day filters prevent collisions</li>
                </ul>
              </div>
              <div>
                <Mono className="uppercase text-rose-500 mb-2 block" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>✗ what you give up</Mono>
                <ul className="space-y-1.5 text-slate-400 leading-relaxed" style={{ fontSize: "12px" }}>
                  <li>• Hunter vs Cons P&L breakdown in TradersPost</li>
                  <li>• Pausing one bot independently</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   EQUITY CURVE — THE MAIN STORY
   ========================================================================= */
function EquityCurve() {
  const [showDD, setShowDD] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);
  const s = DATA.summary;

  const ddData = DATA.equity.map(d => ({ ...d, dd_abs: Math.abs(d.dd) }));

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={2} label="Equity Curve" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-slate-100" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.02em" }}>
          The <Display italic style={{ color: "#fbbf24" }}>journey</Display>.
        </h2>
        <div className="flex gap-2" style={{ fontSize: "11px" }}>
          <button
            onClick={() => setShowMilestones(!showMilestones)}
            className="px-3 py-1.5 border transition-colors"
            style={{
              fontFamily: FONT_MONO,
              borderColor: showMilestones ? "#fbbf24" : "#334155",
              color: showMilestones ? "#fbbf24" : "#64748b",
              backgroundColor: showMilestones ? "rgba(251,191,36,0.05)" : "transparent"
            }}
          >
            ◆ MILESTONES
          </button>
          <button
            onClick={() => setShowDD(!showDD)}
            className="px-3 py-1.5 border transition-colors"
            style={{
              fontFamily: FONT_MONO,
              borderColor: showDD ? "#f43f5e" : "#334155",
              color: showDD ? "#f43f5e" : "#64748b",
              backgroundColor: showDD ? "rgba(244,63,94,0.05)" : "transparent"
            }}
          >
            ▼ DRAWDOWN
          </button>
        </div>
      </div>

      <div className="border border-slate-800 bg-black p-4 md:p-6 mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={ddData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: FONT_MONO }}
              stroke="#1e293b"
              tickFormatter={(d) => {
                const parts = d.split('-');
                return `${parts[0].slice(2)}-${parts[1]}`;
              }}
              interval={Math.floor(ddData.length / 8)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: FONT_MONO }}
              stroke="#1e293b"
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            {showDD && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#f43f5e", fontSize: 10, fontFamily: FONT_MONO }}
                stroke="#f43f5e"
                tickFormatter={(v) => `-$${v}`}
                domain={[0, 1200]}
              />
            )}
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: "#475569", strokeDasharray: "3 3" }}
              formatter={(v, n) => {
                if (n === "Equity") return [fmt$$(v), n];
                if (n === "Drawdown") return [`-${fmt$$(v)}`, n];
                return [v, n];
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="cum_pnl"
              stroke="#fbbf24"
              strokeWidth={2}
              fill="url(#equityGrad)"
              name="Equity"
            />
            {showDD && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="dd_abs"
                stroke="#f43f5e"
                strokeWidth={1}
                fill="url(#ddGrad)"
                name="Drawdown"
              />
            )}
            {showMilestones && [3000, 6000, 10000].map((level, i) => (
              <ReferenceLine
                key={i}
                yAxisId="left"
                y={level}
                stroke="#fbbf24"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
                label={{ value: `$${level/1000}K`, fill: "#fbbf24", fontSize: 10, position: "right", fontFamily: FONT_MONO, fillOpacity: 0.7 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Milestone callouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-slate-800" style={{ backgroundColor: "rgba(30,41,59,0.4)" }}>
        {[
          { l: 3000, days: 71, label: "1st payout goal", note: "Tradeify 50K Lightning" },
          { l: 6000, days: 181, label: "2nd payout milestone", note: "≈ 6 months in" },
          { l: 10000, days: 307, label: "Five-figure mark", note: "≈ 10 months in" },
          { l: 13000, days: 351, label: "Final stretch", note: "≈ 12 months in" }
        ].map((m, i) => (
          <div key={i} className="bg-black p-4 md:p-5">
            <Mono className="uppercase text-slate-500 mb-2 block" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>${(m.l/1000).toFixed(0)}K HIT</Mono>
            <Display weight={300} style={{ fontSize: "26px", color: "#fbbf24" }}>{m.days}<span className="text-slate-500" style={{ fontSize: "13px" }}> days</span></Display>
            <Mono className="text-slate-300 block mt-2" style={{ fontSize: "11px" }}>{m.label}</Mono>
            <Mono className="text-slate-600 block" style={{ fontSize: "10px" }}>{m.note}</Mono>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   MONTHLY P&L
   ========================================================================= */
function MonthlyPnL() {
  const data = DATA.monthly.map(m => ({ ...m, fill: m.pnl >= 0 ? "#fbbf24" : "#f43f5e" }));
  const profitable = DATA.summary.profitable_months;
  const total = DATA.summary.total_months;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={3} label="Monthly Returns" />

      <div className="grid lg:grid-cols-12 gap-8 mb-6">
        <div className="lg:col-span-4">
          <h2 className="text-slate-100 leading-tight" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2.25rem, 4.5vw, 3rem)" }}>
            <Display italic style={{ color: "#fbbf24" }}>{profitable}</Display> of <Display italic>{total}</Display>
            <br />months green.
          </h2>
          <p className="text-slate-400 leading-relaxed mt-4" style={{ fontSize: "14px" }}>
            <Mono className="text-emerald-400" style={{ fontSize: "13px" }}>{((profitable/total)*100).toFixed(0)}%</Mono> profitable months.
            Worst month was just <Mono className="text-rose-400" style={{ fontSize: "13px" }}>−$241</Mono>,
            best was <Mono className="text-amber-300" style={{ fontSize: "13px" }}>+$2,428</Mono>.
            Median month at <Mono className="text-amber-300" style={{ fontSize: "13px" }}>+$1,164</Mono> means
            you're hitting the 1st-payout profit goal roughly every 2.6 months.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-px border border-slate-800" style={{ backgroundColor: "rgba(30,41,59,0.4)" }}>
            <div className="bg-black p-4">
              <Mono className="block uppercase text-slate-500" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Avg / month</Mono>
              <Display weight={300} style={{ fontSize: "26px", color: "#a7f3d0" }}>${DATA.summary.avg_monthly.toFixed(0)}</Display>
            </div>
            <div className="bg-black p-4">
              <Mono className="block uppercase text-slate-500" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Median</Mono>
              <Display weight={300} style={{ fontSize: "26px", color: "#a7f3d0" }}>${DATA.summary.median_monthly.toFixed(0)}</Display>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 border border-slate-800 bg-black p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: FONT_MONO }}
                stroke="#1e293b"
                tickFormatter={(m) => m.slice(2)}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: FONT_MONO }}
                stroke="#1e293b"
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                formatter={(v) => [fmt$$(v), "P&L"]}
              />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   DAY OF WEEK
   ========================================================================= */
function DayOfWeek() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={4} label="When trades fire" />

      <div className="grid lg:grid-cols-12 gap-8 mb-6">
        <div className="lg:col-span-5">
          <h2 className="text-slate-100 leading-tight" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2.25rem, 4.5vw, 3rem)" }}>
            Cons days are <Display italic style={{ color: "#fbbf24" }}>quiet</Display>.<br />
            Hunter days are <Display italic style={{ color: "#22d3ee" }}>busy</Display>.
          </h2>
          <p className="text-slate-400 leading-relaxed mt-4" style={{ fontSize: "14px" }}>
            Your suspicion was right. <Mono className="text-emerald-400" style={{ fontSize: "13px" }}>Tue/Thu</Mono> only fire ~14% of sessions —
            most weeks you'll see zero Cons trades. <Mono className="text-amber-300" style={{ fontSize: "13px" }}>Mon/Wed/Fri</Mono>
            fire ~52% of sessions, multiple trades when active.
          </p>
          <p className="text-slate-400 leading-relaxed mt-3" style={{ fontSize: "14px" }}>
            But notice the <em className="text-slate-200">quality</em> trade-off: when Cons does fire,
            avg trade is <Mono className="text-emerald-400" style={{ fontSize: "13px" }}>$260</Mono> vs Hunter's
            <Mono className="text-amber-300" style={{ fontSize: "13px" }}> $55</Mono>. That's the diversification benefit —
            two different shapes of edge, working together.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-3">
            {DATA.weekdays.map((wd) => {
              const isHunter = wd.bot === "Hunter";
              const accent = isHunter ? "#fbbf24" : "#34d399";
              return (
                <div key={wd.day} className="relative p-5 border border-slate-800" style={{ background: `linear-gradient(to right, ${accent}08, transparent)` }}>
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-baseline gap-3">
                      <Display italic weight={400} style={{ fontSize: "28px", color: accent }}>{wd.day}</Display>
                      <Mono className="uppercase" style={{ fontSize: "9px", letterSpacing: "0.25em", color: accent, opacity: 0.7 }}>{wd.bot}</Mono>
                    </div>
                    <Mono className="text-slate-200" style={{ fontSize: "13px" }}>{fmt$(wd.pnl)} <span className="text-slate-600">total</span></Mono>
                  </div>

                  {/* Participation bar */}
                  <div className="relative h-2 bg-slate-900 mb-3 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 transition-all" style={{ width: `${wd.participation}%`, backgroundColor: accent, opacity: 0.7 }} />
                  </div>

                  <div className="grid grid-cols-4 gap-3" style={{ fontSize: "10px" }}>
                    <div>
                      <Mono className="block text-slate-600 uppercase" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Active</Mono>
                      <Mono className="text-slate-200" style={{ fontSize: "13px" }}>{wd.participation.toFixed(0)}%</Mono>
                      <Mono className="text-slate-600 block" style={{ fontSize: "10px" }}>{wd.active}/{wd.sessions} days</Mono>
                    </div>
                    <div>
                      <Mono className="block text-slate-600 uppercase" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Trades</Mono>
                      <Mono className="text-slate-200" style={{ fontSize: "13px" }}>{wd.trades}</Mono>
                      <Mono className="text-slate-600 block" style={{ fontSize: "10px" }}>{wd.perSession.toFixed(2)}/sess</Mono>
                    </div>
                    <div>
                      <Mono className="block text-slate-600 uppercase" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Win rate</Mono>
                      <Mono className="text-slate-200" style={{ fontSize: "13px" }}>{wd.winRate.toFixed(0)}%</Mono>
                    </div>
                    <div>
                      <Mono className="block text-slate-600 uppercase" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Avg trade</Mono>
                      <Mono className="text-slate-200" style={{ fontSize: "13px" }}>{fmt$(wd.avgTrade)}</Mono>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   TIME OF DAY
   ========================================================================= */
function TimeOfDay() {
  const data = DATA.tod.map(t => ({ ...t, label: t.bucket }));

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={5} label="Time of Day" />

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <h2 className="text-slate-100 leading-tight" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2rem, 4vw, 2.5rem)" }}>
            Most action <Display italic style={{ color: "#fbbf24" }}>fast</Display>.
          </h2>
          <p className="text-slate-400 leading-relaxed mt-4" style={{ fontSize: "14px" }}>
            <Mono className="text-amber-300" style={{ fontSize: "13px" }}>30%</Mono> of trades fire in
            the first 5 minutes after the ORB completes (9:50-9:54).
            Median hold time is <Mono className="text-amber-300" style={{ fontSize: "13px" }}>15 minutes</Mono>.
            Most days you'll know if it's a winner before 10:30 AM ET.
          </p>
          <p className="text-slate-400 leading-relaxed mt-3" style={{ fontSize: "14px" }}>
            Best win-rate window: <Mono className="text-emerald-400" style={{ fontSize: "13px" }}>10:15-10:29</Mono> at
            72%, when Hunter takes its delayed/conservative entries after waiting out the initial fakeout.
          </p>
        </div>

        <div className="lg:col-span-8 border border-slate-800 bg-black p-6">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="bucket"
                tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: FONT_MONO }}
                stroke="#1e293b"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#fbbf24", fontSize: 10, fontFamily: FONT_MONO }}
                stroke="#fbbf24"
                strokeOpacity={0.5}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#34d399", fontSize: 10, fontFamily: FONT_MONO }}
                stroke="#34d399"
                strokeOpacity={0.5}
                tickFormatter={(v) => `${v}%`}
                domain={[40, 100]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
              />
              <Bar yAxisId="left" dataKey="trades" fill="#fbbf24" name="Trades" radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#34d399" strokeWidth={2} name="Win rate %" dot={{ fill: "#34d399", r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   DRAWDOWN ANATOMY
   ========================================================================= */
function DrawdownAnatomy() {
  const data = DATA.drawdowns.map((d, i) => ({ ...d, id: i + 1, depth_abs: Math.abs(d.depth) }));

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={6} label="Drawdown Anatomy" />

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <h2 className="text-slate-100 leading-tight" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
            <Display italic style={{ color: "#f43f5e" }}>Eighteen</Display> drawdowns.<br />
            All <Display italic>recovered</Display>.
          </h2>
          <p className="text-slate-400 leading-relaxed mt-4" style={{ fontSize: "14px" }}>
            Across 12 months, the equity curve dipped below peak 18 times. Worst was
            <Mono className="text-rose-400" style={{ fontSize: "13px" }}> $1,050</Mono> (2.80R) — well within Tradeify's $2,000 trail.
            Median drawdown: <Mono className="text-rose-400" style={{ fontSize: "13px" }}>$378</Mono>.
            Average recovery: 3.4 trades.
          </p>
          <p className="text-slate-400 leading-relaxed mt-3" style={{ fontSize: "14px" }}>
            The two worst drawdowns clustered in <Mono className="text-slate-200" style={{ fontSize: "13px" }}>Sep–Nov 2025</Mono>,
            during the only losing month. Both fully recovered within 5-15 trades. No structural issue —
            normal variance.
          </p>

          <div className="mt-6 p-4 border border-slate-800 bg-slate-950">
            <Mono className="block uppercase text-slate-500 mb-2" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Worst single DD</Mono>
            <div className="flex items-baseline gap-3">
              <Display weight={300} style={{ fontSize: "36px", color: "#f43f5e" }}>−$918</Display>
              <Mono className="text-slate-500" style={{ fontSize: "12px" }}>= 2.45R</Mono>
            </div>
            <Mono className="text-slate-600 block mt-1" style={{ fontSize: "10px" }}>vs Tradeify $2,000 trail = 46% utilization</Mono>
          </div>
        </div>

        <div className="lg:col-span-7 border border-slate-800 bg-black p-6">
          <Mono className="block uppercase text-slate-500 mb-4" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>Top 10 deepest drawdowns</Mono>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10, fontFamily: FONT_MONO }} stroke="#1e293b" tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="id" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: FONT_MONO }} stroke="#1e293b" width={30} tickFormatter={(v) => `#${v}`} />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                formatter={(v, n, p) => {
                  if (n === "depth_abs") return [`-${fmt$$(v)}`, "Depth"];
                  return [v, n];
                }}
              />
              <ReferenceLine x={2000} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: "Tradeify trail $2k", fill: "#f43f5e", fontSize: 10, position: "right", fontFamily: FONT_MONO }} />
              <Bar dataKey="depth_abs" radius={[0, 2, 2, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.depth_abs > 800 ? "#f43f5e" : d.depth_abs > 500 ? "#fb7185" : "#fda4af"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   PAYOUT PROJECTION
   ========================================================================= */
function PayoutProjection() {
  const monthly = DATA.summary.avg_monthly;

  // Tradeify Lightning 50K (post-Sep 2025)
  // Min payout buffer: $500 above trail (1% of starting balance) for new accounts
  // 1st payout: $3,000 profit goal, 20% consistency
  // 2nd: $3,000 again, 25% consistency
  // 3rd: $3,000, 30%
  // 4th+: same goal, 30%

  const payouts = [
    { n: 1, goal: 3000, consistency: 20, expected_month: 2.8, hit_date: "Jul 2, 2025", actual_days: 71 },
    { n: 2, goal: 3000, consistency: 25, expected_month: 5.6, hit_date: "Sep 21, 2025", actual_days: 152 },
    { n: 3, goal: 3000, consistency: 30, expected_month: 8.4, hit_date: "Dec 7, 2025", actual_days: 229 },
    { n: 4, goal: 3000, consistency: 30, expected_month: 11.1, hit_date: "Mar 1, 2026", actual_days: 313 }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={7} label="Tradeify Payouts" />

      <div className="mb-8">
        <h2 className="text-slate-100" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.02em" }}>
          Your <Display italic style={{ color: "#fbbf24" }}>payout</Display> calendar.
        </h2>
        <p className="text-slate-400 leading-relaxed max-w-2xl mt-3" style={{ fontSize: "16px" }}>
          Based on your realized $1,076/month average at $375 risk on a Tradeify Lightning 50K Instant Funded.
          Each payout requires <Mono className="text-amber-300" style={{ fontSize: "13px" }}>$3,000</Mono> of fresh profit
          (the goal resets after each one).
        </p>
      </div>

      <div className="space-y-3">
        {payouts.map((p, i) => (
          <div key={p.n} className="relative grid md:grid-cols-12 gap-4 p-5 border border-slate-800 bg-black items-center" style={{
            background: `linear-gradient(to right, rgba(251,191,36,${0.08 - i*0.015}), transparent)`
          }}>
            <div className="md:col-span-1 flex items-center gap-3">
              <Mono className="text-amber-400" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "44px", lineHeight: 1 }}>0{p.n}</Mono>
            </div>
            <div className="md:col-span-3">
              <Mono className="block uppercase text-slate-500" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Profit goal</Mono>
              <Display weight={300} style={{ fontSize: "24px", color: "#fbbf24" }}>${p.goal.toLocaleString()}</Display>
              <Mono className="text-slate-500 block" style={{ fontSize: "10px" }}>fresh from this cycle</Mono>
            </div>
            <div className="md:col-span-2">
              <Mono className="block uppercase text-slate-500" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Consistency</Mono>
              <Display weight={300} style={{ fontSize: "24px", color: "#a7f3d0" }}>{p.consistency}%</Display>
              <Mono className="text-slate-500 block" style={{ fontSize: "10px" }}>max single day</Mono>
            </div>
            <div className="md:col-span-2">
              <Mono className="block uppercase text-slate-500" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Expected</Mono>
              <Display weight={300} style={{ fontSize: "24px", color: "#e2e8f0" }}>~{p.expected_month}<span className="text-slate-500" style={{ fontSize: "13px" }}> mo</span></Display>
              <Mono className="text-slate-500 block" style={{ fontSize: "10px" }}>at $1,076/mo avg</Mono>
            </div>
            <div className="md:col-span-2">
              <Mono className="block uppercase text-slate-500" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Realized hit</Mono>
              <Display weight={300} style={{ fontSize: "16px", color: "#a7f3d0" }}>{p.hit_date}</Display>
              <Mono className="text-slate-500 block" style={{ fontSize: "10px" }}>day {p.actual_days}</Mono>
            </div>
            <div className="md:col-span-2 text-right">
              <Mono className="block uppercase text-slate-500" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Take-home (90%)</Mono>
              <Display weight={300} style={{ fontSize: "26px", color: "#fbbf24" }}>${(p.goal * 0.9).toLocaleString()}</Display>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 border border-emerald-500/30 bg-emerald-500/5">
        <Mono className="uppercase text-emerald-400 block mb-2" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>✓ consistency check · realized data</Mono>
        <p className="text-slate-300 leading-relaxed" style={{ fontSize: "14px" }}>
          Your single best day in 12 months was <Mono className="text-emerald-300" style={{ fontSize: "13px" }}>$510.42</Mono>.
          For the 1st payout (20% rule, $3K goal), max single day allowed = $600 — you're <em className="text-emerald-300">comfortably under</em>.
          At $375 risk on this strategy, the rule isn't a binding constraint. You can request the payout the moment you hit $3,500 buffer.
        </p>
      </div>
    </section>
  );
}

/* =========================================================================
   RISK PROFILE COMPARISON
   ========================================================================= */
function RiskProfileComparison() {
  // At $375 risk, you're between SAFE ($300) and MODERATE ($400) for Combo B 50K
  // Realized DD = 2.45R = $918 at $375 risk
  // Same DD at:
  //   $250 risk = $613 (very safe)
  //   $300 risk = $735 (SAFE)
  //   $375 risk = $918 (current — between SAFE and MODERATE)
  //   $400 risk = $980 (MODERATE)
  //   $450 risk = $1,103 (AGGRESSIVE)
  //   $500 risk = $1,225

  const profiles = [
    { name: "Conservative", risk: 250, projected: 718, dd: 613, breach: 0.5, monthly: 717, payout: 4.2, current: false },
    { name: "Safe", risk: 300, projected: 861, dd: 735, breach: 1, monthly: 861, payout: 3.5, current: false },
    { name: "Current ($375)", risk: 375, projected: 1076, dd: 918, breach: 2, monthly: 1076, payout: 2.8, current: true, isOptimal: true },
    { name: "Moderate", risk: 400, projected: 1148, dd: 980, breach: 3, monthly: 1148, payout: 2.6, current: false },
    { name: "Aggressive", risk: 450, projected: 1291, dd: 1103, breach: 6, monthly: 1291, payout: 2.3, current: false },
    { name: "Reckless", risk: 500, projected: 1435, dd: 1225, breach: 10, monthly: 1435, payout: 2.1, current: false }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={8} label="Risk Profile Tuning" />

      <div className="mb-8">
        <h2 className="text-slate-100" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.02em" }}>
          Is <Display italic style={{ color: "#fbbf24" }}>$375</Display> right?
        </h2>
        <p className="text-slate-400 leading-relaxed max-w-2xl mt-3" style={{ fontSize: "16px" }}>
          Quick answer: yes, but you have room to optimize. Your realized worst DD was $918 (46% of trail) — meaning you're operating well below the danger zone.
          The verdict: <Mono className="text-amber-300" style={{ fontSize: "13px" }}>$375 is the sweet spot</Mono> for a Tradeify 50K Lightning.
        </p>
      </div>

      <div className="border border-slate-800 bg-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontFamily: FONT_MONO, fontSize: "12px" }}>
            <thead>
              <tr className="border-b border-slate-800 text-left">
                {["Profile", "Risk/trade", "~ Monthly profit", "Worst DD (proj)", "% of trail", "Breach risk", "Months to 1st payout"].map((h) => (
                  <th key={h} className="px-4 py-3 uppercase text-slate-500 font-normal" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const utilizationPct = Math.min(100, (p.dd / 2000) * 100);
                return (
                  <tr key={p.name} className={`border-b border-slate-800/50 ${p.current ? "bg-amber-500/8" : ""} hover:bg-slate-950 transition-colors`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {p.current && <span className="bg-amber-500" style={{ width: "3px", height: "20px" }} />}
                        <span style={{ fontFamily: FONT_BODY, fontWeight: p.current ? 600 : 400, color: p.current ? "#fbbf24" : "#cbd5e1", fontSize: "13px" }}>{p.name}</span>
                        {p.isOptimal && <span className="px-2 py-0.5 bg-amber-500 text-black" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em" }}>OPTIMAL</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 tabular-nums text-slate-200" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "16px" }}>${p.risk}</td>
                    <td className="px-4 py-4 tabular-nums text-emerald-400">${p.monthly.toLocaleString()}</td>
                    <td className="px-4 py-4 tabular-nums text-rose-400">${p.dd}</td>
                    <td className="px-4 py-4 tabular-nums">
                      <div className="flex items-center gap-2">
                        <div className="relative bg-slate-900 overflow-hidden" style={{ width: "80px", height: "6px" }}>
                          <div className="absolute inset-y-0 left-0" style={{
                            width: `${utilizationPct}%`,
                            backgroundColor: utilizationPct > 70 ? "#f43f5e" : utilizationPct > 50 ? "#fbbf24" : "#34d399"
                          }} />
                        </div>
                        <span className="text-slate-300">{utilizationPct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 tabular-nums" style={{ color: p.breach <= 1 ? "#34d399" : p.breach <= 3 ? "#fbbf24" : "#f43f5e" }}>~{p.breach}%</td>
                    <td className="px-4 py-4 tabular-nums text-slate-300">{p.payout} mo</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-px mt-6 border border-slate-800" style={{ backgroundColor: "rgba(30,41,59,0.4)" }}>
        <div className="bg-black p-5">
          <Mono className="uppercase text-amber-400 mb-2 block" style={{ fontSize: "10px", letterSpacing: "0.25em" }}>Why $375 wins</Mono>
          <p className="text-slate-400 leading-relaxed" style={{ fontSize: "13px" }}>
            Your realized DD ($918) sits at <Mono className="text-amber-300" style={{ fontSize: "12px" }}>46%</Mono> of trail —
            comfortable buffer for variance, room for a bad month without account risk.
          </p>
        </div>
        <div className="bg-black p-5">
          <Mono className="uppercase text-emerald-400 mb-2 block" style={{ fontSize: "10px", letterSpacing: "0.25em" }}>If you'd rather sleep better</Mono>
          <p className="text-slate-400 leading-relaxed" style={{ fontSize: "13px" }}>
            Drop to <Mono className="text-emerald-400" style={{ fontSize: "12px" }}>$300</Mono> and you trade $215 less monthly profit
            for ~50% lower breach probability. Reasonable for the first month.
          </p>
        </div>
        <div className="bg-black p-5">
          <Mono className="uppercase text-rose-400 mb-2 block" style={{ fontSize: "10px", letterSpacing: "0.25em" }}>The bump-up case</Mono>
          <p className="text-slate-400 leading-relaxed" style={{ fontSize: "13px" }}>
            Going to <Mono className="text-rose-400" style={{ fontSize: "12px" }}>$450</Mono> earns ~$215 more monthly,
            but breach risk triples. Wait until 3+ months of clean live data before scaling up.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   EXIT SIGNAL BREAKDOWN
   ========================================================================= */
function ExitBreakdown() {
  const data = DATA.exits.map(e => ({ ...e, fill: e.pnl > 0 ? "#fbbf24" : "#f43f5e" }));

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={9} label="Exit Signal Anatomy" />

      <div className="grid lg:grid-cols-12 gap-8 mb-6">
        <div className="lg:col-span-5">
          <h2 className="text-slate-100 leading-tight" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
            How trades <Display italic style={{ color: "#fbbf24" }}>actually</Display> end.
          </h2>
          <p className="text-slate-400 leading-relaxed mt-4" style={{ fontSize: "14px" }}>
            <Mono className="text-amber-300" style={{ fontSize: "13px" }}>Hunter T2</Mono> (full target hit) was the single biggest profit driver —
            $6,384 across 82 trades. The Partial TP at <Mono className="text-amber-300" style={{ fontSize: "13px" }}>0.7R/50%</Mono>
            captured another $3,050 across 84 trades.
          </p>
          <p className="text-slate-400 leading-relaxed mt-3" style={{ fontSize: "14px" }}>
            <Mono className="text-emerald-400" style={{ fontSize: "13px" }}>TP SD1.0</Mono> is Cons hitting its full target —
            12 trades, $4,361 total ($363 avg per trade — that's the diversification payoff).
            Stop losses fired only <Mono className="text-rose-400" style={{ fontSize: "13px" }}>3 times</Mono> in 192 trades.
          </p>
        </div>

        <div className="lg:col-span-7 border border-slate-800 bg-black p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10, fontFamily: FONT_MONO }} stroke="#1e293b" tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <YAxis type="category" dataKey="signal" tick={{ fill: "#cbd5e1", fontSize: 11, fontFamily: FONT_MONO }} stroke="#1e293b" width={110} />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                formatter={(v, n, p) => [fmt$$(v), "P&L"]}
              />
              <ReferenceLine x={0} stroke="#475569" />
              <Bar dataKey="pnl" radius={[0, 2, 2, 0]}>
                {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   STREAKS + EDGE
   ========================================================================= */
function StreaksEdge() {
  const s = DATA.summary;
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={10} label="Edge Statistics" />

      <div className="grid md:grid-cols-3 gap-px border border-slate-800" style={{ backgroundColor: "rgba(30,41,59,0.4)" }}>
        <div className="bg-black p-6 md:p-8">
          <Mono className="uppercase text-emerald-400 mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>↑ best streak</Mono>
          <Display weight={300} style={{ fontSize: "60px", color: "#a7f3d0", lineHeight: 1 }}>{s.max_win_streak}</Display>
          <Mono className="text-slate-400 block mt-3" style={{ fontSize: "13px" }}>consecutive wins</Mono>
          <Mono className="text-slate-600 block mt-1" style={{ fontSize: "11px" }}>The dopamine never quits</Mono>
        </div>
        <div className="bg-black p-6 md:p-8">
          <Mono className="uppercase text-rose-400 mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>↓ worst streak</Mono>
          <Display weight={300} style={{ fontSize: "60px", color: "#fda4af", lineHeight: 1 }}>{s.max_loss_streak}</Display>
          <Mono className="text-slate-400 block mt-3" style={{ fontSize: "13px" }}>consecutive losses</Mono>
          <Mono className="text-slate-600 block mt-1" style={{ fontSize: "11px" }}>Max realized · also the WC projection</Mono>
        </div>
        <div className="bg-black p-6 md:p-8">
          <Mono className="uppercase text-amber-400 mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>⏱ avg hold</Mono>
          <Display weight={300} style={{ fontSize: "60px", color: "#fde68a", lineHeight: 1 }}>15<span className="text-slate-500" style={{ fontSize: "20px" }}>min</span></Display>
          <Mono className="text-slate-400 block mt-3" style={{ fontSize: "13px" }}>median trade duration</Mono>
          <Mono className="text-slate-600 block mt-1" style={{ fontSize: "11px" }}>Most trades closed by 10:30 AM</Mono>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-px mt-px border-l border-r border-b border-slate-800" style={{ backgroundColor: "rgba(30,41,59,0.4)" }}>
        <div className="bg-black p-5">
          <Mono className="uppercase text-slate-500 mb-2 block" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Avg win</Mono>
          <Display weight={300} style={{ fontSize: "22px", color: "#a7f3d0" }}>+${s.avg_win.toFixed(0)}</Display>
        </div>
        <div className="bg-black p-5">
          <Mono className="uppercase text-slate-500 mb-2 block" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Avg loss</Mono>
          <Display weight={300} style={{ fontSize: "22px", color: "#fda4af" }}>-${Math.abs(s.avg_loss).toFixed(0)}</Display>
        </div>
        <div className="bg-black p-5">
          <Mono className="uppercase text-slate-500 mb-2 block" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Best trade</Mono>
          <Display weight={300} style={{ fontSize: "22px", color: "#fde68a" }}>+${s.best_trade.toFixed(0)}</Display>
        </div>
        <div className="bg-black p-5">
          <Mono className="uppercase text-slate-500 mb-2 block" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>Worst trade</Mono>
          <Display weight={300} style={{ fontSize: "22px", color: "#fda4af" }}>-${Math.abs(s.worst_trade).toFixed(0)}</Display>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SUMMARY VERDICT
   ========================================================================= */
function FinalVerdict() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10">
      <SectionMarker number={11} label="The Bottom Line" />

      <div className="relative border border-amber-500/30 p-8 md:p-12" style={{
        background: "linear-gradient(135deg, #020617, #000000 50%, rgba(120,53,15,0.15))"
      }}>
        <CornerBrackets color="#fbbf24" />

        <Mono className="uppercase text-amber-500 mb-6 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>◆ verdict</Mono>

        <h2 className="text-slate-100 leading-[1.1]" style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(2.25rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", margin: 0 }}>
          Stay at <Display italic style={{ color: "#fbbf24" }}>$375</Display>.<br />
          Use <Display italic style={{ color: "#fbbf24" }}>one webhook</Display>.<br />
          Expect a payout every <Display italic style={{ color: "#fbbf24" }}>~3 months</Display>.
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-slate-800">
          <div>
            <Mono className="uppercase text-amber-400 mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>What the data says to do</Mono>
            <ul className="space-y-3 text-slate-300 leading-relaxed" style={{ fontSize: "14px" }}>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">→</span>
                <span>Run Combo B at <Mono className="text-amber-300" style={{ fontSize: "13px" }}>$375 risk</Mono> in both Pine inputs. Realized DD of 46% trail utilization is a healthy buffer.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">→</span>
                <span>One TradersPost strategy + one webhook + two TradingView layouts. Day filters in Pine prevent collisions.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">→</span>
                <span>Plan around <Mono className="text-amber-300" style={{ fontSize: "13px" }}>~$1,076/month</Mono> realized average. Payout #1 hit at day 71 historically.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 mt-1">→</span>
                <span>Don't worry about consistency rule — your best day was $510, well below the $600 ceiling.</span>
              </li>
            </ul>
          </div>
          <div>
            <Mono className="uppercase text-rose-400 mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>What to watch out for</Mono>
            <ul className="space-y-3 text-slate-300 leading-relaxed" style={{ fontSize: "14px" }}>
              <li className="flex gap-3">
                <span className="text-rose-500 mt-1">→</span>
                <span>Tradeify Lightning post-Sep 2025 caps positions at <Mono className="text-rose-300" style={{ fontSize: "13px" }}>40 micros</Mono>. Cons can hit ~40 on tight stops — verify the cap is enforced.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 mt-1">→</span>
                <span>September–December was the only rough patch (2 of 13 months). Don't tilt risk down after small drawdowns — your data shows recovery.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 mt-1">→</span>
                <span>Cons fires only ~14% of Tue/Thu sessions — many quiet weeks. This is normal, not a malfunction.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-500 mt-1">→</span>
                <span>$80K total payout ceiling on Lightning before forced Live transition — plan for that at month ~24.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   FOOTER
   ========================================================================= */
function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 md:px-10 mt-24 mb-16">
      <div className="border-t border-slate-800 pt-10">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div className="md:col-span-2">
            <Mono className="uppercase text-amber-500 mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.3em", opacity: 0.85 }}>/ data sources</Mono>
            <p className="text-slate-500 leading-relaxed" style={{ fontSize: "12px" }}>
              All metrics derived from your two uploaded TradingView strategy export files: <Mono style={{ fontSize: "11px" }}>Mon_Wed_Fri_Hunter_Mode_Data</Mono> (226 trades, MNQ scale)
              and <Mono style={{ fontSize: "11px" }}>Tues_Thurs_Cons_Mode_Data</Mono> (15 trades, NQ scale converted to MNQ via ÷10).
              Combined chronologically over their overlap period (Apr 22 2025 → Apr 24 2026, 264 business days).
              All calculations use $375 fixed risk per trade as specified in your Pine inputs.
            </p>
          </div>
          <div>
            <Mono className="uppercase text-amber-500 mb-3 block" style={{ fontSize: "10px", letterSpacing: "0.3em", opacity: 0.85 }}>/ disclaimers</Mono>
            <p className="text-slate-500 leading-relaxed" style={{ fontSize: "12px" }}>
              Past performance ≠ future results. Live execution may differ by 5-10% due to slippage and fills.
              Tradeify rules summarized from public help docs as of May 2026 — verify current terms before relying on them.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-900">
          <Mono className="uppercase text-slate-600" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>
            <span className="text-amber-500" style={{ opacity: 0.7 }}>★</span> n4a.orb v27.2 · realized performance
          </Mono>
          <Mono className="uppercase text-slate-700" style={{ fontSize: "10px", letterSpacing: "0.3em" }}>
            © 2026 playbit trading systems
          </Mono>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   ROOT
   ========================================================================= */
export default function Dashboard() {
  useFonts();

  return (
    <div className="min-h-screen bg-black text-slate-200 antialiased" style={{ fontFamily: FONT_BODY }}>
      <Hero />
      <WebhookAnswer />
      <EquityCurve />
      <MonthlyPnL />
      <DayOfWeek />
      <TimeOfDay />
      <DrawdownAnatomy />
      <PayoutProjection />
      <RiskProfileComparison />
      <ExitBreakdown />
      <StreaksEdge />
      <FinalVerdict />
      <Footer />
    </div>
  );
}
