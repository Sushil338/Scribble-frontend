const WhiteboardCanvas = ({ canvasRef, onMouseDown, onMouseMove, onMouseUp, onMouseLeave }) => {
    return (
        <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            className="h-[62vh] min-h-[420px] w-full cursor-crosshair bg-white"
        />
    );
};

export default WhiteboardCanvas;
