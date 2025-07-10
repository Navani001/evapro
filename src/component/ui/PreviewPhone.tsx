"use client";
import React from "react";

interface PreviewPhoneProps {
  children: React.ReactNode;
}

export const PreviewPhone = ({ children }: PreviewPhoneProps) => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl max-w-sm mx-auto relative">
      {/* Phone Frame with enhanced styling */}
      <div className="bg-black rounded-3xl p-2 shadow-inner">
        <div className="bg-white rounded-2xl overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-10"></div>
          
          {/* Status Bar */}
          <div className="bg-gray-100 px-4 py-3 flex justify-between items-center text-xs pt-8">
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
              <span className="font-medium ml-2">Verizon</span>
            </div>
            <span className="font-medium">9:41 AM</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
              <div className="w-6 h-3 border border-gray-400 rounded-sm">
                <div className="w-4 h-2 bg-green-500 rounded-sm m-0.5"></div>
              </div>
            </div>
          </div>
          
          {/* Message Header with enhanced styling */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-4 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-primary-600 font-bold text-lg">B</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Brand Name</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-xs text-primary-100">Verified Business • Online</p>
              </div>
            </div>
            <div className="text-xs text-primary-200">RCS</div>
          </div>
          
          {/* Message Content with better spacing */}
          <div className="p-4 min-h-[320px] bg-gradient-to-b from-gray-50 to-gray-100 relative">
            {/* Background pattern for realism */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            </div>
            <div className="relative z-10">
              {children}
            </div>
          </div>
          
          {/* Message Input Area */}
          <div className="bg-white border-t border-gray-200 p-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-500 text-sm">Type a message...</span>
            </div>
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Phone reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-10 rounded-3xl pointer-events-none"></div>
    </div>
  );
};

export default PreviewPhone;
