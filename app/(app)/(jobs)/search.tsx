import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';

import { Container } from '~/components/Container';
import { useColorScheme } from '~/lib/useColorScheme';

export default function SearchScreen() {
  const [serialNumber, setSerialNumber] = useState('');
  const { colors } = useColorScheme();

  // Define the groups for the serial number format
  const groups = [2, 3, 3, 1, 4, 1, 1, 1, 2, 1];

  // Create grouped number guide
  const numberGuide = useMemo(() => {
    let currentNum = 1;
    return groups.map((length) => Array.from({ length }, () => currentNum++));
  }, []);

  // Create the placeholder with properly spaced dashes
  const placeholder = groups.map((n) => '-'.repeat(n)).join(' ');

  const formatSerialNumber = (text: string) => {
    // Remove spaces and non-alphanumeric characters
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '');
    let formatted = '';
    let currentPos = 0;

    groups.forEach((length, index) => {
      const groupText = cleaned.substr(currentPos, length);
      formatted += groupText;
      currentPos += length;

      if (index < groups.length - 1 && currentPos < cleaned.length) {
        formatted += ' ';
      }
    });

    return formatted;
  };

  const handleInputChange = (text: string) => {
    if (text.length < serialNumber.length && serialNumber.endsWith(' ')) {
      text = text.slice(0, -1);
    }
    const formatted = formatSerialNumber(text);
    setSerialNumber(formatted);
  };

  return (
    <Container>
      <Text style={styles.title}>Search database</Text>

      {/* Number format guide */}
      <View style={styles.formatGuide}>
        {numberGuide.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.groupContainer}>
            <Text style={styles.separator}>|</Text>
            <View style={styles.numberGroup}>
              {group.map((num, i) => (
                <Text key={i} style={styles.groupNumber}>
                  {num}
                </Text>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.separator}>|</Text>
      </View>

      {/* Serial number input visualization */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card }]}
          value={serialNumber}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          maxLength={groups.reduce((sum, num) => sum + num, 0) + (groups.length - 1)}
          autoCapitalize="characters"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.resetButton} onPress={() => setSerialNumber('')}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
        <Pressable style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search by serial number</Text>
        </Pressable>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    padding: 10,
    color: '#333',
  },
  formatGuide: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    alignItems: 'center',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberGroup: {
    flexDirection: 'row',
    gap: 2,
    paddingHorizontal: 2,
  },
  separator: {
    color: '#999',
    fontSize: 12,
    marginHorizontal: 2,
  },
  groupNumber: {
    fontSize: 9,
    color: '#666',
    width: 12,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'monospace',
    height: 54,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
  },
  resetButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
