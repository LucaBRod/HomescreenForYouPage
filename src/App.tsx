import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const MOOD_EMOJIS = ["😞", "😕", "😐", "🙂", "😊"];
const MOOD_COLORS = ["#E07B7B", "#E8A87C", "#D4C06E", "#8BC98B", "#6BB8C4"];
const MOOD_LABELS = ["Very Bad", "Bad", "Neutral", "Good", "Very Good"];

const moodData7 = [
  { day: "Mon", mood: 2, label: "Neutral" },
  { day: "Tue", mood: 1, label: "Bad" },
  { day: "Wed", mood: 2, label: "Neutral" },
  { day: "Thu", mood: 3, label: "Good" },
  { day: "Fri", mood: 4, label: "Very Good" },
  { day: "Sat", mood: 3, label: "Good" },
  { day: "Sun", mood: 3, label: "Good" },
];

const moodData30 = [
  { day: "W1", mood: 1 },
  { day: "", mood: 2 },
  { day: "", mood: 3 },
  { day: "", mood: 2 },
  { day: "", mood: 1 },
  { day: "", mood: 2 },
  { day: "", mood: 3 },
  { day: "W2", mood: 2 },
  { day: "", mood: 1 },
  { day: "", mood: 2 },
  { day: "", mood: 3 },
  { day: "", mood: 4 },
  { day: "", mood: 3 },
  { day: "", mood: 3 },
  { day: "W3", mood: 2 },
  { day: "", mood: 3 },
  { day: "", mood: 4 },
  { day: "", mood: 3 },
  { day: "", mood: 4 },
  { day: "", mood: 3 },
  { day: "", mood: 3 },
  { day: "W4", mood: 3 },
  { day: "", mood: 4 },
  { day: "", mood: 3 },
  { day: "", mood: 4 },
  { day: "", mood: 3 },
  { day: "", mood: 4 },
  { day: "", mood: 3 },
  { day: "", mood: 4 },
  { day: "Now", mood: 3 },
];

const comparisonData = [
  { day: "Mon", comparison: 2, mood: 3 },
  { day: "Tue", comparison: 4, mood: 1 },
  { day: "Wed", comparison: 1, mood: 3 },
  { day: "Thu", comparison: 3, mood: 2 },
  { day: "Fri", comparison: 4, mood: 1 },
  { day: "Sat", comparison: 2, mood: 3 },
  { day: "Sun", comparison: 1, mood: 4 },
];

const timeOfDay = [
  { label: "Morning", emoji: "🌅", value: 12, color: "#F9C74F" },
  { label: "Afternoon", emoji: "☀️", value: 18, color: "#F4A261" },
  { label: "Evening", emoji: "🌆", value: 45, color: "#9B5DE5" },
  { label: "Night", emoji: "🌙", value: 25, color: "#4361EE" },
];

const categories = [
  { label: "Appearance", emoji: "✨", value: 78 },
  { label: "Fitness", emoji: "💪", value: 54 },
  { label: "Social Life", emoji: "👥", value: 47 },
  { label: "Accomplishments", emoji: "🏆", value: 32 },
  { label: "Style / Fashion", emoji: "👗", value: 28 },
];

const freqData = [
  { day: "Mon", count: 1 },
  { day: "Tue", count: 0 },
  { day: "Wed", count: 2 },
  { day: "Thu", count: 1 },
  { day: "Fri", count: 3 },
  { day: "Sat", count: 0 },
  { day: "Sun", count: 1 },
];

const streakDays = [
  { label: "M", done: true },
  { label: "T", done: false },
  { label: "W", done: true },
  { label: "T", done: true },
  { label: "F", done: true },
  { label: "S", done: false },
  { label: "S", done: false },
];

const activityLog = [
  {
    group: "Today",
    entries: [
      {
        title: "My Thoughts",
        body: "I'm proud of finishing my homework today, it was difficult but I did it.",
        time: "6:00 PM",
      },
    ],
  },
  {
    group: "Yesterday",
    entries: [
      {
        title: "My Values",
        body: "I think social media makes it harder for me to follow my value of peace because it is easy to get caught up in what everyone else is doing.",
        time: "9:00 AM",
      },
    ],
  },
  {
    group: "Monday",
    entries: [
      {
        title: "My Thanks",
        body: "Grateful for my friend Zara who always checks in on me after a rough day.",
        time: "8:30 PM",
      },
      {
        title: "Comparison Check",
        body: "Scrolled through Instagram for 40 mins and felt like everyone's summer looked way better than mine.",
        time: "3:15 PM",
      },
    ],
  },
  {
    group: "Sunday",
    entries: [
      {
        title: "My Thoughts",
        body: "Stayed off my phone most of the day. Felt really calm.",
        time: "7:00 PM",
      },
    ],
  },
];

