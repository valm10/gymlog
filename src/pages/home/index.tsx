import React from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const today = new Date().toISOString().split("T")[0];

  const onDayPress = (d: { dateString: string }) => {
    if (d.dateString === today) {
      navigation.navigate("LogToday" as never);
    } else {
      Alert.alert("Dia passado", "Você pode visualizar o histórico desse dia.");
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={{
          [today]: { selected: true, selectedColor: "orange" },
        }}
        onDayPress={onDayPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
