import { Box, Button, Heading } from '@chakra-ui/react';
import React, { useState } from 'react';
import { createRandomPainting, mutatePainting, Painting, usePaintingHtml } from '../painting';
import CustomHtml from './CustomHtml';

export default function TestMutationPage() {
  const [painting, setPainting] = useState(createRandomPainting);
  const paintingHtml = usePaintingHtml(painting);

  const [mutation, setMutation] = useState<Painting | null>(null);
  const mutationHtml = usePaintingHtml(mutation);

  const handleRandomPaintingClick = () => {
    const randomPainting = createRandomPainting(3);
    setPainting(randomPainting);
  };

  const handleMutateClick = () => {
    const mutation = mutatePainting(painting);
    setMutation(mutation);
  };

  return (
    <Box>
      <Heading as="h2" size="lg" marginBottom={8}>
        Mutations
      </Heading>
      <Button onClick={handleRandomPaintingClick} marginBottom={4}>
        Random Painting
      </Button>
      <CustomHtml html={paintingHtml} marginBottom={4}></CustomHtml>
      <Button onClick={handleMutateClick} marginBottom={4}>
        Mutate
      </Button>
      <CustomHtml html={mutationHtml} marginBottom={4}></CustomHtml>
    </Box>
  );
}
