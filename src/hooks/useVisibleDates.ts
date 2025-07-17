import { useEffect, useState } from "react";
import { getDatesInRange, parseDateStringLocal } from "@/lib/dates";

export function useVisibleDates() {
  const [visibleDatesCount, setVisibleDatesCount] = useState<number>(5);
  const [visibleDates, setVisibleDates] = useState<string[]>(getDatesInRange(new Date(), visibleDatesCount));

  useEffect(() => {
    const calculateDateCount = () => {
      const width = window.innerWidth;
      
      // Get the actual date cell width based on responsive breakpoints
      let dateCellWidth: number;
      if (width >= 1024) {
        dateCellWidth = 56; // 3.5rem
      } else if (width >= 640) {
        dateCellWidth = 48; // 3rem
      } else {
        dateCellWidth = 40; // 2.5rem
      }

      const reservedWidth = 120 + 8 + 16;
      const availableWidth = width - reservedWidth;
      
      const min = 5;
      const max = Math.floor(availableWidth / dateCellWidth);
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