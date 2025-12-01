import type { LucideIcon } from "lucide-react-native";
import type { ComponentProps } from "react";
import { withUniwind } from "uniwind";

type IconProps = {
  icon: LucideIcon;
} & ComponentProps<LucideIcon>;

export function Icon({ icon: LucideIconComponent, ...props }: IconProps) {
  const StyledIcon = withUniwind(LucideIconComponent);

  return <StyledIcon {...props} />;
}
