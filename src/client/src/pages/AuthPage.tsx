import { useState } from 'react';

import { AppBar } from '../components/AppBar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authActions, AuthFormMode } from '../store/slices/auth_slice';
// import { emailSchema } from '@shared/validations/auth_schema';

const EmailForm = () => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>();

  const onSubmit = async (event: React.MouseEvent) => {
    // const a = emailSchema.parse(email);
    // console.log(a);
  };

  return (
    <form id="authForm" className="space-y-4">
      <div>
        <label className="block text-white mb-[0.8rem]">Email Address</label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-white rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 invalid:border-red-500 transition"
        />
      </div>
      <br />
      <div>
        <button
          type="submit"
          id="submitBtn"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer"
          onClick={onSubmit}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export const AuthPage = () => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className="w-screen h-screen flex flex-col">
      <AppBar />
      {authState.isLoading && <center className="text-white">loading...</center>}
      <div className="flex justify-center pt-[10rem]">
        <div className="bg-[#0c0c0c] p-[2rem] rounded-[1rem] shadow-lg w-full max-w-md">
          <div className="flex justify-center">
            <button
              id="signUpBtn"
              className={`px-6 py-2 text-white font-semibold ${
                authState.authFormMode === AuthFormMode.SIGN_UP && 'border-b-2 border-blue-500'
              } focus:outline-none cursor-pointer`}
              onClick={() => dispatch(authActions.toggleAuthMode())}
            >
              Sign Up
            </button>
            <button
              id="signInBtn"
              className={`px-6 py-2 text-white font-semibold ${
                authState.authFormMode === AuthFormMode.SIGN_IN && 'border-b-2 border-blue-500'
              } focus:outline-none cursor-pointer`}
              onClick={() => dispatch(authActions.toggleAuthMode())}
            >
              Sign In
            </button>
          </div>
          <br />
          <EmailForm />
        </div>
      </div>
    </div>
  );
};
