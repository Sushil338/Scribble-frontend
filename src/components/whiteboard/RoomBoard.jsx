import { useWhiteboardRoom } from '../../hooks/useWhiteboardRoom';
import RoomChatPanel from './RoomChatPanel';
import Toolbar from './Toolbar';
import WhiteboardCanvas from './WhiteboardCanvas';
import WhiteboardHeader from './WhiteboardHeader';

const RoomBoard = ({ scribble, onScribbleChange }) => {
    const board = useWhiteboardRoom(scribble, onScribbleChange);

    return (
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <WhiteboardHeader
                    title={board.scribble.title}
                    roomCode={board.scribble.roomCode}
                    connected={board.connected}
                />

                <Toolbar
                    tool={board.tool}
                    setTool={board.setTool}
                    color={board.color}
                    setColor={board.setColor}
                    brushSize={board.brushSize}
                    setBrushSize={board.setBrushSize}
                    fillShape={board.fillShape}
                    setFillShape={board.setFillShape}
                    onClear={board.revertFromServer}
                    onClearAll={board.clearEntireBoard}
                    onSave={board.saveCanvas}
                    onDownload={board.downloadJpeg}
                />

                <WhiteboardCanvas
                    canvasRef={board.canvasRef}
                    onMouseDown={board.startDrawing}
                    onMouseMove={board.draw}
                    onMouseUp={board.endInteraction}
                    onMouseLeave={board.handleMouseLeave}
                />

                {(board.status || board.socketError) && (
                    <p className="border-t border-gray-200 px-4 py-2 text-sm text-gray-500">
                        {board.socketError || board.status}
                    </p>
                )}
            </div>

            <RoomChatPanel
                connected={board.connected}
                messages={board.chatMessages}
                username={board.username}
                chatInput={board.chatInput}
                onChatInputChange={(e) => board.setChatInput(e.target.value)}
                onSubmit={board.submitChat}
            />
        </section>
    );
};

export default RoomBoard;
