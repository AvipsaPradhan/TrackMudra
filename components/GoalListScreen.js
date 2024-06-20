import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const GoalListScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [authState] = useContext(AuthContext);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchGoals();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get("/api/v1/goal/get-goal", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setGoals(response.data);
      checkGoals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const markGoalAsCompleted = async (goalId) => {
    try {
      await axios.post(`/api/v1/goal/mark-completed/${goalId}`, {}, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      // Remove the completed goal from the current goals list
      setGoals(goals.filter(goal => goal._id !== goalId));
    } catch (error) {
      console.error("Error marking goal as completed:", error);
    }
  };

  const checkGoals = async (goals) => {
    const now = new Date().setHours(0, 0, 0, 0);
    for (const goal of goals) {
      const endDate = new Date(goal.endDate).setHours(0, 0, 0, 0);
      const dayAfterEndDate = new Date(endDate);
      dayAfterEndDate.setDate(dayAfterEndDate.getDate() + 1);

      if (now >= dayAfterEndDate.getTime()) {
        if (goal.currentAmount <= goal.amount) {
          Alert.alert(
            "Goal Achieved!",
            `Congratulations! You have achieved your goal of ₹${goal.amount} in the category ${goal.category}. You have received a reward of 200 points.`,
            [
              {
                text: "OK",
                onPress: async () => {
                  await markGoalAsCompleted(goal._id); // Mark the goal as completed
                  navigation.navigate("Rewards"); // Navigate to the Rewards page
                },
              },
            ]
          );
          // Remove the completed goal from the current goals list
          setGoals(goals.filter(goal => goal._id !== goal._id));
        }
      }
    }
  };

  const renderItem = ({ item }) => {
    const progressBarColor = item.currentAmount >= item.alertAmount ? "#FF0000" : "#00FF00";

    return (
      <View style={styles.goalCard}>
        <View style={styles.goalCardContent}>
          <Text style={styles.goalTitle}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
          <Text style={styles.goalSubtitle}>Your Target: ₹{item.amount}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                { width: `${(item.currentAmount / item.amount) * 100}%`, backgroundColor: progressBarColor },
              ]}
            />
          </View>
          <Text style={styles.currentAmount}>₹{item.currentAmount}</Text>
          <Text style={styles.goalDates}>
            From: {new Date(item.startDate).toLocaleDateString()} To:{" "}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Goals</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CompletedGoalsScreen")}>
          <Text style={styles.headerSubtitle}>Completed Goals</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={goals}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("GoalSetterScreen", { onSuccess: fetchGoals })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#007AFF",
  },
  goalCard: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  goalCardContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  goalSubtitle: {
    fontSize: 16,
    color: "#fff",
  },
  goalDates: {
    fontSize: 14,
    color: "#fff",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  progress: {
    height: "100%",
    borderRadius: 5,
  },
  currentAmount: {
    fontSize: 14,
    color: "#fff",
  },
  goalImage: {
    width: 50,
    height: 50,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default GoalListScreen;
