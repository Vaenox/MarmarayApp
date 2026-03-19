import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Station } from "@/types/station";
import trainTimesData from "@/app/utils/trainTimes.json";

const { width } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrainEntry {
  departure: string;    // "HH:MM"
  destination: string;
  weekendOnly: boolean;
}

interface StationSchedule {
  halkali: TrainEntry[];
  gebze: TrainEntry[];
}

interface UpcomingTrain extends TrainEntry {
  minutesLeft: number;
}

// JSON'un "stations" objesini tip-güvenli şekilde oku
const allStations = trainTimesData.stations as Record<string, StationSchedule>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isWeekend(): boolean {
  const d = new Date().getDay();
  return d === 0 || d === 6;
}

/**
 * "HH:MM" → minutes from midnight.
 * 00:00–04:59 → +1440 (ertesi gün olarak sırala)
 */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m;
  return total < 300 ? total + 1440 : total;
}

function getUpcoming(trains: TrainEntry[], count = 5): UpcomingTrain[] {
  const now = new Date();
  const nowRaw = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const nowNorm = nowRaw < 300 ? nowRaw + 1440 : nowRaw;
  const weekend = isWeekend();

  return trains
    .filter((t) => (t.weekendOnly ? weekend : true))
    .map((t) => ({ ...t, minutesLeft: Math.round(toMinutes(t.departure) - nowNorm) }))
    .filter((t) => t.minutesLeft > 0)
    .sort((a, b) => a.minutesLeft - b.minutesLeft)
    .slice(0, count);
}

