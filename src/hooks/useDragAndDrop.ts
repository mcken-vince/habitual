import { useState } from "react";
import { Habit } from "@/types";

export function useDragAndDrop(
  habits: Habit[],
  selectedListHabit: Habit | null,
  reorderHabits: (fromIndex: number, toIndex: number) => void
) {
  const [draggedHabitIndex, setDraggedHabitIndex] = useState<number | null>(null);
  const [dragOverHabitIndex, setDragOverHabitIndex] = useState<number | null>(null);
  const [isDraggingHabit, setIsDraggingHabit] = useState<boolean>(false);

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

  const handleTouchStartForReorder = (e: React.TouchEvent, habitId: string) => {
    const actualIndex = habits.findIndex(h => h.id === habitId);
    if (selectedListHabit?.id !== habitId) return;

    setDraggedHabitIndex(actualIndex);
    setIsDraggingHabit(true);
    e.stopPropagation();
  };

  const handleTouchMoveForReorder = (e: React.TouchEvent) => {
    if (!isDraggingHabit || draggedHabitIndex === null) return;

    const touch = e.touches[0];
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

  return {
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
  };
}