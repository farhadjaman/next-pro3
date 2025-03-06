import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import XDate from 'xdate';

import { TaskCard } from '~/components/Tasks/TaskCard';
import { SearchInput } from '~/components/nativewindui/SearchInput';
import { Text } from '~/components/nativewindui/Text';
import { demoTasks } from '~/lib/demoData';
import { useColorScheme } from '~/lib/useColorScheme';
import { Task } from '~/types/task';

// Demo tasks
const tasks: Task[] = demoTasks as Task[];

LocaleConfig.locales = LocaleConfig.locales || {};
LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};
LocaleConfig.defaultLocale = 'en';

export default function Calender() {
  const today = new Date().toISOString().split('T')[0];
  const fastDate = getPastDate(3);
  const futureDates = getFutureDates(12);
  const dates = [fastDate, today].concat(futureDates);
  const { colors } = useColorScheme();

  // Add state to track selected date
  const [selectedDate, setSelectedDate] = useState(today);

  const markedDates = {
    '2025-03-08': {
      dots: [{ key: 'event1', color: colors.primary }],
    },
    '2025-03-09': {
      dots: [{ key: 'event2', color: colors.primary }],
    },
    '2025-03-27': {
      dots: [{ key: 'event2', color: colors.primary }],
    },
  };

  const calendarTheme = {
    textSectionTitleColor: '#1f2937',
    selectedDayBackgroundColor: '#EB4F3E',
    selectedDayTextColor: colors.background,
    unselectedDayTextColor: '#212529',
    textDayHeaderFontSize: 14,
    todayTextColor: colors.primary,
    dayTextColor: '#212529',
    textDisabledColor: '#fff',
    dotColor: colors.primary,
    selectedDotColor: colors.background,
    arrowColor: colors.primary,
    monthTextColor: colors.grey,
    textMonthFontSize: 16,
    weekVerticalMargin: 6,
    textDayFontSize: 20,
    'stylesheet.day.basic': {
      text: {
        fontSize: 20,
        lineHeight: 30,
        fontWeight: '500',
        textAlignVertical: 'end',
        textAlign: 'center',
      },
    },
  };

  function handleAcceptTask(taskId: string): void {
    throw new Error('Function not implemented.');
  }

  function handleRejectTask() {
    console.log('Rejected task');
  }

  // Format the date to show only the month name
  const formatMonth = (date: XDate | undefined) => {
    if (!date) return '';
    try {
      return date.toString('MMMM yyyy').toUpperCase();
    } catch (error) {
      console.log('Error formatting date:', error);
      return '';
    }
  };

  // Handle day press
  const handleDayPress = (day: any) => {
    console.log('Selected day', day);
    setSelectedDate(day.dateString);
  };

  return (
    <CalendarProvider
      date={selectedDate || dates[1]}
      onDateChanged={(date) => {
        console.log('Date changed:', date);
      }}
      onMonthChange={(month) => {
        console.log('Month changed:', month);
      }}>
      <SafeAreaView className="flex-1 flex-col gap-y-0.5">
        <View className="justify-center p-3">
          <SearchInput textContentType="none" autoComplete="off" />
        </View>
        <ExpandableCalendar
          className="flex-1"
          theme={calendarTheme}
          firstDay={1}
          enableSwipeMonths
          hideArrows
          markedDates={markedDates}
          markingType="multi-dot"
          closeOnDayPress={false}
          allowShadow={false}
          hideExtraDays
          disableAllTouchEventsForDisabledDays
          onDayPress={handleDayPress}
          renderHeader={(date) => {
            const formattedMonth = formatMonth(date);
            return (
              <View className="w-full items-start justify-start p-2.5  text-3xl">
                <Text variant="title3" className="font-bold text-gray-800">
                  {formattedMonth || ''}
                </Text>
              </View>
            );
          }}
        />
        <FlashList
          estimatedItemSize={100}
          data={tasks}
          renderItem={({ item }) => (
            <TaskCard
              className="px-2 pb-3 pt-4"
              task={item}
              onAccept={handleAcceptTask}
              onReject={handleRejectTask}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-0.2" />}
        />
      </SafeAreaView>
    </CalendarProvider>
  );
}

function getPastDate(numberOfDays: number) {
  return new Date(Date.now() - 864e5 * numberOfDays).toISOString().split('T')[0];
}

function getFutureDates(numberOfDays: number) {
  const array: string[] = [];
  // Calculate base timestamp once before the loop for consistency
  const baseTimestamp = Date.now();

  for (let index = 1; index <= numberOfDays; index++) {
    let d = baseTimestamp;
    if (index > 8) {
      const dateObj = new Date(d);
      dateObj.setMonth(dateObj.getMonth() + 1);
      d = dateObj.getTime();
    }
    const date = new Date(d + 864e5 * index);
    const dateString = date.toISOString().split('T')[0];
    array.push(dateString);
  }
  return array;
}
