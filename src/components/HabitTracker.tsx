import { useState } from "react";
import { Habit } from "@/types";
import { useHabits } from "@/hooks/useHabits";
import { HabitView } from "@/components/HabitView";
import { Settings } from "@/components/Settings";
import { HabitFormSheet } from "@/components/HabitFormSheet";
import { HabitTrackerHeader } from "@/components/HabitTrackerHeader";
import { HabitList } from "@/components/HabitList";
import { useHabitSelection } from "@/hooks/useHabitSelection";
import { useHabitForm } from "@/hooks/useHabitForm";

function HabitTracker() {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [showArchivedHabits, setShowArchivedHabits] = useState<boolean>(false);

  const { habits, updateHabit, deleteHabit, toggleHabitIsArchived } = useHabits();
  const { selectedListHabit, handleSelectListHabit, handleDeselectListHabit } = useHabitSelection();
  const { habitFormOptions, handleCreateHabit, handleEditHabit, resetHabitForm } = useHabitForm();

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

  const visibleHabits = habits.filter((habit) =>
    showArchivedHabits ? true : !habit.isArchived
  );

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
        showArchivedHabits={showArchivedHabits}
        onCreateHabit={handleCreateHabit}
        onEditHabit={() => {
          if (selectedListHabit) handleEditHabit(selectedListHabit);
        }}
        onArchiveHabit={handleArchiveHabit}
        onDeleteHabit={handleDeleteHabit}
        onDeselectHabit={handleDeselectListHabit}
        onToggleArchived={() => setShowArchivedHabits(!showArchivedHabits)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <Settings open={settingsOpen} onClose={(value) => setSettingsOpen(value)} />

      {showArchivedHabits && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
          Showing archived habits
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