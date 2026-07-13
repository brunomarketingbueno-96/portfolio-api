declare module 'react-quill' {
  import * as React from 'react';

  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    onChange?: (content: string, delta: unknown, source: string, editor: unknown) => void;
    modules?: unknown;
    formats?: string[];
    theme?: string;
    className?: string;
    readOnly?: boolean;
    bounds?: string | HTMLElement;
    placeholder?: string;
    preserveWhitespace?: boolean;
    [key: string]: unknown;
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {
    focus(): void;
    blur(): void;
    getEditor(): unknown;
  }
}
