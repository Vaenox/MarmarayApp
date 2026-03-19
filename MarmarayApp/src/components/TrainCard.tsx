import { StackToolbarMenuActionProps } from "expo-router"
import { View, Text, StyleSheet } from "react-native"
import { Train } from "../types/train"

export default function TrainCard({ d, m, t }: Train) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.destination}>{d}</Text>
        <Text style={{ color: '#9ca3af', fontSize: 12 }}>Saat: {t}</Text>
      </View>

      <View style={styles.timeBubble}>
        <Text style={styles.timeText}>{m} dk</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2f3b4f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  destination: {
    color: "white",
    fontSize: 16
  },

  timeBubble: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20
  },

  timeText: {
    color: "white",
    fontWeight: "600"
  }
})