import { useMemo, useState } from "react";
import { Habit } from "@/types";
import { useHabits } from "@/hooks/useHabits";
import { HabitView } from "@/components/HabitView";
import { Settings } from "@/components/Settings";
import { HabitFormSheet } from "@/components/HabitFormSheet";
import { HabitTrackerHeader } from "@/components/HabitTrackerHeader";
import { HabitList } from "@/components/HabitList";
import { useHabitSelection } from "@/hooks/useHabitSelection";
import { useHabitForm } from "@/hooks/useHabitForm";
import { useSettings } from "@/hooks/useSettings";
import { todayLocalString } from "@/lib/dates";

function HabitTracker() {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const { habits, updateHabit, deleteHabit, toggleHabitIsArchived } = useHabits();
  const { selectedListHabit, handleSelectListHabit, handleDeselectListHabit } = useHabitSelection();
  const { habitFormOptions, handleCreateHabit, handleEditHabit, resetHabitForm } = useHabitForm();
  const { settings } = useSettings();

  const openHabitView = (habit: Habit) => {
    handleDeselectListHabit();
    setSelectedHabit(habit);
  };

  const handleDeleteHabit = () => {
    if (selectedListHabit) {
      deleteHabit(selectedListHabit.id);
      handleDeselectListHabit();
    }
  };

  const handleArchiveHabit = () => {
    if (selectedListHabit) {
      toggleHabitIsArchived(selectedListHabit.id, !selectedListHabit.isArchived);
      handleDeselectListHabit();
    }
  };

  // Helper function to check if a boolean habit is completed today
  const isHabitCompletedToday = (habit: Habit): boolean => {
    if (habit.type !== "boolean") return false;
    const today = todayLocalString();
    return !!habit.history[today];
  };

  const visibleHabits = useMemo(() => habits.filter((habit) => {
    if (settings.hideArchivedHabits && habit.isArchived) return false;
    if (settings.hideCompletedHabits && isHabitCompletedToday(habit)) return false;
    return true;
  }),[settings.hideArchivedHabits, settings.hideCompletedHabits, habits]);

  if (habitFormOptions.open) {
    return (
      <HabitFormSheet
        open={habitFormOptions.open}
        onSave={(habit) => {
          if (selectedHabit) {
            setSelectedHabit(prev => ({ ...prev, ...habit }));
          }
        }}
        onClose={() => {
          resetHabitForm();
          handleDeselectListHabit();
        }}
        initialHabit={habitFormOptions.initialHabit}
      />
    );
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
          handleEditHabit(habit);
        }}
        onDeleteHabit={(id) => {
          deleteHabit(id);
          setSelectedHabit(null);
        }}
      />
    );
  }

  return (
    <div className="w-full">
      <HabitTrackerHeader
        selectedListHabit={selectedListHabit}
        onCreateHabit={handleCreateHabit}
        onEditHabit={() => {
          if (selectedListHabit) handleEditHabit(selectedListHabit);
        }}
        onArchiveHabit={handleArchiveHabit}
        onDeleteHabit={handleDeleteHabit}
        onDeselectHabit={handleDeselectListHabit}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <Settings open={settingsOpen} onClose={(value) => setSettingsOpen(value)} />

      {(!settings.hideArchivedHabits || settings.hideCompletedHabits) && (
        <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-sm text-blue-800 dark:text-blue-200">
          {!settings.hideArchivedHabits && settings.hideCompletedHabits && "Showing archived habits, hiding completed habits"}
          {!settings.hideArchivedHabits && !settings.hideCompletedHabits && "Showing archived habits"}
          {settings.hideArchivedHabits && settings.hideCompletedHabits && "Hiding completed habits"}
        </div>
      )}

      <HabitList
        habits={habits}
        visibleHabits={visibleHabits}
        selectedListHabit={selectedListHabit}
        onHabitClick={openHabitView}
        onHabitSelect={handleSelectListHabit}
      />
    </div>
  );
}

export default HabitTracker;