import random from 'random';
import { PAINTING_HEIGHT, PAINTING_WIDTH } from './constants';
import { clamp, cloneDeep, zip, sum, sortBy } from 'lodash';
import { useEffect, useState } from 'react';

export interface PaintingElement {
  posX: number;
  posY: number;
  width: number;
  height: number;
  backgroundRed: number;
  backgroundGreen: number;
  backgroundBlue: number;
  zIndex: number;
  borderRadiusTL: number;
  borderRadiusTR: number;
  borderRadiusBR: number;
  borderRadiusBL: number;
}

export interface Painting {
  elements: PaintingElement[];
}

function createRandomElement() {
  // Pick a random point for a center, rather than top-left
  const midX = random.int(0, PAINTING_WIDTH - 1);
  const midY = random.int(0, PAINTING_HEIGHT - 1);
  const width = random.int(0, PAINTING_WIDTH);
  const height = random.int(0, PAINTING_HEIGHT);
  const posX = clamp(midX - Math.floor(width / 2), 0, PAINTING_WIDTH);
  const posY = clamp(midY - Math.floor(height / 2), 0, PAINTING_HEIGHT);
  const zIndex = random.int(-100, 100);
  const element: PaintingElement = {
    posX: posX,
    posY: posY,
    width: width,
    height: height,
    backgroundRed: Math.floor(Math.random() * 256),
    backgroundGreen: Math.floor(Math.random() * 256),
    backgroundBlue: Math.floor(Math.random() * 256),
    zIndex: zIndex,
    borderRadiusTL: random.int(0, 100),
    borderRadiusTR: random.int(0, 100),
    borderRadiusBR: random.int(0, 100),
    borderRadiusBL: random.int(0, 100),
  };
  return element;
}

export function createRandomPainting(elementsCount: number = 10) {
  const painting: Painting = { elements: [] };
  for (let i = 0; i < elementsCount; i++) {
    const element = createRandomElement();
    painting.elements.push(element);
  }
  return painting;
}

function generateElementHtml(element: PaintingElement): string {
  const styleProperties = [
    `position: absolute;`,
    `opacity: 50%;`,
    `top: ${element.posY}px;`,
    `left: ${element.posX}px;`,
    `width: ${element.width}px;`,
    `height: ${element.height}px;`,
    `background-color: rgb(${element.backgroundRed}, ${element.backgroundGreen}, ${element.backgroundBlue});`,
    `z-index: ${element.zIndex};`,
    `border-radius: ${element.borderRadiusTL}% ${element.borderRadiusTR}% ${element.borderRadiusBR}% ${element.borderRadiusBL}%;`,
  ];
  const style = styleProperties.join(' ');
  const html = `<div style="${style}"></div>`;
  return html;
}

export function generatePaintingHtml(painting: Painting) {
  // Pass empty string to join, because its ',' by default.
  const elementsHtml = painting.elements.map((element) => generateElementHtml(element)).join('');
  const html = `<div style="position: relative; width: ${PAINTING_WIDTH}px; height: ${PAINTING_HEIGHT}px; overflow: hidden">${elementsHtml}</div>`;
  return html;
}

export function usePaintingHtml(painting: Painting | null) {
  const [paintingHtml, setPaintingHtml] = useState('');

  useEffect(() => {
    if (painting !== null) {
      const html = generatePaintingHtml(painting);
      setPaintingHtml(html);
    } else {
      setPaintingHtml('');
    }
  }, [painting]);

  return paintingHtml;
}

export function mutatePainting(painting: Painting) {
  const posRate = 50;
  const colorRate = 20;
  const zIndexRate = 10;
  const radiusRate = 10;
  const mutationChanceThreshold = 0.8;

  const newPainting = cloneDeep(painting);
  newPainting.elements.forEach((e) => {
    if (Math.random() > mutationChanceThreshold) {
      e.posX = clamp(e.posX + Math.round(random.normal(0, posRate)()), 0, PAINTING_WIDTH);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.posY = clamp(e.posY + Math.round(random.normal(0, posRate)()), 0, PAINTING_HEIGHT);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.width = clamp(e.width + Math.round(random.normal(0, posRate)()), 10, PAINTING_WIDTH - e.posX);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.height = clamp(e.height + Math.round(random.normal(0, posRate)()), 10, PAINTING_HEIGHT - e.posY);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.backgroundRed = clamp(e.backgroundRed + Math.round(random.normal(0, colorRate)()), 0, 255);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.backgroundGreen = clamp(e.backgroundGreen + Math.round(random.normal(0, colorRate)()), 0, 255);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.backgroundBlue = clamp(e.backgroundBlue + Math.round(random.normal(0, colorRate)()), 0, 255);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.zIndex = clamp(e.zIndex + Math.round(random.normal(0, zIndexRate)()), -100, 100);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.borderRadiusTL = clamp(e.borderRadiusTL + Math.round(random.normal(0, radiusRate)()), 0, 100);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.borderRadiusTR = clamp(e.borderRadiusTR + Math.round(random.normal(0, radiusRate)()), 0, 100);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.borderRadiusBR = clamp(e.borderRadiusBR + Math.round(random.normal(0, radiusRate)()), 0, 100);
    }
    if (Math.random() > mutationChanceThreshold) {
      e.borderRadiusBL = clamp(e.borderRadiusBL + Math.round(random.normal(0, radiusRate)()), 0, 100);
    }
  });
  return newPainting;
}

function elementsDiff(element1: PaintingElement, element2: PaintingElement) {
  let diff = 0;
  diff += Math.abs(element1.posX - element2.posX);
  diff += Math.abs(element1.posY - element2.posY);
  diff += Math.abs(element1.width - element2.width);
  diff += Math.abs(element1.height - element2.height);
  diff += Math.abs(element1.backgroundRed - element2.backgroundRed);
  diff += Math.abs(element1.backgroundGreen - element2.backgroundGreen);
  diff += Math.abs(element1.backgroundBlue - element2.backgroundBlue);
  diff += Math.abs(element1.zIndex - element2.zIndex);
  return diff;
}

export function paintingsDiff(painting1: Painting, painting2: Painting) {
  const diffs = zip(
    sortBy(painting1.elements, (e) => e.zIndex),
    sortBy(painting2.elements, (e) => e.zIndex)
  ).map(([element1, element2]) => elementsDiff(element1!, element2!));
  const diff = sum(diffs);
  return diff;
}
