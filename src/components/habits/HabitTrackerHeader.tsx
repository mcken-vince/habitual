import { Habit } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusIcon, Settings2Icon, EditIcon, TrashIcon, XIcon, ArchiveIcon, ArchiveRestoreIcon, ListFilterIcon } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface HabitTrackerHeaderProps {
  selectedListHabit: Habit | null;
  onCreateHabit: () => void;
  onEditHabit: () => void;
  onArchiveHabit: () => void;
  onDeleteHabit: () => void;
  onDeselectHabit: () => void;
  onOpenSettings: () => void;
}

export function HabitTrackerHeader({
  selectedListHabit,
  onCreateHabit,
  onEditHabit,
  onArchiveHabit,
  onDeleteHabit,
  onDeselectHabit,
  onOpenSettings,
}: HabitTrackerHeaderProps) {
  const { settings, updateSettings } = useSettings();
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilterIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Label className="flex items-center">
                    <Checkbox 
                      checked={settings.hideArchivedHabits}
                      onCheckedChange={(checked: boolean) => updateSettings({ hideArchivedHabits: checked })}
                      className="mr-2"
                    />
                    Hide Archived Habits
                  </Label>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Label className="flex items-center">
                    <Checkbox
                      checked={settings.hideCompletedHabits}
                      onCheckedChange={(checked: boolean) => updateSettings({ hideCompletedHabits: checked })}
                      className="mr-2"
                    />
                    Hide Completed Habits
                  </Label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" onClick={onOpenSettings}>
              <Settings2Icon />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}