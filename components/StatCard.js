import { View, StyleSheet } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

const StatCard = ({ title, value, icon, footer, valueColor }) => {
  const theme = useTheme()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline || "rgba(0,0,0,0.1)",
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        <Ionicons name={icon} size={14} color={theme.colors.onSurface} /> {title}
      </Text>
      <Text style={[styles.value, { color: valueColor || theme.colors.onSurface }]}>{value}</Text>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: "1%",
    borderWidth: 1,
    elevation: 1,
  },
  title: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.8,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 8,
  },
})

export default StatCard
