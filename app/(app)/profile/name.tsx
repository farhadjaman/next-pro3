import { router, Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardController } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '~/components/nativewindui/Button';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { Text } from '~/components/nativewindui/Text';
import { TextField } from '~/components/nativewindui/TextField';
import { cn } from '~/lib/cn';
import { store } from '~/store';

function LeftLabel({ children }: { children: string }) {
  return (
    <View className="w-28 justify-center pl-2">
      <Text className="font-medium">{children}</Text>
    </View>
  );
}

const NameScreen = observer(() => {
  const insets = useSafeAreaInsets();
  const initialForm = {
    first: store.currentUser?.firstName || 'Zach',
    last: store.currentUser?.lastName || 'Nugent',
  };

  const [form, setForm] = useState(initialForm);
  useEffect(() => {
    setForm({
      first: store.currentUser?.firstName || 'Zach',
      last: store.currentUser?.lastName || 'Nugent',
    });
  }, [store.currentUser]);

  const onChangeText = (type: 'first' | 'middle' | 'last') => (text: string) => {
    setForm((prev) => ({ ...prev, [type]: text }));
  };

  function focusNext() {
    KeyboardController.setFocusTo('next');
  }

  // Allow saving if the first or last name has changed.
  const canSave =
    (form.first !== (store.currentUser?.firstName || 'Zach') ||
      form.last !== (store.currentUser?.lastName || 'Nugent')) &&
    !!form.first &&
    !!form.last;

  function onSave() {
    store.updateUser({
      firstName: form.first,
      lastName: form.last,
    });
    router.back();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Name',
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
        <Form className="gap-5 px-4 pt-12">
          <FormSection materialIconProps={{ name: 'person-outline' }}>
            <FormItem>
              <TextField
                textContentType="givenName"
                autoFocus
                autoComplete="name-given"
                label={Platform.select({ ios: undefined, default: 'First' })}
                leftView={Platform.select({ ios: <LeftLabel>First</LeftLabel> })}
                placeholder="required"
                value={form.first}
                onChangeText={onChangeText('first')}
                onSubmitEditing={focusNext}
                submitBehavior="submit"
                enterKeyHint="next"
              />
            </FormItem>
            <FormItem>
              <TextField
                textContentType="familyName"
                autoComplete="name-family"
                label={Platform.select({ ios: undefined, default: 'Last' })}
                leftView={Platform.select({ ios: <LeftLabel>Last</LeftLabel> })}
                placeholder="required"
                value={form.last}
                onChangeText={onChangeText('last')}
                onSubmitEditing={onSave}
                enterKeyHint="done"
              />
            </FormItem>
          </FormSection>
          {Platform.OS !== 'ios' && (
            <View className="items-end">
              <Button
                className={cn('px-6', !canSave && 'bg-muted')}
                disabled={!canSave}
                onPress={onSave}>
                <Text>ave</Text>
              </Button>
            </View>
          )}
        </Form>
      </KeyboardAwareScrollView>
    </>
  );
});

export default NameScreen;
