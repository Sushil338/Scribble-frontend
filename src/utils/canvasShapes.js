export const SHAPE_TOOLS = ['line', 'rect', 'ellipse'];

export const buildShapePath = (ctx, shape, x1, y1, x2, y2) => {
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);

    ctx.beginPath();

    if (shape === 'line') {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    } else if (shape === 'rect') {
        ctx.rect(left, top, w, h);
    } else if (shape === 'ellipse') {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = w / 2;
        const ry = h / 2;
        if (rx > 0 && ry > 0) {
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        }
    }
};

export const strokeAndFillShape = (ctx, shape, x1, y1, x2, y2, strokeColor, lineWidth, filled) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;

    buildShapePath(ctx, shape, x1, y1, x2, y2);

    if (shape !== 'line' && filled) {
        ctx.fillStyle = strokeColor;
        ctx.fill();
        ctx.stroke();
    } else {
        ctx.stroke();
    }
};
