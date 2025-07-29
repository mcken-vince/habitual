interface MiniBarProps {
  value: number;
  max: number;
  label: string;
  color: string;
  width?: string;
}

export function MiniBar({ value, max, label, width = "w-2.5", color }: MiniBarProps) {
  const percent = max > 0 ? (value / max) * 100 : 0
  return (
    <div className={`h-full justify-end relative flex flex-col items-center ${width} mx-1.5 overflow-y-visible`}>
      <span
  className="absolute text-[10px]"
  style={{
    bottom: `calc(${percent}% + 2px)`, 
    left: "50%",
    transform: "translateX(-50%)"
  }}
>
  {value > 0 ? value : ""}
</span>
      <div className="relative h-full w-full flex items-end">
        <div
          className="rounded-t"
          style={{
            height: `${percent}%`,
            minHeight: value > 0 ? "8px" : "0",
            width: "100%",
            transition: "height 0.3s",
            backgroundColor: color
          }}
        />
      </div>
      <span className="absolute -bottom-7 text-[10px] mt-1 text-center break-words leading-tight">{label}</span>
    </div>
  )
}