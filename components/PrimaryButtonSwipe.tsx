import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  View
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  Extrapolate,
  interpolate
} from "react-native-reanimated";
import { interpolateColor } from 'react-native-reanimated';



interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = 390;
const BUTTON_PADDING = 5;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - BUTTON_PADDING * 2;
const MAX_TRANSLATE = BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING * 2;
const TEXT_THRESHOLD = MAX_TRANSLATE * 0.1; // When text colors flip
const COMPLETION_THRESHOLD = MAX_TRANSLATE * 0.9; // When handler color changes




const PrimaryButtonSwipe: React.FC<PrimaryButtonProps> = ({

  
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {

    const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = Math.min(Math.max(0, event.translationX), MAX_TRANSLATE);
    },
    onEnd: () => {
      if (translateX.value > COMPLETION_THRESHOLD) {
        runOnJS(onPress)();
      }

      translateX.value = 0;
    },
  });




   const animatedStyle = useAnimatedStyle(() => {

    const handlerColor = interpolateColor(
      translateX.value,
      [0, COMPLETION_THRESHOLD, MAX_TRANSLATE],
      ['#000', '#000', '#fff'] // Black to white when completing
    );

    // Expand width to cover entire button width when swiping
    const expandedWidth = interpolate(
      translateX.value,
      [0, MAX_TRANSLATE],
      [SWIPEABLE_DIMENSIONS, BUTTON_WIDTH - BUTTON_PADDING * 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: handlerColor,
      width: expandedWidth,
    };
  });

  const buttonTextStyle = useAnimatedStyle(() => {
    // Text color flips when handler reaches text area
    const textColor = interpolateColor(
      translateX.value,
      [0, TEXT_THRESHOLD, MAX_TRANSLATE],
      ['#000', '#000', '#fff'] // Black to white when handler reaches text
    );

    return {
      color: textColor,
    };
  });


   const buttonBackgroundStyle = useAnimatedStyle(() => {
    // Background becomes black when handler reaches the end
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, COMPLETION_THRESHOLD, MAX_TRANSLATE],
      ['#fff', '#fff', '#000'] // White to black when completing
    );

    return {
      backgroundColor,
    };
  });


  return (
    <Animated.View style={[styles.button, style, buttonBackgroundStyle]}>
      <Animated.Text style={[styles.buttonText, textStyle, buttonTextStyle]}>
        {title}
      </Animated.Text>
      <PanGestureHandler onGestureEvent={gestureHandler} enabled={!disabled}>
        <Animated.View style={[styles.swipeable, animatedStyle]}> 
            <Text>⛽️</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>  
  );
};

///⛽️

const styles = StyleSheet.create({
   button: {
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    paddingHorizontal: BUTTON_PADDING,
    overflow: "hidden",
    display : 'flex',
    borderWidth : 1,
    borderColor : 'rgba(0,0,0,0.1)'
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
    alignSelf: "center",
    position: "absolute",
    zIndex : 2
  },
  swipeable: {
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS, // This will be overridden by animated style
    borderRadius: 16,
    position: "absolute",
    left: BUTTON_PADDING,
    top: BUTTON_PADDING,
    zIndex: 1,
    // Add subtle shadow for better visual depth`
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'center'
  },
});

export default PrimaryButtonSwipe;
