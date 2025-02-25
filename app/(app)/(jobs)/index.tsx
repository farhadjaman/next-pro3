import { ListRenderItemInfo } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { View } from 'react-native';

import { Text } from '~/components/nativewindui/Text';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListDataItem,
  ListItem,
  ListSectionHeader,
} from '~/components/nativewindui/List';

export default function ListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Insets' }} />
      <List
        variant="insets"
        data={DATA}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT.titleOnly}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </>
  );
}

function renderItem<T extends ListDataItem>(info: ListRenderItemInfo<T>) {
  if (typeof info.item === 'string') {
    return <ListSectionHeader {...info} />;
  }
  return <ListItem {...info} onPress={() => console.log('onPress')} />;
}

function keyExtractor(item: (Omit<ListDataItem, string> & { id: string }) | string) {
  return typeof item === 'string' ? item : item.id;
}

const DATA = [
  'Assist. Téc., Lisbon',
  { id: 'u004', title: 'Catarina Silva' },
  { id: 'u0015', title: 'Paula Oliveira' },
  'Assist. Téc., Loulé',
  { id: 'u0012', title: 'João Almeida' },
  { id: 'u0013', title: 'Nuno Anunciação' },
  { id: 'u006', title: 'Carlos Boavista' },
  'Header',
  { id: 'u001', title: 'Mário Afonso' },
  { id: 'u002', title: 'Nuno Anunciação' },
  { id: 'u003', title: 'Nuno A' },
  { id: 'u005', title: 'Paula Oliveira' },
  { id: 'u007', title: 'Andreia Sousa' },
  { id: 'u008', title: 'Andreia Sousa' },
  { id: 'u009', title: 'Andreia Sousa' },
  { id: 'u010', title: 'Andreia Sousa' },
  { id: 'u011', title: 'Andreia Sousa' },
  { id: 'u012', title: 'Andreia Sousa' },
  { id: 'u013', title: 'Andreia Sousa' },
  { id: 'u014', title: 'Andreia Sousa' },
];
