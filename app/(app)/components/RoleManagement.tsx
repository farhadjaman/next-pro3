import { ListRenderItemInfo } from '@shopify/flash-list';
import data from 'data.json';

import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListDataItem,
  ListItem,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { BottomSheet } from '~/components/sheets/BottomSheet';
import { buildRoleData } from '~/helpers/buildRoleUserData';
import { User } from '~/store';

const DATA = buildRoleData(data.users as User[]);

type RoleManagementSheetProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function RoleManagement({ isOpen, onClose }: RoleManagementSheetProps) {
  return (
    <BottomSheet snapPoints={['80%', '90%']} isOpen={isOpen} onClose={onClose}>
      <List
        rootStyle={{ width: '100%' }}
        data={DATA}
        variant="insets"
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.titleOnly}
        contentContainerStyle={{ paddingBottom: 0 }}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </BottomSheet>
  );
}

function renderItem<T extends ListDataItem>(info: ListRenderItemInfo<T>) {
  if (typeof info.item === 'string') {
    return <ListSectionHeader className="bg-gray-50 text-2xl font-medium" {...info} />;
  }
  return <ListItem {...info} onPress={() => console.log('onPress', info.item)} />;
}

function keyExtractor(item: (Omit<ListDataItem, string> & { id: string }) | string) {
  return typeof item === 'string' ? item : item.id;
}
