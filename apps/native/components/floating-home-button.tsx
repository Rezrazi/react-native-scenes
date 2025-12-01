import { usePathname, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { ArrowLeft } from "lucide-react-native";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUTTON_SIZE = 48;
const IS_DEMO = process.env.EXPO_PUBLIC_DEMO === "true";

export const FloatingHomeButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const translateX = useSharedValue(16);
  const translateY = useSharedValue(insets.top + 40);
  const offsetX = useSharedValue(16);
  const offsetY = useSharedValue(insets.top + 16);
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(150)
    .onStart(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      isDragging.value = false;
      // Grow and make opaque when holding
      scale.value = withSpring(1.15, { damping: 15, stiffness: 200 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 200 });
    })
    .onUpdate((event) => {
      const newX = offsetX.value + event.translationX;
      const newY = offsetY.value + event.translationY;

      // Mark as dragging if moved more than 5 pixels
      if (Math.abs(event.translationX) > 5 || Math.abs(event.translationY) > 5) {
        isDragging.value = true;
      }

      // Constrain within screen bounds
      translateX.value = Math.max(0, Math.min(width - BUTTON_SIZE, newX));
      translateY.value = Math.max(insets.top, Math.min(height - BUTTON_SIZE - insets.bottom, newY));
    })
    .onEnd(() => {
      // Snap to nearest edge (left or right)
      const shouldSnapToRight = translateX.value > width / 2 - BUTTON_SIZE / 2;
      translateX.value = withSpring(shouldSnapToRight ? width - BUTTON_SIZE - 16 : 16, { damping: 20, stiffness: 90 });
      // Return to normal size and opacity
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withSpring(0.3, { damping: 15, stiffness: 200 });
    });

  const shouldShow = IS_DEMO && pathname !== "/";

  const animatedStyle = useAnimatedStyle(() => ({
    // @ts-expect-error
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    opacity: shouldShow ? opacity.value : 0,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        pointerEvents={shouldShow ? "auto" : "none"}
        style={[
          {
            position: "absolute",
            zIndex: 50,
          },
          animatedStyle,
        ]}
      >
        <Button
          className="bg-background-tertiary"
          isIconOnly
          onPress={() => router.dismiss()}
          testID="return-home"
          variant="secondary"
        >
          {/** @ts-expect-error */}
          <ArrowLeft className="text-white" />
        </Button>
      </Animated.View>
    </GestureDetector>
  );
};
