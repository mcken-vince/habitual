import { useEffect, useMemo, useRef, useState } from "react";
import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { HabitListItem } from "@/components/HabitListItem";
import { useHabits } from "@/hooks/useHabits";
import { HabitView } from "@/components/HabitView";
import { PlusIcon, Settings2Icon, EditIcon, TrashIcon, XIcon, ArchiveIcon, ArchiveRestoreIcon } from "lucide-react";
import { getDatesInRange, parseDateStringLocal } from "@/lib/dates";
import { Settings } from "@/components/Settings";
import { HabitFormSheet } from "./HabitFormSheet";

function HabitTracker() {
  const {
    habits,
    updateHabit,
    deleteHabit,
    updateCompletion,
    reorderHabits,
    toggleHabitIsArchived,
  } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habitFormOptions, setHabitFormOptions] = useState<{ open: boolean; initialHabit: Habit | undefined; }>({ open: false, initialHabit: undefined });
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [selectedListHabit, setSelectedListHabit] = useState<Habit | null>(null);
  const [visibleDatesCount, setVisibleDatesCount] = useState<number>(5);
  const [visibleDates, setVisibleDates] = useState<string[]>(getDatesInRange(new Date(), visibleDatesCount));
  const [isScrollDragging, setIsScrollDragging] = useState<boolean>(false);
  const dragScrollStartX = useRef<number | null>(null);
  const [draggedHabitIndex, setDraggedHabitIndex] = useState<number | null>(null);
  const [dragOverHabitIndex, setDragOverHabitIndex] = useState<number | null>(null);
  const [isDraggingHabit, setIsDraggingHabit] = useState<boolean>(false);
  const [showArchivedHabits, setShowArchivedHabits] = useState<boolean>(false);

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

  const handleArchiveHabit = () => {
    if (selectedListHabit) {
      toggleHabitIsArchived(selectedListHabit.id, !selectedListHabit.isArchived);
      setSelectedListHabit(null); // Clear selection after archiving
    }
  }

  const visibleHabits = useMemo(() => {
    return habits.filter((habit) => showArchivedHabits ? true : !habit.isArchived);
  }, [habits, showArchivedHabits]);

  if (habitFormOptions.open) {
    return (
      <HabitFormSheet
        open={habitFormOptions.open}
        onSave={(habit) => {
          if (selectedHabit) {
            // Update selected habit if form was opened from HabitView
            setSelectedHabit(prev => ({ ...prev, ...habit }));
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

  // Handlers for horizontal scrolling across dates
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
      const maxStartDate = new Date(today);
      maxStartDate.setDate(today.getDate() - (visibleDatesCount - 1));

      if (direction === 1 && newStartDate > today) {
        setIsScrollDragging(false);
        dragScrollStartX.current = null;
        return;
      }

      setVisibleDates(getDatesInRange(newStartDate, visibleDatesCount));
      dragScrollStartX.current = clientX; // Reset drag start position
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
  }

  // Drag and drop handlers for habit reordering
  const handleDragStartForReorder = (e: React.DragEvent, habitId: string) => {
    const actualIndex = habits.findIndex(h => h.id === habitId);
    setDraggedHabitIndex(actualIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverForReorder = (e: React.DragEvent, habitId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const actualIndex = habits.findIndex(h => h.id === habitId);
    setDragOverHabitIndex(actualIndex);
  };

  const handleDragEndForReorder = () => {
    setDraggedHabitIndex(null);
    setDragOverHabitIndex(null);
  };

  const handleDropForReorder = (e: React.DragEvent, habitId: string) => {
    e.preventDefault();
    const dropIndex = habits.findIndex(h => h.id === habitId);
    if (draggedHabitIndex !== null && draggedHabitIndex !== dropIndex) {
      reorderHabits(draggedHabitIndex, dropIndex);
    }
    setDraggedHabitIndex(null);
    setDragOverHabitIndex(null);
  };

  // Touch-based drag and drop handlers for mobile
  const handleTouchStartForReorder = (e: React.TouchEvent, habitId: string) => {
    const actualIndex = habits.findIndex(h => h.id === habitId);
    // Only start drag if habit is selected
    if (selectedListHabit?.id !== habitId) return;

    setDraggedHabitIndex(actualIndex);
    setIsDraggingHabit(true);

    // Stop event propagation to prevent conflicts with other touch handlers
    e.stopPropagation();
  };

  const handleTouchMoveForReorder = (e: React.TouchEvent) => {
    if (!isDraggingHabit || draggedHabitIndex === null) return;

    const touch = e.touches[0];

    // Calculate which habit we're hovering over
    const habitElements = document.querySelectorAll('[data-habit-id]');
    let newDragOverIndex = draggedHabitIndex;

    for (let i = 0; i < habitElements.length; i++) {
      const element = habitElements[i] as HTMLElement;
      const rect = element.getBoundingClientRect();
      if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        const habitId = element.getAttribute('data-habit-id');
        if (habitId) {
          newDragOverIndex = habits.findIndex(h => h.id === habitId);
          break;
        }
      }
    }

    setDragOverHabitIndex(newDragOverIndex);
  };

  const handleTouchEndForReorder = () => {
    if (isDraggingHabit && draggedHabitIndex !== null && dragOverHabitIndex !== null && draggedHabitIndex !== dragOverHabitIndex) {
      reorderHabits(draggedHabitIndex, dragOverHabitIndex);
    }

    setDraggedHabitIndex(null);
    setDragOverHabitIndex(null);
    setIsDraggingHabit(false);
  };

  return (
    <div className="w-full" onMouseMove={handleMouseScroll} onMouseUp={endDragForScroll}
      onTouchMove={isDraggingHabit ? handleTouchMoveForReorder : handleTouchScroll}
      onTouchEnd={isDraggingHabit ? handleTouchEndForReorder : endDragForScroll}>
      {/* Header */}
      <header className="flex w-full items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-sm dark:bg-slate-900 dark:text-slate-200">
        <h1 className="text-2xl font-bold">Habitual</h1>
        <div className="flex flex-row gap-2">
          {selectedListHabit ? (
            <>
              <Button variant="ghost" onClick={handleEditHabit}>
                <EditIcon />
              </Button>
              <Button variant="ghost" onClick={handleArchiveHabit}>
                {selectedListHabit.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
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
              <Button
                variant={showArchivedHabits ? "default" : "ghost"}
                onClick={() => setShowArchivedHabits(!showArchivedHabits)}
              >
                <ArchiveIcon />
              </Button>
              <Button variant="ghost" onClick={() => setSettingsOpen(true)}>
                <Settings2Icon />
              </Button>
            </>
          )}
        </div>
      </header>

      <Settings open={settingsOpen} onClose={(value) => setSettingsOpen(value)} />

      {/* Archive status indicator */}
      {showArchivedHabits && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
          Showing archived habits
        </div>
      )}

      {/* Headers */}
      <div className="flex flex-row gap-2 border-b pb-2 select-none">
        <div className="flex flex-grow-1 min-w-30 p-2"></div>
        <div className="grid items-center"
          style={{ gridTemplateColumns: `repeat(${visibleDatesCount}, var(--date-cell-width))` }}
          onMouseDown={handleMouseDownForScroll}
          onTouchStart={handleTouchStartForScroll}>
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
        {visibleHabits.map((habit) => {
          const actualIndex = habits.findIndex(h => h.id === habit.id);
          const isSelected = selectedListHabit?.id === habit.id;
          let wrapperClasses = 'border-slate-500 dark:border-slate-400'
          if (dragOverHabitIndex === actualIndex && draggedHabitIndex !== actualIndex) {
            if ((draggedHabitIndex ?? 0) >= actualIndex || actualIndex === 0) {
              wrapperClasses += ' border-t-2';
            } else {
              wrapperClasses += ' border-b-2';
            }
          }
          if (draggedHabitIndex === actualIndex) {
            wrapperClasses += ' opacity-50';
          }
          return (
            <div
              key={habit.id}
              data-habit-id={habit.id}
              draggable={isSelected}
              onDragStart={(e) => handleDragStartForReorder(e, habit.id)}
              onDragOver={(e) => handleDragOverForReorder(e, habit.id)}
              onDragEnd={handleDragEndForReorder}
              onDrop={(e) => handleDropForReorder(e, habit.id)}
              onTouchStart={(e) => handleTouchStartForReorder(e, habit.id)}
              className={wrapperClasses}
              style={{ touchAction: isSelected ? 'none' : 'auto' }} // Prevent touch scrolling when reordering
            >
              <HabitListItem
                habit={habit}
                visibleDates={visibleDates}
                updateCompletion={updateCompletion}
                onClick={() => openHabitView(habit)}
                onLongPress={() => handleSelectHabit(habit)}
                isSelected={isSelected}
                isDraggable={isSelected}
              />
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default HabitTracker;