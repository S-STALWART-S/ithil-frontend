import {
  Badge,
  Slider as ChakraSlider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  UseSliderProps,
} from "@chakra-ui/react";

interface Props {
  value: number;
  onChange: UseSliderProps["onChange"];
}

const Slider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <>
      <ChakraSlider
        value={value}
        onChange={onChange}
        aria-label="slider-ex-4"
        defaultValue={value}
        min={1}
        max={12}
        step={1}
        style={{ width: "100%" }}
      >
        <SliderMark mt={5} value={value}>
          <Badge
            style={{
              borderRadius: "25%",
              padding: "2px 10px",
            }}
            ml="-3"
            fontSize="18px"
            colorScheme="cyan"
          >
            {value}
          </Badge>
        </SliderMark>
        <SliderTrack bg="white">
          <SliderFilledTrack bg="transparent" />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </ChakraSlider>
    </>
  );
};

export default Slider;
