declare module "@hugeicons/react-native" {
  import type { SvgProps } from "react-native-svg";
  import type { StyleProp, ViewStyle } from "react-native";

  // matches the type you showed
  export type IconSvgElement = readonly (readonly [
    string,
    {
      readonly [key: string]: string | number;
    },
  ])[];

  export interface HugeiconsProps extends SvgProps {
    size?: string | number;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
    className?: string;
    style?: StyleProp<ViewStyle>;
    icon: IconSvgElement;
    altIcon?: IconSvgElement;
    showAlt?: boolean;
  }

  // Replace 'any' with a proper React component type
  export const HugeiconsIcon: React.ComponentType<HugeiconsProps>;
}
