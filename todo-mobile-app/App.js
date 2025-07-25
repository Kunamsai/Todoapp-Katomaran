import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import TasksScreen from './src/screens/TasksScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState('Tasks');

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            screen === 'Tasks' && styles.tabButtonActive,
          ]}
          onPress={() => setScreen('Tasks')}
        >
          <Text style={styles.tabButtonText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            screen === 'Profile' && styles.tabButtonActive,
          ]}
          onPress={() => setScreen('Profile')}
        >
          <Text style={styles.tabButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.screenContainer}>
        {screen === 'Tasks' && <TasksScreen />}
        {screen === 'Profile' && <ProfileScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabBar: { flexDirection: 'row', marginBottom: 20, justifyContent: 'center' },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  tabButtonActive: {
    backgroundColor: '#007bff',
  },
  tabButtonText: {
    color: '#222',
    fontWeight: 'bold',
  },
  screenContainer: { flex: 1 },
});
