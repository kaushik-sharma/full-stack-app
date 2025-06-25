import { useNavigate } from 'react-router-dom';

export const AppBar: React.FC<{
  profileImageUrl?: string;
}> = ({ profileImageUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#202020] sticky top-0 z-50 flex flex-row px-[3rem] py-[1rem] items-center">
      <h1
        className="text-teal-700 text-[2.5rem] font-black cursor-pointer"
        onClick={() => navigate('/')}
      >
        MyApp
      </h1>
      <div className="flex-grow" />
      {profileImageUrl && (
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate('/profile');
          }}
        >
          <img
            src={profileImageUrl!}
            alt="profile-image"
            className="w-[4rem] h-[4rem] rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
};
