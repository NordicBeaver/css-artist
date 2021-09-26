import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { PAINTING_HEIGHT, PAINTING_WIDTH } from '../constants';
import { createRandomPainting, generatePaintingHtml } from '../painting';
import { renderHtml, renderHtmlBatch } from '../render';
import CustomHtml from './CustomHtml';

export default function TestRendererPage() {
  const [painting, setPainting] = useState(createRandomPainting);
  const [paintingHtml, setPaintingHtml] = useState('');
  const [perfTestResult, setPerfTestResult] = useState('');

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

  const handlePerformanceTestClick = async () => {
    if (!paintingHtml) return;

    const testLength = 10000;

    setPerfTestResult(`Testing with ${testLength} iterations.`);

    const t0 = performance.now();

    const batchSize = 100;
    const htmls: string[] = [];
    for (let i = 0; i < batchSize; i++) {
      htmls.push(paintingHtml);
    }

    for (let i = 0; i < testLength / batchSize; i++) {
      await renderHtmlBatch(htmls);
    }
    const t1 = performance.now();

    setPerfTestResult(`Done. ${testLength} iterations took ${t1 - t0}ms.`);
  };

  return (
    <Box>
      <Heading as="h2" size="lg" marginBottom={8}>
        Renderer
      </Heading>
      <Button onClick={handleRandomPaintingClick} marginBottom={4}>
        Random Painting
      </Button>
      <CustomHtml html={paintingHtml} marginBottom={4}></CustomHtml>
      <Button onClick={handleRenderClick} marginBottom={4}>
        Render
      </Button>
      <Box marginBottom={4}>
        <canvas
          ref={canvasRef}
          width={PAINTING_WIDTH}
          height={PAINTING_HEIGHT}
          style={{ border: '1px solid black' }}
        ></canvas>
      </Box>
      <Button onClick={handlePerformanceTestClick} marginBottom={4}>
        Performance Test
      </Button>
      <Text>{perfTestResult}</Text>
    </Box>
  );
}
