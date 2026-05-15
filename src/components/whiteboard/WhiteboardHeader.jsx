const WhiteboardHeader = ({ title, roomCode, connected }) => {
    return (
        <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">
                Room {roomCode} — {connected ? 'Live' : 'Connecting'} — Save stores JPEG; the board also auto-saves about
                every 2.5s so new joiners see recent progress.
            </p>
        </div>
    );
};

export default WhiteboardHeader;
