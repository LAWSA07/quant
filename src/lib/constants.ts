import { readFileSync } from "fs";
import { parse } from "pdf-parse";
import { createCanvas, loadImage } from "canvas";
import sharp from "sharp";

export const processImage = async (buffer: Buffer) => {
  return sharp(buffer).grayscale().normalize().toBuffer();
};

export const processPDF = async (buffer: Buffer) => {
  const pdfData = await parse(buffer);
  const text = pdfData.text;

  // If PDF contains images, implement extraction logic here
  return text;
};

export const bufferToImageData = (buffer: Buffer) => {
  const img = new Image();
  img.src = `data:image/png;base64,${buffer.toString("base64")}`;
  return img;
};
