import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ExpandableComponent from './Expandable';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const today = new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Expandable Calendar - standalone component */}
      <ExpandableComponent
        collapsedHeight={180}
        expandedHeight={350}
        initialPosition="closed"
        containerStyle={styles.calendarWrapper}>
        <Calendar
          current={today}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [today]: { selected: true, selectedColor: '#4DB6AC' },
            [selectedDate]: { selected: true, selectedColor: '#4DB6AC' },
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#4DB6AC',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#4DB6AC',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#4DB6AC',
            selectedDotColor: '#ffffff',
            arrowColor: '#4DB6AC',
            monthTextColor: '#2d4150',
          }}
        />
      </ExpandableComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 15,
    backgroundColor: '#5C8BC0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  calendarWrapper: {
    margin: 10,
  },
  listContent: {
    padding: 10,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  idContainer: {
    marginRight: 10,
    backgroundColor: '#EDE7F6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  taskId: {
    color: '#673AB7',
    fontWeight: '600',
  },
  statusContainer: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  taskStatus: {
    color: '#5D4037',
    fontWeight: '600',
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  taskType: {
    color: '#616161',
  },
  assignee: {
    color: '#616161',
    fontWeight: '500',
    marginLeft: 'auto',
  },
  chevron: {
    marginLeft: 10,
  },
  chevronText: {
    fontSize: 24,
    color: '#BDBDBD',
  },
});

export default App;
