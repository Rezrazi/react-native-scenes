import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "@native/components/safe-area-view";
import { Link, Stack, useRouter } from "expo-router";
import { Button, Select, TextField } from "heroui-native";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { z } from "zod";
import { Auth } from "@/components/blocks/auth";

const schema = z.object({
  phone: z.string("Please enter your phone number"),
});

type CountryOption = {
  value: string;
  label: string;
  flag: string;
  code: string;
};

const COUNTRIES: CountryOption[] = [
  { value: "US", label: "United States", flag: "🇺🇸", code: "+1" },
  { value: "GB", label: "United Kingdom", flag: "🇬🇧", code: "+44" },
  { value: "CA", label: "Canada", flag: "🇨🇦", code: "+1" },
  { value: "AU", label: "Australia", flag: "🇦🇺", code: "+61" },
  { value: "FR", label: "France", flag: "🇫🇷", code: "+33" },
];

export default function LoginScene() {
  const [country, setCountry] = useState<CountryOption>(COUNTRIES[0]);
  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log({ values });

    push("/demo/auth/otp");
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "Login to your account", headerShown: true, headerBackButtonDisplayMode: "minimal" }}
      />
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        <FormProvider {...form}>
          <Auth className="flex-1 px-6 pt-4">
            <Auth.Content>
              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <TextField isInvalid={fieldState.invalid} isRequired>
                    <TextField.Label>Phone number</TextField.Label>
                    <TextField.Input
                      className="gap-1"
                      inputMode="tel"
                      isInvalid={fieldState.invalid}
                      keyboardType="phone-pad"
                      maxLength={10}
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      placeholder="Enter your phone number"
                      textContentType="telephoneNumber"
                      value={field.value}
                    >
                      <TextField.InputStartContent>
                        <Select
                          onValueChange={(value) => {
                            const selected = COUNTRIES.find((c) => c.value === value?.value);

                            if (!selected) {
                              return;
                            }

                            setCountry(selected);
                          }}
                          value={country}
                        >
                          <Select.Trigger asChild>
                            <Text className="text-right font-bold text-foreground text-sm">{country.code}</Text>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Overlay />
                            <Select.Content presentation="bottom-sheet">
                              <ScrollView>
                                {COUNTRIES.map((item) => (
                                  <Select.Item key={item.value} label={item.code} value={item.value}>
                                    <View className="flex-1 flex-row items-center gap-3">
                                      <Text className="text-2xl">{item.flag}</Text>
                                      <Text className="w-10 text-muted text-sm">{item.code}</Text>
                                      <Text className="flex-1 text-base text-foreground">{item.label}</Text>
                                    </View>
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </ScrollView>
                            </Select.Content>
                          </Select.Portal>
                        </Select>
                      </TextField.InputStartContent>
                    </TextField.Input>
                    <TextField.ErrorMessage>{fieldState.error?.message}</TextField.ErrorMessage>
                  </TextField>
                )}
              />
            </Auth.Content>
            <Auth.Actions className="flex-1">
              <Button className="w-full" onPress={form.handleSubmit(onSubmit)}>
                <Button.Label>Send verification code</Button.Label>
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
