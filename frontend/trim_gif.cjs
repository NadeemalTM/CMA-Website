const { GifUtil } = require('gifwrap');

async function processGif() {
    console.log("Reading GIF...");
    const gif = await GifUtil.read('src/assets/slow_office.gif');
    console.log(`Original frames: ${gif.frames.length}`);
    
    // Drop the last 7 frames (~2.1 seconds)
    const newFrames = gif.frames.slice(0, gif.frames.length - 7);
    await GifUtil.write('src/assets/slow_office.gif', newFrames);
    console.log(`Trimmed! Kept ${newFrames.length} frames.`);
}

processGif().catch(console.error);