function formatCountdown(minutes: number): string {
  if (minutes < 1) return "Az kaldı";
  if (minutes < 60) return `${minutes} dk`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} saat` : `${h} sa ${m} dk`;
}

function formatClock(date: Date): string {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

// ─── DepartureCard ────────────────────────────────────────────────────────────
const DepartureCard = ({
  train,
  index,
  direction,
}: {
  train: UpcomingTrain;
  index: number;
  direction: "halkali" | "gebze";
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 350, delay: index * 70, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 350, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  const accent = direction === "halkali" ? "#E8530A" : "#D4A017";
  const isImminent = train.minutesLeft <= 2;

  return (
    <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={[styles.iconBox, { borderColor: accent + "55" }]}>
        <MaterialCommunityIcons name="subway-variant" size={19} color={accent} />
      </View>

      <View style={styles.cardMiddle}>
        <Text style={styles.destinationText}>{train.destination}</Text>
        <Text style={styles.departureTime}>{train.departure} kalkış</Text>
      </View>

      <View style={styles.cardRight}>
        {train.weekendOnly && (
          <View style={styles.weekendBadge}>
            <Text style={styles.weekendBadgeText}>H/S</Text>
          </View>
        )}
        {isImminent ? (
          <View style={styles.imminentBadge}>
            <Text style={styles.imminentText}>{train.minutesLeft} dk</Text>
          </View>
        ) : (
          <Text style={[styles.countdownText, index === 0 && styles.countdownFirst]}>
            {formatCountdown(train.minutesLeft)}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

// ─── DirectionPanel ───────────────────────────────────────────────────────────
const DirectionPanel = ({
  direction,
  trains,
}: {
  direction: "halkali" | "gebze";
  trains: UpcomingTrain[];
}) => {
  const isHalkali = direction === "halkali";
  const accent = isHalkali ? "#E8530A" : "#D4A017";
  const grad: [string, string] = isHalkali ? ["#2A1A10", "#1E2230"] : ["#2A2210", "#1E2230"];

  return (
    <View style={styles.panel}>
      <LinearGradient colors={grad} style={styles.panelHeader}>
        <View style={[styles.directionBtn, { backgroundColor: accent }]}>
          <Ionicons name={isHalkali ? "arrow-back" : "arrow-forward"} size={17} color="#fff" />
        </View>
        <Text style={styles.panelTitle}>{isHalkali ? "Halkalı Yönü" : "Gebze Yönü"}</Text>
      </LinearGradient>

      <View style={styles.cardList}>
        {trains.length === 0 ? (
          <View style={styles.noTrainBox}>
            <Text style={styles.noTrainText}>Bugün için sefer kalmadı.</Text>
          </View>
        ) : (
          trains.map((t, i) => (
            <DepartureCard key={`${t.departure}-${i}`} train={t} index={i} direction={direction} />
          ))
        )}
      </View>
    </View>
  );
};

// ─── Station Picker Modal ─────────────────────────────────────────────────────
const StationPickerModal = ({
  visible,
  selectedValue,
  stationList,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedValue: number;
  stationList: { label: string; value: number }[];
  onSelect: (v: number) => void;
  onClose: () => void;
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
    <View style={styles.modalSheet}>
      <View style={styles.modalHandle} />
      <Text style={styles.modalTitle}>İstasyon Seçin</Text>
      <FlatList
        data={stationList}
        keyExtractor={(item) => item.value.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const sel = item.value === selectedValue;
          return (
            <TouchableOpacity
              style={[styles.modalItem, sel && styles.modalItemSelected]}
              onPress={() => { onSelect(item.value); onClose(); }}
            >
              <MaterialCommunityIcons name="subway-variant" size={17} color={sel ? "#38BDF8" : "#475569"} />
              <Text style={[styles.modalItemText, sel && styles.modalItemTextSelected]}>{item.label}</Text>
              {sel && <Ionicons name="checkmark-circle" size={17} color="#38BDF8" />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  </Modal>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function StationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [clockStr, setClockStr] = useState(formatClock(new Date()));
  const [tick, setTick] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const clockTimer    = setInterval(() => setClockStr(formatClock(new Date())), 1000);
    const countdownTimer = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => { clearInterval(clockTimer); clearInterval(countdownTimer); };
  }, []);

  // ── Station enum → picker list ──
  const stationList = Station.ALL.map((s) => ({
    label: s.visibleName,
    value: s.id,
  }));
  const numericId = Number(id);
  const stationName = Station.getById(numericId)?.name ?? null;

  // ── Seçilen istasyonun adı (Station enum'dan) ──


  // ── trainTimes.json'dan eşleşen istasyonu bul ──
  // Enum adı "Uskudar" gibi olabilir, JSON anahtarı "Üsküdar" olabilir;
  // önce tam eşleşme, sonra büyük-küçük harf duyarsız ara.
  const resolveSchedule = (enumName: string | null): StationSchedule | null => {
    if (!enumName) return null;
    if (allStations[enumName]) return allStations[enumName];
    const lower = enumName.toLowerCase();
    const found = Object.keys(allStations).find((k) => k.toLowerCase() === lower);
    return found ? allStations[found] : null;
  };

  const schedule = resolveSchedule(stationName);

  // ── Yaklaşan seferler (30s tick'te yeniden hesapla) ──
  const halkaliUpcoming = React.useMemo(
    () => (schedule ? getUpcoming(schedule.halkali, 5) : []),
    [tick, schedule]
  );
  const gebzeUpcoming = React.useMemo(
    () => (schedule ? getUpcoming(schedule.gebze, 5) : []),
    [tick, schedule]
  );

  const weekend = isWeekend();
  const currentStationName = stationName ?? "İstasyon Seçiniz";
  const hasSchedule = !!schedule;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1623" />

      {/* ── Header ── */}
      <LinearGradient
        colors={["#162033", "#1A2540"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.stationSelector} onPress={() => setPickerVisible(true)} activeOpacity={0.8}>
            <View style={styles.stationIconBox}>
              <MaterialCommunityIcons name="subway-variant" size={26} color="#fff" />
            </View>
            <View style={styles.stationInfo}>
              <Text style={styles.liveLabel}>CANLI SEFER SAATLERİ</Text>
              <View style={styles.stationNameRow}>
                <Text style={styles.stationName} numberOfLines={1}>{currentStationName}</Text>
                <Ionicons name="chevron-down" size={15} color="#94A3B8" style={{ marginLeft: 4, marginTop: 4 }} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.clockBox}>
            <Text style={styles.clockLabel}>ŞU AN</Text>
            <View style={styles.clockRow}>
              <Ionicons name="time-outline" size={13} color="#38BDF8" style={{ marginRight: 4 }} />
              <Text style={styles.clockText}>{clockStr}</Text>
            </View>
          </View>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>CANLI</Text>
          </View>
          {weekend && (
            <View style={styles.weekendModeBadge}>
              <Ionicons name="calendar" size={10} color="#818CF8" style={{ marginRight: 4 }} />
              <Text style={styles.weekendModeText}>HAFTA SONU TARİFESİ</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* ── İçerik ── */}
      {!numericId ? (
        // İstasyon seçilmedi
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons name="subway-variant" size={56} color="#1E3A5F" />
          <Text style={styles.emptyTitle}>İstasyon Seçin</Text>
          <Text style={styles.emptySubtitle}>Canlı sefer saatlerini görmek için bir istasyon seçin.</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setPickerVisible(true)}>
            <Text style={styles.selectBtnText}>İstasyon Seç</Text>
          </TouchableOpacity>
        </View>
      ) : !hasSchedule ? (
        // JSON'da bu istasyonun datası henüz yok
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons name="clock-outline" size={56} color="#1E3A5F" />
          <Text style={styles.emptyTitle}>{currentStationName}</Text>
          <Text style={styles.emptySubtitle}>Bu istasyonun sefer saatleri henüz eklenmedi.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {schedule.halkali.length > 0 && (
            <DirectionPanel direction="halkali" trains={halkaliUpcoming} />
          )}
          {schedule.gebze.length > 0 && (
            <DirectionPanel direction="gebze" trains={gebzeUpcoming} />
          )}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#818CF8" }]} />
              <Text style={styles.legendText}>H/S — Yalnızca hafta sonu geçerli sefer</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ── Picker Modal ── */}
      <StationPickerModal
        visible={pickerVisible}
        selectedValue={numericId}
        stationList={stationList}
        onSelect={(value) => router.setParams({ id: value.toString() })}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F1623" },

  header: {
    paddingTop: 12, paddingBottom: 16, paddingHorizontal: 18,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 14,
  },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  stationSelector: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  stationIconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" },
  stationInfo: { flex: 1 },
  liveLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5, color: "#38BDF8", marginBottom: 2 },
  stationNameRow: { flexDirection: "row", alignItems: "center" },
  stationName: { fontSize: 22, fontWeight: "800", color: "#F1F5F9", letterSpacing: -0.5, maxWidth: width * 0.4 },
  clockBox: { alignItems: "flex-end" },
  clockLabel: { fontSize: 9, fontWeight: "700", letterSpacing: 1.5, color: "#94A3B8", marginBottom: 2 },
  clockRow: { flexDirection: "row", alignItems: "center" },
  clockText: { fontSize: 19, fontWeight: "800", color: "#38BDF8", fontVariant: ["tabular-nums"], letterSpacing: 0.8 },
  badgesRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  liveBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(239,68,68,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "rgba(239,68,68,0.3)" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#EF4444", marginRight: 6 },
  liveText: { color: "#EF4444", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  weekendModeBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(129,140,248,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "rgba(129,140,248,0.3)" },
  weekendModeText: { color: "#818CF8", fontSize: 9, fontWeight: "800", letterSpacing: 1 },

  scrollContent: { paddingHorizontal: 14, paddingBottom: 32, gap: 14 },

  panel: { borderRadius: 20, backgroundColor: "#161F30", overflow: "hidden", borderWidth: 1, borderColor: "#1E2D42" },
  panelHeader: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  directionBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  panelTitle: { fontSize: 19, fontWeight: "800", color: "#F1F5F9", letterSpacing: -0.3 },
  cardList: { padding: 10, gap: 8 },
  noTrainBox: { paddingVertical: 18, alignItems: "center" },
  noTrainText: { color: "#475569", fontSize: 13 },

  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#1C2840", borderRadius: 14, paddingVertical: 13, paddingHorizontal: 13, borderWidth: 1, borderColor: "#253350", gap: 11 },
  iconBox: { width: 38, height: 38, borderRadius: 10, borderWidth: 1.5, backgroundColor: "#0F1825", alignItems: "center", justifyContent: "center" },
  cardMiddle: { flex: 1 },
  destinationText: { fontSize: 15, fontWeight: "600", color: "#CBD5E1" },
  departureTime: { fontSize: 11, color: "#475569", marginTop: 1, fontVariant: ["tabular-nums"] },
  cardRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  weekendBadge: { backgroundColor: "rgba(129,140,248,0.2)", borderWidth: 1, borderColor: "rgba(129,140,248,0.4)", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  weekendBadgeText: { color: "#818CF8", fontSize: 9, fontWeight: "800" },
  countdownText: { fontSize: 14, fontWeight: "700", color: "#94A3B8" },
  countdownFirst: { color: "#E2E8F0" },
  imminentBadge: { backgroundColor: "#22C55E", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 },
  imminentText: { fontSize: 12, fontWeight: "800", color: "#fff" },

  emptyBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: "#334155", marginTop: 8 },
  emptySubtitle: { fontSize: 14, color: "#475569", textAlign: "center", lineHeight: 21 },
  selectBtn: { marginTop: 8, backgroundColor: "#3B82F6", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14 },
  selectBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  legend: { paddingHorizontal: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 7 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: "#475569", fontSize: 11 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalSheet: { backgroundColor: "#161F30", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingBottom: 34, maxHeight: "70%", borderTopWidth: 1, borderColor: "#1E2D42" },
  modalHandle: { width: 40, height: 4, backgroundColor: "#334155", borderRadius: 2, alignSelf: "center", marginVertical: 12 },
  modalTitle: { fontSize: 17, fontWeight: "800", color: "#F1F5F9", marginBottom: 12, marginLeft: 4 },
  modalItem: { flexDirection: "row", alignItems: "center", paddingVertical: 13, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4, gap: 10, backgroundColor: "#1C2840", borderWidth: 1, borderColor: "#1E2D42" },
  modalItemSelected: { borderColor: "#38BDF8", backgroundColor: "#0F2140" },
  modalItemText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#94A3B8" },
  modalItemTextSelected: { color: "#F1F5F9" },
});