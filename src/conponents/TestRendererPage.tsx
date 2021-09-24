import { Box, Button, Heading } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PAINTING_HEIGHT, PAINTING_WIDTH } from '../constants';
import { createRandomPainting, generatePaintingHtml, Painting } from '../painting';
import CustomHtml from './CustomHtml';
import { renderHtml } from '../render';

function testPainting() {
  const painting: Painting = {
    elements: [
      { posX: 10, posY: 10, height: 20, width: 20, backgroundRed: 255, backgroundGreen: 0, backgroundBlue: 0 },
      { posX: 40, posY: 60, height: 50, width: 10, backgroundRed: 0, backgroundGreen: 255, backgroundBlue: 0 },
    ],
  };
  return painting;
}

export default function TestRendererPage() {
  const [painting, setPainting] = useState(testPainting);
  const [paintingHtml, setPaintingHtml] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const html = generatePaintingHtml(painting);
    setPaintingHtml(html);
  }, [painting]);

  const handleRandomPaintingClick = () => {
    const randomPainting = createRandomPainting();
    setPainting(randomPainting);
  };

  const handleRenderClick = async () => {
    if (paintingHtml === '') return;
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    const imageData = await renderHtml(paintingHtml);
    console.log(imageData);

    context.putImageData(imageData, 0, 0);
  };

  return (
    <Box>
      <Heading as="h2" size="lg" marginBottom={8}>
        Renderer
      </Heading>
      <Button onClick={handleRandomPaintingClick}>Random Painting</Button>
      <CustomHtml html={paintingHtml}></CustomHtml>
      <Button onClick={handleRenderClick}>Render</Button>
      <canvas ref={canvasRef} width={PAINTING_WIDTH} height={PAINTING_HEIGHT}></canvas>
    </Box>
  );
}
