import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusIcon, Settings2Icon, EditIcon, TrashIcon, XIcon, ArchiveIcon, ArchiveRestoreIcon } from "lucide-react";

interface HabitTrackerHeaderProps {
  selectedListHabit: Habit | null;
  showArchivedHabits: boolean;
  onCreateHabit: () => void;
  onEditHabit: () => void;
  onArchiveHabit: () => void;
  onDeleteHabit: () => void;
  onDeselectHabit: () => void;
  onToggleArchived: () => void;
  onOpenSettings: () => void;
}

export function HabitTrackerHeader({
  selectedListHabit,
  showArchivedHabits,
  onCreateHabit,
  onEditHabit,
  onArchiveHabit,
  onDeleteHabit,
  onDeselectHabit,
  onToggleArchived,
  onOpenSettings,
}: HabitTrackerHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-sm dark:bg-slate-900 dark:text-slate-200">
      <h1 className="text-2xl font-bold">Habitual</h1>
      <div className="flex flex-row gap-2">
        {selectedListHabit ? (
          <>
            <Button variant="ghost" onClick={onEditHabit}>
              <EditIcon />
            </Button>
            <Button variant="ghost" onClick={onArchiveHabit}>
              {selectedListHabit.isArchived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
            </Button>
            <Button variant="ghost" onClick={onDeleteHabit}>
              <TrashIcon />
            </Button>
            <Button variant="ghost" onClick={onDeselectHabit}>
              <XIcon />
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onCreateHabit}><PlusIcon /></Button>
            <Button
              variant={showArchivedHabits ? "default" : "ghost"}
              onClick={onToggleArchived}
            >
              <ArchiveIcon />
            </Button>
            <Button variant="ghost" onClick={onOpenSettings}>
              <Settings2Icon />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}