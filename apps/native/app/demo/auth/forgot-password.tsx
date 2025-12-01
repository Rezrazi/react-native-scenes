import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "@native/components/safe-area-view";
import { Stack } from "expo-router";
import { Button, TextField } from "heroui-native";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Auth } from "@/components/blocks/auth";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});

export default function LoginScene() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log({ values });

    alert("Logged in successfully!");
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "Reset your account", headerShown: true, headerBackButtonDisplayMode: "minimal" }}
      />
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        <FormProvider {...form}>
          <Auth className="flex-1 px-6 pt-4">
            <Auth.Content>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextField isInvalid={fieldState.invalid} isRequired>
                    <TextField.Label>Email</TextField.Label>
                    <TextField.Input
                      autoCapitalize="none"
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      placeholder="Enter your email"
                      textContentType="emailAddress"
                      value={field.value}
                    />
                    <TextField.ErrorMessage>{fieldState.error?.message}</TextField.ErrorMessage>
                  </TextField>
                )}
              />
            </Auth.Content>

            <Auth.Actions>
              <Button className="w-full" onPress={form.handleSubmit(onSubmit)}>
                <Button.Label>Send recovery link</Button.Label>
              </Button>
            </Auth.Actions>
          </Auth>
        </FormProvider>
      </SafeAreaView>
    </>
  );
}
