import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/User";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  User: undefined;
};

export default function User() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const [foodLevels, setFoodLevels] = useState<number[]>([100]);
  const [lastFeds, setLastFeds] = useState<string[]>(["Not yet"]);
  const [deviceStatuses, setDeviceStatuses] = useState<
    Array<{
      id: number;
      status: "Online" | "Offline" | "Not Working";
      lastOnline: string | null;
    }>
  >([]);
  const [deviceSchedules, setDeviceSchedules] = useState<string[][]>([[]]);
  const [scheduleInputs, setScheduleInputs] = useState<string[]>([""]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [lastTriggeredMinute, setLastTriggeredMinute] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const openTimePicker = (deviceId: number) => {
    setSelectedDevice(deviceId);
    setShowTimePicker(true);
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);

    if (time && selectedDevice !== null) {
      setSelectedTime(time);

      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");

      const formatted = `${hours}:${minutes}`;

      const newInputs = [...scheduleInputs];
      newInputs[selectedDevice - 1] = formatted;

      setScheduleInputs(newInputs);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await AsyncStorage.getItem("currentUser");
      setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const initializeData = async () => {
      // Get user device count
      const usersJson = await AsyncStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const userData = users.find((u: any) => u.email === currentUser);
      const deviceCount = userData?.deviceCount || 1;

      // Initialize device statuses
      const initialStatuses = Array.from({ length: deviceCount }, (_, i) => ({
        id: i + 1,
        status: "Online" as const,
        lastOnline: null,
      }));
      setDeviceStatuses(initialStatuses);

      // Initialize food levels and last feeds
      setFoodLevels(Array(deviceCount).fill(100));
      setLastFeds(Array(deviceCount).fill("Not yet"));

      // Initialize schedules
      const initialSchedules = Array.from({ length: deviceCount }, () => []);
      setDeviceSchedules(initialSchedules);
      setScheduleInputs(Array(deviceCount).fill(""));

      // Load saved schedules
      const savedSchedules = await AsyncStorage.getItem(
        `deviceSchedules_${currentUser}`,
      );
      if (savedSchedules) {
        const parsed = JSON.parse(savedSchedules);
        const schedules = Array.from(
          { length: deviceCount },
          (_, i) => parsed[i] || [],
        );
        setDeviceSchedules(schedules);
      }
    };

    initializeData();

    const interval = setInterval(() => {
      setDeviceStatuses((prevStatuses) =>
        prevStatuses.map((device) => {
          const random = Math.random();
          let newStatus: "Online" | "Offline" | "Not Working" = "Online";
          let lastOnline = device.lastOnline;

          if (random < 0.1) {
            newStatus = "Offline";
            lastOnline = new Date().toLocaleString();
          } else if (random < 0.15) {
            newStatus = "Not Working";
            lastOnline = new Date().toLocaleString();
          }

          return {
            ...device,
            status: newStatus,
            lastOnline,
          };
        }),
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const addFeedLog = async (
    type: "Manual" | "Scheduled",
    status: "Success" | "Failed",
    foodAfter: number,
    deviceId: number = 1,
  ) => {
    const existingLogs = await AsyncStorage.getItem("feedingLogs");
    const logs = existingLogs ? JSON.parse(existingLogs) : [];

    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      user: currentUser,
      type,
      foodAfter,
      status,
      deviceId,
    };

    const updatedLogs = [newLog, ...logs];
    await AsyncStorage.setItem("feedingLogs", JSON.stringify(updatedLogs));
  };

  const handleAddSchedule = (deviceId: number) => {
    const scheduleTime = scheduleInputs[deviceId - 1];
    if (!scheduleTime) return;

    const currentSchedules = deviceSchedules[deviceId - 1] || [];
    if (currentSchedules.includes(scheduleTime)) {
      addNotification(
        `⚠️ Schedule already exists for ${getDeviceName(deviceId)}.`,
      );
      return;
    }

    const newSchedules = [...deviceSchedules];
    newSchedules[deviceId - 1] = [...currentSchedules, scheduleTime];
    setDeviceSchedules(newSchedules);

    const newInputs = [...scheduleInputs];
    newInputs[deviceId - 1] = "";
    setScheduleInputs(newInputs);

    addNotification(`⏰ Schedule added for ${getDeviceName(deviceId)}.`);
  };

  const handleRemoveSchedule = (deviceId: number, time: string) => {
    const newSchedules = [...deviceSchedules];
    const currentSchedules = newSchedules[deviceId - 1] || [];
    newSchedules[deviceId - 1] = currentSchedules.filter((t) => t !== time);
    setDeviceSchedules(newSchedules);
    addNotification(`🗑 Schedule removed from ${getDeviceName(deviceId)}.`);
  };

  const addNotification = (message: string) => {
    setNotifications((prev) => [message, ...prev]);
  };

  const getDeviceName = (deviceId: number) => {
    // For simplicity, return Device {id}, as petNames might not be set
    return `Device ${deviceId}`;
  };

  const handleManualFeed = (deviceId: number) => {
    const deviceIndex = deviceId - 1;
    const currentFoodLevel = foodLevels[deviceIndex];

    if (currentFoodLevel > 0) {
      const newFoodLevel = Math.max(currentFoodLevel - 5, 0);
      const newFoodLevels = [...foodLevels];
      newFoodLevels[deviceIndex] = newFoodLevel;
      setFoodLevels(newFoodLevels);

      const now = new Date().toLocaleTimeString();
      const newLastFeds = [...lastFeds];
      newLastFeds[deviceIndex] = now;
      setLastFeds(newLastFeds);

      addFeedLog("Manual", "Success", newFoodLevel, deviceId);
      addNotification(
        `✅ Manual feeding successful for ${getDeviceName(deviceId)} at ${now}`,
      );
    } else {
      addFeedLog("Manual", "Failed", currentFoodLevel, deviceId);
      addNotification(
        `❌ Manual feeding failed for ${getDeviceName(deviceId)}. No food.`,
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentMinute = now.toISOString().slice(0, 16);

      deviceSchedules.forEach((schedules, deviceIndex) => {
        const deviceId = deviceIndex + 1;
        schedules.forEach((time) => {
          if (time === currentTime && currentMinute !== lastTriggeredMinute) {
            const currentFoodLevel = foodLevels[deviceIndex];
            if (currentFoodLevel > 0) {
              const newFoodLevel = Math.max(currentFoodLevel - 5, 0);
              const newFoodLevels = [...foodLevels];
              newFoodLevels[deviceIndex] = newFoodLevel;
              setFoodLevels(newFoodLevels);

              const newLastFeds = [...lastFeds];
              newLastFeds[deviceIndex] = now.toLocaleTimeString();
              setLastFeds(newLastFeds);

              addNotification(
                `⏰ Scheduled feeding for ${getDeviceName(deviceId)} at ${time}`,
              );
              addFeedLog("Scheduled", "Success", newFoodLevel, deviceId);
            } else {
              addNotification(
                `❌ Scheduled feeding failed for ${getDeviceName(deviceId)}. No food.`,
              );
              addFeedLog("Scheduled", "Failed", currentFoodLevel, deviceId);
            }

            setLastTriggeredMinute(currentMinute);
          }
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deviceSchedules, foodLevels, lastTriggeredMinute, currentUser]);

  useEffect(() => {
    if (currentUser) {
      AsyncStorage.setItem(
        `deviceSchedules_${currentUser}`,
        JSON.stringify(deviceSchedules),
      );
    }
  }, [deviceSchedules, currentUser]);

  useEffect(() => {
    foodLevels.forEach((level, index) => {
      const deviceId = index + 1;
      if (level <= 20 && level > 0) {
        addNotification(`⚠️ ${getDeviceName(deviceId)} food level is low!`);
      }
      if (level === 0) {
        addNotification(`❌ ${getDeviceName(deviceId)} food container empty!`);
      }
    });
  }, [foodLevels, currentUser]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    await AsyncStorage.removeItem("role");
    navigation.navigate("Login");
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Smart Pet Feeder System</Text>
          <Text style={styles.welcome}>Welcome, {currentUser}</Text>
        </View>
      </View>

      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowNotifications(true)}
        >
          <Text>🔔 Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowDropdown(true)}
        >
          <Text>👤 Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {/* Rest of Screen */}
        <View style={styles.content}>{/* dashboard cards etc */}</View>
      </View>

      {/* Device Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Device Status</Text>
        {deviceStatuses.map((device) => (
          <View key={device.id} style={styles.deviceCard}>
            <Text>
              <Text style={styles.bold}>{getDeviceName(device.id)}: </Text>
              <Text
                style={[
                  styles.status,
                  device.status === "Online"
                    ? styles.online
                    : device.status === "Offline"
                      ? styles.offline
                      : styles.notWorking,
                ]}
              >
                ● {device.status}
              </Text>
            </Text>
            {(device.status === "Offline" || device.status === "Not Working") &&
              device.lastOnline && (
                <Text>Last Online: {device.lastOnline}</Text>
              )}
            <Text>
              <Text style={styles.bold}>Last Feeding: </Text>
              {lastFeds[device.id - 1]}
            </Text>
            <Text>
              <Text style={styles.bold}>Food Level:</Text>
            </Text>
            <View style={styles.foodBar}>
              <View
                style={[
                  styles.foodFill,
                  { width: `${foodLevels[device.id - 1]}%` },
                  foodLevels[device.id - 1] <= 20 && styles.low,
                ]}
              />
            </View>
            <Text style={styles.foodPercent}>{foodLevels[device.id - 1]}%</Text>
            <TouchableOpacity
              style={styles.feedButton}
              onPress={() => handleManualFeed(device.id)}
            >
              <Text style={styles.buttonText}>
                Feed {getDeviceName(device.id)}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Schedule */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Feeding Schedule</Text>
        {deviceStatuses.map((device) => (
          <View key={device.id} style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>
              {getDeviceName(device.id)} Schedule
            </Text>
            <View style={styles.scheduleInputRow}>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => openTimePicker(device.id)}
              >
                <Text>{scheduleInputs[device.id - 1] || "Select Time"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddSchedule(device.id)}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {(deviceSchedules[device.id - 1] || []).map((time, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Text>{time}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveSchedule(device.id, time)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {notifications.length === 0 ? (
              <Text>No alerts yet.</Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.notificationItem}>{item}</Text>
                )}
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNotifications(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal visible={showDropdown} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => Alert.alert("Profile", "Navigate to Profile")}
            >
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Pet Tracker", "Navigate to Pet Feed Tracker")
              }
            >
              <Text style={styles.menuItem}>Pet Feed Tracker</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDropdown(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </ScrollView>
  );
}
