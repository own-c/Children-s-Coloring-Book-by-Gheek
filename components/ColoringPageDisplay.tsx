
import React from 'react';
import Spinner from './Spinner';

interface ColoringPageDisplayProps {
  coverImage: string | null;
  pageImages: string[];
  isLoading: boolean;
}

const LoadingPlaceholder: React.FC = () => (
    <div className="aspect-[4/3] bg-slate-200 rounded-lg animate-pulse flex items-center justify-center">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
    </div>
);

const ColoringPageDisplay: React.FC<ColoringPageDisplayProps> = ({ coverImage, pageImages, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8">
        <p className="text-center text-slate-600 mb-4 flex items-center justify-center gap-2">
            <Spinner /> Our creative robots are drawing your book...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <LoadingPlaceholder />
            {Array.from({ length: 5 }).map((_, index) => (
                <LoadingPlaceholder key={index} />
            ))}
        </div>
      </div>
    );
  }

  if (!coverImage && pageImages.length === 0) {
    return (
      <div className="mt-8 text-center py-12 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
        <p className="text-slate-500">Your generated coloring pages will appear here!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-700 mb-4">Your Coloring Book Preview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coverImage && (
          <div className="relative group">
            <img src={coverImage} alt="Coloring Book Cover" className="w-full h-auto object-cover rounded-lg shadow-md transition transform group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-br-lg rounded-tl-lg">Cover</div>
          </div>
        )}
        {pageImages.map((src, index) => (
          <div key={index} className="relative group">
            <img src={src} alt={`Coloring Page ${index + 1}`} className="w-full h-auto object-cover rounded-lg shadow-md transition transform group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-br-lg rounded-tl-lg">Page {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColoringPageDisplay;
