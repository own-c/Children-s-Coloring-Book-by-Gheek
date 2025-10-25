
import React from 'react';

interface DownloadButtonProps {
  pdfUrl: string | null;
  childName: string;
  theme: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ pdfUrl, childName, theme }) => {
  if (!pdfUrl) {
    return null;
  }

  const fileName = `${childName}s-${theme.replace(/\s+/g, '-')}-Coloring-Book.pdf`;

  return (
    <div className="mt-8 text-center">
      <a
        href={pdfUrl}
        download={fileName}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-cyan-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Your PDF
      </a>
    </div>
  );
};

export default DownloadButton;
