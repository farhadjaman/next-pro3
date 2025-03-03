import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { TaskCard } from './TaskCard';
import { Task } from '~/types/task';
import { demoTasks } from '~/lib/demoData';
import { store } from '~/store';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = WINDOW_WIDTH * 0.9;
const CAROUSEL_HEIGHT = 100;

const tasks: Task[] = Array.isArray(demoTasks)
  ? demoTasks.map((task) => ({
      ...task,
      dateTime: {
        start: new Date(task.dateTime.start),
        end: new Date(task.dateTime.end),
      },
    }))
  : [];

const TaskCarousel: React.FC = () => {
  const progress = useSharedValue<number>(0);

  const handleSnapToItem = (index: number) => {
    const task = tasks[index];
    if (task && task.location) {
      store.setCurrentShop({
        name: task.location.name,
        lat: task.location.lat,
        long: task.location.long,
      });
    }

    console.log('Current task selected:', task.id, task.title);
  };

  const handleAcceptTask = (taskId: string) => console.log('Task accepted');
  const handleRejectTask = (taskId: string) => console.log('Task rejected');

  return (
    <View style={styles.container}>
      <Carousel
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TaskCard styles={{
              borderRadius:16
            }} task={item} onAccept={handleAcceptTask} onReject={handleRejectTask} />
          </View>
        )}
        width={CARD_WIDTH}
        height={CAROUSEL_HEIGHT}
        loop
        autoPlay={false}
        windowSize={3}
        style={styles.carousel}
        defaultIndex={0}
        snapEnabled
        overscrollEnabled={false}
        enabled
        scrollAnimationDuration={500}
        onProgressChange={progress}
        onSnapToItem={(index) => handleSnapToItem(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  carousel: {
    width: WINDOW_WIDTH,
    justifyContent: 'center',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    padding: 5,
  },
});

export default TaskCarousel;
