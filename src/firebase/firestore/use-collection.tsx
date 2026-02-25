'use client';
import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot } from 'firebase/firestore';

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
        setData([]);
        setLoading(false);
        return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const result: T[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(result);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("useCollection error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
