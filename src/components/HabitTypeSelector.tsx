import { Button } from "./ui/button";

export const HabitTypeSelector = ({ handleTypeSelection }: { handleTypeSelection: (type: "boolean" | "measurable") => void }) => {
  const HABIT_TYPES = [
    {
      value: "boolean" as const,
      title: "Yes/No Habit",
      description: "Track completion (e.g., \"Did I exercise today?\")",
    },
    {
      value: "measurable" as const,
      title: "Measurable Habit",
      description: "Track quantities (e.g., \"How many km did I run?\")",
    },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4">What type of habit would you like to create?</h3>
        <div className="space-y-3">
          {HABIT_TYPES.map((type) => (
            <Button
              key={type.value}
              variant="outline"
              className="w-full h-auto p-4 text-left"
              onClick={() => handleTypeSelection(type.value)}
            >
              <div>
                <div className="font-medium">{type.title}</div>
                <div className="text-sm text-muted-foreground">
                  {type.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}