import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { MediaLibraryModal } from '../media/MediaLibraryModal';
import { MediaAsset } from '../../types';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Undo,
  Redo,
  Unlink
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  minHeight = '360px'
}) => {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-editorial-red underline font-medium hover:opacity-80',
          rel: 'noopener noreferrer'
        }
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'rounded my-4 max-w-full h-auto mx-auto shadow-sm'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4 border border-slate-300 dark:border-navy-700'
        }
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 dark:border-navy-700 bg-slate-100 dark:bg-navy-800 p-2 font-bold text-left'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 dark:border-navy-700 p-2'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setRawHtml(html);
      onChange(html);
    }
  });

  // Sync external content update if editor is not active/focused
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused && !isSourceMode) {
      editor.commands.setContent(content, { emitUpdate: false });
      setRawHtml(content);
    }
  }, [content, editor, isSourceMode]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawHtml(val);
    onChange(val);
  };

  const handleToggleSource = () => {
    if (isSourceMode) {
      // Switching from source to WYSIWYG
      editor?.commands.setContent(rawHtml, { emitUpdate: true });
      setIsSourceMode(false);
    } else {
      // Switching from WYSIWYG to source
      setRawHtml(editor?.getHTML() || '');
      setIsSourceMode(true);
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter external or internal URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleMediaSelect = (asset: MediaAsset) => {
    if (!editor) return;
    const imageUrl = asset.secureUrl || asset.url;
    editor.chain().focus().setImage({
      src: imageUrl,
      alt: asset.alt || asset.originalFilename,
      title: asset.caption || ''
    }).run();
  };

  if (!editor) {
    return (
      <div className="h-64 flex items-center justify-center border border-slate-200 dark:border-navy-700 rounded bg-slate-50 dark:bg-navy-900 text-xs text-slate-400">
        Loading TipTap Rich Text Editor...
      </div>
    );
  }

  return (
    <div className="border border-slate-200 dark:border-navy-700 rounded-lg overflow-hidden bg-white dark:bg-navy-850 shadow-sm focus-within:border-editorial-red transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-900 text-slate-700 dark:text-slate-300">
        {/* History */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 dark:border-navy-750">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-navy-800 disabled:opacity-30"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-navy-800 disabled:opacity-30"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 dark:border-navy-750">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded font-bold text-xs ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded font-bold text-xs ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded font-bold text-xs ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Formatting */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 dark:border-navy-750">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded ${
              editor.isActive('bold')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded ${
              editor.isActive('italic')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded ${
              editor.isActive('underline')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded ${
              editor.isActive('strike')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 dark:border-navy-750">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded ${
              editor.isActive({ textAlign: 'left' })
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded ${
              editor.isActive({ textAlign: 'center' })
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 rounded ${
              editor.isActive({ textAlign: 'right' })
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-1.5 rounded ${
              editor.isActive({ textAlign: 'justify' })
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 dark:border-navy-750">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded ${
              editor.isActive('bulletList')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded ${
              editor.isActive('orderedList')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded ${
              editor.isActive('blockquote')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inserts: Links, Media library images, Tables */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200 dark:border-navy-750">
          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded ${
              editor.isActive('link')
                ? 'bg-editorial-red text-white'
                : 'hover:bg-slate-200 dark:hover:bg-navy-800'
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-rose-500"
              title="Remove Link"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-editorial-red font-semibold flex items-center gap-1"
            title="Insert Image from Media Library"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Media</span>
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-navy-800"
            title="Insert Table (3x3)"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Source Toggle */}
        <button
          type="button"
          onClick={handleToggleSource}
          className={`p-1.5 rounded text-xs flex items-center gap-1 font-mono ${
            isSourceMode
              ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900'
              : 'hover:bg-slate-200 dark:hover:bg-navy-800'
          }`}
          title="Toggle Source HTML"
        >
          <Code className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase font-bold">{isSourceMode ? 'WYSIWYG' : 'HTML'}</span>
        </button>
      </div>

      {/* Editor Content Area */}
      {isSourceMode ? (
        <textarea
          value={rawHtml}
          onChange={handleSourceChange}
          className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 focus:outline-none"
          style={{ minHeight }}
        />
      ) : (
        <EditorContent
          editor={editor}
          className="p-4 sm:p-6 prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 focus:outline-none leading-relaxed text-sm"
          style={{ minHeight }}
        />
      )}

      {/* Media Picker Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        allowedTypes={['image']}
        title="Insert Image into Article Content"
      />
    </div>
  );
};
