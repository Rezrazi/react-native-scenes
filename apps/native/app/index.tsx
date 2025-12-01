import { Icon } from "@native/components/icon";
import { Link, type LinkProps } from "expo-router";
import { Button } from "heroui-native";
import { ArrowRight } from "lucide-react-native";
import { SectionList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

type Page = {
  title: string;
  href: LinkProps["href"];
};

type Section = {
  title: string;
  data: Page[];
};

const pages: Section[] = [
  {
    title: "Onboarding",
    data: [
      {
        title: "Onboarding Slider",
        href: "/demo/onboarding/onboarding-slider",
      },
    ],
  },
  {
    title: "Authentication",
    data: [
      {
        title: "Login",
        href: "/demo/auth/login",
      },
      {
        title: "Register",
        href: "/demo/auth/register",
      },
      {
        title: "Forgot Password",
        href: "/demo/auth/forgot-password",
      },
      {
        title: "Phone number login",
        href: "/demo/auth/phone-number",
      },
      {
        title: "OTP Verification",
        href: "/demo/auth/otp",
      },
    ],
  },
];

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background px-4" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <SectionList
        renderItem={({ item, index, section }) => (
          <Link asChild href={item.href}>
            <Button
              className={cn("mb-2 justify-between", index === section.data.length - 1 && "mb-4")}
              size="lg"
              variant="tertiary"
            >
              <Button.Label>{item.title}</Button.Label>
              <Icon className="text-default-foreground" icon={ArrowRight} />
            </Button>
          </Link>
        )}
        renderSectionHeader={({ section }) => (
          <Text className="bg-background pb-2 font-semibold text-muted uppercase">{section.title}</Text>
        )}
        sections={pages}
      />
    </View>
  );
}
