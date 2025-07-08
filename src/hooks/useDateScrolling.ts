import { useState, useRef } from "react";
import { getDatesInRange, parseDateStringLocal } from "@/lib/dates";
import { useVisibleDates } from "@/hooks/useVisibleDates";

export function useDateScrolling() {
  const {visibleDates, setVisibleDates, visibleDatesCount} = useVisibleDates();

  const [isScrollDragging, setIsScrollDragging] = useState<boolean>(false);
  const dragScrollStartX = useRef<number | null>(null);

  // Horizontal scrolling logic
  const handleHorizontalDragScroll = (clientX: number) => {
    if (!isScrollDragging || dragScrollStartX.current === null) return;

    const dragDistance = clientX - dragScrollStartX.current;
    if (Math.abs(dragDistance) >= 40) {
      const direction = dragDistance < 0 ? -1 : 1;
      const baseDate = parseDateStringLocal(visibleDates[0]);
      const newStartDate = new Date(baseDate);
      newStartDate.setDate(newStartDate.getDate() + direction);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (direction === 1 && newStartDate > today) {
        setIsScrollDragging(false);
        dragScrollStartX.current = null;
        return;
      }

      setVisibleDates(getDatesInRange(newStartDate, visibleDatesCount));
      dragScrollStartX.current = clientX;
    }
  };

  const handleTouchScroll = (event: React.TouchEvent) => {
    handleHorizontalDragScroll(event.touches[0].clientX);
  };

  const handleMouseScroll = (event: React.MouseEvent) => {
    handleHorizontalDragScroll(event.clientX);
  };

  const startDragScroll = (clientX: number) => {
    setIsScrollDragging(true);
    dragScrollStartX.current = clientX;
  };

  const handleTouchStartForScroll = (event: React.TouchEvent) => {
    startDragScroll(event.touches[0].clientX);
  };

  const handleMouseDownForScroll = (event: React.MouseEvent) => {
    startDragScroll(event.clientX);
  };

  const endDragForScroll = () => {
    setIsScrollDragging(false);
    dragScrollStartX.current = null;
  };

  return {
    visibleDates,
    handleMouseDownForScroll,
    handleTouchStartForScroll,
    handleMouseScroll,
    handleTouchScroll,
    endDragForScroll,
  };
}