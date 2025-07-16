# Habitual

A modern, intuitive habit tracking application built with React, TypeScript, and Vite. Track your daily routines, measure your progress, and build better habits with beautiful visualizations and smart analytics.

## Features

### 🎯 **Two Types of Habits**
- **Boolean Habits**: Yes/No tracking (e.g., "Did I exercise today?")
- **Measurable Habits**: Quantity-based tracking (e.g., "How many kilometers did I run?")

### 📊 **Comprehensive Analytics**
- **Habit Scoring**: Intelligent scoring system that evaluates your consistency over time
- **Progress Tracking**: Visual progress bars for weekly, monthly, quarterly, and yearly targets
- **History Charts**: Interactive charts showing completion trends over different time periods
- **Calendar View**: Monthly calendar interface for viewing and editing habit completions

### 🔧 **Flexible Configuration**
- **Custom Frequencies**: Set habits to daily, weekly, monthly, or custom intervals
- **Personalized Targets**: Define specific goals for each habit
- **Color Coding**: Assign unique colors to organize and identify habits
- **Units**: Specify measurement units for quantitative habits (km, minutes, etc.)

### 🎨 **Modern Interface**
- **Clean Design**: Beautiful, responsive UI with dark mode support
- **Intuitive Navigation**: Easy-to-use interface with drag-and-drop reordering
- **Quick Actions**: Long-press gestures for rapid habit completion
- **Custom Filtering**: Hide completed or archived habits to focus on what matters

### 📈 **Smart Widgets**
- **Overview Widget**: Quick summary of habit details and current score
- **Targets Widget**: Visual progress bars for different time periods
- **Score Widget**: Historical performance charts with customizable time ranges
- **History Widget**: Completion frequency analysis by week, month, quarter, or year
- **Calendar Widget**: Interactive monthly calendar for detailed tracking

### ⚙️ **Customization Options**
- **Habit Management**: Create, edit, archive, and delete habits
- **View Settings**: Toggle visibility of completed and archived habits
- **Week Start**: Configure which day your week starts on
- **Data Persistence**: All data stored locally in your browser

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habitual
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

## Usage

### Creating Your First Habit

1. **Click the "+" button** in the top-right corner
2. **Choose your habit type**:
   - **Boolean**: For simple yes/no tracking
   - **Measurable**: For quantity-based tracking
3. **Fill in the details**:
   - Name your habit
   - Set a target (how many times or how much)
   - Choose frequency (daily, weekly, monthly, or custom)
   - Pick a color for easy identification
4. **Save** and start tracking!

### Tracking Progress

- **Quick completion**: Tap any date cell to mark completion
- **Detailed entry**: Long-press for measurable habits to enter specific values
- **Calendar view**: Click on a habit to see the full calendar interface
- **Bulk editing**: Use the calendar widget to quickly update multiple days

### Understanding Your Score

The habit scoring system evaluates your consistency over time using a sophisticated algorithm that:
- Weighs recent performance more heavily than past performance
- Considers your target frequency and completion rate
- Provides a percentage score from 0-100%
- Updates in real-time as you track completions

### Managing Habits

- **Edit**: Click the edit button to modify habit details
- **Archive**: Hide habits you're not actively working on
- **Delete**: Permanently remove habits you no longer need
- **Reorder**: Drag and drop to organize your habit list

## Technical Details

### Built With
- **React 19** - Modern React with concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Clean, consistent icons

### Architecture
- **Local Storage**: All data persists in browser's local storage
- **Context API**: State management for habits and settings
- **Custom Hooks**: Reusable logic for common operations
- **Component Library**: Modular, reusable UI components

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities

## Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Start building better habits today!** 🚀