import { Habit } from "@/types"
import { parseDateStringLocal } from "./dates"

// Returns true if the habit is satisfied for the given date
export function isHabitSatisfiedOnDate(habit: Habit, date: string): boolean {
  const freqDays = habit.frequencyDays ?? 1
  const target = habit.target ?? 1
  const current = parseDateStringLocal(date)

  // Calculate window start (inclusive)
  const windowStart = new Date(current)
  windowStart.setDate(current.getDate() - freqDays + 1)

  // Sum completions in the window
  let sum = 0
  for (let i = 0; i < freqDays; i++) {
    const d = new Date(windowStart)
    d.setDate(windowStart.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    sum += habit.history[key] || 0
  }

  return sum >= target
}