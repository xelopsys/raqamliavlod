import React, { useEffect, useRef } from 'react';
import QuillKey, { Quill } from 'quill';
import 'quill/dist/quill.snow.css';

const TextArea = ({
  handleSubmitText,
  isClear,
}: {
  handleSubmitText: (value: any) => void;
  isClear?: boolean;
}) => {
  const quillRef = useRef<Quill>();

  useEffect(() => {
    quillRef.current = new QuillKey('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block', 'link'],
        ],
      },
    });

    quillRef.current.on('text-change', handleTextChange);

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change', handleTextChange);
      }
    };
  }, []);

  const handleTextChange = () => {
    const content = quillRef.current && quillRef.current.root.innerHTML;
    handleSubmitText(content);
  };

  useEffect(() => {
    if (isClear) {
      quillRef.current?.setText('');
    }
  }, [isClear]);

  return (
    <div className='w-full'>
      <div
        id='editor'
        className='!w-full h-full'
        style={{ minHeight: '400px', width: '100%' }}></div>
    </div>
  );
};

export default TextArea;
