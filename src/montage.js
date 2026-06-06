const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const { runFFmpegCommand } = require('./libs/utils');

const config = require('../config.json');
const clipConfig = config.clips;

console.log("[INFO] Starting video processing with VHS visual effects.");

// Step 1: Normalize, trim, and apply visual effects to each clip
clipConfig.forEach((clip, index) => {
    const outputFile = `assets/temp_${index}.mp4`;
    const isImageFile = clip.file.toUpperCase().endsWith('.JPG') || clip.file.toUpperCase().endsWith('.JPEG');

    const fileExtension = clip.file.split('.').pop().toLowerCase();
    const assetFolder = ['jpg', 'jpeg', 'png'].includes(fileExtension) ? 'images' : 'video';
    const filePath = `assets/${assetFolder}/${clip.file}`;

    let cmd = `"${ffmpeg}" -y `;

    if (isImageFile) {
        cmd += `-loop 1 -framerate 30 -i "${filePath}" -t ${clip.duration} `;
    } else {
        cmd += `-ss 0 -t ${clip.duration} -i "${filePath}" `;
    }

    const videoFilter = `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,boxblur=lr=0:cr=8:cp=2,unsharp=5:5:-0.8,eq=contrast=1.1:saturation=0.6:brightness=0.02:gamma=1.2,noise=alls=18:allf=t+u`;

    cmd += `-vf "${videoFilter}" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "${outputFile}"`;

    console.log(`[PROCESSING] Rendering clip ${index + 1}/${clipConfig.length}: ${clip.file} (Generating visual effects)...`);
    runFFmpegCommand(cmd, null, 'ignore');
});

console.log("[INFO] Generating crossfade transitions and final output fade...");

// Step 2: Prepare input arguments and filter chain for transitions
let ffmpegInputs = '';
clipConfig.forEach((_, index) => {
    ffmpegInputs += `-i assets/temp_${index}.mp4 `;
});

let filterComplex = '';
let lastLabel = '0:v';
let currentOffset = clipConfig[0].duration;
const transitionDuration = 0.2;

for (let i = 1; i < clipConfig.length; i++) {
    const outputLabel = `vout${i}`;
    const offset = currentOffset - transitionDuration;

    filterComplex += `[${lastLabel}][${i}:v]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}[${outputLabel}];`;

    lastLabel = outputLabel;
    currentOffset = offset + clipConfig[i].duration;
}

// --- APPLY FINAL FADE OUT ---
const totalDuration = currentOffset;
const fadeDuration = 2.0; // 2 seconds fade out to black
const fadeStart = totalDuration - fadeDuration;

// Attach fade effect to the final transition output
filterComplex += `[${lastLabel}]fade=t=out:st=${fadeStart}:d=${fadeDuration}[final_video]`;

// Step 3: Execute final assembly mapping the output label [final_video]
const concatCommand = `"${ffmpeg}" -y ${ffmpegInputs} -filter_complex "${filterComplex}" -map "[final_video]" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p "${config.outputs.baseVideo}"`;
runFFmpegCommand(concatCommand, `Video compilation finished successfully. Output: ${config.outputs.baseVideo}`, 'ignore');

console.log("[PROCESSING] Cleaning up temporary files...");

clipConfig.forEach((_, index) => {
    if (fs.existsSync(`assets/temp_${index}.mp4`)) {
        fs.unlinkSync(`assets/temp_${index}.mp4`);
    }
});
