#!/usr/bin/env python3
"""
Icon Generator Script (Python)

This script generates all required PWA icons from the SVG source.

Requirements:
    pip install pillow cairosvg

Usage:
    python generate-icons.py

This will create all icon sizes in the /icons/ folder.
"""

import os
from pathlib import Path

try:
    from PIL import Image
    import cairosvg
except ImportError:
    print("❌ Required modules not found.")
    print("\n📦 Install with: pip install pillow cairosvg")
    print("\n📝 Alternative: Open generate-icons.html in your browser to generate icons manually.")
    exit(1)

# Icon sizes needed for PWA
SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]

# Paths
SCRIPT_DIR = Path(__file__).parent
ICONS_DIR = SCRIPT_DIR / 'icons'
SVG_PATH = ICONS_DIR / 'icon.svg'

# Create icons directory if it doesn't exist
ICONS_DIR.mkdir(exist_ok=True)

def generate_icons():
    """Generate all icon sizes from SVG"""
    
    if not SVG_PATH.exists():
        print(f"❌ SVG file not found: {SVG_PATH}")
        return
    
    print("🎨 Generating Chess App Icons from SVG...\n")
    
    for size in SIZES:
        output_path = ICONS_DIR / f'icon-{size}x{size}.png'
        
        try:
            # Convert SVG to PNG at specified size
            cairosvg.svg2png(
                url=str(SVG_PATH),
                write_to=str(output_path),
                output_width=size,
                output_height=size
            )
            print(f"✅ Generated icon-{size}x{size}.png")
        except Exception as e:
            print(f"❌ Failed to generate {size}x{size}: {e}")
    
    print("\n🎉 All icons generated successfully in /icons/ folder!")
    print("📱 Your PWA is ready to install!")

if __name__ == '__main__':
    generate_icons()

