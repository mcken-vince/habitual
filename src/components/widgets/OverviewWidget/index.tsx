import { useMemo } from "react";
import { Habit } from "@/types";
import { SimplePie } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateHabitScore } from "@/lib/scoring";
import { 
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateTotalCompletions,
  getRecentActivity,
  getActivityOpacity
} from "./helpers";

interface OverviewWidgetProps {
  habit: Habit;
}

interface StatItemProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

const StatItem = ({ label, value, sublabel }: StatItemProps) => (
  <div className="flex flex-col justify-center">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
    {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
  </div>
);

interface ActivityIndicatorProps {
  date: string;
  completed: boolean;
  value: number;
  color: string;
  target: number;
}

const ActivityIndicator = ({ date, completed, value, color, target }: ActivityIndicatorProps) => {
  const opacity = getActivityOpacity(value, target);
  
  return (
    <div
      className="w-2 h-8 rounded-sm transition-opacity"
      style={{
        backgroundColor: completed ? color : '#e5e7eb',
        opacity
      }}
      title={`${date}: ${completed ? `${value} ${value === 1 ? 'completion' : 'completions'}` : 'Missed'}`}
    />
  );
};

export const OverviewWidget = ({ habit }: OverviewWidgetProps) => {
  // Use memoized calculations for performance
  const stats = useMemo(() => ({
    score: calculateHabitScore(habit),
    currentStreak: calculateCurrentStreak(habit.history),
    longestStreak: calculateLongestStreak(habit.history),
    totalCompletions: calculateTotalCompletions(habit.history),
    recentActivity: getRecentActivity(habit.history, 30)
  }), [habit]);

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
              percentage={stats.score}
              color={habit.color}
              size={60}
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Score</p>
              <p className="text-2xl font-bold">{stats.score.toFixed(1)}%</p>
            </div>
          </div>

          <StatItem
            label="Current Streak"
            value={stats.currentStreak}
            sublabel="days"
          />

          <StatItem
            label="Best Streak"
            value={stats.longestStreak}
            sublabel="days"
          />

          <StatItem
            label="Total"
            value={stats.totalCompletions}
            sublabel={habit.unit || 'completions'}
          />
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Recent Activity
          </p>
          <div className="flex gap-1">
            {stats.recentActivity.map((day) => (
              <ActivityIndicator
                key={day.date}
                date={day.date}
                completed={day.completed}
                value={day.value}
                color={habit.color}
                target={habit.target}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last 30 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
