"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold as BoldIcon, Italic as ItalicIcon, List, Heading1, Table as TableIcon } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = "Write your detailed trade notes, lessons, and observations..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      ListItem,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[140px] px-4 py-3 text-sm',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#1F1F1F] rounded-3xl overflow-hidden bg-[#0F0F0F]">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-[#1F1F1F] bg-[#111] px-3 py-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-xl hover:bg-[#1F1F1F] ${editor.isActive('bold') ? 'bg-[#1F1F1F] text-white' : 'text-[#A1A1AA]'}`}
        >
          <BoldIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-xl hover:bg-[#1F1F1F] ${editor.isActive('italic') ? 'bg-[#1F1F1F] text-white' : 'text-[#A1A1AA]'}`}
        >
          <ItalicIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-xl hover:bg-[#1F1F1F] ${editor.isActive('heading', { level: 2 }) ? 'bg-[#1F1F1F] text-white' : 'text-[#A1A1AA]'}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-xl hover:bg-[#1F1F1F] ${editor.isActive('bulletList') ? 'bg-[#1F1F1F] text-white' : 'text-[#A1A1AA]'}`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded-xl hover:bg-[#1F1F1F] text-[#A1A1AA]"
        >
          <TableIcon size={16} />
        </button>

        <div className="flex-1" />
        <div className="text-[10px] text-[#555] px-2">Rich Journal • Inspired by Qunt Edge</div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
