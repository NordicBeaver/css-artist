import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { Painting, PaintingElement } from '../painting';
import PaintingElementForm from './PaintingElementForm';

interface PaintingFormProps {
  painting: Painting;
  onChange?: (painting: Painting) => void;
}
export default function PaintingForm({ painting, onChange }: PaintingFormProps) {
  const handleElementChange = (index: number, element: PaintingElement) => {
    if (onChange) {
      const newPainting: Painting = {
        ...painting,
        elements: [...painting.elements],
      };
      newPainting.elements[index] = element;
      onChange(newPainting);
    }
  };

  return (
    <Box>
      {painting.elements.map((paintingElement, index) => (
        <Box marginBottom={4}>
          <Heading as="h3" size="md" marginBottom={2}>
            Element {index + 1}
          </Heading>
          <PaintingElementForm
            element={paintingElement}
            onChange={(newElement) => handleElementChange(index, newElement)}
          ></PaintingElementForm>
        </Box>
      ))}
    </Box>
  );
}
