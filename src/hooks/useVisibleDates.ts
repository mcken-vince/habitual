import { useEffect, useState } from "react";
import { getDatesInRange, parseDateStringLocal } from "@/lib/dates";

export function useVisibleDates() {
  const [visibleDatesCount, setVisibleDatesCount] = useState<number>(5);
  const [visibleDates, setVisibleDates] = useState<string[]>(getDatesInRange(new Date(), visibleDatesCount));

  useEffect(() => {
    const calculateDateCount = () => {
      const width = window.innerWidth;
      const max = Math.floor((width - 120) / 42);
      const min = 5;
      const count = Math.max(min, max);
      setVisibleDatesCount(count);
      setVisibleDates(prev => getDatesInRange(parseDateStringLocal(prev[0]), count));
    };

    calculateDateCount();
    window.addEventListener("resize", calculateDateCount);
    return () => window.removeEventListener("resize", calculateDateCount);
  }, []);

  return { visibleDates, visibleDatesCount, setVisibleDates };
}