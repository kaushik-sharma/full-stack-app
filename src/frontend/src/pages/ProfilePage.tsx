import {
  PencilIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { DateTime } from 'luxon';
import React, { useState } from 'react';

import { AppBar } from '../components/AppBar';
import { IconButton } from '../components/IconButton';
import { Modal } from '../components/Modal';
import { LabeledInput } from '../components/LabeledInput';
// import { LabeledSelect } from '../components/LabeledSelect';

const DashedLine = () => (
  <svg className="w-full h-[2px] my-[1.4rem]" viewBox="0 0 100 2" preserveAspectRatio="none">
    <line
      x1="0"
      y1="1"
      x2="100"
      y2="1"
      stroke="#4B5563"
      strokeWidth="2"
      strokeDasharray="0.7,0.7"
    />
  </svg>
);

const DetailsTile: React.FC<{
  title1: string;
  value1: string;
  title2: string;
  value2: string;
}> = ({ title1, value1, title2, value2 }) => {
  const Item: React.FC<{ title: string; value: string }> = ({ title, value }) => (
    <div className="flex flex-1 flex-col overflow-hidden">
      <p className="text-[1rem] text-gray-500 font-light truncate">{title}</p>
      <p className="text-[1.3rem] text-white font-light break-all">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <Item title={title1} value={value1} />
        <div className="w-[1rem] flex-shrink-0" />
        <Item title={title2} value={value2} />
      </div>
      <div className="w-full h-[1px] bg-gray-800 mt-[0.8rem] mb-[1rem]" />
    </div>
  );
};

const ProfileImageCard = () => (
  <>
    <h2 className="text-white text-[2rem] font-bold text-center leading-[1.2]">John Doe</h2>
    <p className="text-green-400 text-[1rem] font-light text-center">{'Premium'.toUpperCase()}</p>
    <div className="h-[1rem]"></div>
    <div className="relative">
      <img
        src="https://cdn.getmerlin.in/cms/Screenshot_2024_04_05_130256_473f8428ec.png"
        className="w-full aspect-square rounded-full object-cover border-[1.4rem] border-[#4b4d51] overflow-hidden"
      />
      <div className="absolute top-1 right-0 border border-[#ffffff] rounded-full">
        <IconButton icon={PencilIcon} color="#ffffff" size={1.25} onClick={() => {}} />
      </div>
    </div>
  </>
);

const ProfileEditButton: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <IconButton icon={PencilIcon} color="#ffffff" size={1.2} onClick={() => setShow(true)} />
      <Modal open={show} onClose={() => setShow(false)} backgroundColor="#202020">
        <div className="flex flex-col px-[2rem] py-[1.4rem]">
          <h2 className="text-[1.4rem] text-white font-bold">Edit details</h2>
          <div className="h-[2rem]" />
          <div className="flex flex-row items-center justify-center">
            <LabeledInput type="text" label="First Name" />
            <div className="w-[1.5rem]" />
            <LabeledInput type="text" label="Last Name" />
          </div>
          <div className="h-[2rem]" />
          <div className="flex flex-row items-center justify-center">
            {/* <LabeledSelect options=[] label="Gender" /> */}
            <div className="w-[1.5rem]" />
            <LabeledInput type="date" label="Date of Birth" />
          </div>
          <div className="h-[3rem]" />
          <div className="flex flex-row items-center justify-end">
            <button
              onClick={() => {}}
              className="text-red-500 text-[1.2rem] font-normal hover:bg-[#ff000030] px-[1.25rem] py-[0.4rem] rounded-full transition cursor-pointer"
            >
              Cancel
            </button>
            <div className="w-[1.5rem]" />
            <button
              onClick={() => {}}
              className="text-white text-[1.2rem] font-normal bg-green-600 px-[1.25rem] py-[0.4rem] rounded-full transition cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const BioDetailsCard = () => {
  const formattedDob = DateTime.fromISO('2024-09-15').toFormat('MMM d, yyyy');

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <p className="text-white text-[1.1rem] font-bold">Bio & other details</p>
        <ProfileEditButton />
      </div>
      <div className="h-[2rem]"></div>
      <DetailsTile title1="First Name" value1="John" title2="Last Name" value2="Doe" />
      <DetailsTile title1="Gender" value1="MALE" title2="DoB" value2={formattedDob} />
      <DetailsTile
        title1="Phone Number"
        value1="+91 9876543210"
        title2="Email"
        value2="user@email.com"
      />
      <DetailsTile title1="Followers" value1="200" title2="Following" value2="100" />
    </>
  );
};

