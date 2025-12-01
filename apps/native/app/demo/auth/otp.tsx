import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "@native/components/safe-area-view";
import { Link, Stack } from "expo-router";
import { Button, TextField } from "heroui-native";
import { useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type { TextInput } from "react-native";
import { z } from "zod";
import { Auth } from "@/components/blocks/auth";
import { Otp } from "@/components/ui/otp";

const schema = z.object({
  code: z.array(z.number()).length(6, "Please enter a valid verification code"),
});

export default function LoginScene() {
  const ref = useRef<TextInput>(null);

  const form = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      code: [],
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    const code = values.code.join("");

    alert(`Code verified ${code}, welcome back!`);
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "Verify your phone number", headerShown: true, headerBackButtonDisplayMode: "minimal" }}
      />
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        <FormProvider {...form}>
          <Auth className="flex-1 px-6 pt-8">
            <Auth.Content className="">
              <Controller
                control={form.control}
                name="code"
                render={({ field, fieldState }) => (
                  <TextField isInvalid={fieldState.invalid} isRequired>
                    <TextField.Label>Verification code</TextField.Label>
                    <Otp maxLength={6} onChange={field.onChange} ref={ref} value={field.value} />
                    <TextField.ErrorMessage>{fieldState.error?.message}</TextField.ErrorMessage>
                  </TextField>
                )}
              />
            </Auth.Content>
            <Auth.Actions className="flex-1">
              <Button className="w-full" onPress={form.handleSubmit(onSubmit)}>
                <Button.Label>Verify code</Button.Label>
              </Button>
              <Button className="w-full" variant="tertiary">
                <Button.Label>Resend a code</Button.Label>
              </Button>
            </Auth.Actions>
            <Auth.Actions>
              <Link asChild href="/demo/auth/forgot-password">
                <Button variant="ghost">
                  <Button.Label className="text-muted text-sm underline">Trouble accessing your account?</Button.Label>
                </Button>
              </Link>
            </Auth.Actions>
          </Auth>
        </FormProvider>
      </SafeAreaView>
    </>
  );
}
