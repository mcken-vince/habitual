import { useState } from "react";
import { Habit } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HabitListItem } from "./HabitListItem";
import { useHabits } from "@/hooks/useHabits";

function HabitTracker() {
  const { habits, addHabit, updateCompletion } = useHabits();
  const [newHabit, setNewHabit] = useState<Partial<Habit> & { name: string; type: "boolean" | "measurable"; target: number; unit: string; description: string }>({
    name: "",
    description: "",
    type: "boolean",
    target: 1,
    unit: "",
  });
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      addHabit({
        id: Date.now().toString(),
        ...newHabit,
        history: {},
      });
      setNewHabit({ name: "", description: "", type: "boolean", target: 1, unit: "" });
      setHabitFormOpen(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full">
    {/* Header */}
      <header className="flex w-full items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold">Habitual</h1>
        <Sheet open={habitFormOpen} onOpenChange={() => {
          setHabitFormOpen(prev => !prev);
        }}>
          <SheetTrigger asChild>
            <Button>Add Habit</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full p-4">
            <SheetHeader className="flex flex-row justify-between">
              <SheetTitle>Create Habit</SheetTitle>
              <Button onClick={handleAddHabit}>Save</Button>
            </SheetHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Habit name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={newHabit.description}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Habit description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select
                  value={newHabit.type}
                  onValueChange={(value) => setNewHabit((prev) => ({ ...prev, type: value as Habit["type"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select habit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                    <SelectItem value="measurable">Numeric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newHabit.type === "measurable" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Value</label>
                    <Input
                      type="number"
                      value={newHabit.target}
                      onChange={(e) => setNewHabit((prev) => ({ ...prev, target: parseInt(e.target.value, 10) }))}
                      placeholder="Target value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <Input
                      value={newHabit.unit}
                      onChange={(e) => setNewHabit((prev) => ({ ...prev, unit: e.target.value }))}
                      placeholder="Unit (e.g., km, minutes)"
                    />
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>
<div  className="p-4 max-w-4xl mx-auto">

      {/* Habit List */}
      <ul className="space-y-4">
        {habits.map((habit) => (
          <HabitListItem key={habit.id} habit={habit} today={today} updateCompletion={updateCompletion} />
        ))}
      </ul>
        </div>
    </div>
  );
}

export default HabitTracker;