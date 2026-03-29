import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginTop: 35,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 16,
    color: "#666",
  },
  headerRight: {
    flexDirection: "row",
  },
  notificationButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  profileButton: {
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deviceCard: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  status: {
    fontSize: 16,
  },
  online: {
    color: "green",
  },
  offline: {
    color: "orange",
  },
  notWorking: {
    color: "red",
  },
  foodBar: {
    height: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    marginVertical: 5,
  },
  foodFill: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 10,
  },
  low: {
    backgroundColor: "red",
  },
  foodPercent: {
    textAlign: "center",
    fontWeight: "bold",
  },
  feedButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scheduleCard: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scheduleInputRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f9f9f9",
    marginBottom: 5,
    borderRadius: 5,
  },
  removeText: {
    color: "red",
  },
  footer: {
    alignItems: "center",
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6c757d",
    borderRadius: 5,
    alignItems: "center",
  },

  topActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  actionBtn: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
  },

  content: {
    flex: 1,
    padding: 20,
  },
});
