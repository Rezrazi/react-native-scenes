import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export type AuthProps = {
  children: ReactNode;
};

const AuthRoot = ({ children, className, ...props }: AuthProps & ViewProps) => (
  <View {...props} className={cn("flex-1 gap-8 px-8", className)}>
    {children}
  </View>
);

const AuthContent = ({ className, children, ...props }: ViewProps) => (
  <View className={cn("gap-4", className)} {...props}>
    {children}
  </View>
);

const AuthActions = ({ className, children, ...props }: ViewProps) => (
  <View className={cn("gap-4", className)} {...props}>
    {children}
  </View>
);

const AuthDivider = ({ children }: { children: string }) => (
  <View className="flex-row items-center">
    <View className="h-[1px] flex-1 bg-muted/30" />

    <Text className="px-3 font-medium text-muted/70 text-sm">{children}</Text>

    <View className="h-[1px] flex-1 bg-muted/30" />
  </View>
);

export const Auth = Object.assign(AuthRoot, {
  Content: AuthContent,
  Actions: AuthActions,
  Divider: AuthDivider,
});
