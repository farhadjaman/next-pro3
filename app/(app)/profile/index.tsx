import { Icon } from '@roninoss/icons';
import { router, Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Platform, View } from 'react-native';

import { Avatar, AvatarFallback } from '~/components/nativewindui/Avatar';
import { Button } from '~/components/nativewindui/Button';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListItem,
  ListRenderItemInfo,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useAuth } from '~/lib/context/authContext';
import { useColorScheme } from '~/lib/useColorScheme';
import { store } from '~/store';

const SCREEN_OPTIONS = {
  title: 'Profile',
  headerTransparent: Platform.OS === 'ios',
  headerBlurEffect: 'systemMaterial',
} as const;

const ESTIMATED_ITEM_SIZE =
  ESTIMATED_ITEM_HEIGHT[Platform.OS === 'ios' ? 'titleOnly' : 'withSubTitle'];

const Profile = observer(() => {
  const currentUser = store.currentUser;
  const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest';
  const userEmail = currentUser ? currentUser.email : 'unknown@example.com';

  const DATA: DataItem[] = [
    ...(Platform.OS !== 'ios' ? ['Basic info'] : []),
    {
      id: 'name',
      title: 'Name',
      ...(Platform.OS === 'ios' ? { value: fullName } : { subTitle: fullName }),
      onPress: () => router.push('/(app)/profile/name'),
    },
    {
      id: 'email',
      title: 'Email',
      ...(Platform.OS === 'ios' ? { value: userEmail } : { subTitle: userEmail }),
      onPress: () => router.push('/(app)/profile/email'),
    },
    ...(Platform.OS !== 'ios' ? ['Stay up to date'] : ['']),
    {
      id: 'notifications',
      title: 'Notifications',
      ...(Platform.OS === 'ios' ? { value: 'Push' } : { subTitle: 'Push' }),
      onPress: () => router.push('/(app)/profile/notification'),
    },
  ];

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <List
        variant="insets"
        data={DATA}
        sectionHeaderAsGap={Platform.OS === 'ios'}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        renderItem={renderItem}
        ListHeaderComponent={<ListHeaderComponent />}
        ListFooterComponent={<ListFooterComponent />}
      />
    </>
  );
});

function renderItem(info: ListRenderItemInfo<DataItem>) {
  return <Item info={info} />;
}

function Item({ info }: { info: ListRenderItemInfo<DataItem> }) {
  const { colors } = useColorScheme();

  if (typeof info.item === 'string') {
    return <ListSectionHeader {...info} />;
  }
  return (
    <ListItem
      titleClassName="text-lg"
      rightView={
        <View className="flex-1 flex-row items-center gap-0.5 px-2">
          {!!info.item.value && <Text className="text-muted-foreground">{info.item.value}</Text>}
          <Icon name="chevron-right" size={22} color={colors.grey2} />
        </View>
      }
      onPress={info.item.onPress}
      {...info}
    />
  );
}

function ListHeaderComponent() {
  const currentUser = store.currentUser;
  const initials =
    currentUser && currentUser.firstName && currentUser.lastName
      ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
      : 'NA';
  const fullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest';
  const username = currentUser ? currentUser.email.split('@')[0] : 'guest';

  return (
    <View className="ios:pb-8 items-center pb-4 pt-8">
      <Avatar alt={`${fullName}'s Profile`} className="h-24 w-24">
        <AvatarFallback>
          <Text
            variant="largeTitle"
            className={cn(
              'font-medium text-white dark:text-background',
              Platform.OS === 'ios' && 'dark:text-foreground'
            )}>
            {initials}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View className="p-1" />
      <Text variant="title1">{fullName}</Text>
      <Text className="text-muted-foreground">{`@${username}`}</Text>
    </View>
  );
}

function ListFooterComponent() {
  const { signOut } = useAuth();
  return (
    <View className="ios:px-0 px-4 pt-8">
      <Button
        size="lg"
        variant={Platform.select({ ios: 'primary', default: 'secondary' })}
        className="border-border bg-card"
        onPress={signOut}>
        <Text className="text-destructive">Log Out</Text>
      </Button>
    </View>
  );
}

type DataItem =
  | string
  | {
      id: string;
      title: string;
      value?: string;
      subTitle?: string;
      onPress: () => void;
    };

export type { DataItem };
export default Profile;
