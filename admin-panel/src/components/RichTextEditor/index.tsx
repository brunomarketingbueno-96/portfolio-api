import { useRef, useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { UploadService } from '@/services/uploadService';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface QuillEditorInstance {
  getSelection: () => { index: number; length: number } | null;
  getLength: () => number;
  insertEmbed: (index: number, type: string, value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const { t } = useTranslation();
  const quillRef = useRef<ReactQuill>(null);
  const [showSource, setShowSource] = useState(false);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const url = await UploadService.uploadImage(file, 'blog-posts', `inline-${Date.now()}`);
          const quill = quillRef.current?.getEditor() as QuillEditorInstance | undefined;

          if (quill) {
            const range = quill.getSelection();
            const position = range ? range.index : quill.getLength();
            quill.insertEmbed(position, 'image', url);
          }
        } catch (error) {
          console.error(t('blog_posts.editor.errors.upload_log'), error);
          alert(t('blog_posts.editor.errors.upload_alert'));
        }
      }
    };
  }, [t]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }, { 'header': [2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  return (
    <div className="rich-text-wrapper relative flex flex-col gap-2">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowSource(!showSource)}
          className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          {showSource ? (
            <>
              <span className="text-sm">👁️</span> {t('blog_posts.editor.buttons.preview')}
            </>
          ) : (
            <>
              <span className="text-sm">🧑‍💻</span> {t('blog_posts.editor.buttons.html_code')}
            </>
          )}
        </button>
      </div>

      <div className="rich-text-container bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-600">
        {showSource ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-75 p-4 font-mono text-sm bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-300 resize-y outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('blog_posts.editor.placeholders.html')}
          />
        ) : (
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value || ''}
            onChange={onChange}
            modules={modules}
            className="dark:text-white [&_.ql-editor]:min-h-75"
          />
        )}
      </div>
    </div>
  );
}
