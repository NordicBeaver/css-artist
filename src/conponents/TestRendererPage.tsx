import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

export default function TestRendererPage() {
  return (
    <Box>
      <Heading as="h2" size="lg" marginBottom={8}>
        Renderer
      </Heading>
    </Box>
  );
}
