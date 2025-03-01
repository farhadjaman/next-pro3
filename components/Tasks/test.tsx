import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { TaskCard } from './TaskCard';
import { Task } from '~/types/task';
import { demoTasks } from '~/lib/demoData';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const CARD_WIDTH = WINDOW_WIDTH * 0.9;
const CAROUSEL_HEIGHT = 160;

const TaskCarousel: React.FC = () => {
  const progress = useSharedValue<number>(0);

  const tasks: Task[] = Array.isArray(demoTasks)
    ? demoTasks.map((task) => ({
        ...task,
        dateTime: {
          start: new Date(task.dateTime.start),
          end: new Date(task.dateTime.end),
        },
      }))
    : [];

  const handleAcceptTask = (taskId: string) => console.log(`Task accepted: ${taskId}`);
  const handleRejectTask = (taskId: string) => console.log(`Task rejected: ${taskId}`);

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TaskCard task={item} onAccept={handleAcceptTask} onReject={handleRejectTask} />
          </View>
        )}
        width={WINDOW_WIDTH}
        height={CAROUSEL_HEIGHT}
        windowSize={3}
        loop
        autoPlay
        snapEnabled
        onProgressChange={progress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    width: WINDOW_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    overflow: 'hidden',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TaskCarousel;
