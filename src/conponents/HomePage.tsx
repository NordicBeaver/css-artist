import { Box, Button, Code, Heading, HStack, Text, Wrap } from '@chakra-ui/react';
import { range, sortBy, zip, sum } from 'lodash';
import random from 'random';
import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import {
  createRandomPainting,
  generatePaintingHtml,
  mutatePainting,
  Painting,
  paintingsDiff,
  usePaintingHtml,
} from '../painting';
import { renderFile, renderHtml, renderHtmlBatch } from '../render';
import CanvasImage from './CanvasImage';

const generationSize = 10000;
const topCount = 10;
const descendatsCount = 900;
const randomCount = 1000;

const paintingElementsCount = 10;

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
    const painting = createRandomPainting(paintingElementsCount);
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

async function getPaintingsImageData(paintings: Painting[]) {
  const paintingsHtmls = paintings.map((p) => generatePaintingHtml(p));
  const batchSize = 100;
  const paintingsImageData: ImageData[] = [];
  for (let i = 0; i < paintingsHtmls.length / batchSize; i++) {
    const htmlBatch = paintingsHtmls.slice(i * batchSize, (i + 1) * batchSize);
    const imagesBatch = await renderHtmlBatch(htmlBatch);
    paintingsImageData.push(...imagesBatch);
  }
  return paintingsImageData;
}

async function sortPaintingsByScore(paintings: Painting[], originalImageData: ImageData) {
  const paintingsImageData = await getPaintingsImageData(paintings);

  const paintingsSorted: { painting: Painting; imageData: ImageData }[] = [];

  const paintinsRanked = zip(paintings, paintingsImageData).map(([painting, imageData]) => ({
    painting: painting!,
    imageData: imageData!,
    diff: compareImages(originalImageData.data, imageData!.data),
  }));
  const paintingsRankedSorted = sortBy(paintinsRanked, (d) => d.diff);
  return paintingsRankedSorted;
}

async function selectTopPaintings(paintings: Painting[], originalImageData: ImageData) {
  const paintingsImageData = await getPaintingsImageData(paintings);

  const paintingsCompared = zip(paintings, paintingsImageData).map(([painting, imageData]) => ({
    painting: painting!,
    imageData: imageData!,
    diff: compareImages(originalImageData.data, imageData!.data),
  }));

  const topPaintings: { painting: Painting; imageData: ImageData }[] = [];

  for (let i = 0; i < topCount; i++) {
    const paintingsScored = paintingsCompared.map((paintingScored) => {
      const diffFromTop = sum(
        topPaintings.map((topPainting) => paintingsDiff(topPainting.painting, paintingScored.painting))
      );
      const score = diffFromTop > 0 ? (1 / paintingScored.diff) * diffFromTop : 1 / paintingScored.diff;
      return {
        painting: paintingScored.painting,
        imageData: paintingScored.imageData,
        diff: paintingScored.diff,
        diffFromTop: diffFromTop,
        score: score,
      };
    });
    const topPainting = sortBy(paintingsScored, (d) => -d.score)[0];
    topPaintings.push(topPainting);
  }

  return topPaintings;
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
        ? generateNextGeneration(currentGeneration)
        : range(generationSize).map(() => createRandomPainting(paintingElementsCount));

    await selectTopPaintings(paintings, originalImageData);

    const topPaintings = await selectTopPaintings(paintings, originalImageData);

    setCurrentGeneration(topPaintings.slice(0, topCount).map((d) => d.painting));
    setCurrentGenerationImageData(topPaintings.slice(0, 8).map((d) => d.imageData));
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
        // await new Promise((resolve) => setTimeout(resolve, 500));
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
