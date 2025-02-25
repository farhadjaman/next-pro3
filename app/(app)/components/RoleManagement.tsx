import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { BottomSheet } from '~/components/sheets/BottomSheet';
import { ListRenderItemInfo } from '@shopify/flash-list';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListDataItem,
  ListItem,
  ListSectionHeader,
} from '~/components/nativewindui/List';

type RoleManagementSheetProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function RoleManagement({ isOpen, onClose }: RoleManagementSheetProps) {
  return (
    <BottomSheet snapPoints={['70%', '90%']} isOpen={isOpen} onClose={onClose}>
      <List
        rootStyle={{ width: '100%' }}
        variant="insets"
        data={DATA}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.titleOnly}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </BottomSheet>
  );
}

function renderItem<T extends ListDataItem>(info: ListRenderItemInfo<T>) {
  if (typeof info.item === 'string') {
    return <ListSectionHeader {...info} />;
  }
  return (
    <ListItem
      leftView={
        <View className="flex-1 justify-center px-4">
          <View className="aspect-square h-8 rounded bg-red-500" />
        </View>
      }
      rightView={
        <View className="flex-1 justify-center px-4">
          <Text variant="caption1" className="ios:px-0 px-2 text-muted-foreground">
            100+
          </Text>
        </View>
      }
      {...info}
      onPress={() => console.log('onPress')}
    />
  );
}

function keyExtractor(item: (Omit<ListDataItem, string> & { id: string }) | string) {
  return typeof item === 'string' ? item : item.id;
}

const DATA = [
  'Header',
  {
    id: '1',
    title: 'Hello',
    subTitle: 'World',
  },
  {
    id: '2',
    title: 'Hello',
    subTitle: 'World',
  },

  {
    id: '3',
    title: 'Hello',
    subTitle: 'World',
  },
  {
    id: '4',
    title: 'Hello',
    subTitle: 'World',
  },
  'Header 2',

  {
    id: '8',
    title: 'Hello',
    subTitle: 'World',
  },
  'Header 3',
  {
    id: '9',
    title: 'Hello',
    subTitle: 'World',
  },
  {
    id: '10',
    title: 'Hello',
    subTitle: 'World',
  },
];
