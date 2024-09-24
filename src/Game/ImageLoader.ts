class ImageLoader {
  private images: { [key: string]: HTMLImageElement } = {};

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      this.images[src] = img; // Store the image
    });
  }

  getImage(src: string): HTMLImageElement | undefined {
    return this.images[src];
  }
}

export default ImageLoader;
