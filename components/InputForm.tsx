
import React from 'react';
import Spinner from './Spinner';

interface InputFormProps {
  theme: string;
  setTheme: (theme: string) => void;
  childName: string;
  setChildName: (name: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ theme, setTheme, childName, setChildName, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-700 mb-1">Coloring Theme</label>
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., Magical Forest Animals"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-slate-700 mb-1">Child's Name</label>
          <input
            id="childName"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="e.g., Lily"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
            disabled={isLoading}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !theme || !childName}
        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <Spinner />
            Generating...
          </>
        ) : 'Create My Coloring Book'}
      </button>
    </form>
  );
};

export default InputForm;
