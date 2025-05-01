import { Habit } from "@/types";
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
  // Generate an array of dates starting from today and going back 6 days
  const generateDates = (startDate: string, days: number) => {
    const dates = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < days; i++) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return dates;
  };

  const dates = generateDates(today, 7); // Generate 7 days of data (including today)

  return (
    <div className="grid grid-cols-[200px_repeat(7,1fr)] items-center gap-4 border-b py-2">
      {/* Habit Details */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{habit.name}</h3>
        <p className="text-sm text-muted-foreground">{habit.description}</p>
        {habit.type === "measurable" && (
          <p className="text-sm">
            Target: {habit.target} {habit.unit}
          </p>
        )}
      </div>

      {/* Habit Data for Each Day */}
      {dates.map((date) => (
        <div key={date} className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">{date}</span>
          <Button
            onClick={() =>
              updateCompletion(
                habit.id,
                date,
                habit.type === "boolean" ? 1 : 0
              )
            }
            variant={habit.history[date] ? "secondary" : "default"}
            className="mt-1"
          >
            {habit.type === "boolean"
              ? habit.history[date]
                ? "✔"
                : "✖"
              : habit.history[date] || 0}
          </Button>
        </div>
      ))}
    </div>
  );
}