import { Box, Code, Grid, Heading } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Painting, usePaintingHtml } from '../painting';
import CustomHtml from './CustomHtml';
import PaintingForm from './PaintingForm';

function testPainting() {
  const painting: Painting = {
    elements: [
      { posX: 10, posY: 10, height: 20, width: 20, backgroundRed: 255, backgroundGreen: 0, backgroundBlue: 0 },
      { posX: 40, posY: 60, height: 50, width: 10, backgroundRed: 0, backgroundGreen: 255, backgroundBlue: 0 },
    ],
  };
  return painting;
}

export default function TestParametersPage() {
  const [painting, setPainting] = useState(testPainting);
  const paintingHtml = usePaintingHtml(painting);

  const handlePaintingFormChange = (newPainting: Painting) => {
    setPainting(newPainting);
  };

  return (
    <Grid templateColumns="300px 1fr" gap={10}>
      <Box>
        <Heading as="h2" size="lg" marginBottom={8}>
          Painting Parameters
        </Heading>
        <PaintingForm painting={painting} onChange={handlePaintingFormChange}></PaintingForm>
      </Box>
      <Box padding={20}>
        <Box marginBottom={8}>
          <CustomHtml html={paintingHtml}></CustomHtml>
        </Box>
        <Box maxW={80}>
          <Code>{paintingHtml}</Code>
        </Box>
      </Box>
    </Grid>
  );
}
