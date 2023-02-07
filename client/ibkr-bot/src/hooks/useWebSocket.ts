import { useState, useEffect } from 'react';

export function useWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setWs(socket);
    };

    socket.onmessage = (event) => {
      setMessage(`${event.data}`);
    };

    socket.onclose = () => {
      setError('WebSocket closed');
    };

    socket.onerror = (error) => {
      setError(`Error in connection ${error}`);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return { ws, message, error };
}