import { useEffect, useState } from 'react';
import api from '../api/apiClient';
import Navbar from './Navbar';
import Whiteboard from './Whiteboard';

const Dashboard = ({ user, onLogout }) => {
    const userId = localStorage.getItem('userId');
    const [title, setTitle] = useState('My Scribble');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [scribble, setScribble] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loadRooms = async () => {
        try {
            const { data } = await api.get('/scribbles/mine');
            setRooms(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not load saved rooms.');
        }
    };

    useEffect(() => {
        let cancelled = false;

        queueMicrotask(async () => {
            if (!cancelled) {
                await loadRooms();
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const createScribble = async () => {
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/scribbles/create', { title });
            setScribble(data);
            setRoomCodeInput(data.roomCode || '');
            await loadRooms();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create scribble.');
        } finally {
            setLoading(false);
        }
    };

    const joinScribble = async () => {
        if (!roomCodeInput.trim()) {
            setError('Enter a room code.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { data } = await api.post(`/scribbles/join/${roomCodeInput.trim()}`);
            setScribble(data);
            await loadRooms();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not join this room.');
        } finally {
            setLoading(false);
        }
    };

    const openSavedRoom = async (roomCode) => {
        setError('');
        setLoading(true);

        try {
            const { data } = await api.get(`/scribbles/room/${roomCode}`);
            setScribble(data);
            setRoomCodeInput(roomCode);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not open this room.');
        } finally {
            setLoading(false);
        }
    };

    const quitRoom = async () => {
        if (!scribble) {
            return;
        }

        if (!window.confirm('Leave this room? You can join again later with the room code.')) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            await api.post(`/scribbles/quit/${scribble.roomCode}`);
            setScribble(null);
            setRoomCodeInput('');
            await loadRooms();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not quit this room.');
        } finally {
            setLoading(false);
        }
    };

    const deleteRoom = async () => {
        if (!scribble) {
            return;
        }

        if (!window.confirm('Delete this room for everyone? This cannot be undone.')) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            await api.delete(`/scribbles/${scribble.roomCode}`);
            setScribble(null);
            setRoomCodeInput('');
            await loadRooms();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not delete this room.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username={user.username} onLogout={onLogout} />

            <main className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[280px_1fr]">
                <aside className="rounded-lg border border-gray-200 bg-white p-4">
                    <h2 className="text-sm font-semibold text-gray-900">Rooms</h2>

                    <div className="mt-4 space-y-3">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            placeholder="Room title"
                        />
                        <button
                            onClick={createScribble}
                            disabled={loading}
                            className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                            Create room
                        </button>
                    </div>

                    <div className="mt-5 space-y-3">
                        <input
                            value={roomCodeInput}
                            onChange={(e) => setRoomCodeInput(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            placeholder="Enter room code"
                        />
                        <button
                            onClick={joinScribble}
                            disabled={loading}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-60"
                        >
                            Join room
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Saved rooms</h3>
                        <div className="space-y-2">
                            {rooms.length === 0 && (
                                <p className="text-sm text-gray-500">No rooms yet.</p>
                            )}

                            {rooms.map((room) => (
                                <button
                                    key={room.id}
                                    onClick={() => openSavedRoom(room.roomCode)}
                                    className={`w-full rounded border px-3 py-2 text-left text-sm ${
                                        scribble?.roomCode === room.roomCode
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <span className="block font-medium text-gray-900">{room.title}</span>
                                    <span className="text-xs text-gray-500">{room.roomCode}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {scribble ? (
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-3">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{scribble.title}</p>
                                <p className="text-xs text-gray-500">
                                    {String(scribble.ownerId) === String(userId) ? 'You created this room' : 'You joined this room'}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {String(scribble.ownerId) === String(userId) ? (
                                    <button
                                        onClick={deleteRoom}
                                        className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600"
                                    >
                                        Delete room
                                    </button>
                                ) : (
                                    <button
                                        onClick={quitRoom}
                                        className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
                                    >
                                        Quit room
                                    </button>
                                )}
                            </div>
                        </div>

                        <Whiteboard
                            key={scribble.roomCode}
                            scribble={scribble}
                            onScribbleChange={setScribble}
                        />
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
                        Create a room, join by code, or open a saved room.
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
