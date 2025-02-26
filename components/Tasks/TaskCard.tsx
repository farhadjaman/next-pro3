import { FontAwesome6 } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Pressable, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { Task } from '~/types/task';

type TaskCardProps = {
  task: Task;
  onAccept?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
};

function formatStatus(status: string): string {
  const withSpaces = status.replace(/_/g, ' ');

  const formatted = withSpaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return formatted;
}

export function TaskCard({ task, onAccept, onReject }: TaskCardProps) {
  const { colors } = useColorScheme();

  // Helper function to get background color based on task type
  const getTaskTypeColor = () => {
    switch (task.type) {
      case 'preventive':
        return 'bg-blue-100';
      case 'component_exchange':
        return 'bg-blue-100';
      case 'repair':
        return 'bg-blue-100';
      case 'withdrawal':
        return 'bg-blue-100';
      default:
        return 'bg-blue-100';
    }
  };

  // Get title based on task type with proper formatting
  const getFormattedTitle = () => {
    switch (task.type) {
      case 'component_exchange':
        return 'Component Exchange';
      case 'preventive':
        return 'Preventive Maintenance';
      case 'repair':
        return 'Repair';
      case 'withdrawal':
        return 'Machine Withdrawal';
      default:
        return task.title;
    }
  };

  // Format the time for display
  const formatTimeRange = () => {
    return `${format(task.dateTime.start, 'HH:mm')}–${format(task.dateTime.end, 'HH:mm')}`;
  };

  // Render swipe actions
  const renderRightActions = () => (
    <View className="w-full justify-center bg-green-500 py-1">
      <Pressable
        className="h-full w-full items-end justify-center pr-5"
        onPress={() => onAccept?.(task.id)}>
        <Text className="font-bold text-white">Accept</Text>
      </Pressable>
    </View>
  );

  const renderLeftActions = () => (
    <View className="w-full items-center bg-red-500">
      <Pressable
        className="h-full w-full items-start justify-center pl-5"
        onPress={() => onReject?.(task.id)}>
        <Text className="font-bold text-white">Reject</Text>
      </Pressable>
    </View>
  );

  return (
    <ReanimatedSwipeable
      containerStyle={{ backgroundColor: colors.card }}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}>
      <Pressable className="w-full bg-white p-4">
        {/* Header: ID and Status */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 space-x-2">
            {/* Task ID */}
            <View className="rounded bg-purple-100 px-2 py-1">
              <Text className="font-medium text-purple-600">{task.taskId}</Text>
            </View>

            {/* Status */}
            <View className="rounded bg-purple-100 px-2 py-1">
              <Text className="font-medium text-purple-600">{formatStatus(task.status)}</Text>
            </View>
          </View>

          {/* Chevron */}
          <FontAwesome6 name="chevron-right" size={14} color={colors.primary} />
        </View>

        {/* Task Type and Technician Section */}
        <View className="mb-3 flex-row justify-between">
          {/*//task type*/}
          <View className={`self-start rounded-full px-3 py-1 ${getTaskTypeColor()}`}>
            <Text className="text-sm font-medium text-blue-600">{getFormattedTitle()}</Text>
          </View>
          <View className="gap-1 rounded-xl bg-gray-100 px-3 py-1">
            <Text className="text-sm font-medium text-gray-800">{task.technician.name}</Text>
          </View>
        </View>

        <View className="mb-3 flex-row items-end justify-between">
          <View className={`self-start rounded-full px-3 py-1 ${getTaskTypeColor()}`}>
            <Text className="text-sm font-medium text-blue-600">{task.sla}</Text>
          </View>
          <View className="rounded-xl bg-gray-100 px-3 py-1.5">
            <Text className="text-sm font-medium text-gray-800">{formatTimeRange()}</Text>
          </View>
        </View>

        {/* Location Section */}
        <View className=" rounded-xl bg-gray-100 p-2.5">
          <Text className="text-md font-medium text-gray-800">{task.location.name} </Text>
          <Text className="text-sm text-gray-600">
            {task.location.postalCode}, {task.location.city}
          </Text>
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
}
