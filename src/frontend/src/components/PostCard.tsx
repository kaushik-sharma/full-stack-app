import { useState, useRef, useEffect } from 'react';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

import { IconButton } from './IconButton';

const Divider: React.FC = () => <div className="w-[1.5px] h-full bg-[#888888]" />;

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Closes the menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const MenuItem: React.FC<{ text: string; onTap: () => void }> = ({ text, onTap }) => (
    <button className="w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={onTap}>
      {text}
    </button>
  );

  return (
    <div className="relative" ref={menuRef}>
      <IconButton
        icon={EllipsisHorizontalIcon}
        color="#dddddd"
        size={2}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute right-0 w-[10rem] bg-white rounded-[0.5rem] shadow-lg z-50 overflow-hidden">
          <MenuItem text="Report" onTap={() => {}} />
        </div>
      )}
    </div>
  );
};

const InteractionEl: React.FC<{
  icon: React.ElementType;
  text: string;
  onClick: () => void;
}> = ({ icon: Icon, text, onClick }) => (
  <div
    className="px-[10px] flex flex-[1] flex-row items-center justify-center cursor-pointer overflow-hidden"
    onClick={onClick}
  >
    <Icon className="w-[1.3rem] text-[#ffffff] flex-shrink-0" />
    <p className="pl-[0.5rem] text-[#ffffff] text-[1.1rem] font-light truncate overflow-hidden">
      {text}
    </p>
  </div>
);

export const PostCard: React.FC<{ depth: number }> = ({ depth }) => {
  return (
    <div className="w-[35rem] bg-[#303030] border-none rounded-[1rem] overflow-hidden">
      <img
        src="https://image-processor-storage.s3.us-west-2.amazonaws.com/images/3cf61c1011912a2173ea4dfa260f1108/halo-of-neon-ring-illuminated-in-the-stunning-landscape-of-yosemite.jpg"
        className="w-full aspect-[16/9] object-cover"
      />
      <div>
        <div className="flex flex-row px-[1rem] pt-[1rem] items-center">
          <div
            className="flex flex-row overflow-hidden cursor-pointer pr-[1rem]"
            onClick={() => {}}
          >
            <img
              src="https://image-processor-storage.s3.us-west-2.amazonaws.com/images/3cf61c1011912a2173ea4dfa260f1108/halo-of-neon-ring-illuminated-in-the-stunning-landscape-of-yosemite.jpg"
              className="w-[3.5rem] h-[3.5rem] object-cover rounded-full flex-shrink-0"
            />
            <div className="w-[0.8rem] flex-shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <h2 className="text-[#dddddd] text-[1.4rem] font-bold truncate overflow-hidden">
                John Doe
              </h2>
              <p className="text-[#888888] text-[0.95rem] font-medium truncate">11hr ago</p>
            </div>
          </div>
          <div className="flex-grow" />
          <Menu />
        </div>
        <div className="h-[0.6rem]" />
        <p className="text-[#c9c9c9] text-[1.2rem] px-[1rem]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque porta urna non odio
          venenatis blandit. Proin malesuada porta elementum. Integer luctus sagittis tempus.
          Vivamus tempor urna vulputate justo tristique imperdiet.
        </p>
        {depth > 0 ? <div /> : <div className="h-[1rem]" />}
        {depth > 0 && (
          <div className="transform scale-90">
            <div className="border border-[#ffffff] rounded-[1rem] overflow-hidden">
              <PostCard depth={depth - 1} />
            </div>
          </div>
        )}
        <div className="w-full h-[1.5px] bg-[#888888]" />
        <div className="flex flex-row h-[3.2rem] items-center justify-center">
          <InteractionEl icon={HandThumbUpIcon} text="200" onClick={() => {}} />
          <Divider />
          <InteractionEl icon={HandThumbDownIcon} text="50" onClick={() => {}} />
          <Divider />
          <InteractionEl icon={ChatBubbleOvalLeftIcon} text="456" onClick={() => {}} />
          <Divider />
          <InteractionEl icon={ArrowPathIcon} text="5" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};
