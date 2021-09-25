import { PAINTING_HEIGHT, PAINTING_WIDTH } from './constants';

const maxBatchSize = 100;

const canvas = document.createElement('canvas');
canvas.width = PAINTING_WIDTH;
canvas.height = PAINTING_HEIGHT * maxBatchSize;
const context = canvas.getContext('2d')!;

const readAsDataUrl = (svg: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      const svgDataUrl = e.target!.result as string;
      resolve(svgDataUrl);
    });
    reader.readAsDataURL(svg);
  });
};

const drawImage = (dataUrl: string) => {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = dataUrl;
  });
};

export async function renderHtml(html: string) {
  const svgString =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PAINTING_WIDTH}" height="${PAINTING_HEIGHT * maxBatchSize}">` +
    '<foreignObject width="100%" height="100%">' +
    '<div xmlns="http://www.w3.org/1999/xhtml">' +
    html +
    '</div>' +
    '</foreignObject>' +
    '</svg>';

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const dataUrl = await readAsDataUrl(svgBlob);
  const image = await drawImage(dataUrl);

  context.clearRect(0, 0, PAINTING_WIDTH, PAINTING_HEIGHT);
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, PAINTING_WIDTH, PAINTING_HEIGHT);
  return imageData;
}

export async function renderHtmlBatch(htmls: string[]) {
  const svgString =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PAINTING_WIDTH}" height="${PAINTING_HEIGHT * maxBatchSize}">` +
    '<foreignObject width="100%" height="100%">' +
    '<div xmlns="http://www.w3.org/1999/xhtml">' +
    htmls.join('') +
    '</div>' +
    '</foreignObject>' +
    '</svg>';

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const dataUrl = await readAsDataUrl(svgBlob);
  const image = await drawImage(dataUrl);

  context.clearRect(0, 0, PAINTING_WIDTH, PAINTING_HEIGHT * maxBatchSize);
  context.drawImage(image, 0, 0);

  const data: ImageData[] = [];
  for (let i = 0; i < htmls.length; i++) {
    const imageData = context.getImageData(0, i * PAINTING_HEIGHT, PAINTING_WIDTH, PAINTING_HEIGHT);
    data.push(imageData);
  }
  return data;
}
