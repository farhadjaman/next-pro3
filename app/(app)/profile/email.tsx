import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';

import { Button } from '~/components/nativewindui/Button';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { Text } from '~/components/nativewindui/Text';
import { TextField } from '~/components/nativewindui/TextField';
import { cn } from '~/lib/cn';
import { store } from '~/store';

const EmailScreen = observer(() => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(store.currentUser?.email || 'example@example.com');
  useEffect(() => {
    if (store.currentUser?.email) {
      setEmail(store.currentUser.email);
    }
  }, [store.currentUser?.email]);

  const canSave = !!email && email !== (store.currentUser?.email || 'example@example.com');

  const onSave = () => {
    store.updateUser({ email });
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Email',
          headerTransparent: Platform.OS === 'ios',
          headerBlurEffect: 'systemMaterial',
          headerRight: Platform.select({
            ios: () => (
              <Button className="ios:px-0" disabled={!canSave} variant="plain" onPress={onSave}>
                <Text className={cn(canSave && 'text-primary')}>Save</Text>
              </Button>
            ),
          }),
        }}
      />

      <KeyboardAwareScrollView
        bottomOffset={8}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <Form className="gap-5 px-4 pt-8">
          <FormSection
            materialIconProps={{ name: 'email-outline' }}
            footnote="Enter your email address.">
            <FormItem>
              <TextField
                textContentType="emailAddress"
                autoFocus
                autoComplete="email"
                className="pl-0.5"
                label={Platform.select({ ios: undefined, default: 'Email' })}
                leftView={
                  <View className="ios:w-36 ios:justify-between flex-row items-center pl-2">
                    {Platform.OS === 'ios' && <Text className="font-medium">Email</Text>}
                    <Text className="text-muted-foreground">@</Text>
                  </View>
                }
                placeholder="required"
                value={email}
                onChangeText={setEmail}
              />
            </FormItem>
          </FormSection>
          {Platform.OS !== 'ios' && (
            <View className="items-end">
              <Button
                className={cn('px-6', !canSave && 'bg-muted')}
                disabled={!canSave}
                onPress={onSave}>
                <Text>Save</Text>
              </Button>
            </View>
          )}
        </Form>
      </KeyboardAwareScrollView>
    </>
  );
});

export default EmailScreen;
