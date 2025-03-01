import { FlashList } from '@shopify/flash-list';
import { SafeAreaView, View } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';

import { TaskCard } from '~/components/Tasks/TaskCard';
import { demoTasks } from '~/lib/demoData';
import { Task } from '~/types/task';
import { useColorScheme } from '~/lib/useColorScheme';

function handleRejectTask() {}

const tasks: Task[] = demoTasks.map((task) => ({
  ...task,
  dateTime: {
    start: new Date(task.dateTime.start),
    end: new Date(task.dateTime.end),
  },
}));

export default function Calender() {
  const today = new Date().toISOString().split('T')[0];
  const fastDate = getPastDate(3);
  const futureDates = getFutureDates(12);
  const dates = [fastDate, today].concat(futureDates);
  const { colors } = useColorScheme();

  const calendarTheme = {
    backgroundColor: colors.card,
    calendarBackground: colors.card,
    textSectionTitleColor: colors.grey,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.background,
    selectedDayFontWeight: 'semibold' as const,
    textDayFontWeight: 'semibold' as const,
    textMonthFontWeight: 'bold' as const,
    todayTextColor: colors.primary,
    dayTextColor: colors.grey,
    textDisabledColor: colors.grey4,
    dotColor: colors.primary,
    selectedDotColor: colors.background,
    arrowColor: colors.primary,
    monthTextColor: colors.grey,
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayFontFamily: colors.primary,
    textDayFontColor: colors.grey,
    textDayTextColor: colors.grey,
    textDayHeaderFontSize: 14,
  };

  function handleAcceptTask(taskId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <CalendarProvider
      date={dates[1]}
      onDateChanged={(date) => {
        console.log('Date changed:', date);
      }}
      onMonthChange={(month) => {
        console.log('Month changed:', month);
      }}>
      <SafeAreaView className="flex-1">
        <ExpandableCalendar
          theme={calendarTheme}
          firstDay={1}
          hideExtraDays={false}
          enableSwipeMonths
          hideArrows
          closeOnDayPress={false}
        />
        <FlashList
          estimatedItemSize={100}
          data={tasks}
          renderItem={({ item }) => (
            <TaskCard task={item} onAccept={handleAcceptTask} onReject={handleRejectTask} />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-0.5 border-border" />}
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
