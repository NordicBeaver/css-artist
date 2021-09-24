import random from 'random';
import { PAINTING_HEIGHT, PAINTING_WIDTH } from './constants';
import { clamp } from 'lodash';

export interface PaintingElement {
  posX: number;
  posY: number;
  width: number;
  height: number;
  backgroundRed: number;
  backgroundGreen: number;
  backgroundBlue: number;
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
  const element: PaintingElement = {
    posX: posX,
    posY: posY,
    width: width,
    height: height,
    backgroundRed: Math.floor(Math.random() * 256),
    backgroundGreen: Math.floor(Math.random() * 256),
    backgroundBlue: Math.floor(Math.random() * 256),
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
    `top: ${element.posY}px;`,
    `left: ${element.posX}px;`,
    `width: ${element.width}px;`,
    `height: ${element.height}px;`,
    `background-color: rgb(${element.backgroundRed}, ${element.backgroundGreen}, ${element.backgroundBlue});`,
  ];
  const style = styleProperties.join(' ');
  const html = `<div style="${style}"></div>`;
  return html;
}

export function generatePaintingHtml(painting: Painting) {
  // Pass empty string to join, because its ',' by default.
  const html = painting.elements.map((element) => generateElementHtml(element)).join('');
  return html;
}
