import { Habit } from "../types";
import { Button } from "@/components/ui/button";

export function HabitListItem({
  habit,
  today,
  updateCompletion,
}: {
  habit: Habit;
  today: string;
  updateCompletion: (habitId: string, date: string, value: number) => void;
}) {
  return (
    <li className="p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold">{habit.name}</h3>
      <p className="text-sm text-muted-foreground">{habit.description}</p>
      <p className="text-sm">
        Type: <span className="font-medium">{habit.type === "boolean" ? "Yes/No" : "Numeric"}</span>
      </p>
      {habit.type === "measurable" && (
        <p className="text-sm">
          Target: {habit.target} {habit.unit}
        </p>
      )}
      <Button
        onClick={() => updateCompletion(habit.id, today, habit.type === "boolean" ? 1 : 0)}
        variant={habit.history[today] ? "secondary" : "default"}
        className="mt-2"
      >
        {habit.type === "boolean"
          ? habit.history[today]
            ? "Completed"
            : "Mark Done"
          : "Add Progress"}
      </Button>
    </li>
  );
}