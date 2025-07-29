import './App.css'
import HabitTracker from './components/habits/HabitTracker'
import { HabitsProvider } from './hooks/useHabits'
import { SettingsProvider } from './hooks/useSettings'

function App() {

  return (
    <SettingsProvider>
      <HabitsProvider>
        <HabitTracker />
      </HabitsProvider>
    </SettingsProvider>
  )
}

export default App
