import { Box } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { PAINTING_HEIGHT, PAINTING_WIDTH } from '../constants';

export interface CanvasImageProps {
  imageData: ImageData;
}
export default function CanvasImage({ imageData }: CanvasImageProps) {
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (canvas) {
        const context = canvas.getContext('2d')!;
        context.putImageData(imageData, 0, 0);
      }
    },
    [imageData]
  );

  return (
    <Box border="1px solid black">
      <canvas ref={canvasRef} width={PAINTING_WIDTH} height={PAINTING_HEIGHT}></canvas>
    </Box>
  );
}
