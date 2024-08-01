import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim() === '') {
      alert('No podes agregar una tarea vacía');
      return;
    }
    setTasks([...tasks, { id: Math.random().toString(), text: taskText }]);
    setTaskText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <Text style={styles.task}>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No hay tareas todavía :(</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Escribir tarea"
        value={taskText}
        onChangeText={setTaskText}
      />
      <TouchableOpacity style={styles.buttonAdd} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 18,
    padding: 10,
  },
  task: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  empty: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  buttonAdd: {
    borderRadius: 10,
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

