import { Box } from '@chakra-ui/layout';
import React, { useCallback } from 'react';
import { PAINTING_HEIGHT, PAINTING_WIDTH } from '../constants';

export interface CustomHtmlProps {
  html: string;
}
export default function CustomHtml({ html, ...boxProps }: CustomHtmlProps & React.ComponentProps<typeof Box>) {
  const rootRef = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        node.innerHTML = html;
      }
    },
    [html]
  );

  return (
    <Box
      ref={rootRef}
      position="relative"
      width={PAINTING_WIDTH}
      height={PAINTING_HEIGHT}
      border="1px solid black"
      overflow="hidden"
      {...boxProps}
    ></Box>
  );
}
