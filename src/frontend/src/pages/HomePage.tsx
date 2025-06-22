import React, { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import axios from 'axios';

import { AppBar } from '../components/AppBar';
import { PostCard } from '../components/PostCard';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  setTimeout(async () => {
    try {
      const response = await axios.get('/api/v1/auth/email/status/user@email.com');
      setData(response.data.data.userAction);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }, 3000);

  return (
    <div className="w-screen h-screen flex flex-col">
      <AppBar profileImageUrl="https://image-processor-storage.s3.us-west-2.amazonaws.com/images/3cf61c1011912a2173ea4dfa260f1108/halo-of-neon-ring-illuminated-in-the-stunning-landscape-of-yosemite.jpg" />
      <p className="text-white flex items-center justify-center">{data}</p>
      <div className="flex-1 w-full">
        <Virtuoso
          totalCount={10}
          itemContent={(index) => (
            <div className="flex justify-center pb-[2rem]">
              <PostCard depth={1} />
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
