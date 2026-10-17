'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createNote } from '../../lib/api';

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required field'),
  content: Yup.string().max(500, 'Maximum 500 characters'),
  tag: Yup.string()
    .oneOf([
      'To Do',
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
    ])
    .required('Required field'),
});

interface NoteFormProps {
  onClose: () => void;
}

const NoteForm = ({ onClose }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const addNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    },
  });

  return (
    <Formik
      initialValues={{
        title: '',
        content: '',
        tag: 'Personal',
      }}
      validationSchema={NoteSchema}
      onSubmit={(values, actions) => {
        addNoteMutation.mutate(values, {
          onSettled: () => {
            actions.setSubmitting(false);
            actions.resetForm();
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field
              as="select"
              id="tag"
              name="tag"
              className={css.select}
            >
              <option value="Todo">To Do</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
