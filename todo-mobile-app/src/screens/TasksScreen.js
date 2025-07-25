import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
  RefreshControl,
  LayoutAnimation,
} from 'react-native';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, open, complete
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'open',
    priority: 'normal', // Add priority
  });
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchText, filterStatus]);

  const applyFilters = () => {
    let filtered = tasks;
    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }
    if (searchText.trim() !== '') {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredTasks(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const addTask = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!newTask.title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }
    if (editingId !== null) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId ? { ...task, title: newTask.title, description: newTask.description } : task
        )
      );
      setEditingId(null);
    } else {
      setTasks((prev) => [
        ...prev,
        { ...newTask, id: Date.now().toString(), status: 'open' },
      ]);
    }
    setNewTask({ title: '', description: '', dueDate: '', status: 'open', priority: 'normal' });
    setModalVisible(false);
  };

  const deleteTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'open' ? 'complete' : 'open' } : t
      )
    );
  };

  const startEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority, // Include priority in editing
    });
    setEditingId(task.id);
    setModalVisible(true);
  };

  const updateTask = () => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingId
          ? { ...task, ...newTask }
          : task
      )
    );
    setEditingId(null);
    setNewTask({ title: '', description: '', dueDate: '', status: 'open', priority: 'normal' });
    setModalVisible(false);
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteTask(id)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderTask = ({ item }) => (
    <View>
      <TouchableOpacity
        style={[
          styles.taskItem,
          item.status === 'complete' && styles.taskComplete,
        ]}
        onPress={() => toggleComplete(item.id)}
      >
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.taskDueDate}>Due: {item.dueDate || 'N/A'}</Text>
        <Text style={{ color: item.status === 'complete' ? '#28a745' : '#007bff' }}>
          Status: {item.status}
        </Text>
        <Text style={{ color: item.priority === 'high' ? '#dc3545' : item.priority === 'normal' ? '#007bff' : '#ffc107' }}>
          Priority: {item.priority}
        </Text>
        <View style={styles.actions}>
          <Button title="Edit" onPress={() => startEditTask(item)} />
          <Button title="Delete" onPress={() => deleteTask(item.id)} />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchFilterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={styles.filterButtons}>
          {['all', 'open', 'complete'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.filterButtonActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={
                  filterStatus === status
                    ? styles.filterButtonTextActive
                    : styles.filterButtonText
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No tasks to show</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={newTask.dueDate}
              onChangeText={(text) => setNewTask({ ...newTask, dueDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Priority (low, normal, high)"
              value={newTask.priority}
              onChangeText={(text) => setNewTask({ ...newTask, priority: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => {
    setModalVisible(false);
    setEditingId(null);
    setNewTask({ title: '', description: '', dueDate: '', status: 'open', priority: 'normal' });
  }} />
              <Button title={editingId ? "Update" : "Add"} onPress={editingId ? updateTask : addTask} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchFilterContainer: {
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  taskComplete: {
    backgroundColor: '#d4edda',
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#007bff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    transform: [{ scale: 1 }],
  },
  fabText: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 36,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
