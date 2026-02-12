'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/test-questions');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch questions');
        }
        
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <div className="p-4">Loading questions...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Questions from Database</h1>
      <p className="mb-4">Total questions: {questions.length}</p>
      
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="border p-4 rounded">
            <h3 className="font-semibold">{q.question}</h3>
            <ul className="mt-2 space-y-1">
              {q.options.map((opt: string, idx: number) => (
                <li key={idx} className="ml-4">
                  {String.fromCharCode(65 + idx)}. {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}