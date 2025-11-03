#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import math

# Create 1024x1024 icon
size = 1024
img = Image.new('RGB', (size, size))
draw = ImageDraw.Draw(img)

# Create gradient background (blue theme)
for y in range(size):
    # Interpolate between colors
    ratio = y / size
    r = int(14 + (125 - 14) * ratio)
    g = int(165 + (211 - 165) * ratio)
    b = int(233 + (252 - 233) * ratio)
    draw.rectangle([(0, y), (size, y+1)], fill=(r, g, b))

# Draw subtle grid pattern
grid_color = (255, 255, 255, 50)
grid_size = size // 5
for i in range(1, 5):
    draw.line([(i * grid_size, 50), (i * grid_size, size - 50)], fill=(255, 255, 255), width=3)
    draw.line([(50, i * grid_size), (size - 50, i * grid_size)], fill=(255, 255, 255), width=3)

# Draw large triangle marker in center
center_x = size // 2
center_y = size // 2
triangle_size = 280

triangle_points = [
    (center_x, center_y - triangle_size // 2),  # Top
    (center_x - int(triangle_size / 2.5), center_y + triangle_size // 2),  # Bottom left
    (center_x + int(triangle_size / 2.5), center_y + triangle_size // 2),  # Bottom right
]

# Draw shadow
shadow_offset = 10
shadow_points = [(x + shadow_offset, y + shadow_offset) for x, y in triangle_points]
draw.polygon(shadow_points, fill=(0, 0, 0, 100))

# Draw white triangle
draw.polygon(triangle_points, fill=(255, 255, 255))

# Try to add numbers in corners
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 120)
except:
    font = ImageFont.load_default()

text_color = (255, 255, 255, 100)
draw.text((100, 100), "1", fill=text_color, font=font)
draw.text((size - 200, 100), "2", fill=text_color, font=font)
draw.text((100, size - 180), "3", fill=text_color, font=font)

# Add a small circle (mine symbol) in top right for uniqueness
circle_x = size - 180
circle_y = size - 180
circle_radius = 40
draw.ellipse([circle_x - circle_radius, circle_y - circle_radius,
              circle_x + circle_radius, circle_y + circle_radius],
             fill=(255, 255, 255))

# Save the icon
img.save('/Users/danperry/Desktop/mine-finder/app-icon-1024.png')
print("Icon created successfully!")
