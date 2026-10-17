// app/notes/filter/[...slug]/page.tsx
import NotesClient from './Notes.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/notes';

export default async function FilteredNotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;

  const currentTag = resolvedParams.slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', currentTag],
    queryFn: () =>
      fetchNotes({ page: 1, search: '', tag: currentTag }),
  });

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>
        Notes filtered by tag:{' '}
        <span style={{ textTransform: 'capitalize' }}>
          {currentTag}
        </span>
      </h2>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={currentTag} />
      </HydrationBoundary>
    </div>
  );
}
