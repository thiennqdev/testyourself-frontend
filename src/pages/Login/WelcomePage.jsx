import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/login'); // This will redirect to the login page
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black/70">
      <img
        alt="Close-up of a person typing on a laptop keyboard with a hand on the trackpad, dark blue tone"
        className="absolute inset-0 w-full h-full object-cover"
        height="720"
        src="https://storage.googleapis.com/a1aa/image/2d617dd8-ce15-4c32-787d-0f21ad88af2d.jpg"
        width="1280"
      />
      <div className="relative text-center text-white px-4 max-w-md">
        <h1 className="font-semibold text-4xl leading-tight mb-2">
          Welcome to TestYourself
        </h1>
        <p className="text-3xl mb-6">Your gateway to online learning</p>
        <button 
          onClick={handleJoinClick}
          className="bg-teal-600 hover:bg-teal-700 text-xl rounded-full px-4 py-1 mb-2"
        >
          Join Here!
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;