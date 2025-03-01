import { SafeAreaView } from 'react-native';

import TaskMap from '~/components/Tasks/TaskMap';

export default function Jobs() {
  return (
    <SafeAreaView className="flex-1">
      <TaskMap />
    </SafeAreaView>
  );
}
