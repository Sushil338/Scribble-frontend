const Toolbar = ({
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    fillShape,
    setFillShape,
    onClear,
    onClearAll,
    onSave,
    onDownload
}) => {
    return (
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white p-3">
            <div className="flex flex-wrap gap-1 rounded border border-gray-300 p-0.5">
                <button
                    type="button"
                    onClick={() => setTool('pen')}
                    className={`rounded px-2.5 py-1.5 text-sm ${tool === 'pen' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                >
                    Pen
                </button>
                <button
                    type="button"
                    onClick={() => setTool('eraser')}
                    className={`rounded px-2.5 py-1.5 text-sm ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                >
                    Eraser
                </button>
                <button
                    type="button"
                    onClick={() => setTool('line')}
                    className={`rounded px-2.5 py-1.5 text-sm ${tool === 'line' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                >
                    Line
                </button>
                <button
                    type="button"
                    onClick={() => setTool('rect')}
                    className={`rounded px-2.5 py-1.5 text-sm ${tool === 'rect' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                >
                    Rectangle
                </button>
                <button
                    type="button"
                    onClick={() => setTool('ellipse')}
                    className={`rounded px-2.5 py-1.5 text-sm ${tool === 'ellipse' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                >
                    Ellipse
                </button>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
                Color
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={tool === 'eraser'}
                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 disabled:opacity-40"
                />
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
                Stroke
                <input
                    type="range"
                    min="1"
                    max="24"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                />
                <span className="w-6 text-right">{brushSize}</span>
            </label>

            {(tool === 'rect' || tool === 'ellipse') && (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={fillShape}
                        onChange={(e) => setFillShape(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    Fill shape
                </label>
            )}

            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                <button
                    type="button"
                    onClick={onClear}
                    title="Restore the board from the last version saved on the server"
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
                >
                    Clear
                </button>
                <button
                    type="button"
                    onClick={onClearAll}
                    title="Wipe the board for everyone and save a blank canvas"
                    className="rounded border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-800"
                >
                    Clear all
                </button>
                <button
                    type="button"
                    onClick={onDownload}
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
                >
                    JPEG
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
