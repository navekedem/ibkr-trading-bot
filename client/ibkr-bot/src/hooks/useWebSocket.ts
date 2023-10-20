import { useState, useEffect, useRef } from 'react';

export function useWebSocket(url: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState();
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setWs(socket);
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