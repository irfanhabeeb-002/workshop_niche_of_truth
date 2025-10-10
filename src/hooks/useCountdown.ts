import { useEffect, useMemo, useState } from "react";
import workshops from "@/data/workshops.json";

type Workshop = {
  month: string;
  title: string;
  date: string | null;
  location: string;
};

export type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  target: Date | null;
  nextWorkshop: Workshop | null;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function findNextWorkshop(now: Date): { target: Date | null; nextWorkshop: Workshop | null } {
  const upcoming = (workshops as Workshop[])
    .map((w) => ({ ...w, parsed: parseDate(w.date) }))
    .filter((w) => w.parsed && (w.parsed as Date).getTime() > now.getTime())
    .sort((a, b) => ((a.parsed as Date).getTime() - (b.parsed as Date).getTime()));

  if (upcoming.length === 0) {
    return { target: null, nextWorkshop: null };
  }

  const first = upcoming[0];
  return { target: first.parsed as Date, nextWorkshop: { month: first.month, title: first.title, date: first.date, location: first.location } };
}

export function useCountdown(): CountdownState {
  const [now, setNow] = useState<Date>(() => new Date());

  const { target, nextWorkshop } = useMemo(() => findNextWorkshop(now), [now]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!target) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00", target: null, nextWorkshop: null };
  }

  const diffMs = Math.max(0, target.getTime() - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: pad2(days),
    hours: pad2(hours),
    minutes: pad2(minutes),
    seconds: pad2(seconds),
    target,
    nextWorkshop,
  };
}

export default useCountdown;


