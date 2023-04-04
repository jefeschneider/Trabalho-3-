import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Principal() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/tasks");
      setTaskList(response.data);
    }
    fetchData();
  }, []);

  async function handleAddTask() {
    if (newTaskTitle === "") return;
    const response = await axios.post("http://localhost:3001/tasks", {
      title: newTaskTitle,
    });
    setTaskList([...taskList, response.data]);
    setNewTaskTitle("");
  }

  async function handleToggleTaskCompleted(id: number) {
    const taskToUpdate = taskList.find((task) => task.id === id);
    if (!taskToUpdate) return;
    const response = await axios.patch(`http://localhost:3001/tasks/${id}`, {
      title: taskToUpdate.title,
      completed: !taskToUpdate.completed,
    });
    const updatedTaskList = taskList.map((task) =>
      task.id === response.data.id ? response.data : task
    );
    setTaskList(updatedTaskList);
  }

  async function handleDeleteTask(id: number) {
    await axios.delete(`http://localhost:3001/tasks/${id}`);
    const updatedTaskList = taskList.filter((task) => task.id !== id);
    setTaskList(updatedTaskList);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={newTaskTitle}
          onChangeText={(text) => setNewTaskTitle(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={taskList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskContainer}
            onPress={() => handleToggleTaskCompleted(item.id)}
          >
            <Text
              style={[
                styles.taskTitle,
                item.completed && styles.completedTaskTitle,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.taskStatus}>
              {item.completed ? "Completed" : "Incomplete"}
            </Text>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Text>X</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
  },
  completedTaskTitle: {
    textDecorationLine: "line-through",
    color: "#ccc",
  },
  taskStatus: {
    marginRight: 10,
    color: "#ccc",
  },
});
