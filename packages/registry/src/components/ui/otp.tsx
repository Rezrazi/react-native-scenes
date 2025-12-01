import type * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { cn } from "@/lib/utils";

export type OtpProps = Omit<TextInputProps, "value" | "onChange"> & {
  value?: number[];
  maxLength: number;
  ref?: React.RefObject<TextInput | null>;
  onComplete?: (value: number[]) => void;
  onChange?: (value: number[]) => void;
};

const Digit = ({ digit, isActive }: { digit: number | undefined; isActive: boolean }) => (
  <View
    className={cn("h-18 w-14 items-center justify-center rounded-lg bg-surface", {
      "border-2 border-accent": isActive,
    })}
  >
    {Number.isInteger(digit) ? <Text className="font-bold font-mono text-3xl text-foreground">{digit}</Text> : null}
  </View>
);

const regex = /^\d$/;

export const Otp = ({ ref, onChange, maxLength, onComplete, ...props }: OtpProps) => {
  const [value, setValue] = useState<number[]>(props.value ?? []);

  const onChangeText = (newValue: string) => {
    if (newValue.length === 0) {
      setValue([]);

      return;
    }

    const digits = newValue
      .split("")
      .filter((char) => regex.test(char))
      .map((char) => Number(char));

    if (digits.length > maxLength) {
      return;
    }

    setValue(digits);
  };

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }

    if (value.length === maxLength) {
      onComplete?.(value);
    }
  }, [value, maxLength, onComplete, onChange]);

  const onPress = useCallback(() => {
    ref?.current?.focus();
  }, [ref]);

  return (
    <Pressable className="relative py-2" onPress={onPress}>
      <View className="flex-row justify-center gap-1">
        {Array.from({ length: maxLength }).map((_, idx) => (
          <Digit digit={value.at(idx)} isActive={value.length === idx} key={`digit-${idx}`} />
        ))}
      </View>
      <TextInput
        accessibilityRole="text"
        accessible
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        autoFocus
        caretHidden
        className="absolute"
        clearTextOnFocus
        inputMode="numeric"
        ref={ref}
        style={[styles.input]}
        testID="otp-input"
        textContentType="oneTimeCode"
        {...props}
        onChangeText={onChangeText}
        value={value.join("")}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  input: {
    /**
     * On iOS if the input has an opacity of 0, we can't paste text into it.
     * This is a workaround to allow pasting text into the input.
     */
    ...Platform.select({
      ios: {
        opacity: 0.02,
        color: "transparent",
      },
      android: {
        opacity: 0,
      },
    }),
  },
});
