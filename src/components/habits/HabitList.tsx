import { Habit } from "@/types";
import { HabitListItem } from "./HabitListItem";
import { HabitListHeader } from "./HabitListHeader";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useDateScrolling } from "@/hooks/useDateScrolling";
import { useHabits } from "@/hooks/useHabits";

interface HabitListProps {
  habits: Habit[];
  visibleHabits: Habit[];
  selectedListHabit: Habit | null;
  onHabitClick: (habit: Habit) => void;
  onHabitSelect: (habit: Habit) => void;
}

export function HabitList({
  habits,
  visibleHabits,
  selectedListHabit,
  onHabitClick,
  onHabitSelect,
}: HabitListProps) {
  const { updateCompletion, reorderHabits } = useHabits();
  const {
    draggedHabitIndex,
    dragOverHabitIndex,
    isDraggingHabit,
    handleDragStartForReorder,
    handleDragOverForReorder,
    handleDragEndForReorder,
    handleDropForReorder,
    handleTouchStartForReorder,
    handleTouchMoveForReorder,
    handleTouchEndForReorder,
  } = useDragAndDrop(habits, selectedListHabit, reorderHabits);
  const {
    visibleDates,
    handleMouseDownForScroll,
    handleTouchStartForScroll,
    handleMouseScroll,
    handleTouchScroll,
    endDragForScroll,
  } = useDateScrolling();

  return (
    <div
      className="w-full"
      onMouseMove={handleMouseScroll}
      onMouseUp={endDragForScroll}
      onTouchMove={isDraggingHabit ? handleTouchMoveForReorder : handleTouchScroll}
      onTouchEnd={isDraggingHabit ? handleTouchEndForReorder : endDragForScroll}
    >
      <HabitListHeader
        visibleDates={visibleDates}
        onMouseDown={handleMouseDownForScroll}
        onTouchStart={handleTouchStartForScroll}
      />

      <div>
        {visibleHabits.map((habit) => {
          const actualIndex = habits.findIndex(h => h.id === habit.id);
          const isSelected = selectedListHabit?.id === habit.id;

          let wrapperClasses = 'border-slate-500 dark:border-slate-400';
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
              style={{ touchAction: isSelected ? 'none' : 'auto' }}
            >
              <HabitListItem
                habit={habit}
                visibleDates={visibleDates}
                updateCompletion={updateCompletion}
                onClick={() => onHabitClick(habit)}
                onLongPress={() => onHabitSelect(habit)}
                isSelected={isSelected}
                isDraggable={isSelected}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}