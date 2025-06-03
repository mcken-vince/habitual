import { useEffect, useRef, useState } from "react";
import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HabitListItem } from "./HabitListItem";
import { useHabits } from "@/hooks/useHabits";
import { HabitView } from "./HabitView";
import { HabitForm } from "./HabitForm";
import { PlusIcon } from "lucide-react";
import { getDatesInRange } from "@/lib/dates";

function HabitTracker() {
  const { habits, addHabit, updateHabit, deleteHabit, updateCompletion } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [visibleDatesCount, setVisibleDatesCount] = useState(5);
  const [visibleDates, setVisibleDates] = useState<string[]>(getDatesInRange(new Date(), visibleDatesCount));
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);

  // Dynamically adjust visibleDateCount based on screen width
  useEffect(() => {
    const calculateDateCount = () => {
      // 42px per date column, min 5
      const width = window.innerWidth;
      const max = Math.floor((width - 120) / 42); // 120px for sidebar/padding
      const min = 5;
      const count = Math.max(min, max);
      setVisibleDatesCount(count);
      setVisibleDates(prev => getDatesInRange(new Date(prev[0]), count));
    };
    calculateDateCount();
    window.addEventListener("resize", calculateDateCount);
    return () => window.removeEventListener("resize", calculateDateCount);
  }, []);

  const openHabitView = (habit: Habit) => {
    setSelectedHabit(habit);
  }

  if (selectedHabit) {
    return (
      <HabitView
        habit={selectedHabit}
        isOpen={!!selectedHabit}
        onClose={() => setSelectedHabit(null)}
        onUpdateHabit={(id, updatedHabit) => {
          updateHabit(id, updatedHabit);
          setSelectedHabit((prev) => (prev ? { ...prev, ...updatedHabit } : null));
        }}
                onDeleteHabit={(id) => {
          deleteHabit(id);
          setSelectedHabit(null);
        }}
      />
    )
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging || dragStartX.current === null) return;

    const dragDistance = clientX - dragStartX.current;
    if (Math.abs(dragDistance) >= 40) {
      const direction = dragDistance < 0 ? -1 : 1;
      // Parse as local date (YYYY-MM-DD)
      const [year, month, day] = visibleDates[0].split('-').map(Number);
      const baseDate = new Date(year, month - 1, day);
      const newStartDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
      newStartDate.setDate(newStartDate.getDate() + direction);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxStartDate = new Date(today);
      maxStartDate.setDate(today.getDate() - (visibleDatesCount - 1));

      if (direction === 1 && newStartDate > today) {
        setIsDragging(false);
        dragStartX.current = null;
        return;
      }

      setVisibleDates(getDatesInRange(newStartDate, visibleDatesCount));
      dragStartX.current = clientX; // Reset drag start position
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    handleDragMove(event.touches[0].clientX);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    handleDragMove(event.clientX);
  };

  const startDrag = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    startDrag(event.touches[0].clientX);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    startDrag(event.clientX);
  };

  const endDrag = () => {
    setIsDragging(false);
    dragStartX.current = null;
  }

  return (
    <div className="w-full" onMouseMove={handleMouseMove} onMouseUp={endDrag}
      onTouchMove={handleTouchMove}
      onTouchEnd={endDrag}>
      {/* Header */}
      <header className="flex w-full items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold">Habitual</h1>
        <Sheet open={habitFormOpen} onOpenChange={() => setHabitFormOpen((prev) => !prev)}>
          <SheetTrigger asChild>
            <Button><PlusIcon /></Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full p-4">
            <SheetHeader>
              <SheetTitle>Create Habit</SheetTitle>
            </SheetHeader>
            <HabitForm
              onSave={(habit) => {
                addHabit({
                  id: Date.now().toString(),
                  ...habit,
                  history: {},
                  createdAt: new Date().toISOString(),
                });
                setHabitFormOpen(false);
              }}
              onCancel={() => setHabitFormOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </header>
      {/* Headers */}
      <div className="flex flex-row gap-2 border-b pb-2 select-none">
        <div className="flex flex-grow-1 min-w-30 p-2"></div>
        <div className="grid items-center"
          style={{ gridTemplateColumns: `repeat(${visibleDatesCount}, 1fr)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}>
          {visibleDates.map((date) => (
            <div key={date} className="flex align-center justify-center w-10">
              <div className="max-w-8 text-center text-sm font-medium">{
                new Date(date).toUTCString().split(" ").slice(0, 2).join(" ").replace(',', '')
              }
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Habit List */}
      <div>
        {habits.map((habit) => (
          <HabitListItem
            key={habit.id}
            habit={habit}
            visibleDates={visibleDates}
            updateCompletion={updateCompletion}
            onClick={() => openHabitView(habit)}
          />
        ))}
      </div>
    </div>
  );
}

export default HabitTracker;