const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const { runFFmpegCommand, formatTime } = require('./libs/utils');

const config = require('../config.json');

const inputVideo = config.outputs.audioVideo;
const outputVideo = config.outputs.finalVideo;
const subtitleFile = config.outputs.tempSubtitle;

const lyricsData = config.lyrics;

console.log("[INFO] Generating subtitle file...");

let srtContent = "";
lyricsData.forEach((line, index) => {
    srtContent += `${index + 1}\n`;
    srtContent += `${formatTime(line.start)} --> ${formatTime(line.end)}\n`;
    srtContent += `{\\blur4}${line.text}\n\n`;
});

fs.writeFileSync(subtitleFile, srtContent, 'utf8');

console.log("[PROCESSING] Burning subtitles with centralized glassmorphism effect...");

const subtitleStyle = "FontName=Arial Black,FontSize=24,PrimaryColour=&H80FFFFFF&,Bold=1,Outline=0,Shadow=0,Alignment=10,MarginL=20,MarginR=20";

const safeSrtPath = subtitleFile.replace(/\\/g, '/');

const dropStart = config.effects.dropStart;
const dropEnd = dropStart + config.effects.dropDuration;
const intensity = config.effects.shakeIntensity;

const shakeFilter = `crop=1040:1850:'20+${intensity}*sin(t*20)*between(t,${dropStart},${dropEnd})':'35+${intensity}*cos(t*25)*between(t,${dropStart},${dropEnd})',scale=1080:1920`;

const cmd = `"${ffmpeg}" -y -i "${inputVideo}" -vf "${shakeFilter},subtitles=${safeSrtPath}:force_style='${subtitleStyle}'" -c:v libx264 -preset fast -crf 23 -c:a copy "${outputVideo}"`;

runFFmpegCommand(cmd, `Subtitle rendering finished successfully. Output: ${outputVideo}`, 'inherit');

console.log("[PROCESSING] Cleaning up temporary subtitle file...");
if (fs.existsSync(subtitleFile)) {
    fs.unlinkSync(subtitleFile);
}
