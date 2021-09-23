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

function generateElementHtml(parameters: PaintingElement): string {
  const styleProperties = [
    `position: absolute;`,
    `top: ${parameters.posY}px;`,
    `left: ${parameters.posX}px;`,
    `width: ${parameters.width}px;`,
    `height: ${parameters.height}px;`,
    `background-color: rgb(${parameters.backgroundRed}, ${parameters.backgroundGreen}, ${parameters.backgroundBlue});`,
  ];
  const style = styleProperties.join(' ');
  const html = `<div style="${style}"></div>`;
  return html;
}

export function generatePaintingHtml(parameters: Painting) {
  // Pass empty string to join, because its ',' by default.
  const html = parameters.elements.map((elementParams) => generateElementHtml(elementParams)).join('');
  return html;
}
