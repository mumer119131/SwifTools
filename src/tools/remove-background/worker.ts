/// <reference lib="webworker" />

import { detectBackgroundColor, removeBackground, type Rgb } from "./logic";

export interface WorkerRequest {
  buffer: ArrayBuffer;
  width: number;
  height: number;
  tolerance: number;
  feather: number;
  /** Omit to auto-detect the background colour from the image edges. */
  reference: Rgb | null;
}

export interface WorkerResponse {
  buffer: ArrayBuffer;
  removed: number;
  reference: Rgb;
}

/**
 * Background removal is O(pixels) with a queue, which is fast — but on a 6000px
 * photo it is still hundreds of milliseconds of solid main-thread work, long
 * enough to freeze the tolerance slider mid-drag. Running it here keeps the UI
 * at 60fps, and the pixel buffer is transferred rather than copied in either
 * direction.
 */
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { buffer, width, height, tolerance, feather, reference } = event.data;
  const data = new Uint8ClampedArray(buffer);

  const backgroundColor = reference ?? detectBackgroundColor(data, width, height);
  const removed = removeBackground(data, width, height, {
    reference: backgroundColor,
    tolerance,
    feather,
  });

  const response: WorkerResponse = {
    buffer: data.buffer as ArrayBuffer,
    removed,
    reference: backgroundColor,
  };

  (self as unknown as Worker).postMessage(response, [response.buffer]);
};
