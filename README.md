# Thunderdior

A command-line tool designed to process raw festival footage into stylized, nostalgic hardcore-themed video edits. The workflow automates video concatenation, VHS visual effects, audio synchronization, and stylized subtitle overlays.

## Overview
This project was developed to pay homage to the raw energy of the early Hardcore, Early Rave, and Gabber scene. It specifically draws inspiration from the aesthetic legacy of **Thunderdome** and the iconic sound of tracks like **"Wonderful Days"** by Charly Lownoise & Mental Theo. The tool bridges the gap between modern 4K digital captures and the gritty, distorted 1996 VHS look that defined the rave era.

## 🔗 TikTok Showcase
Check out the final result here: [TikTok](https://www.tiktok.com/@fullgreensprtn/video/7648405264227388705?_r=1&_t=ZN-96zoMR67rKY)

## Features

- **VHS Processing**: Applies custom filters (chroma blur, grain, desaturation) to emulate late 90s camcorder footage, capturing the essence of underground rave tapes.
- **Automated Editing**: Uses ffmpeg's `xfade` for seamless transitions between clips.
- **Audio Integration**: Syncs tracks with precise start points and automatic fade-outs, optimized for high-BPM anthems.
- **Glassmorphic Typography**: Injects centered, glassmorphic-styled subtitles with blur effects, providing a sharp modern contrast to the vintage visuals.
- **Dynamic Effects**: Configurable camera shake logic for musical drops, designed to emphasize the impact of the kickdrum.

## Prerequisites

- Node.js installed
- FFmpeg (handled programmatically via `ffmpeg-static` dependency)

## Directory Structure

Before running the pipeline, ensure your source media files are placed in the correct directories:
- **Video Clips** (`.mp4`, `.MOV`): `/assets/video/`
- **Images** (`.jpg`, `.png`): `/assets/images/`
- **Audio Tracks** (`.mp3`): `/assets/audio/`

## Setup

1. Install required dependencies:
   ```bash
   npm install