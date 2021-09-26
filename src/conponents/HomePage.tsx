import { Box, Button, Code, Heading, HStack, Text, Wrap } from '@chakra-ui/react';
import { range, sortBy, zip } from 'lodash';
import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { createRandomPainting, generatePaintingHtml, mutatePainting, Painting, usePaintingHtml } from '../painting';
import { renderFile, renderHtml, renderHtmlBatch } from '../render';
import CanvasImage from './CanvasImage';

const generationSize = 1000;
const topCount = 100;
const descendatsCount = 8;
const randomCount = 100;

const paintingElementsCount = 2;

function generateNextGeneration(paintings: Painting[]) {
  const next: Painting[] = [];
  paintings.forEach((painting) => {
    next.push(painting);
    range(descendatsCount).forEach(() => {
      const mutation = mutatePainting(painting);
      next.push(mutation);
    });
  });
  range(randomCount).forEach(() => {
    const painting = createRandomPainting(2);
    next.push(painting);
  });
  return next;
}

export function compareImages(data1: Uint8ClampedArray, data2: Uint8ClampedArray) {
  let diff = 0;
  for (let i = 0; i < data1.length; i++) {
    let pixelDiff = data1[i] - data2[i];
    if (pixelDiff < 0) {
      pixelDiff = -pixelDiff;
    }
    diff += pixelDiff;
  }
  return diff;
}

export default function HomePage() {
  const [originalPainting, setOriginalPainting] = useState(() => createRandomPainting(paintingElementsCount));
  const originalPaintingHtml = usePaintingHtml(originalPainting);
  const [originalPaintingImageData, setoriginalPaintingImageData] = useState<ImageData | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [iterationsLeft, setIterationsLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [currentGeneration, setCurrentGeneration] = useState<Painting[]>([]);
  const [currentGenerationImageData, setCurrentGenerationImageData] = useState<ImageData[]>([]);

  const iterate = useCallback(async (currentGeneration: Painting[], originalImageData: ImageData) => {
    const paintings =
      currentGeneration.length > 0
        ? generateNextGeneration(currentGeneration.slice(0, topCount))
        : range(generationSize).map(() => createRandomPainting(paintingElementsCount));

    const paintingsHtmls = paintings.map((p) => generatePaintingHtml(p));

    const batchSize = 100;
    const paintingsImageData: ImageData[] = [];
    for (let i = 0; i < paintingsHtmls.length / batchSize; i++) {
      const htmlBatch = paintingsHtmls.slice(i * batchSize, (i + 1) * batchSize);
      const imagesBatch = await renderHtmlBatch(htmlBatch);
      paintingsImageData.push(...imagesBatch);
    }

    const paintinsRanked = zip(paintings, paintingsImageData).map(([painting, imageData]) => ({
      painting: painting!,
      imageData: imageData!,
      diff: compareImages(originalImageData.data, imageData!.data),
    }));
    const paintingsRankedSorted = sortBy(paintinsRanked, (d) => d.diff);

    setCurrentGeneration(paintingsRankedSorted.map((d) => d.painting));
    setCurrentGenerationImageData(paintingsRankedSorted.slice(0, 8).map((d) => d.imageData));

    console.log(paintingsRankedSorted[0].diff);
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedFile !== null) {
        const imageData = await renderFile(selectedFile);
        setoriginalPaintingImageData(imageData);
      } else {
        const imageData = await renderHtml(originalPaintingHtml);
        setoriginalPaintingImageData(imageData);
      }
    })();
  }, [originalPaintingHtml, selectedFile]);

  useEffect(() => {
    (async () => {
      if (iterationsLeft > 0 && !isGenerating) {
        setIsGenerating(true);
        await iterate(currentGeneration!, originalPaintingImageData!);
        setIterationsLeft(iterationsLeft - 1);
        setIsGenerating(false);
      }
    })();
  }, [iterationsLeft, isGenerating, originalPaintingImageData, iterate, currentGeneration]);

  const handleRandomPaintingClick = () => {
    setSelectedFile(null);
    const randomPainting = createRandomPainting(paintingElementsCount);
    setOriginalPainting(randomPainting);
  };

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files![0];
    setSelectedFile(file);
  };

  const handleStartClick = async () => {
    setIterationsLeft(100);
  };

  return (
    <Box>
      <Heading as="h2" size="lg" marginBottom={8}>
        Mutations
      </Heading>

      <HStack marginBottom={4}>
        <Button as="label">
          Select File<input type="file" onChange={handleFileSelect} style={{ display: 'none' }}></input>
        </Button>
        <Button onClick={handleRandomPaintingClick}>Random Painting</Button>
      </HStack>
      {originalPaintingImageData ? (
        <CanvasImage imageData={originalPaintingImageData} marginBottom={4}></CanvasImage>
      ) : null}
      <Button onClick={handleStartClick} marginBottom={4}>
        Train
      </Button>
      <Text>Iterations left: {iterationsLeft}</Text>
      <Wrap marginBottom={4}>
        {currentGenerationImageData.slice(0, 8).map((imageData) => (
          <CanvasImage imageData={imageData}></CanvasImage>
        ))}
      </Wrap>
      {currentGeneration.length > 0 ? <Code>{generatePaintingHtml(currentGeneration[0])}</Code> : null}
    </Box>
  );
}
