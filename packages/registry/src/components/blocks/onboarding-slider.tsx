import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  type FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

export type Step<T = any> = {
  id: string;
  children?: ReactNode;
} & Record<string, T>;

type OnboardingSliderContext = {
  scrollX: SharedValue<number>;
  currentIndex: number;
  all: Step[];
  isLast: boolean;
  isFirst: boolean;
  goTo: (index: number) => void;
  handleNext: () => void;
  flatListRef: RefObject<FlatList | null>;
};

const OnboardingContext = createContext<OnboardingSliderContext | undefined>(undefined);

const useOnboardingSlider = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("OnboardingSlider components must be used within OnboardingSlider");
  }

  return context;
};

export type OnboardingSliderProps = {
  /**
   * Array of steps to display. Each step must have an `id` property.
   */
  all: Step[];
  /**
   * Current step.
   */
  current: Step;
  /**
   * Whether the current step is the last one.
   */
  isLast: boolean;
  /**
   * Whether the current step is the first one.
   */
  isFirst: boolean;
  /**
   * Callback to go to a specific step by its index in the `all` array.
   * @param index - index of the step to go to.
   */
  goTo: (index: number) => void;
  /**
   * Content to display inside the slider.
   */
  children: ReactNode;
};

const OnboardingSliderRoot = ({
  current,
  all,
  isLast,
  isFirst,
  goTo,
  className,
  children,
  ...props
}: OnboardingSliderProps & ViewProps) => {
  const scrollX = useSharedValue(0);
  const currentIndex = all.findIndex((step) => step.id === current.id);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex + 1;

    if (newIndex >= all.length) {
      return;
    }

    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });

    goTo(newIndex);
  }, [currentIndex, all.length, goTo]);

  const value: OnboardingSliderContext = {
    scrollX,
    currentIndex,
    all,
    isLast,
    isFirst,
    goTo,
    handleNext,
    flatListRef,
  };

  return (
    <OnboardingContext.Provider value={value}>
      <View {...props} className={cn("flex-1 gap-8", className)}>
        {children}
      </View>
    </OnboardingContext.Provider>
  );
};

const OnboardingSliderHeader = ({ className, children, ...props }: ViewProps) => (
  <View className={cn("", className)} {...props}>
    {children}
  </View>
);

const OnboardingSliderContent = ({ className, children, ...props }: ViewProps) => (
  <View className={cn("flex-1", className)} {...props}>
    {children}
  </View>
);

type OnboardingSliderItemsProps = {
  items: Step[];
} & Omit<ViewProps, "children">;

const OnboardingSliderItems = ({ items, className, ...props }: OnboardingSliderItemsProps) => {
  const { scrollX, goTo, flatListRef } = useOnboardingSlider();
  const { width } = useWindowDimensions();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      goTo(newIndex);
    },
    [width, goTo]
  );

  const renderItem = useCallback(
    ({ item }: { item: Step }) => (
      <View className="flex-1 gap-4" style={{ width }}>
        <View className="flex-1 items-center justify-center">{item.children}</View>
        <View className="h-48 gap-4 px-8">
          <Text className="text-left font-extrabold text-4xl text-foreground tracking-tight">{item.title}</Text>
          <Text className="text-left text-muted text-xl">{item.description}</Text>
        </View>
      </View>
    ),
    [width]
  );

  return (
    <View className={cn("flex-1", className)} {...props}>
      <Animated.FlatList
        bounces={false}
        data={items}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        horizontal
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={scrollHandler}
        pagingEnabled
        ref={flatListRef}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const OnboardingSliderFooter = ({ className, children, ...props }: ViewProps) => (
  <View className={cn("px-8 pb-4", className)} {...props}>
    {children}
  </View>
);

type OnboardingSliderActionProps = {
  asChild?: boolean;
  children: ReactNode;
} & Omit<ViewProps, "children">;

const OnboardingSliderAction = ({ asChild, children, className, ...props }: OnboardingSliderActionProps) => {
  const { handleNext } = useOnboardingSlider();

  if (asChild && isValidElement(children)) {
    return (
      <View className={cn("px-8 pb-4", className)} {...props}>
        {cloneElement(children, { onPress: handleNext } as any)}
      </View>
    );
  }

  return (
    <View className={cn("px-8 pb-4", className)} {...props}>
      <Pressable onPress={handleNext}>{children}</Pressable>
    </View>
  );
};

type IndicatorProps = {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
};

const Indicator = ({ index, scrollX, width }: IndicatorProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const fillWidth = interpolate(scrollX.value, [width * (index - 1), width * index], [0, 100], Extrapolation.CLAMP);

    return {
      width: index === 0 ? "100%" : `${fillWidth}%`,
    };
  });

  return (
    <View className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/25">
      <Animated.View className="h-full rounded-full bg-accent" style={animatedStyle} />
    </View>
  );
};

const OnboardingSliderIndicator = () => {
  const { scrollX, all } = useOnboardingSlider();
  const { width } = useWindowDimensions();

  return (
    <View className="flex-row gap-2 px-8 pt-4">
      {all.map((_, index) => (
        <Indicator index={index} key={`indicator-${index}`} scrollX={scrollX} width={width} />
      ))}
    </View>
  );
};

export const OnboardingSlider = Object.assign(OnboardingSliderRoot, {
  Header: OnboardingSliderHeader,
  Content: OnboardingSliderContent,
  Items: OnboardingSliderItems,
  Indicator: OnboardingSliderIndicator,
  Footer: OnboardingSliderFooter,
  Action: OnboardingSliderAction,
});