// ─── Custom Mood Dot ──────────────────────────────────────────────────────────

function MoodDot({ cx, cy, payload }: { cx?: number; cy?: number; payload?: { mood: number } }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), (payload?.mood ?? 0) * 120 + 300);
    return () => clearTimeout(timer);
  }, [payload]);

  if (!cx || !cy) return null;
  const mood = payload?.mood ?? 2;
  const color = MOOD_COLORS[mood];

  return (
    <g>
      <circle
        ref={ref}
        cx={cx}
        cy={cy}
        r={visible ? 6 : 0}
        fill={color}
        stroke="white"
        strokeWidth={2}
        style={{ transition: "r 0.3s ease" }}
      />
      <text
        x={cx}
        y={cy - 14}
        textAnchor="middle"
        fontSize={visible ? 14 : 0}
        style={{ transition: "font-size 0.3s ease", userSelect: "none" }}
      >
        {MOOD_EMOJIS[mood]}
      </text>
    </g>
  );
}

// ─── Mood Gradient ────────────────────────────────────────────────────────────

function MoodGradientDef() {
  return (
    <defs>
      <linearGradient id="moodLine" x1="0%" y1="0%" x2="100%" y2="0%">
        {moodData7.map((d, i) => (
          <stop
            key={i}
            offset={`${(i / (moodData7.length - 1)) * 100}%`}
            stopColor={MOOD_COLORS[d.mood]}
          />
        ))}
      </linearGradient>
      <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8BC98B" stopOpacity={0.18} />
        <stop offset="100%" stopColor="#8BC98B" stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: "#F0EDE6", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
    >
      {children}
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold tracking-widest uppercase mb-3"
      style={{ color: "#9C9080", fontFamily: "var(--font-body)" }}
    >
      {children}
    </p>
  );
}

// ─── Takeaway ─────────────────────────────────────────────────────────────────

function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm mb-4 leading-snug" style={{ color: "#6B6355", fontFamily: "var(--font-body)" }}>
      {children}
    </p>
  );
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-lg font-semibold mb-1"
      style={{ fontFamily: "var(--font-display)", color: "#2C2820", fontWeight: 600 }}
    >
      {children}
    </h3>
  );
}

// ─── Graph 1: Mood Over Time ──────────────────────────────────────────────────

