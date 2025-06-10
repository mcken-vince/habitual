import { Habit } from "@/types";
import { SimplePie } from "./SimplePie";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { calculateHabitScore } from "@/lib/scoring";

export const HabitOverview = ({ habit }: { habit: Habit }) => {
  const score = calculateHabitScore(habit);
  return (
    <Card>
      <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
      <CardContent className="flex gap-4">
        <SimplePie
          percentage={score}
          color={habit.color}
          size={50}
        />
        <div>
          <p className="text-sm font-medium">Score:</p>
          <p>{score.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-sm font-medium">Description:</p>
          <p>{habit.description}</p>
        </div>
        {habit.type === "boolean" && habit.target && habit.frequencyDays && (
          <div>
            <p className="text-sm font-medium">Frequency:</p>
            <p>{habit.target} times every {habit.frequencyDays} days</p>
          </div>
        )}
        {habit.type === "measurable" && (
          <div className="">
            <p className="text-sm font-medium">Frequency:</p>
            <p>
              {habit.target} {habit.unit} every {habit.frequencyDays === 1 ? 'day' : `${habit.frequencyDays ?? '0'} days`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}