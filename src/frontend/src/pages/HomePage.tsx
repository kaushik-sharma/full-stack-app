import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import { AppBar } from '../components/AppBar';
import { PostCard } from '../components/PostCard';

export const HomePage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <AppBar profileImageUrl="https://image-processor-storage.s3.us-west-2.amazonaws.com/images/3cf61c1011912a2173ea4dfa260f1108/halo-of-neon-ring-illuminated-in-the-stunning-landscape-of-yosemite.jpg" />
      <div className="flex-1 w-full">
        <Virtuoso
          totalCount={10}
          itemContent={(index) => (
            <div className="flex justify-center pb-[2rem]">
              <PostCard />
            </div>
          )}
          components={{
            Header: () => <div className="h-[2rem]" />,
          }}
        />
      </div>
    </div>
  );
};
