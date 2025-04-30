import './App.css'
import HabitTracker from './components/HabitTracker'
import { HabitsProvider } from './hooks/useHabits'

function App() {

  return (
    <HabitsProvider>
      <HabitTracker />
    </HabitsProvider>
  )
}

export default App
