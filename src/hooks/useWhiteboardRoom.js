import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/apiClient';
import { useScribbleSocket } from './useScribbleSocket';
import { readSavedCanvas } from '../utils/canvasStorage';
import { SHAPE_TOOLS, buildShapePath, strokeAndFillShape } from '../utils/canvasShapes';

export const useWhiteboardRoom = (scribble, onScribbleChange) => {
    const canvasRef = useRef(null);
    const drawingRef = useRef(false);
    const lastPointRef = useRef(null);
    const remotePointsRef = useRef({});
    const shapeDragRef = useRef(null);
    const shapeSnapshotRef = useRef(null);
    const snapshotTimerRef = useRef(null);

    const userId = localStorage.getItem('userId') || localStorage.getItem('username') || 'guest';
    const username = localStorage.getItem('username') || 'User';

    const [tool, setTool] = useState('pen');
    const [color, setColor] = useState('#111827');
    const [brushSize, setBrushSize] = useState(3);
    const [fillShape, setFillShape] = useState(false);
    const [status, setStatus] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    const getCanvasImage = useCallback(() => {
        return canvasRef.current.toDataURL('image/jpeg', 0.92);
    }, []);

    const drawPage = useCallback((pageData) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!pageData) {
            return;
        }

        const image = new Image();
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = pageData;
    }, []);

    useEffect(() => {
        drawPage(readSavedCanvas(scribble.canvasData));
        remotePointsRef.current = {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scribble.roomCode, drawPage]);

    useEffect(
        () => () => {
            if (snapshotTimerRef.current) {
                clearTimeout(snapshotTimerRef.current);
                snapshotTimerRef.current = null;
            }
        },
        []
    );

    const drawLine = useCallback((from, to, lineColor = '#111827', lineWidth = 3) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }, []);

    const drawShapeOnCanvas = useCallback((action) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const shape = action.shape;
        if (!shape || !SHAPE_TOOLS.includes(shape)) {
            return;
        }
        strokeAndFillShape(
            ctx,
            shape,
            action.x,
            action.y,
            action.x2,
            action.y2,
            action.color || '#111827',
            action.brushSize || 3,
            Boolean(action.filled)
        );
    }, []);

    const scheduleSnapshotSave = useCallback(() => {
        if (!scribble.roomCode) {
            return;
        }

        if (snapshotTimerRef.current) {
            clearTimeout(snapshotTimerRef.current);
        }

        snapshotTimerRef.current = setTimeout(async () => {
            snapshotTimerRef.current = null;

            try {
                const canvasData = getCanvasImage();
                const { data } = await api.put(`/scribbles/save/${scribble.roomCode}`, { canvasData });
                onScribbleChange(data);
            } catch {
                /* 401 handled globally */
            }
        }, 2500);
    }, [getCanvasImage, onScribbleChange, scribble.roomCode]);

    const cancelPendingSnapshotSave = useCallback(() => {
        if (snapshotTimerRef.current) {
            clearTimeout(snapshotTimerRef.current);
            snapshotTimerRef.current = null;
        }
    }, []);

    const handleRemoteDraw = useCallback(
        (action) => {
            if (!action || action.userId === userId) {
                return;
            }

            if (action.type === 'CLEAR_ALL') {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                setStatus('The board was reset by another collaborator.');
                scheduleSnapshotSave();
                return;
            }

            if (action.type === 'REVERT' || action.type === 'REVERT_PAGE') {
                (async () => {
                    try {
                        const { data } = await api.get(`/scribbles/room/${scribble.roomCode}`);
                        drawPage(readSavedCanvas(data.canvasData));
                    } catch (err) {
                        setStatus(err.response?.data?.message || 'Could not sync restore from the server.');
                    }
                })();
                return;
            }

            if (action.type === 'SHAPE') {
                drawShapeOnCanvas(action);
                scheduleSnapshotSave();
                return;
            }

            if (action.pageIndex !== 0) {
                return;
            }

            if (action.type === 'START') {
                remotePointsRef.current[action.userId] = { x: action.x, y: action.y };
                return;
            }

            if (action.type === 'DRAW') {
                const lastPoint = remotePointsRef.current[action.userId];
                const nextPoint = { x: action.x, y: action.y };

                if (lastPoint) {
                    drawLine(lastPoint, nextPoint, action.color, action.brushSize);
                }

                remotePointsRef.current[action.userId] = nextPoint;
                scheduleSnapshotSave();
            }

            if (action.type === 'END') {
                delete remotePointsRef.current[action.userId];
                scheduleSnapshotSave();
            }
        },
        [drawLine, drawPage, drawShapeOnCanvas, scheduleSnapshotSave, userId, scribble.roomCode]
    );

    const handleChatMessage = useCallback((message) => {
        setChatMessages((current) => [...current, message]);
    }, []);

    const { connected, socketError, sendDrawData, sendChatMessage, sendRoomAction } = useScribbleSocket(
        scribble.roomCode,
        handleRemoteDraw,
        handleChatMessage
    );

    const getPoint = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const activeColor = tool === 'eraser' ? '#ffffff' : color;
    const activeBrushSize = tool === 'eraser' ? Math.max(brushSize, 10) : brushSize;

    const renderShapePreview = useCallback((from, to) => {
        const snap = shapeSnapshotRef.current;
        const drag = shapeDragRef.current;
        if (!snap || !drag) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.setLineDash([8, 6]);
            ctx.strokeStyle = drag.strokeColor;
            ctx.lineWidth = drag.lineWidth;
            buildShapePath(ctx, drag.shapeTool, from.x, from.y, to.x, to.y);
            ctx.stroke();
            ctx.restore();
        };
        image.src = snap;
    }, []);

    const cancelShapeDraft = useCallback(() => {
        shapeDragRef.current = null;
        const snap = shapeSnapshotRef.current;
        shapeSnapshotRef.current = null;
        if (snap) {
            drawPage(snap);
        }
    }, [drawPage]);

    const commitShape = useCallback(
        (from, to) => {
            const snap = shapeSnapshotRef.current;
            const drag = shapeDragRef.current;
            if (!snap || !drag) {
                return;
            }

            const { shapeTool, strokeColor, lineWidth, useFill } = drag;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                strokeAndFillShape(ctx, shapeTool, from.x, from.y, to.x, to.y, strokeColor, lineWidth, useFill);
                sendDrawData({
                    type: 'SHAPE',
                    shape: shapeTool,
                    x: from.x,
                    y: from.y,
                    x2: to.x,
                    y2: to.y,
                    color: strokeColor,
                    brushSize: lineWidth,
                    filled: useFill,
                    userId,
                    pageIndex: 0
                });
                scheduleSnapshotSave();
            };
            image.src = snap;
        },
        [scheduleSnapshotSave, sendDrawData, userId]
    );

    const startDrawing = (event) => {
        const point = getPoint(event);

        if (SHAPE_TOOLS.includes(tool)) {
            shapeDragRef.current = {
                start: point,
                shapeTool: tool,
                strokeColor: activeColor,
                lineWidth: activeBrushSize,
                useFill: fillShape && tool !== 'line'
            };
            shapeSnapshotRef.current = canvasRef.current.toDataURL('image/jpeg', 0.92);
            return;
        }

        drawingRef.current = true;
        lastPointRef.current = point;
        sendDrawData({
            type: 'START',
            ...point,
            color: activeColor,
            brushSize: activeBrushSize,
            userId,
            pageIndex: 0
        });
    };

    const draw = (event) => {
        if (shapeDragRef.current && SHAPE_TOOLS.includes(tool)) {
            const point = getPoint(event);
            renderShapePreview(shapeDragRef.current.start, point);
            return;
        }

        if (!drawingRef.current || !lastPointRef.current) {
            return;
        }

        const point = getPoint(event);
        const lastPoint = lastPointRef.current;

        drawLine(lastPoint, point, activeColor, activeBrushSize);
        sendDrawData({
            type: 'DRAW',
            ...point,
            color: activeColor,
            brushSize: activeBrushSize,
            userId,
            pageIndex: 0
        });

        lastPointRef.current = point;
        scheduleSnapshotSave();
    };

    const stopDrawing = () => {
        const wasDrawing = drawingRef.current;

        if (wasDrawing) {
            sendDrawData({
                type: 'END',
                x: 0,
                y: 0,
                color: activeColor,
                brushSize: activeBrushSize,
                userId,
                pageIndex: 0
            });
        }

        drawingRef.current = false;
        lastPointRef.current = null;

        if (wasDrawing) {
            scheduleSnapshotSave();
        }
    };

    const endInteraction = (event) => {
        if (shapeDragRef.current && SHAPE_TOOLS.includes(tool)) {
            const to = getPoint(event);
            const from = shapeDragRef.current.start;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            if (Math.hypot(dx, dy) > 2) {
                commitShape(from, to);
            } else {
                cancelShapeDraft();
            }
            shapeDragRef.current = null;
            shapeSnapshotRef.current = null;
            return;
        }

        stopDrawing();
    };

    const handleMouseLeave = () => {
        if (shapeDragRef.current) {
            cancelShapeDraft();
            shapeDragRef.current = null;
            shapeSnapshotRef.current = null;
            return;
        }

        stopDrawing();
    };

    const revertFromServer = async () => {
        cancelPendingSnapshotSave();
        setStatus('Restoring from the server...');

        try {
            const { data } = await api.get(`/scribbles/room/${scribble.roomCode}`);
            const restored = readSavedCanvas(data.canvasData);
            drawPage(restored);
            sendRoomAction({ type: 'REVERT', userId, pageIndex: 0 });
            setStatus('Board matches the last saved version on the server.');
        } catch (err) {
            setStatus(err.response?.data?.message || 'Could not restore from the server.');
        }
    };

    const clearEntireBoard = async () => {
        if (!window.confirm('Clear the board for everyone? This saves a blank canvas immediately.')) {
            return;
        }

        cancelPendingSnapshotSave();
        drawPage('');
        sendRoomAction({ type: 'CLEAR_ALL', userId, pageIndex: 0 });
        setStatus('Clearing...');

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const canvasData = getCanvasImage();
            const { data } = await api.put(`/scribbles/save/${scribble.roomCode}`, { canvasData });
            onScribbleChange(data);
            setStatus('Board cleared and saved.');
        } catch (err) {
            setStatus(err.response?.data?.message || 'Cleared locally, but saving failed.');
        }
    };

    const downloadJpeg = () => {
        const link = document.createElement('a');
        link.download = `${scribble.roomCode}.jpg`;
        link.href = getCanvasImage();
        link.click();
    };

    const saveCanvas = async () => {
        cancelPendingSnapshotSave();
        setStatus('Saving...');

        try {
            const canvasData = getCanvasImage();
            const { data } = await api.put(`/scribbles/save/${scribble.roomCode}`, { canvasData });
            onScribbleChange(data);
            setStatus('Saved as JPEG.');
        } catch (err) {
            setStatus(err.response?.data?.message || 'Save failed.');
        }
    };

    const submitChat = (event) => {
        event.preventDefault();

        if (!chatInput.trim()) {
            return;
        }

        sendChatMessage(chatInput.trim());
        setChatInput('');
    };

    return {
        canvasRef,
        scribble,
        tool,
        setTool,
        color,
        setColor,
        brushSize,
        setBrushSize,
        fillShape,
        setFillShape,
        status,
        socketError,
        connected,
        chatMessages,
        chatInput,
        setChatInput,
        username,
        submitChat,
        startDrawing,
        draw,
        endInteraction,
        handleMouseLeave,
        revertFromServer,
        clearEntireBoard,
        saveCanvas,
        downloadJpeg
    };
};
