import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { VStack } from '@chakra-ui/layout';
import { SliderFilledTrack, SliderTrack } from '@chakra-ui/react';
import { Slider, SliderThumb } from '@chakra-ui/slider';
import React from 'react';
import { PAINTING_HEIGHT, PAINTING_WIDTH } from '../constants';
import { PaintingElement } from '../painting';

export interface PaintingElementFormProps {
  element: PaintingElement;
  onChange?: (element: PaintingElement) => void;
}
export default function PaintingElementForm({ element, onChange }: PaintingElementFormProps) {
  const handlePositionXSliderChange = (value: number) => {
    onChange?.({ ...element, posX: value });
  };

  const handlePositionYSliderChange = (value: number) => {
    onChange?.({ ...element, posY: value });
  };

  const handleWidthSliderChange = (value: number) => {
    onChange?.({ ...element, width: value });
  };

  const handleHeightSliderChange = (value: number) => {
    onChange?.({ ...element, height: value });
  };

  return (
    <VStack>
      <FormControl>
        <FormLabel marginBottom={0}>Position X: {element.posX}</FormLabel>
        <Slider min={0} max={PAINTING_WIDTH} value={element.posX} onChange={handlePositionXSliderChange}>
          <SliderTrack>
            <SliderFilledTrack></SliderFilledTrack>
          </SliderTrack>
          <SliderThumb></SliderThumb>
        </Slider>
      </FormControl>
      <FormControl>
        <FormLabel marginBottom={0}>Position Y: {element.posY}</FormLabel>
        <Slider min={0} max={PAINTING_HEIGHT} value={element.posY} onChange={handlePositionYSliderChange}>
          <SliderTrack>
            <SliderFilledTrack></SliderFilledTrack>
          </SliderTrack>
          <SliderThumb></SliderThumb>
        </Slider>
      </FormControl>
      <FormControl>
        <FormLabel marginBottom={0}>Width: {element.width}</FormLabel>
        <Slider min={0} max={PAINTING_WIDTH} value={element.width} onChange={handleWidthSliderChange}>
          <SliderTrack>
            <SliderFilledTrack></SliderFilledTrack>
          </SliderTrack>
          <SliderThumb></SliderThumb>
        </Slider>
      </FormControl>
      <FormControl>
        <FormLabel marginBottom={0}>Height: {element.height}</FormLabel>
        <Slider min={0} max={PAINTING_HEIGHT} value={element.height} onChange={handleHeightSliderChange}>
          <SliderTrack>
            <SliderFilledTrack></SliderFilledTrack>
          </SliderTrack>
          <SliderThumb></SliderThumb>
        </Slider>
      </FormControl>
    </VStack>
  );
}
