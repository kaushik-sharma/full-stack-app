export const IconButton: React.FC<{
  icon: React.ElementType;
  color: string;
  size: number;
  onClick: () => void;
}> = ({ icon: Icon, color, size, onClick }) => {
  return (
    <div
      className="transition duration-200 active:bg-[#88888888] p-[0.5rem] rounded-full cursor-pointer flex-shrink-0"
      onClick={onClick}
    >
      <Icon style={{ color: color, width: `${size}rem` }} />
    </div>
  );
};
