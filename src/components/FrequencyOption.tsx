import { type FrequencyType } from "@/lib/habitFormHelpers";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface FrequencyOptionProps {
  id: FrequencyType;
  onSelect: (type: FrequencyType) => void;
  children: React.ReactNode;
}

export function FrequencyOption({ id, onSelect, children }: FrequencyOptionProps) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem value={id} id={id} />
      <label
        htmlFor={id}
        className="cursor-pointer flex items-center"
        onClick={() => onSelect(id)}
      >
        {children}
      </label>
    </div>
  );
}
