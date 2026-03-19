import { View, Text, StyleSheet } from "react-native"
import { Train } from "../types/train"
import TrainCard from "./TrainCard"

interface Props {
  title: string
  trains: Train[]
}

export default function DirectionList({ title, trains }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {trains?.length === 0 ? (
        <Text style={{ color: "#9ca3af", fontStyle: "italic" }}>
          Sefer bilgisi bulunamadı
        </Text>
      ) : (
        trains?.map((t, index) => (
          // Key ekledik ve objeyi direkt yaydık (spread)
          <TrainCard key={index} {...t} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6
  },

  title: {
    color: "white",
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600"
  }
})