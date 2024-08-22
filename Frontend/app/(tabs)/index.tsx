import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TextInput, Button, FlatList, TouchableOpacity, } from 'react-native';
import axios from 'axios';


 const MONGO_URL = 'mongodb://localhost:27017/tasks';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(MONGO_URL);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    if (task.length > 0) {
      try {
        const newTask = { task };
        const response = await axios.post(MONGO_URL, newTask);
        setTasks([...tasks, response.data]);
        setTask('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${MONGO_URL}/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
      />
      
      <Button title="Add Task" onPress={addTask} />
      
      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => deleteTask(item._id)}>
            <View style={styles.taskContainer}>
              <Text style={styles.taskText}>{item.task}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#4B0082',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    width: '100%',
    fontSize: 18,
  },
  taskContainer: {
    backgroundColor: '#FFD700',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  taskText: {
    fontSize: 18,
    color: '#4B0082',
  },
});