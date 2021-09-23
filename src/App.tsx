import { Box, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <Box>Hi</Box>
    </ChakraProvider>
  );
}

export default App;
