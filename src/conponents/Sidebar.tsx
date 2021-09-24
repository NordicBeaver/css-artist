import { VStack } from '@chakra-ui/layout';
import { Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <VStack spacing={2} align="stretch" fontWeight={600}>
      <Link as={RouterLink} to="/">
        Home
      </Link>
      <Link as={RouterLink} to="/test-parameters">
        Test Parameters
      </Link>
    </VStack>
  );
}
