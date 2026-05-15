/** Load a single canvas image from stored room data (legacy string or old multi-page JSON). */
export const readSavedCanvas = (canvasData) => {
    if (!canvasData) {
        return '';
    }

    try {
        const parsed = JSON.parse(canvasData);

        if (parsed?.format === 'scribble-pages-v1' && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
            const idx = Math.min(Math.max(0, parsed.currentPage || 0), parsed.pages.length - 1);
            return parsed.pages[idx] || '';
        }
    } catch {
        // Single data URL or other legacy string
    }

    return canvasData;
};
