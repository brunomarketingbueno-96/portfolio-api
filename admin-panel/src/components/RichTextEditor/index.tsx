import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import CodeEditor from '@uiw/react-textarea-code-editor';
import { html_beautify } from 'js-beautify';

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
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setEditorTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const getDecodedAndFormattedSourceCode = (html: string) => {
    if (!html) return '';

    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    const decoded = txt.value.replace(/\u00a0/g, ' ');

    return html_beautify(decoded, {
      indent_size: 2,
      wrap_line_length: 120,
      preserve_newlines: false,
    });
  };

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
      <div className="flex justify-between">
        <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 ml-1 transition-colors duration-300">
          {t('pages.blog_posts.create.sections.post_content', { defaultValue: 'Content' })}
        </label>

        <button
          type="button"
          onClick={() => setShowSource(!showSource)}
          className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          {showSource ? (
            <>
              <span className="text-sm">👁️</span> {t('forms.blog_posts.buttons.preview')}
            </>
          ) : (
            <>
              <span className="text-sm">🧑‍💻</span> {t('forms.blog_posts.buttons.source_code')}
            </>
          )}
        </button>
      </div>

      <div className="rich-text-container bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-600">
        {showSource ? (
          <div className="w-full min-h-75 resize-y overflow-auto bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <CodeEditor
              value={getDecodedAndFormattedSourceCode(value)}
              language="html"
              placeholder={t('blog_posts.editor.placeholders.html')}
              onChange={(e) => onChange(e.target.value)}
              padding={16}
              data-color-mode={editorTheme} // Injeta o tema dinâmico (resolve o contraste)
              className="w-full h-full min-h-75 outline-none font-mono text-sm bg-transparent"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
                backgroundColor: 'transparent',
              }}
            />
          </div>
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
