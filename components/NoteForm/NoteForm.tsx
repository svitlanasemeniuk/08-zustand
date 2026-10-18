'use client';

import css from './NoteForm.module.css';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { Note } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';

interface NoteFormProps {
  onClose?: () => void;
}

const tags = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

export default function NoteForm({
  onClose,
}: NoteFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const addNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      clearDraft();

      if (onClose) {
        onClose();
      } else {
        router.push('/notes/filter/all');
      }
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    },
  });

  const handleAction = (formData: FormData) => {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as Note['tag'];

    addNoteMutation.mutate({
      title,
      content,
      tag,
    });
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <form action={handleAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title" className={css.label}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={50}
          className={css.input}
          placeholder="Enter note title..."
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content" className={css.label}>
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          maxLength={500}
          className={css.textarea}
          placeholder="Write your note here..."
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag" className={css.label}>
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          defaultValue="Todo"
          className={css.select}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={addNoteMutation.isPending}
          className={css.submitButton}
        >
          {addNoteMutation.isPending
            ? 'Creating...'
            : 'Create note'}
        </button>
      </div>
    </form>
  );
}
