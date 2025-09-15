import React from "react";
import { View, Text, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import BottomTimer from "../../components/BottomTimer";

export default function Home() {
  const today = dayjs().format("YYYY-MM-DD");

  const onDayPress = (d: { dateString: string }) => {
    if (d.dateString === today) {
      Alert.alert("Log do dia", "Abrir tela de log do treino de hoje");
    } else {
      Alert.alert("Dia passado", "Você pode visualizar o histórico desse dia.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={{ [today]: { selected: true } }}
        onDayPress={onDayPress}
      />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Hoje: {today}</Text>
        {/* database connection */}
      </View>
      <BottomTimer />
    </View>
  );
}
