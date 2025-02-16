import * as tf from "@tensorflow/tfjs-node"; // Switch to CPU-only version if needed: @tensorflow/tfjs-node-cpu
import { RecognitionResult } from "@/types";

// Cache model and warm it up on initial load
let model: tf.LayersModel | null = null;
let isWarm = false;

export const loadModel = async () => {
  if (!model) {
    try {
      model = await tf.loadLayersModel(process.env.NEXT_PUBLIC_MODEL_PATH!);

      // Warm up the model with dummy data
      const warmupInput = tf.zeros([1, 28, 28, 3]); // Adjust dimensions to match your model
      await model.predict(warmupInput);
      isWarm = true;
    } catch (error) {
      throw new Error(`Model loading failed: ${(error as Error).message}`);
    }
  }
  return model;
};

export const predictHandwriting = async (
  imageBuffer: Buffer
): Promise<RecognitionResult> => {
  if (!isWarm) await loadModel();

  try {
    // Preprocessing pipeline
    const processedTensor = tf.tidy(() => {
      const decoded = tf.node.decodeImage(imageBuffer, 3);
      const resized = tf.image.resizeBilinear(decoded, [28, 28]); // Match model input size
      return resized.toFloat().div(255.0).expandDims(0);
    });

    // Prediction with memory cleanup
    const startTime = performance.now();
    const prediction = model!.predict(processedTensor) as tf.Tensor;
    const results = await prediction.data();
    tf.dispose([processedTensor, prediction]);

    const endTime = performance.now();

    return {
      text: decodePrediction(results),
      confidence: Math.max(...results),
      processingTime: endTime - startTime,
    };
  } catch (error) {
    throw new Error(`Prediction failed: ${(error as Error).message}`);
  }
};

// Improved decoding with CTC alignment (example implementation)
const decodePrediction = (output: Float32Array): string => {
  // Implement your actual decoding logic here
  // Example: Connectionist Temporal Classification (CTC) decoding
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let lastChar = -1;
  let decoded = "";

  for (const prob of output) {
    const charIndex = Math.round(prob * (chars.length - 1));
    if (charIndex !== lastChar && charIndex >= 0 && charIndex < chars.length) {
      decoded += chars[charIndex];
      lastChar = charIndex;
    }
  }

  return decoded;
};
