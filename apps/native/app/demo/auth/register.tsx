import { zodResolver } from "@hookform/resolvers/zod";
import { AppleIcon } from "@native/components/icons/apple";
import { GoogleIcon } from "@native/components/icons/google";
import { SafeAreaView } from "@native/components/safe-area-view";
import { Link, Stack } from "expo-router";
import { Button, TextField } from "heroui-native";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Auth } from "@/components/blocks/auth";

const schema = z.object({
  name: z.string("Please enter your name"),
  email: z.email("Please enter a valid email address"),
  password: z.string("Please enter a valid password").min(8, "Password must be at least 8 characters long."),
});

export default function LoginScene() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log({ values });

    alert("Logged in successfully!");
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "Create a new account", headerShown: true, headerBackButtonDisplayMode: "minimal" }}
      />
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        <FormProvider {...form}>
          <Auth className="flex-1 px-6 pt-4">
            <Auth.Content>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField isInvalid={fieldState.invalid}>
                    <TextField.Label>Name</TextField.Label>
                    <TextField.Input
                      autoCapitalize="words"
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      placeholder="Enter your name"
                      textContentType="name"
                      value={field.value}
                    />
                    <TextField.ErrorMessage>{fieldState.error?.message}</TextField.ErrorMessage>
                  </TextField>
                )}
              />
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
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <TextField isInvalid={fieldState.invalid} isRequired>
                    <TextField.Label>Password</TextField.Label>
                    <TextField.Input
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      placeholder="Enter your password"
                      textContentType="password"
                      value={field.value}
                    />
                    <TextField.ErrorMessage>{fieldState.error?.message}</TextField.ErrorMessage>
                  </TextField>
                )}
              />
            </Auth.Content>
            <Auth.Actions>
              <Button className="w-full" onPress={form.handleSubmit(onSubmit)}>
                <Button.Label>Create an account</Button.Label>
              </Button>
            </Auth.Actions>
            <Auth.Divider>OR</Auth.Divider>

            <Auth.Actions className="flex-1">
              <Button className="w-full bg-foreground" onPress={form.handleSubmit(onSubmit)} variant="ghost">
                <GoogleIcon className="size-6" />
                <Button.Label className="text-background">Continue with Google</Button.Label>
              </Button>
              <Button className="w-full bg-foreground" onPress={form.handleSubmit(onSubmit)} variant="ghost">
                <AppleIcon className="size-6" />
                <Button.Label className="text-background">Continue with Apple</Button.Label>
              </Button>
            </Auth.Actions>
            <Auth.Actions>
              <Link asChild href="/demo/auth/login" replace>
                <Button variant="ghost">
                  <Button.Label className="text-muted text-sm">Login using an existing account instead?</Button.Label>
                </Button>
              </Link>
            </Auth.Actions>
          </Auth>
        </FormProvider>
      </SafeAreaView>
    </>
  );
}
