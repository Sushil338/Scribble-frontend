import { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/ws-scribble';

const looksLikeAuthFailure = (frame) => {
    const msg = `${frame?.headers?.message || ''} ${frame?.body || ''}`.toLowerCase();
    return (
        /401|403|unauthori[sz]ed|jwt|token|expired|invalid.*token|authentication/i.test(msg) ||
        /access denied/i.test(msg)
    );
};

export const useScribbleSocket = (roomCode, onDrawReceived, onChatReceived) => {
    const clientRef = useRef(null);
    const drawHandlerRef = useRef(onDrawReceived);
    const chatHandlerRef = useRef(onChatReceived);
    const [connected, setConnected] = useState(false);
    const [socketError, setSocketError] = useState('');

    useEffect(() => {
        drawHandlerRef.current = onDrawReceived;
    }, [onDrawReceived]);

    useEffect(() => {
        chatHandlerRef.current = onChatReceived;
    }, [onChatReceived]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!roomCode || !token) {
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_BASE_URL),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 3000,
            debug: () => {},
            onConnect: () => {
                setConnected(true);
                setSocketError('');

                client.subscribe(`/topic/room/${roomCode}`, (message) => {
                    if (message.body && drawHandlerRef.current) {
                        drawHandlerRef.current(JSON.parse(message.body));
                    }
                });

                client.subscribe(`/topic/chat/${roomCode}`, (message) => {
                    if (message.body && chatHandlerRef.current) {
                        chatHandlerRef.current(JSON.parse(message.body));
                    }
                });
            },
            onStompError: (frame) => {
                setConnected(false);
                setSocketError(frame.headers?.message || 'WebSocket connection failed.');
                if (looksLikeAuthFailure(frame)) {
                    localStorage.clear();
                    window.dispatchEvent(new CustomEvent('scribble:session-expired'));
                }
            },
            onWebSocketClose: (event) => {
                setConnected(false);
                const reason = `${event?.reason || ''}`;
                if (reason && looksLikeAuthFailure({ body: reason })) {
                    localStorage.clear();
                    window.dispatchEvent(new CustomEvent('scribble:session-expired'));
                }
            }
        });

        clientRef.current = client;
        client.activate();

        return () => {
            client.deactivate();
            clientRef.current = null;
            setConnected(false);
        };
    }, [roomCode]);

    const sendDrawData = useCallback((data) => {
        if (!clientRef.current || !connected || !roomCode) {
            return;
        }

        clientRef.current.publish({
            destination: `/app/draw/${roomCode}`,
            body: JSON.stringify(data)
        });
    }, [connected, roomCode]);

    const sendChatMessage = useCallback((message) => {
        if (!clientRef.current || !connected || !roomCode || !message.trim()) {
            return;
        }

        clientRef.current.publish({
            destination: `/app/chat/${roomCode}`,
            body: JSON.stringify({ message })
        });
    }, [connected, roomCode]);

    const sendRoomAction = useCallback((action) => {
        if (!clientRef.current || !connected || !roomCode) {
            return;
        }

        clientRef.current.publish({
            destination: `/app/draw/${roomCode}`,
            body: JSON.stringify(action)
        });
    }, [connected, roomCode]);

    return { connected, socketError, sendDrawData, sendChatMessage, sendRoomAction };
};
