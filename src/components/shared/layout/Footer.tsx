// auto-blog-service\src\components\layout\Footer.tsx
// Footer 컴포넌트: 애플리케이션의 하단 푸터 영역을 렌더링합니다.

'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © 2025 Auto Blog Service. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          Powered by Gemini AI · Built with Next.js
        </div>
      </div>
    </footer>
  );
};

export default Footer;