import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const colors = [
  { value: "#FF0000", label: "Red" },
  { value: "#00FF00", label: "Green" },
  { value: "#0000FF", label: "Blue" },
  { value: "#FFA500", label: "Orange" },
  { value: "#800080", label: "Purple" },
  { value: "#00FFFF", label: "Cyan" },
  { value: "#FFC0CB", label: "Pink" },
  { value: "#808080", label: "Gray" },
]

const ColorSelectItem = ({ value, label }: { value: string; label: string }) => {
  return (
    <SelectItem value={value}>
      <div className="flex flex-row items-center">
        <div
          className="w-4 h-4 rounded-full mr-2"
          style={{ backgroundColor: value }} />
        {label}
      </div>
    </SelectItem>
  )

}

export const ColorSelect = ({ color, onChange }: { color: string; onChange: (color: string) => void }) => {
  return (
    <Select
      value={color || colors[0].value}
      onValueChange={(value) =>
        onChange(value)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a color" />
      </SelectTrigger>
      <SelectContent>
        {colors.map((color) => (
          <ColorSelectItem key={color.value} value={color.value} label={color.label} />
        ))}
      </SelectContent>
    </Select>
  )

}