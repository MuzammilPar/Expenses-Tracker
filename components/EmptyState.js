import { View, StyleSheet } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

const EmptyState = ({ icon, title, description }) => {
  const theme = useTheme() // ✅ Use Paper theme directly

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.colors.primary} style={styles.icon} />
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.colors.onSurface }]}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    opacity: 0.7,
  },
})

export default EmptyState
