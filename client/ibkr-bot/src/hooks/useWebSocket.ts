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

    // socket.onmessage = (event) => {
    //   // setMessage(prevState => [...prevState, JSON.parse(event.data)]);
    //   // console.log(JSON.parse(event.data))
    //   dailyChartDataRef.current = [...dailyChartDataRef.current, JSON.parse(event.data)]
    //   setMessage(JSON.parse(event.data));
    // };

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