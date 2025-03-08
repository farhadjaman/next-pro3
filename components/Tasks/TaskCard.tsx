import { FontAwesome6 } from '@expo/vector-icons';
import { format } from 'date-fns';
import { View } from 'react-native';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { Task } from '~/types/task';

// Centralized color configuration to match the design specs
const createColorScheme = (themeColors: any) => ({
  // Base UI colors
  card: themeColors.card,
  border: themeColors.grey6,
  text: {
    primary: '#000000', // Black for primary text
    secondary: '#5E5E5E', // Gray for secondary text
    tertiary: '#929292', // Lighter gray for tertiary text
  },
  // Feature colors
  sla: {
    text: '#EA3424', // Red for SLA text
    dot: '#EA3424', // Red for SLA dot
    background: 'rgba(234, 52, 36, 0.1)', // Light red background with opacity
  },
  dates: {
    text: '#3577E3', // Blue for expected dates text
    background: 'rgba(53, 119, 227, 0.1)', // Light blue background with opacity
  },
  status: {
    allocated: '#929292', // Black for allocated status
    actionNeeded: '#929292', // Gray for "Action Needed"
    cancel: '#929292', // Gray for cancel
  },
  dot: {
    new: '#3577E3', // Blue dot for new/unread tasks
    sla: '#EA3424', // Red dot for SLA tasks
  },
});

// Type for component props
type TaskCardProps = {
  task: Task;
  styles?: {
    [key: string]: any;
  };
  className?: string;
  onAccept?: (taskId: string) => void;
  onReject?: (taskId: string) => void;
};

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
    case 'installation':
      return 'Installation';
    default:
      return type;
  }
}

// Format time like "10:00 AM"
const formatTime = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'hh:mm a').toUpperCase();
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

// Format date like "Wed 5/3/25"
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'EEE M/d/yy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Format time like "18:30"
const formatTimeShort = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time short:', error);
    return '';
  }
};

// Truncate text with ellipsis
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '..' : text;
};

export function TaskCard({ task, styles, className, onAccept, onReject }: TaskCardProps) {
  const { colors: themeColors } = useColorScheme();
  const colors = createColorScheme(themeColors);

  //for first row
  const taskId = task.taskId;
  const title = task.title;
  const fullTitle = `${taskId} ${title}`;

  //for second row
  const type = getFormattedType(task.type);
  const model = task.equipment.model;
  const serialNumber = task.equipment.serialNumber;
  const modelInfo = `${type} • ${model} • ${serialNumber}`;

  //for third row
  //for SLA
  const SLA = task.sla ? `SLA ${task.sla}` : '';
  const SLAdate = task.slaDate
    ? `${formatDate(task.slaDate)} • ${formatTimeShort(task.slaDate)}`
    : '';
  const SLAinfo = `${SLA} ${SLAdate}`;
  task.isAppointed ? truncateText(SLAinfo, 28) : truncateText(SLAinfo, 36);
  //for Expected Dates
  const expectedDates = task.expectedDates
    ? `${formatDate(task.expectedDates.start)} ${formatTimeShort(task.expectedDates.start)} → ${formatDate(task.expectedDates.end)} ${formatTimeShort(task.expectedDates.end)}`
    : '';

  return (
    <View
      className={`flex-row items-start gap-0.5 ${className}`}
      style={{
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        ...styles,
      }}>
      {/* Column 1: Left column with dots */}
      <View className="flex-col items-start justify-center" style={{ width: 20, marginTop: 2 }}>
        {/* Row 1: Blue dot for new tasks */}
        <View style={{ height: 17, justifyContent: 'center' }}>
          {task.isNew && (
            <View
              className="h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: colors.dot.new }}
            />
          )}
        </View>

        {/* Row 2: Empty space */}
        <View style={{ height: 26 }} />

        {/* Row 3: Red dot for SLA tasks */}
        <View style={{ height: 24, justifyContent: 'center' }}>
          {task.variant === 'sla' && (
            <View
              className="h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: colors.dot.sla }}
            />
          )}
        </View>
      </View>

      {/* Column 2: Main content */}
      <View className="flex-1 flex-col justify-center">
        {/* Row 1: Task ID + Title */}
        <View className="w-full flex-row items-center justify-between gap-1">
          {/* Task ID + Title truncated to one line */}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1 text-[16px] font-semibold"
            style={{ color: colors.text.primary }}>
            {fullTitle}
          </Text>

          <Text className="mr-2 text-[16px] font-medium" style={{ color: colors.text.primary }}>
            {formatTime(task.dateTime.start)}
          </Text>
        </View>

        {/* Row 2: Type, Equipment */}
        <View className="mt-1 flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1 text-[16px]"
            style={{ color: colors.text.primary }}>
            {modelInfo}
          </Text>
          <Text className="mr-2 text-[16px] font-medium" style={{ color: colors.text.tertiary }}>
            {formatTime(task.dateTime.end)}
          </Text>
        </View>

        {/* Row 3: Variant-specific content + (Action Needed if appointed) */}
        {task.variant === 'sla' && (
          <View className="mt-1 flex-row items-center justify-between gap-2">
            <View className="flex-1 flex-row items-center">
              <View style={{ flexShrink: 1 }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-[16px]"
                  style={{ backgroundColor: colors.sla.background, color: colors.sla.text }}>
                  {SLAinfo}
                </Text>
              </View>
            </View>
            {task.isAppointed && (
              <Text className="mr-2 text-[16px]" style={{ color: colors.status.actionNeeded }}>
                Action Needed
              </Text>
            )}
          </View>
        )}

        {task.variant === 'expected_dates' && (
          <View className="mt-1 flex-row items-center justify-between gap-2">
            <View style={{ flexShrink: 1 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="w-full text-[16px]"
                style={{ backgroundColor: colors.dates.background, color: colors.dates.text }}>
                {expectedDates}
              </Text>
            </View>
            {task.isAppointed && (
              <Text className="mr-2 text-[16px]" style={{ color: colors.status.actionNeeded }}>
                Action Needed
              </Text>
            )}
          </View>
        )}

        {task.variant === 'job_comment' && (
          <View className="mt-1 flex-row items-center justify-between gap-1">
            <View style={{ flexShrink: 1 }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                className="text-[16px]"
                style={{ color: colors.text.tertiary }}>
                {task.jobComment}
              </Text>
            </View>
            {task.isAppointed && (
              <Text className="mr-2 text-[16px]" style={{ color: colors.status.actionNeeded }}>
                Action Needed
              </Text>
            )}
          </View>
        )}

        {/* Row 4: Location details + status */}
        <View className="mt-1 flex-row items-center justify-between">
          <View style={{ flexShrink: 1 }}>
            <Text numberOfLines={1} style={{ color: colors.text.tertiary }} className="text-[16px]">
              {`${task.location.postalCode} ${task.location.city}`}
            </Text>
          </View>
          {task.isAppointed ? (
            <Text
              style={{ color: colors.status.cancel, width: 70 }}
              className="mr-2 text-right text-[16px]">
              CANCEL
            </Text>
          ) : (
            <Text
              style={{ color: colors.status.allocated, width: 100 }}
              className="mr-2 text-right text-[16px]">
              ALLOCATED
            </Text>
          )}
        </View>
      </View>

      {/* Column 3: Chevron arrow */}
      <View className="mt-1 justify-center">
        <FontAwesome6 name="chevron-right" size={12} color={colors.text.tertiary} />
      </View>
    </View>
  );
}
