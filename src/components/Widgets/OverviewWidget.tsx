import { Habit } from "@/types";
import { SimplePie } from "@/components/SimplePie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateHabitScore } from "@/lib/scoring";

export const OverviewWidget = ({ habit }: { habit: Habit }) => {
  const score = calculateHabitScore(habit);
  const totalCompletions = Object.values(habit.history).reduce((sum, value) => sum + (value || 0), 0);
  const currentStreak = calculateCurrentStreak(habit.history);
  const longestStreak = calculateLongestStreak(habit.history);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Score with Pie Chart */}
          <div className="flex items-center gap-4">
            <SimplePie
              percentage={score}
              color={habit.color}
              size={60}
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Score</p>
              <p className="text-2xl font-bold">{score.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{totalCompletions}</p>
            <p className="text-xs text-muted-foreground">{habit.unit || 'completions'}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-2">Recent Activity</p>
          <div className="flex gap-1">
            {getRecentActivity(habit.history, 30).map((day, index) => (
              <div
                key={index}
                className="w-2 h-8 rounded-sm"
                style={{
                  backgroundColor: day.completed ? habit.color : '#e5e7eb',
                  opacity: day.completed ? 1 : 0.3
                }}
                title={`${day.date}: ${day.completed ? 'Completed' : 'Missed'}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
function calculateCurrentStreak(history: Record<string, number>): number {
  if (Object.keys(history).length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from today and work backwards
  let currentDate = new Date(today);

  // Check if today has an entry and is completed
  let todayStr = currentDate.toISOString().split('T')[0];
  if (history[todayStr] && history[todayStr] > 0) {
    streak = 1;
    currentDate.setDate(currentDate.getDate() - 1);
  } else {
    // If today is not completed, check yesterday
    currentDate.setDate(currentDate.getDate() - 1);
    let yesterdayStr = currentDate.toISOString().split('T')[0];
    if (history[yesterdayStr] && history[yesterdayStr] > 0) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      return 0; // No recent activity
    }
  }

  // Continue backwards until we find a missing or incomplete day
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];

    if (history[dateStr] && history[dateStr] > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

function calculateLongestStreak(history: Record<string, number>): number {
  const completedDates = Object.keys(history)
    .filter(date => history[date] > 0)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (completedDates.length === 0) return 0;
  if (completedDates.length === 1) return 1;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i - 1]);
    const currDate = new Date(completedDates[i]);

    // Calculate the difference in days
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      // Consecutive days
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // Gap in dates, reset streak
      currentStreak = 1;
    }
  }

  return maxStreak;
};

function getRecentActivity(history: Record<string, number>, days: number): { date: string; completed: boolean; }[] {
  const activity = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    activity.push({
      date: dateStr,
      completed: history[dateStr] > 0
    });
  }

  return activity;
};
