import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Keyboard, Modal } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksFromStorage = await AsyncStorage.getItem('tasks');
        if (tasksFromStorage) {
          setTasks(JSON.parse(tasksFromStorage));
        }
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error al guardar las tareas:', error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (taskTitle.trim() === '' || taskDescription.trim() === '') {
      alert('No puedes agregar una tarea con título o descripción vacíos');
      return;
    }
    setTasks([...tasks, { id: Math.random().toString(), title: taskTitle, description: taskDescription, completed: false }]);
    setTaskTitle('');
    setTaskDescription('');
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const completeTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>To-Do List</Text>
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() => (
                  <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteTask(item.id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                )}
              >
                <View style={styles.taskContainer}>
                  <View style={styles.taskTextContainer}>
                    <Text style={item.completed ? styles.taskCompleted : styles.task}>{item.title}</Text>
                    {!item.completed && <Text style={styles.description}>{item.description}</Text>}
                  </View>
                  <TouchableOpacity style={styles.buttonComplete} onPress={() => completeTask(item.id)}>
                    <Text style={styles.buttonTick}>{item.completed ? 'Deshacer' : '✓'}</Text>
                  </TouchableOpacity>
                </View>
              </Swipeable>
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>No hay tareas todavía :(</Text>}
          />
          <TouchableOpacity style={styles.buttonAdd} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Título de la tarea"
                value={taskTitle}
                onChangeText={setTaskTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción de la tarea"
                value={taskDescription}
                onChangeText={setTaskDescription}
              />
              <TouchableOpacity style={styles.buttonAdd} onPress={addTask}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
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
    width: '100%',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  taskTextContainer: {
    flex: 1,
  },
  task: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    width: '95%',
  },
  descriptionHide: {
    
  },
  taskCompleted: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#888',
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
    marginBottom: 10,
  },
  buttonComplete: {
    borderRadius: 10,
    backgroundColor: '#0000ff',
    padding: 5,
    alignItems: 'center',
  },
  buttonClose: {
    borderRadius: 10,
    backgroundColor: '#ff0000',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonDelete: {
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
  },
  buttonTick: {
    color: '#fff',
    fontSize: 20,
    minWidth: 30,
    minHeight: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
