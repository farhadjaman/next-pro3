import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Pressable, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import type { Task } from '~/types/task';

type TaskCardProps = {
  task: Task;
    styles?: {
    [key: string]: any;
    };
  onAccept?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
};

function formatStatus(status: string): string {
  const withSpaces = status.replace(/_/g, ' ');
  return withSpaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getFormattedType(type: string): string {
  switch (type) {
    case 'component_exchange':
      return 'Component Exchange';
    case 'preventive':
      return 'Preventive Maintenance';
    case 'repair':
      return 'Repair';
    case 'withdrawal':
      return 'Machine Withdrawal';
    default:
      return type;
  }
}

export function TaskCard({ task, styles, onAccept, onReject }: TaskCardProps) {
  const { colors } = useColorScheme();

  const formatTimeRange = () => {
    return `${format(task.dateTime.start, 'HH:mm')}–${format(task.dateTime.end, 'HH:mm')}`;
  };

  return (
    <ReanimatedSwipeable>
      {/* Bottom border for separation */}
      <View
        className="flex-row p-2"
        style={{
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.grey6,
           ...styles
        }}>
        {/* Right column: three "rows" */}
        <View className="flex-1 flex-col justify-center">
          {/* Row 1: "Task ID + Task Type" on left, Time Range + Chevron on right */}
          <View className="flex-row items-center justify-between">
            <Text numberOfLines={1} className="text-sm font-bold text-gray-800">
              {task.taskId} {getFormattedType(task.type)}
            </Text>
            <View className="flex-row items-center">
              <Text className="mr-1 text-xs font-semibold text-gray-600">{formatTimeRange()}</Text>
              <FontAwesome6 name="chevron-right" size={12} color="#999" />
            </View>
          </View>

          {/* Row 2: status + SLA (with a dot in between) */}
          <View className="flex-row items-center gap-x-1">
            <Text numberOfLines={1} className="text-[14px] text-gray-700">
              {formatStatus(task.status)}
            </Text>
            <View className="rounded-full bg-red-100 px-2 py-0.5">
              <Text numberOfLines={1} className="text-[11px] font-medium text-red-700">
                {task.sla}
              </Text>
            </View>
          </View>

          {/* Row 3: Location (with a dot in between, same styling) */}
          <View className="flex-row items-center gap-x-0.5">
            <Text
              numberOfLines={1}
              style={{
                color: colors.grey,
              }}
              className="text-[14px]">
              {task.location?.postalCode}
            </Text>
            <Text
              style={{
                color: colors.grey,
              }}>
              •
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: colors.grey,
              }}
              className="text-[14px] text-gray-700">
              {task.location?.city}
            </Text>
          </View>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}
