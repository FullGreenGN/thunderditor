const { execSync } = require('child_process');

/**
 * Executes an FFmpeg command synchronously and handles standardized logging.
 * @param {string} cmd The FFmpeg command to execute
 * @param {string} successMessage The message to log upon success
 * @param {string} stdio Defines how to handle standard I/O (default: 'inherit')
 */
function runFFmpegCommand(cmd, successMessage, stdio = 'inherit') {
    try {
        execSync(cmd, { stdio });
        if (successMessage) {
            console.log(`[COMPLETED] ${successMessage}`);
        }
    } catch (error) {
        console.error("[ERROR] FFmpeg command execution failed:", error.message);
        process.exit(1);
    }
}

/**
 * Formats seconds into SRT timestamp format (HH:MM:SS,mmm)
 * @param {number} seconds 
 * @returns {string} Formatted timestamp
 */
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

module.exports = {
    runFFmpegCommand,
    formatTime
};
