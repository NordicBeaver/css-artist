import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { VStack } from '@chakra-ui/layout';
import { HStack, SliderFilledTrack, SliderTrack } from '@chakra-ui/react';
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

  const handlePositionZSliderChange = (value: number) => {
    onChange?.({ ...element, zIndex: value });
  };

  const handleWidthSliderChange = (value: number) => {
    onChange?.({ ...element, width: value });
  };

  const handleHeightSliderChange = (value: number) => {
    onChange?.({ ...element, height: value });
  };

  const handleColorRedSliderChange = (value: number) => {
    onChange?.({ ...element, backgroundRed: value });
  };

  const handleColorGreenSliderChange = (value: number) => {
    onChange?.({ ...element, backgroundGreen: value });
  };

  const handleColorBlueSliderChange = (value: number) => {
    onChange?.({ ...element, backgroundBlue: value });
  };

  return (
    <VStack>
      <FormControl>
        <FormLabel>
          Position (X: {element.posX}, Y: {element.posY}, Z: {element.zIndex})
        </FormLabel>
        <HStack spacing={5}>
          <Slider min={0} max={PAINTING_WIDTH} value={element.posX} onChange={handlePositionXSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
          <Slider min={0} max={PAINTING_HEIGHT} value={element.posY} onChange={handlePositionYSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
          <Slider min={-100} max={100} value={element.zIndex} onChange={handlePositionZSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel>
          Size (Width: {element.width}, Height: {element.height})
        </FormLabel>
        <HStack spacing={5}>
          <Slider min={0} max={PAINTING_WIDTH} value={element.width} onChange={handleWidthSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
          <Slider min={0} max={PAINTING_HEIGHT} value={element.height} onChange={handleHeightSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel>
          Color (R: {element.backgroundRed}, G: {element.backgroundGreen}, B: {element.backgroundBlue})
        </FormLabel>
        <HStack spacing={5}>
          <Slider min={0} max={255} value={element.backgroundRed} onChange={handleColorRedSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
          <Slider min={0} max={255} value={element.backgroundGreen} onChange={handleColorGreenSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
          <Slider min={0} max={255} value={element.backgroundBlue} onChange={handleColorBlueSliderChange}>
            <SliderTrack>
              <SliderFilledTrack></SliderFilledTrack>
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </HStack>
      </FormControl>
    </VStack>
  );
}