function MoodCard() {
  const [range, setRange] = useState<"7" | "30">("7");
  const data = range === "7" ? moodData7 : moodData30;

  return (
    <Card>
      <div className="flex items-start justify-between mb-1">
        <CardHeading>How You've Been Feeling</CardHeading>
        <div
          className="flex rounded-full overflow-hidden text-xs font-semibold flex-shrink-0"
          style={{ background: "#E2DDD4" }}
        >
          {(["7", "30"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1 transition-all"
              style={{
                background: range === r ? "#2C2820" : "transparent",
                color: range === r ? "#F0EDE6" : "#9C9080",
                borderRadius: "999px",
                fontFamily: "var(--font-body)",
              }}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>
      <Takeaway>"Your mood has been a little more positive this week."</Takeaway>

      {/* Chart + left legend side by side */}
      <div className="flex gap-2">
        {/* Y-axis legend */}
        <div className="flex flex-col justify-between py-4 flex-shrink-0" style={{ height: 140 }}>
          {[...MOOD_EMOJIS].reverse().map((e, i) => {
            const realIdx = 4 - i;
            return (
              <div key={realIdx} className="flex items-center gap-1">
                <span style={{ fontSize: 13 }}>{e}</span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: MOOD_COLORS[realIdx], flexShrink: 0 }}
                />
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="flex-1" style={{ height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
              <MoodGradientDef />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#9C9080", fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis domain={[0, 4]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const mood = payload[0].value as number;
                  return (
                    <div
                      className="rounded-xl px-3 py-2 text-sm"
                      style={{
                        background: "#2C2820",
                        color: "#F0EDE6",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {MOOD_EMOJIS[mood]} {MOOD_LABELS[mood]}
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="url(#moodLine)"
                strokeWidth={2.5}
                dot={<MoodDot />}
                activeDot={{ r: 7 }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

// ─── Graph 2: Correlation ─────────────────────────────────────────────────────

function CorrelationCard() {
  return (
    <Card>
      <CardHeading>A Pattern We Noticed</CardHeading>
      <Takeaway>"On days with more social comparison, your mood tends to be lower."</Takeaway>

      <div style={{ height: 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={comparisonData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B5DE5" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#9B5DE5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#9C9080", fontFamily: "var(--font-body)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[0, 5]} hide />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div
                    className="rounded-xl px-3 py-2 text-xs"
                    style={{ background: "#2C2820", color: "#F0EDE6", fontFamily: "var(--font-body)" }}
                  >
                    <div>{label}</div>
                    <div style={{ color: "#9B5DE5" }}>Comparison: {payload[0]?.value}</div>
                    <div style={{ color: "#6BB8C4" }}>Mood: {MOOD_EMOJIS[payload[1]?.value as number ?? 2]}</div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="comparison"
              stroke="#9B5DE5"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#9B5DE5", stroke: "white", strokeWidth: 2 }}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#6BB8C4"
              strokeWidth={2.5}
              strokeDasharray="5 3"
              dot={{ r: 4, fill: "#6BB8C4", stroke: "white", strokeWidth: 2 }}
              animationDuration={1400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B6355", fontFamily: "var(--font-body)" }}>
          <div className="w-5 h-0.5 rounded" style={{ background: "#9B5DE5" }} />
          Comparison
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B6355", fontFamily: "var(--font-body)" }}>
          <div className="w-5 h-0.5 rounded border-t-2 border-dashed" style={{ borderColor: "#6BB8C4" }} />
          Mood
        </div>
      </div>

    </Card>
  );
}

// ─── Graph 3: Time of Day ─────────────────────────────────────────────────────

function TimeOfDayCard() {
  const max = Math.max(...timeOfDay.map((t) => t.value));

  return (
    <Card>
      <CardHeading>When Comparison Shows Up</CardHeading>
      <Takeaway>"Most of your comparison moments happen in the evening."</Takeaway>

      <div className="flex items-end justify-around gap-2" style={{ height: 120 }}>
        {timeOfDay.map((t) => {
          const pct = (t.value / max) * 100;
          return (
            <div key={t.label} className="flex flex-col items-center gap-2 flex-1">
              <span
                className="text-xs font-semibold"
                style={{ color: t.color, fontFamily: "var(--font-body)" }}
              >
                {t.value}%
              </span>
              <div
                className="w-full rounded-t-xl relative overflow-hidden"
                style={{ height: `${(pct / 100) * 72}px`, background: t.color + "30" }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-xl"
                  style={{
                    height: "100%",
                    background: t.color,
                    animation: "growUp 0.8s ease-out forwards",
                    transformOrigin: "bottom",
                  }}
                />
              </div>
              <span style={{ fontSize: 20 }}>{t.emoji}</span>
              <span
                className="text-xs text-center"
                style={{ color: "#9C9080", fontFamily: "var(--font-body)", lineHeight: 1.2 }}
              >
                {t.label}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes growUp {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </Card>
  );
}

// ─── Graph 4: Categories ──────────────────────────────────────────────────────

function CategoriesCard() {
  const max = categories[0].value;

  return (
    <Card>
      <CardHeading>What Comparison Is About</CardHeading>
      <Takeaway>"Appearance has come up most often lately."</Takeaway>

      <div className="flex flex-col gap-3">
        {categories.map((cat, i) => {
          const pct = (cat.value / max) * 100;
          const colors = ["#E07B7B", "#F4A261", "#9B5DE5", "#6BB8C4", "#8BC98B"];
          const color = colors[i];
          return (
            <div key={cat.label} className="flex items-center gap-3">
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{cat.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2C2820", fontFamily: "var(--font-body)" }}
                  >
                    {cat.label}
                  </span>
                  <span className="text-xs" style={{ color: "#9C9080", fontFamily: "var(--font-body)" }}>
                    {cat.value}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: color + "25" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: color,
                      transition: "width 1s ease-out",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Graph 5: Frequency ───────────────────────────────────────────────────────

function FrequencyCard() {
  const max = Math.max(...freqData.map((d) => d.count));
  const total = freqData.reduce((s, d) => s + d.count, 0);

  return (
    <Card>
      <CardHeading>Comparison This Week</CardHeading>
      <Takeaway>{`"You noticed comparison on ${freqData.filter((d) => d.count > 0).length} days this week."`}</Takeaway>

      <div className="flex items-end justify-between gap-1.5">
        {freqData.map((d) => {
          const heightPct = max > 0 ? (d.count / max) * 100 : 0;
          const dotColors = d.count === 0 ? "#E2DDD4" : d.count === 1 ? "#F4C06E" : d.count === 2 ? "#F4A261" : "#E07B7B";
          return (
            <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className="flex flex-col items-center justify-end gap-1"
                style={{ height: 72 }}
              >
                {Array.from({ length: Math.max(d.count, 0) }).map((_, j) => (
                  <div
                    key={j}
                    className="rounded-full"
                    style={{
                      width: 12,
                      height: 12,
                      background: dotColors,
                      animation: `popIn 0.3s ease-out ${j * 0.1}s both`,
                    }}
                  />
                ))}
                {d.count === 0 && (
                  <div
                    className="rounded-full"
                    style={{ width: 12, height: 12, background: "#E2DDD4", border: "1.5px dashed #C4BDB4" }}
                  />
                )}
              </div>
              <span
                className="text-xs"
                style={{ color: "#9C9080", fontFamily: "var(--font-body)" }}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        className="mt-4 rounded-xl px-3 py-2.5 flex items-center gap-2"
        style={{ background: "#E2DDD4" }}
      >
        <span style={{ fontSize: 16 }}>📊</span>
        <span className="text-xs" style={{ color: "#6B6355", fontFamily: "var(--font-body)" }}>
          {total} comparison moments total this week
        </span>
      </div>
    </Card>
  );
}

// ─── Streak Section ───────────────────────────────────────────────────────────

function StreakSection() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Card className="flex flex-col items-center text-center">
      <h2
        className="text-2xl font-bold mb-0.5 flex items-center gap-2"
        style={{ fontFamily: "var(--font-display)", color: "#2C2820" }}
      >
        🔥 3 Days in a Row
      </h2>
      <p className="text-sm mb-1" style={{ color: "#9C9080", fontFamily: "var(--font-body)" }}>
        Keep it up — you're on a roll!
      </p>
      <div className="flex gap-2 mb-3">
        {streakDays.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
              style={{
                background: d.done && animated ? "#2C2820" : "#E2DDD4",
                color: d.done && animated ? "#F0EDE6" : "#9C9080",
                transform: d.done && animated ? "scale(1.05)" : "scale(1)",
                transition: `all 0.35s ease ${i * 0.07}s`,
                fontFamily: "var(--font-body)",
              }}
            >
              {d.done ? "✓" : ""}
            </div>
            <span className="text-xs" style={{ color: "#9C9080", fontFamily: "var(--font-body)" }}>
              {d.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm font-medium self-start" style={{ color: "#8B6F4E", fontFamily: "var(--font-body)" }}>
        🏆 Longest Chain: 11
      </p>
    </Card>
  );
}

// ─── Your Activity ────────────────────────────────────────────────────────────

function ActivitySection() {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-4"
        style={{ fontFamily: "var(--font-display)", color: "#2C2820" }}
      >
        Your activity
      </h2>
      {activityLog.map((group) => (
        <div key={group.group} className="mb-5">
          <SectionLabel>{group.group}</SectionLabel>
          <div className="flex flex-col gap-3">
            {group.entries.map((entry, i) => (
              <Card key={i}>
                <h4
                  className="font-bold text-base mb-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "#2C2820" }}
                >
                  {entry.title}
                </h4>
                <p className="text-sm leading-relaxed mb-2" style={{ color: "#2C2820", fontFamily: "var(--font-body)" }}>
                  {entry.body}
                </p>
                <p className="text-xs" style={{ color: "#9C9080", fontFamily: "var(--font-body)" }}>
                  {entry.time}
                </p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Patterns Carousel ────────────────────────────────────────────────────────

const PATTERN_CARDS = [
  { id: "mood", component: MoodCard },
  { id: "correlation", component: CorrelationCard },
  { id: "time", component: TimeOfDayCard },
  { id: "categories", component: CategoriesCard },
  { id: "frequency", component: FrequencyCard },
];

function PatternsCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(PATTERN_CARDS.length - 1, next)));
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      goTo(dx > 0 ? index + 1 : index - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const ActiveCard = PATTERN_CARDS[index].component;

  return (
    <div>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: "pan-y" }}
      >
        <ActiveCard />
      </div>

      {/* Page dots + nav arrows */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="text-xs px-2 py-1 rounded-lg transition-all"
          style={{
            color: index === 0 ? "#C4BDB4" : "#6B6355",
            fontFamily: "var(--font-body)",
            background: index === 0 ? "transparent" : "#E2DDD4",
          }}
          aria-label="Previous card"
        >
          ‹
        </button>

        <div className="flex gap-1.5 items-center">
          {PATTERN_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to card ${i + 1}`}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: 999,
                background: i === index ? "#2C2820" : "#C4BDB4",
                transition: "all 0.25s ease",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          disabled={index === PATTERN_CARDS.length - 1}
          className="text-xs px-2 py-1 rounded-lg transition-all"
          style={{
            color: index === PATTERN_CARDS.length - 1 ? "#C4BDB4" : "#6B6355",
            fontFamily: "var(--font-body)",
            background: index === PATTERN_CARDS.length - 1 ? "transparent" : "#E2DDD4",
          }}
          aria-label="Next card"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav() {
  const [active, setActive] = useState("you");
  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "library", label: "Library", icon: "📖" },
    { id: "you", label: "You", icon: "👤" },
  ];
  return (
    <div
      className="flex items-center justify-around py-3 border-t"
      style={{ background: "#F0EDE6", borderColor: "rgba(0,0,0,0.07)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className="flex flex-col items-center gap-0.5 px-5 py-1 rounded-2xl transition-all"
          style={{
            background: active === tab.id ? "#2C2820" : "transparent",
            fontFamily: "var(--font-body)",
          }}
        >
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span
            className="text-xs font-medium"
            style={{ color: active === tab.id ? "#F0EDE6" : "#9C9080" }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1a1a", padding: "24px 16px" }}>
    <div style={{
      position: "relative",
      width: 393,
      background: "#1a1a1a",
      borderRadius: 54,
      padding: "12px",
      boxShadow: "0 0 0 1px #3a3a3a, 0 0 0 3px #2a2a2a, 0 30px 80px rgba(0,0,0,0.7), inset 0 0 0 1px #444",
    }}>
      {/* Side buttons */}
      <div style={{ position: "absolute", left: -3, top: 100, width: 3, height: 34, background: "#3a3a3a", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -3, top: 144, width: 3, height: 60, background: "#3a3a3a", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -3, top: 214, width: 3, height: 60, background: "#3a3a3a", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", right: -3, top: 160, width: 3, height: 80, background: "#3a3a3a", borderRadius: "0 2px 2px 0" }} />

      {/* Screen */}
      <div style={{ borderRadius: 44, overflow: "hidden", background: "#E2DDD4" }}>
        {/* Status bar */}
        <div style={{ background: "#E2DDD4", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px 0", height: 50 }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)", color: "#2C2820" }}>9:41</span>
          <div style={{ width: 120, height: 30, background: "#1a1a1a", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 12 }} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="#2C2820"><rect x="0" y="3" width="3" height="9" rx="1"/><rect x="4.5" y="2" width="3" height="10" rx="1"/><rect x="9" y="0" width="3" height="12" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.3"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="#2C2820"><rect x="1" y="1" width="12" height="10" rx="2" stroke="#2C2820" strokeWidth="1.5" fill="none"/><rect x="13" y="3.5" width="2" height="5" rx="1" fill="#2C2820"/><rect x="2.5" y="2.5" width="8" height="7" rx="1" fill="#2C2820"/></svg>
          </div>
        </div>

        {/* App content */}
        <div
          className="flex flex-col"
          style={{ background: "#E2DDD4", maxWidth: 393, height: 780 }}
        >
      {/* Header / Profile */}
      <div className="flex flex-col items-center pt-4 pb-5 px-5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-2"
          style={{ background: "#C8D8C0", color: "#4A5E43", fontFamily: "var(--font-display)" }}
        >
          M
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#2C2820" }}
        >
          Maya
        </h1>
        <p className="text-sm" style={{ color: "#9C9080", fontFamily: "var(--font-body)" }}>
          5 day streak · 12 sessions
        </p>
      </div>

      <div className="w-full h-px" style={{ background: "rgba(0,0,0,0.08)" }} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5" style={{ scrollbarWidth: "none" }}>
        {/* Streak */}
        <StreakSection />

        {/* Your Patterns heading + carousel */}
        <div>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)", color: "#2C2820" }}
          >
            Your patterns
          </h2>
          <PatternsCarousel />
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background: "rgba(0,0,0,0.08)" }} />

        {/* Your Activity */}
        <ActivitySection />

        {/* Bottom padding */}
        <div style={{ height: 8 }} />
      </div>

      {/* Bottom Nav */}
      <BottomNav />
        </div>
      </div>
    </div>
    </div>
  );
}
