import { Box, Code, Grid, Heading } from '@chakra-ui/react';
import React, { useState } from 'react';
import { createRandomPainting, Painting, usePaintingHtml } from '../painting';
import CustomHtml from './CustomHtml';
import PaintingForm from './PaintingForm';

export default function TestParametersPage() {
  const [painting, setPainting] = useState(() => createRandomPainting(2));
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
