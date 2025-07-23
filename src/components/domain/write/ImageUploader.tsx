// auto-blog-service\src\components\domain\write\ImageUploader.tsx
// ImageUploader 컴포넌트: 이미지 파일을 업로드하고 미리보기를 제공하는 UI를 렌더링합니다.

import React, { useState, useRef, useCallback } from 'react';

interface ImageFile {
  file: File;
  url: string;
  id: string;
  name: string;
  size: number;
}

interface ImageUploaderProps {
  onImagesChange: (images: ImageFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  className?: string;
  label?: string;
  multiple?: boolean;
  preview?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  maxFiles = 5,
  maxSize = 10, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = "",
  label = "이미지 업로드",
  multiple = true,
  preview = true
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `지원하지 않는 파일 형식입니다. (${acceptedTypes.join(', ')})`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기가 너무 큽니다. (최대 ${maxSize}MB)`;
    }
    return null;
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: ImageFile[] = [];
    let errorMessage = '';

    // 파일 개수 체크
    if (images.length + fileArray.length > maxFiles) {
      errorMessage = `최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`;
      setError(errorMessage);
      return;
    }

    fileArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errorMessage = validationError;
        return;
      }

      const imageFile: ImageFile = {
        file,
        url: URL.createObjectURL(file),
        id: generateId(),
        name: file.name,
        size: file.size
      };
      validFiles.push(imageFile);
    });

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);
    onImagesChange(newImages);
    setError('');
  }, [images, maxFiles, maxSize, acceptedTypes, onImagesChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (id: string) => {
    const newImages = images.filter(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.url);
        return false;
      }
      return true;
    });
    setImages(newImages);
    onImagesChange(newImages);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm text-gray-600">
            클릭하거나 파일을 여기로 드래그하세요
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {acceptedTypes.join(', ')} • 최대 {maxSize}MB • {maxFiles}개까지
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Image Preview */}
      {preview && images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            업로드된 이미지 ({images.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group border border-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-600 truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;