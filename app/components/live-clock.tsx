"use client";

import { useEffect, useState } from "react";

function padTwo(n: number) {
  return String(n).padStart(2, "0");
}

type LiveClockProps = {
  className?: string;
};

export default function LiveClock({ className = "" }: LiveClockProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const d = new Date();
      setTime(`${padTwo(d.getHours())}:${padTwo(d.getMinutes())}:${padTwo(d.getSeconds())}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <span className={className}>--:--:--</span>;
  return <span className={className}>{time}</span>;
}
