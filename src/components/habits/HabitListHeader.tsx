import { parseDateStringLocal } from "@/lib/dates";

interface HabitListHeaderProps {
  visibleDates: string[];
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
}

export function HabitListHeader({ visibleDates, onMouseDown, onTouchStart }: HabitListHeaderProps) {
  return (
    <div className="flex flex-row gap-2 border-b pb-2 select-none">
      <div className="flex flex-grow-1 min-w-30 p-2"></div>
      <div 
        className="grid items-center"
        style={{ gridTemplateColumns: `repeat(${visibleDates.length}, var(--date-cell-width))` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {visibleDates.map((date) => (
          <div key={date} className="flex align-center justify-center w-full">
            <div className="text-center text-sm font-medium">
              <p>{parseDateStringLocal(date).toLocaleDateString(undefined, { month: "short" })}</p>
              <p>{parseDateStringLocal(date).getDate()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}