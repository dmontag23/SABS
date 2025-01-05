import React from "react";
import {KeyboardAvoidingView, Platform, StyleSheet, View} from "react-native";

import {zodResolver} from "@hookform/resolvers/zod";
import {
  Control,
  Controller,
  FieldError,
  FieldName,
  SubmitHandler,
  useForm
} from "react-hook-form";
import {Button, Text, TextInput, useTheme} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {z} from "zod";

import useStoreAuthTokens from "../../../hooks/asyncStorageHooks/useStoreAuthTokens";

const VALIDATION_SCHEMA = z.object({
  accessToken: z
    .string()
    .trim()
    .min(1, {message: "An access token is required"}),
  refreshToken: z
    .string()
    .trim()
    .min(1, {message: "A refresh token is required"})
});

type FormInputs = z.infer<typeof VALIDATION_SCHEMA>;

const ErrorText = ({message}: {message: string | undefined}) => (
  <Text variant="titleMedium" style={{color: useTheme().colors.error}}>
    {message}
  </Text>
);

const FormInput = ({
  control,
  name,
  label,
  error,
  resetMutation
}: {
  control: Control<FormInputs>;
  name: FieldName<FormInputs>;
  label: string;
  error: FieldError | undefined;
  resetMutation: () => void;
}) => (
  <View style={styles.formSectionGroups}>
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          label={label}
          accessibilityLabel={`${label} input`}
          mode="outlined"
          error={Boolean(error)}
          autoCapitalize="none"
          value={value}
          onChangeText={newText => {
            resetMutation();
            onChange(newText);
          }}
          onBlur={onBlur}
          style={styles.input}
        />
      )}
      name={name}
    />
    {error && <ErrorText message={error.message} />}
  </View>
);

/* TODO: This screen asks the user to enter an access and refresh token in order 
to access the TodayTix API. Ideally, the auth flow would look something like this instead:
    1) Have a form where the user enters their email address.
    2) After the email is sent, have another form where the user can copy the link
    sent to them and login using the link.
The auth flow was initially implemented this way. The problem with this approach is that,
when TodayTix exchanges the code in the link for the access tokens, it sees those access tokens
as a separate user session, e.g. as a "login" on a different device, even if for the same account.
Since placing a hold for tickets only affects that particular login (i.e. you can be logged in
on two separate devices on the same account and place a hold for tickets on each device), the
flow of then navigating to the TodayTix app to pay for the tickets on hold does not work.
The implication seems to be that building out the payment part of the app
would be necessary in order to get this type of login flow to work, but this may also be an
opportunity to exploit the multiple session loophole to hold several different rush tickets
for the same person at the same time. */
const EnterTokensScreen = () => {
  const {
    mutate: storeTokens,
    isPending: isStoreTokensPending,
    isSuccess: isStoreTokensSuccess,
    isError: isStoreTokensError,
    error: storeTokensError,
    reset: resetStoreTokens
  } = useStoreAuthTokens();

  const {
    control,
    handleSubmit,
    formState: {errors: formErrors, isValid: isFormValid}
  } = useForm<FormInputs>({
    defaultValues: {accessToken: "", refreshToken: ""},
    mode: "onTouched",
    resolver: zodResolver(VALIDATION_SCHEMA)
  });

  const {top, bottom} = useSafeAreaInsets();
  const {colors} = useTheme();

  const onSubmit: SubmitHandler<FormInputs> = ({accessToken, refreshToken}) =>
    /* The TTL here is 0 because it allows the user to enter tokens that may be
    expired, but then will automatically be refreshed upon the first request to the TodayTix
    API. This ensures the user will always have a valid token with which to make requests. */
    storeTokens({accessToken, refreshToken, ttl: 0});

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={15}
      style={[styles.screenContainer, {marginTop: top, marginBottom: bottom}]}>
      <View style={styles.formContainer}>
        <View style={styles.formSectionGroups}>
          <Text variant="headlineLarge" style={styles.title}>
            Sign into TodayTix
          </Text>
          <Text variant="titleLarge" style={{color: colors.onSurfaceVariant}}>
            Enter the access tokens from the current TodayTix session.
          </Text>
        </View>
        <View style={styles.formSectionGroups}>
          <FormInput
            control={control}
            name="accessToken"
            label="Access token"
            error={formErrors.accessToken}
            resetMutation={resetStoreTokens}
          />
          <FormInput
            control={control}
            name="refreshToken"
            label="Refresh token"
            error={formErrors.refreshToken}
            resetMutation={resetStoreTokens}
          />
          {isStoreTokensError && (
            <ErrorText
              message={`${storeTokensError.message}. Please try submitting the tokens again.`}
            />
          )}
        </View>
      </View>
      <Button
        accessibilityLabel="Submit button"
        mode="contained"
        disabled={!isFormValid || isStoreTokensPending || isStoreTokensSuccess}
        onPress={handleSubmit(onSubmit)}
        theme={{roundness: 1}}>
        <Text variant="titleLarge" style={{color: colors.onPrimary}}>
          Login
        </Text>
      </Button>
    </KeyboardAvoidingView>
  );
};

export default EnterTokensScreen;

const styles = StyleSheet.create({
  formContainer: {gap: 60},
  formSectionGroups: {gap: 15},
  input: {height: 60, lineHeight: 20},
  screenContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: "5%",
    paddingHorizontal: "8%"
  },
  title: {fontWeight: "bold"}
});
