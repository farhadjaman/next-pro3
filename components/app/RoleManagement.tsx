import { FontAwesome6 } from '@expo/vector-icons';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListItem,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { Text } from '~/components/nativewindui/Text';
import { BottomSheet } from '~/components/sheets/BottomSheet';
import { demoUsers, demoUserRoleData } from '~/lib/demoData';
import { useColorScheme } from '~/lib/useColorScheme';
import { store } from '~/store';
import { UserRole } from '~/types/user';
import { router, useSegments, Link } from 'expo-router';

type RoleManagementSheetProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const RoleManagement = ({ isOpen, onClose }: RoleManagementSheetProps) => {
  const { colors } = useColorScheme();
  const selectedRoleId = store.currentUser?.id || null;

  function handleSetUser(userRole: UserRole) {
    const user = demoUsers.find((u) => u.id === userRole.id);
    if (user) {
      store.setUser(user);
      store.setSelectedUserRole(userRole.role);
      router.replace('/(app)/(jobs)');
      onClose?.();
    } else {
      console.error('User not found for userId:', userRole.id);
    }
  }

  function renderItem(info: ListRenderItemInfo<string | UserRole>) {
    if (typeof info.item === 'string') {
      return <ListSectionHeader className="bg-gray-50 text-2xl font-medium" {...info} />;
    }

    const item = info.item;
    const currentUserId = store.currentUser?.id || null;
    const currentUserRole = store.getSelectedUserRole() || null;
    const isSelected = currentUserId === item.id && currentUserRole === item.role;

    return (
      <ListItem
        {...info}
        rightView={
          <View className="flex-1 justify-center px-4">
            <Text
              variant="caption1"
              className={`ios:px-0 px-2 ${isSelected ? 'font-bold text-green-600' : 'text-muted-foreground'}`}>
              {isSelected ? <FontAwesome6 name="user" size={16} color={colors.primary} /> : ''}
            </Text>
          </View>
        }
        onPress={() => handleSetUser(item)}
      />
    );
  }

  return (
    <BottomSheet snapPoints={['80%', '90%']} isOpen={isOpen} onClose={onClose}>
      <List
        rootStyle={{ width: '100%' }}
        data={demoUserRoleData}
        variant="insets"
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.titleOnly}
        contentContainerStyle={{ paddingBottom: 0 }}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={selectedRoleId}
      />
    </BottomSheet>
  );
};

function keyExtractor(item: string | UserRole) {
  return typeof item === 'string' ? item : `${item.id}-${item.role}`;
}

export default observer(RoleManagement);
