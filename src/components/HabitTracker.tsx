import { useState } from "react";
import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HabitListItem } from "./HabitListItem";
import { useHabits } from "@/hooks/useHabits";
import { HabitView } from "./HabitView";
import { HabitForm } from "./HabitForm";

function HabitTracker() {
  const { habits, addHabit, updateCompletion } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitFormOpen, setHabitFormOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Generate an array of dates starting from today and going back 6 days
  const generateDates = (startDate: string, days: number) => {
    const dates = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < days; i++) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return dates;
  };

  const dates = generateDates(today, 5); // Generate 5 days of data (including today)

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
          // Update the habit in the list (this should be handled in your state management)
          // Add and call updateHabit function from useHabits hook
          
          setSelectedHabit((prev) => (prev ? { ...prev, ...updatedHabit } : null));
        }}
      />
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <header className="flex w-full items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold">Habitual</h1>
        <Sheet open={habitFormOpen} onOpenChange={() => setHabitFormOpen((prev) => !prev)}>
          <SheetTrigger asChild>
            <Button>Add Habit</Button>
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
      <div className="flex flex-row gap-2 border-b pb-2">
        <div className="flex flex-grow-1 min-w-30 p-2"></div>
        <div className="grid grid-cols-[repeat(5,1fr)] items-center">
          {dates.map((date) => (
            <div key={date} className="flex align-center justify-center w-10">
              <div className="max-w-8 text-center text-sm font-medium">{new Date(date).toLocaleDateString("en-US", {
                weekday: "short", day: "2-digit", 
              }).split(" ").reverse().join(" ")}</div>
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
            today={today}
            updateCompletion={updateCompletion}
            onClick={() => openHabitView(habit)}
          />
        ))}
      </div>
    </div>
  );
}

export default HabitTracker;