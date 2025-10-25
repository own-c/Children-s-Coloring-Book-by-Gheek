
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 bg-white/50 rounded-2xl shadow-md backdrop-blur-sm">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        AI Coloring Book Creator
      </h1>
      <p className="mt-2 text-slate-600 text-lg">Bring your imagination to life!</p>
    </header>
  );
};

export default Header;
