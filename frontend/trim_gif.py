import sys
import os
from PIL import Image, ImageStat

gif_path = 'src/assets/slow_office.gif'

if not os.path.exists(gif_path):
    print("GIF not found!")
    sys.exit(1)

img = Image.open(gif_path)
frames = []
durations = []

for i in range(img.n_frames):
    img.seek(i)
    # Convert to RGB to analyze colors
    rgb_frame = img.convert('RGB')
    
    # Calculate standard deviation of colors. Solid colors will have stddev near 0.
    stat = ImageStat.Stat(rgb_frame)
    stddev = sum(stat.stddev) / 3.0
    
    # Check if the frame is mostly white/blank (high mean, low stddev)
    mean = sum(stat.mean) / 3.0
    
    is_blank = stddev < 5 and mean > 240
    
    frames.append(img.copy())
    durations.append(img.info.get('duration', 100))
    print(f"Frame {i}: stddev={stddev:.2f}, mean={mean:.2f}, blank={is_blank}")

# Find the last non-blank frame
last_good = len(frames) - 1
while last_good >= 0:
    stat = ImageStat.Stat(frames[last_good].convert('RGB'))
    stddev = sum(stat.stddev) / 3.0
    mean = sum(stat.mean) / 3.0
    if stddev >= 5 or mean <= 240:
        break
    last_good -= 1

print(f"Keeping frames 0 to {last_good}")

if last_good < len(frames) - 1:
    good_frames = frames[:last_good+1]
    good_durations = durations[:last_good+1]
    
    # Save trimmed GIF
    good_frames[0].save(
        'src/assets/slow_office.gif',
        save_all=True,
        append_images=good_frames[1:],
        duration=good_durations,
        loop=0
    )
    print("Trimmed GIF saved successfully!")
else:
    print("No blank frames found at the end.")
