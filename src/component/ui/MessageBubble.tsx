"use client";
import React, { useState } from "react";

interface MessageBubbleProps {
  text: string;
  suggestions?: Array<{ text: string; postbackData: string }>;
}

export const MessageBubble = ({ text, suggestions }: MessageBubbleProps) => {
  const [clickedSuggestion, setClickedSuggestion] = useState<number | null>(null);

  const handleSuggestionClick = (index: number) => {
    setClickedSuggestion(index);
    setTimeout(() => setClickedSuggestion(null), 200);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Message Bubble with enhanced styling */}
      <div className="bg-white rounded-2xl rounded-bl-sm p-5 shadow-md border border-gray-100 max-w-[280px] relative group hover:shadow-lg transition-all duration-300">
        {/* Message indicator */}
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-l border-b border-gray-100 transform rotate-45"></div>
        
        <p className="text-gray-900 text-sm leading-relaxed">
          {text || (
            <span className="text-gray-400 italic">
              Enter message text to see preview
            </span>
          )}
        </p>
        
        {/* Typing indicator when no text */}
        {!text && (
          <div className="flex items-center gap-1 mt-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        
        {/* Message timestamp */}
        <div className="text-xs text-gray-400 mt-2 text-right">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Enhanced Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-col gap-2 max-w-[280px] animate-slide-up">
          <div className="text-xs text-gray-500 mb-1">Quick replies</div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(index)}
              className={`bg-white border-2 border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 text-left shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
                clickedSuggestion === index ? 'scale-95 bg-primary-100' : ''
              }`}
            >
              {suggestion.text}
            </button>
          ))}
        </div>
      )}
      
      {/* RCS features indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
        <span>Rich Communication Services</span>
      </div>
    </div>
  );
};

export default MessageBubble;
