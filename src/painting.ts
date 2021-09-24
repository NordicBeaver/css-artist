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
