import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageSelectorProps {
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string
}

export default function ImageSelector({ imagePreview, onFileChange, label }: ImageSelectorProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 ml-1">
        {label || t('global.components.image_selector.label', { defaultValue: 'Image' })}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg transition-colors p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-50 ${imagePreview
          ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          className="hidden"
          data-testid="file-input"
        />

        {imagePreview ? (
          <div className="w-full h-full flex flex-col items-center">
            <img
              src={imagePreview}
              alt={t('global.components.image_selector.preview_alt')}
              className="max-h-40 rounded shadow-sm object-contain"
            />
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium">
              {t('global.components.image_selector.change_image', { defaultValue: 'Change image' })}
            </p>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-zinc-400">
            <span className="text-4xl block mb-2">🖼️</span>
            <p className="mt-1 text-sm">{t('global.components.image_selector.upload_image', { defaultValue: 'Upload image' })}</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">{t('global.components.image_selector.file_limit', { defaultValue: 'PNG, JPEG, WEBP (max. 5MB)' })}</p>
          </div>
        )}
      </div>
    </div>
  );
}
