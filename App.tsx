
import React, { useState, useCallback, useRef } from 'react';
import { generateColoringImage, getChatResponse } from './services/geminiService';
import { generatePdf } from './utils/pdfGenerator';
import type { ChatMessage } from './types';

import Header from './components/Header';
import InputForm from './components/InputForm';
import ColoringPageDisplay from './components/ColoringPageDisplay';
import DownloadButton from './components/DownloadButton';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('space dinosaurs');
  const [childName, setChildName] = useState<string>('Alex');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatHistoryRef = useRef<ChatMessage[]>([]);
  chatHistoryRef.current = chatHistory;

  const handleGenerateClick = useCallback(async () => {
    if (!theme || !childName) {
      setError('Please provide both a theme and a name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPdfUrl(null);
    setGeneratedImages([]);
    setCoverImage(null);

    try {
      const coverPrompt = `A delightful coloring book cover for a child named '${childName}' with the theme '${theme}'. The style must be simple, black and white line art with very thick, bold outlines, perfect for a young child to color. No text other than the name '${childName}'.`;
      const coverPromise = generateColoringImage(coverPrompt);

      const pagePromises = Array.from({ length: 5 }, (_, i) => {
        const pagePrompt = `A coloring book page with the theme '${theme}'. Style: simple, fun, black and white line art with very thick, bold outlines, suitable for a young child to color. Ensure there is no text. This is page ${i + 1} of 5, make it unique from the others.`;
        return generateColoringImage(pagePrompt);
      });

      const [generatedCover, ...generatedPages] = await Promise.all([coverPromise, ...pagePromises]);
      
      setCoverImage(generatedCover);
      setGeneratedImages(generatedPages);

      const pdfBlobUrl = await generatePdf(generatedCover, generatedPages, childName, theme);
      setPdfUrl(pdfBlobUrl);

    } catch (e) {
      console.error(e);
      setError('Failed to generate coloring book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [theme, childName]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const responseText = await getChatResponse(chatHistoryRef.current, message);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setChatHistory(prev => [...prev, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: ChatMessage = { role: 'model', text: 'Oops! I had trouble responding. Please try again.' };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Create Your Coloring Book</h2>
            <InputForm
              theme={theme}
              setTheme={setTheme}
              childName={childName}
              setChildName={setChildName}
              onSubmit={handleGenerateClick}
              isLoading={isLoading}
            />
            {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            
            <ColoringPageDisplay
              coverImage={coverImage}
              pageImages={generatedImages}
              isLoading={isLoading}
            />
            
            <DownloadButton pdfUrl={pdfUrl} childName={childName} theme={theme} />
          </div>

          <div className="lg:col-span-1">
            <Chatbot
              history={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
