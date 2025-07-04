import { useEffect, useRef, useState } from "react";
import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { HabitListItem } from "@/components/HabitListItem";
import { useHabits } from "@/hooks/useHabits";
import { HabitView } from "@/components/HabitView";
import { PlusIcon, Settings2Icon, EditIcon, TrashIcon, XIcon } from "lucide-react";
import { getDatesInRange, parseDateStringLocal } from "@/lib/dates";
import { Settings } from "@/components/Settings";
import { HabitFormSheet } from "./HabitFormSheet";

function HabitTracker() {
  const { habits, updateHabit, deleteHabit, updateCompletion } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitFormOptions, setHabitFormOptions] = useState<{ open: boolean; initialHabit: Habit | undefined; }>({ open: false, initialHabit: undefined });
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [selectedListHabit, setSelectedListHabit] = useState<Habit | null>(null);
  const [visibleDatesCount, setVisibleDatesCount] = useState<number>(5);
  const [visibleDates, setVisibleDates] = useState<string[]>(getDatesInRange(new Date(), visibleDatesCount));
  const [isDragging, setIsDragging] = useState<boolean>(false);
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
      setVisibleDates(prev => getDatesInRange(parseDateStringLocal(prev[0]), count));
    };
    calculateDateCount();
    window.addEventListener("resize", calculateDateCount);
    return () => window.removeEventListener("resize", calculateDateCount);
  }, []);

  const openHabitView = (habit: Habit) => {
    setSelectedListHabit(null); // Clear any previous selection
    setSelectedHabit(habit);
  }

  const handleSelectHabit = (habit: Habit) => {
    setSelectedListHabit(habit);
  }

  const handleDeselectHabit = () => {
    setSelectedListHabit(null);
  }

  const handleCreateHabit = () => {
    setHabitFormOptions({ open: true, initialHabit: undefined });
  }

  const handleEditHabit = () => {
    if (selectedListHabit) {
      setHabitFormOptions({ open: true, initialHabit: selectedListHabit });
    }
  }

  const handleDeleteHabit = () => {
    if (selectedListHabit) {
      deleteHabit(selectedListHabit.id);
      setSelectedListHabit(null); // Clear selection after deletion
    }
  }

  const resetHabitForm = () => {
    setHabitFormOptions({ open: false, initialHabit: undefined });
    setSelectedListHabit(null);
  }

  if (habitFormOptions.open) {
    return (
      <HabitFormSheet 
        open={habitFormOptions.open}
        onSave={(habit) => {
          if (selectedHabit) {
            // Update selected habit if form was opened from HabitView
            setSelectedHabit(prev => ({...prev, ...habit}));
          }
        }}
        onClose={resetHabitForm}
        initialHabit={habitFormOptions.initialHabit}
      />
    )
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
        onEditHabit={(habit: Habit) => {
          setHabitFormOptions({ open: true, initialHabit: habit });
          setSelectedListHabit(null);
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
      const baseDate = parseDateStringLocal(visibleDates[0]);
      const newStartDate = new Date(baseDate);
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
      <header className="flex w-full items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-sm dark:bg-slate-900 dark:text-slate-200">
        <h1 className="text-2xl font-bold">Habitual</h1>
        <div className="flex flex-row gap-2">
          {selectedListHabit ? (
            <>
              <Button variant="ghost" onClick={handleEditHabit}>
                <EditIcon />
              </Button>
              <Button variant="ghost" onClick={handleDeleteHabit}>
                <TrashIcon />
              </Button>
              <Button variant="ghost" onClick={handleDeselectHabit}>
                <XIcon />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCreateHabit}><PlusIcon /></Button>
              <Button variant="ghost" onClick={() => setSettingsOpen(true)}>
                <Settings2Icon />
              </Button>
            </>
          )}
        </div>
      </header>

      <Settings open={settingsOpen} onClose={(value) => setSettingsOpen(value)} />

      {/* Headers */}
      <div className="flex flex-row gap-2 border-b pb-2 select-none">
        <div className="flex flex-grow-1 min-w-30 p-2"></div>
        <div className="grid items-center"
          style={{ gridTemplateColumns: `repeat(${visibleDatesCount}, var(--date-cell-width))` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}>
          {visibleDates.map((date) => (
            <div key={date} className="flex align-center justify-center w-full">
              <div className="text-center text-sm font-medium">
                {/* // Use date utils for parsing and display */}
                <p>{(() => {
                  const d = parseDateStringLocal(date);
                  return d.toLocaleDateString(undefined, { month: "short" });
                })()}</p>
                <p>
                  {(() => {
                    const d = parseDateStringLocal(date);
                    return d.getDate();
                  })()}
                </p>

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
            onLongPress={() => handleSelectHabit(habit)}
            isSelected={selectedListHabit?.id === habit.id}
          />
        ))}
      </div>
    </div>
  );
}

export default HabitTracker;