export function Slider({ min, max, step, defaultValue, onValueChange }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value)])}
      className="w-full"
    />
  );
}