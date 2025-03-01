import { View, Text } from 'react-native';

import ExpandableComponent from './Expandable';

const App = () => {
  return (
    <ExpandableComponent collapsedHeight={145} expandedHeight={330}>
      <View>
        <Text>Test</Text>
      </View>
    </ExpandableComponent>
  );
};
export default App;
