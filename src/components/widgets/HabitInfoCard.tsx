import { Habit } from "@/types"

export const HabitInfoCard = ({ habit }: { habit: Habit }) => {
  return (
    <div className="rounded-lg bg-muted/30 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <p className="text-sm mt-0.5">
          {habit.type === "boolean" ? "Yes/No" : "Measurable"} •
          {` Created ${new Date(habit.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            }`}
        </p>
      </div>
      {habit.description && (
        <p className="text-sm text-muted-foreground">{habit.description}</p>
      )}
      <span className="text-sm font-medium">
        {habit.type === "boolean"
          ? `${habit.target} times every ${habit.frequencyDays} ${habit.frequencyDays === 1 ? 'day' : 'days'}`
          : `${habit.target} ${habit.unit} every ${habit.frequencyDays === 1 ? 'day' : `${habit.frequencyDays ?? '0'} days`}`
        }
      </span>
    </div>
  );
}