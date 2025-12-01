import { defineStepper } from "@stepperize/react";
import { Image } from "expo-image";
import { Button } from "heroui-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingSlider } from "@/components/blocks/onboarding-slider";

const size = 300;

const { useStepper } = defineStepper(
  {
    id: "step-1",
    title: "Build Faster, Ship Smarter",
    description: "Transform your workflow with powerful tools designed for modern development teams.",
    children: (
      <Image
        contentFit="contain"
        source={require("@native/assets/illustrations/DrawKit_Vector_Illustrations_Cat shot.svg")}
        style={{ width: size, height: size }}
      />
    ),
  },
  {
    id: "step-2",
    title: "Collaborate in Real-Time",
    description: "Connect with your team instantly and keep everyone aligned on what matters most.",
    children: (
      <Image
        contentFit="contain"
        source={require("@native/assets/illustrations/DrawKit_Vector_Illustrations_Podcast.svg")}
        style={{ width: size, height: size }}
      />
    ),
  },
  {
    id: "step-3",
    title: "Track Progress Seamlessly",
    description: "Monitor metrics and milestones with intuitive dashboards built for efficiency.",
    children: (
      <Image
        contentFit="contain"
        source={require("@native/assets/illustrations/DrawKit_Vector_Illustrations_Selfie.svg")}
        style={{ width: size, height: size }}
      />
    ),
  },
  {
    id: "step-4",
    title: "Deploy with Confidence",
    description: "Ship production-ready code faster with automated testing and quality checks.",
    children: (
      <Image
        contentFit="contain"
        source={require("@native/assets/illustrations/DrawKit_Vector_Illustrations_Shopping call.svg")}
        style={{ width: size, height: size }}
      />
    ),
  }
);

export default function Page() {
  const insets = useSafeAreaInsets();
  const { current, all, goTo, isFirst, isLast } = useStepper();

  const onGoTo = (index: number) => {
    const next = all[index];

    if (!next) {
      return;
    }

    goTo(next.id);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <OnboardingSlider all={all} current={current} goTo={onGoTo} isFirst={isFirst} isLast={isLast}>
        <OnboardingSlider.Header>
          <OnboardingSlider.Indicator />
        </OnboardingSlider.Header>

        <OnboardingSlider.Items items={all} />

        <OnboardingSlider.Action asChild>
          <Button className="w-full rounded-full" size="lg" variant="primary">
            <Button.Label className="font-bold">{isLast ? "Get Started" : "Next"}</Button.Label>
          </Button>
        </OnboardingSlider.Action>
      </OnboardingSlider>
    </View>
  );
}
