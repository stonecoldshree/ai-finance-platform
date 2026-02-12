from PIL import Image
import os

def process_image():
    input_path = "public/logo1.jpeg"
    output_path = "public/logo_white.png"
    
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return

    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        # Determine background color from corners
        # Sample corners:
        corners = [(0, 0), (img.width-1, 0), (0, img.height-1), (img.width-1, img.height-1)]
        bg_colors = [img.getpixel(c) for c in corners]
        
        # Use first corner as base, or average?
        # Assuming simple background, use top-left
        bg_color = bg_colors[0]
        
        newData = []
        threshold = 40  # Increase threshold slightly for JPEG artifacts
        
        count = 0
        for item in datas:
            # Check if pixel is close to background color
            if (abs(item[0] - bg_color[0]) < threshold and 
                abs(item[1] - bg_color[1]) < threshold and 
                abs(item[2] - bg_color[2]) < threshold):
                newData.append((255, 255, 255, 255)) # Replace with White
                count += 1
            else:
                newData.append(item)
        
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully created {output_path}. Replaced {count} pixels.")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    process_image()
