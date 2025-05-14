import { useRef, useState } from "react";
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
  const { habits, addHabit, updateHabit, updateCompletion } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [visibleDateCount] = useState(5);
  const [visibleDates, setVisibleDates] = useState<string[]>(getDatesInRange(new Date(), visibleDateCount));
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);


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
      />
    )
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging || dragStartX.current === null) return;

    const dragDistance = clientX - dragStartX.current;
    if (Math.abs(dragDistance) > 50) {
      const direction = dragDistance < 0 ? -1 : 1;
      const baseDate = new Date(visibleDates[0]);
      const newStartDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
      newStartDate.setDate(newStartDate.getDate() + direction);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxStartDate = new Date(today);
      maxStartDate.setDate(today.getDate() - (visibleDateCount - 1));

      if (direction === 1 && newStartDate > today) {
        setIsDragging(false);
        dragStartX.current = null;
        return;
      }

      setVisibleDates(getDatesInRange(newStartDate, visibleDateCount));
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
{visibleDates.map((date) => (
  <div key={date}>{date}</div>
))}
      {/* Headers */}
      <div className="flex flex-row gap-2 border-b pb-2 select-none">
        <div className="flex flex-grow-1 min-w-30 p-2"></div>
        <div className="grid grid-cols-[repeat(5,1fr)] items-center" onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}>
          {visibleDates.map((date) => (
            <div key={date} className="flex align-center justify-center w-10">
              <div className="max-w-8 text-center text-sm font-medium">{
              // new Date(date).toLocaleDateString("en-CA", {
              //   weekday: "short", day: "2-digit", month: "short"
              // }).split(" ").reverse().join(" ")
              new Date(date).toUTCString().split(" ").slice(0, 4).join(" ")
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