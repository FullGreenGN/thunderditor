const ffmpeg = require('ffmpeg-static');
const { runFFmpegCommand } = require('./libs/utils');

const config = require('../config.json');
const audioFile = config.audio.file;
const audioCutStart = config.audio.cutStart;

const inputVideo = config.outputs.baseVideo;
const outputVideo = config.outputs.audioVideo;

const clipConfig = config.clips;
let totalDuration = clipConfig[0].duration;
for (let i = 1; i < clipConfig.length; i++) {
    totalDuration += clipConfig[i].duration - 0.2;
}
const fadeDuration = 2.0;
const fadeStart = totalDuration - fadeDuration;

console.log(`[INFO] Merging audio track with a ${fadeDuration}s fade-out...`);

// Audio filter: afade type 'out'
const audioFilter = `afade=t=out:st=${fadeStart}:d=${fadeDuration}`;

// Modified FFmpeg command with audio filter (-af) and aac encoder
const cmd = `"${ffmpeg}" -y -i "${inputVideo}" -ss ${audioCutStart} -i "${audioFile}" -c:v copy -af "${audioFilter}" -c:a aac -map 0:v:0 -map 1:a:0 -shortest "${outputVideo}"`;

runFFmpegCommand(cmd, `Audio processing finished successfully. Output: ${outputVideo}`, 'inherit');
