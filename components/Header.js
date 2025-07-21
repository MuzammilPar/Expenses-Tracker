import { View, StyleSheet } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

const Header = ({ title, rightAction }) => {
  const theme = useTheme()

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.elevation.level2 }]}>
      <View style={styles.titleContainer}>
        <Ionicons name="wallet-outline" size={24} color={theme.colors.primary} style={styles.icon} />
        <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
      </View>

      <View style={styles.actions}>{rightAction}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    elevation: 2,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
  },
})

export default Header
