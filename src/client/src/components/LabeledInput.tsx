export const LabeledInput: React.FC<{ type: string; label: string }> = ({ type, label }) => (
  <div className="relative inline-block">
    <label
      className="
        absolute 
        top-0 left-3
        -translate-y-1/2 
        bg-[#1a202c] 
        px-1 
        text-[0.9rem] text-white
        pointer-events-none
      "
    >
      {label}
    </label>
    <input
      type={type}
      className="w-[20rem] border border-white rounded-[0.5rem] px-[1rem] py-[0.6rem] text-[1.2rem] text-white font-light"
    />
  </div>
);
