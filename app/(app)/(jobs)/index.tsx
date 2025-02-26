import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import CalenderScreen from '~/components/ExpandableCalender'
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { Text } from '~/components/nativewindui/Text';
import { TaskCard } from '~/components/Tasks/TaskCard';
import { demoTasks } from '~/lib/demoData';
import { Task } from '~/types/task';

function handleRejectTask() {}

const tasks: Task[] = demoTasks.map((task) => ({
  ...task,
  dateTime: {
    start: new Date(task.dateTime.start),
    end: new Date(task.dateTime.end),
  },
}));

export default function Jobs() {
  const today = new Date().toISOString().split('T')[0];
  const fastDate = getPastDate(3);
  const futureDates = getFutureDates(12);
  const dates = [fastDate, today].concat(futureDates);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Render just the main content area (Calendar or Map)
  const renderMainContent = () => {
    if (selectedIndex === 0) {
      // Calendar view
      return <ExpandableCalendar />;
    } else {
      // Map view placeholder
      return (
        <CalenderScreen/>
      );
    }
  };

  function handleAcceptTask(taskId: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <CalendarProvider date={dates[1]}>
      <SafeAreaView className="flex-1">
        <View className="p-4">
          <SegmentedControl
            materialTextClassName={'bg-orange-40'}
            values={['Calendar', 'Map']}
            selectedIndex={selectedIndex}
            onIndexChange={(index) => {
              setSelectedIndex(index);
            }}
          />
        </View>
        {/* Calendar or Map view */}

        {/* Main content area - changes based on tab selection */}
        {renderMainContent()}
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
      // Create a proper date object for month manipulation
      const dateObj = new Date(d);
      // Set to next month properly handling year transitions
      dateObj.setMonth(dateObj.getMonth() + 1);
      d = dateObj.getTime();
    }
    const date = new Date(d + 864e5 * index); // Add days
    const dateString = date.toISOString().split('T')[0];
    array.push(dateString);
  }
  return array;
}
