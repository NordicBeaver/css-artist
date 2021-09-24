import { Box } from '@chakra-ui/layout';
import React, { useCallback } from 'react';

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
      width={200}
      height={200}
      border="1px solid black"
      overflow="hidden"
      {...boxProps}
    ></Box>
  );
}
