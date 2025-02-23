import { Text, TouchableOpacity, View } from 'react-native';

import { BottomSheet } from '~/components/sheets/BottomSheet';

type RoleManagementSheetProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function RoleManagement({ isOpen, onClose }: RoleManagementSheetProps) {
  return (
    <BottomSheet snapPoints={['50%', '90%']} isOpen={isOpen} onClose={onClose}>
      <View style={{ alignItems: 'center', padding: 16 }}>
        <Text style={{ marginBottom: 16, fontSize: 16 }}>
          Here you can manage or select your roles.
        </Text>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'lightgray',
            borderRadius: 6,
          }}
          onPress={onClose}>
          <Text>Close Sheet</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
