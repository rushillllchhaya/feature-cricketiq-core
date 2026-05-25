import { useState, useCallback } from 'react';

export function useAnalyst() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const analyse = useCallback(async (query, newbieMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, newbieMode, conversationHistory: history })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
      setHistory(prev => [
        ...prev,
        { role: 'user', content: query },
        { role: 'assistant', content: JSON.stringify(data) }
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setResult(null);
    setError(null);
  }, []);

  return { analyse, loading, result, error, clearHistory };
}