const ActiveSessionsCard = () => {
  const SessionTile: React.FC<{
    icon: React.ElementType;
    deviceName: string;
    platform: string;
    dateTime: string;
    isCurrent?: boolean;
  }> = ({ icon: Icon, deviceName, platform, dateTime, isCurrent = false }) => (
    <div className="flex flex-33 flex-row items-center">
      <Icon className="w-[2.5rem] text-white pr-[0.5rem] flex-shrink-0" />
      <div className="flex flex-col items-start overflow-hidden">
        <div className="flex flex-row items-start">
          <p className="text-[1.2rem] text-white font-medium truncate">{deviceName}</p>
          <div
            className={`bg-blue-200 px-[0.5rem] py-[0.2rem] ml-[1rem] rounded-[0.5rem] flex-shrink-0 ${
              isCurrent ? 'visible' : 'invisible'
            }`}
          >
            <p className="text-blue-800 text-[0.8rem]">CURRENT</p>
          </div>
        </div>
        <p className="text-gray-400 text-[0.85rem] mt-[0.2rem] truncate">
          {platform} · {dateTime}
        </p>
      </div>
      <p
        className="ml-[1rem] text-red-500 text-[1rem] font-light cursor-pointer flex-shrink-0"
        onClick={() => {}}
      >
        Log out
      </p>
    </div>
  );

  return (
    <div className="flex flex-row">
      <div className="flex flex-34 flex-col border border-[#4B5563] rounded-[1rem] px-[1.5rem] py-[1.5rem] overflow-hidden">
        <div className="flex flex-row items-center">
          <h2 className="text-white text-[1.2rem] font-bold">Active Sessions</h2>
          <div className="flex-grow" />
          <p
            className="ml-[1.25rem] text-red-500 text-[1rem] font-light cursor-pointer"
            onClick={() => {}}
          >
            Log out from all
          </p>
        </div>
        <div className="h-[1rem]" />
        <SessionTile
          icon={DevicePhoneMobileIcon}
          deviceName="Apple iOS 16 zxcxzcasdasdjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkq"
          platform="IOS"
          dateTime="Mar 4, 2024 at 10:36"
          isCurrent={true}
        />
        <div className="h-[0.8rem]" />
        <SessionTile
          icon={DevicePhoneMobileIcon}
          deviceName="Apple iOS 17 jwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkq"
          platform="IOS"
          dateTime="Mar 4, 2024 at 10:36"
        />
        <div className="h-[0.8rem]" />
        <SessionTile
          icon={ComputerDesktopIcon}
          deviceName="Windows 11 jwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkq"
          platform="WEB"
          dateTime="Mar 4, 2024 at 10:36 jwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkqjwkhejkhqwjkehjkqwhejkqhwejkhqwjkehjkqwhejkq"
        />
      </div>
      <div className="flex flex-66" />
    </div>
  );
};

// const PostsCommentsView = () => {
//   const PostsListView = () => {
//     return (
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <h2 className="text-white text-[1.2rem] font-bold">Posts</h2>
//       </div>
//     );
//   };

//   const CommentsListView = () => {
//     return (
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <h2 className="text-white text-[1.2rem] font-bold">Comments</h2>
//       </div>
//     );
//   };

//   return (
//     <div className="h-[400px] flex flex-row border border-[#4B5563] rounded-[1rem] px-[1.5rem] py-[1.5rem] overflow-hidden">
//       <PostsListView />
//       <div className="w-[1px] h-full bg-[#4B5563] mx-[1.5rem]" />
//       <CommentsListView />
//     </div>
//   );
// };

export const ProfilePage = () => (
  <div className="w-screen h-screen flex flex-col">
    <AppBar />
    <div className="px-[3rem] py-[1.5rem]">
      <h1 className="text-white text-[4rem] font-bold leading-[1.4]">Profile</h1>
      <p className="text-[#808080] text-[1rem] font-normal">View all your profile details here</p>
      <DashedLine />
      <div className="h-[2rem]" />
      <div className="flex flex-row">
        <div className="flex flex-34 flex-col items-center justify-center border border-[#4B5563] rounded-[1rem] px-[2.2rem] py-[1.3rem]">
          <ProfileImageCard />
        </div>
        <div className="flex flex-2" />
        <div className="flex flex-64 flex-col border border-[#4B5563] rounded-[1rem] px-[1.5rem] py-[1.8rem] overflow-hidden">
          <BioDetailsCard />
        </div>
      </div>
      <div className="h-[2rem]" />
      <ActiveSessionsCard />
      {/* <div className="h-[2rem]" />
      <PostsCommentsView /> */}
    </div>
  </div>
);
