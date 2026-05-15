const RoomChatPanel = ({
    connected,
    messages,
    username,
    chatInput,
    onChatInputChange,
    onSubmit
}) => {
    return (
        <aside className="flex min-h-[420px] flex-col rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Chat</h3>
                <p className="text-xs text-gray-500">{connected ? 'Connected to room chat' : 'Connecting...'}</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}

                {messages.map((message, index) => (
                    <div key={`${message.sentAt}-${index}`} className="rounded border border-gray-200 px-3 py-2">
                        <p className="text-xs font-semibold text-gray-600">{message.username || username}</p>
                        <p className="text-sm text-gray-900">{message.message}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={onSubmit} className="flex gap-2 border-t border-gray-200 p-3">
                <input
                    value={chatInput}
                    onChange={onChatInputChange}
                    className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Message"
                />
                <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white">
                    Send
                </button>
            </form>
        </aside>
    );
};

export default RoomChatPanel;
