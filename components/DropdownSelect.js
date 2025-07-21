import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, Menu, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

const DropdownSelect = ({ value, onValueChange, items }) => {
  const [visible, setVisible] = useState(false)
  const theme = useTheme() // ✅ Use paper theme directly

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const handleSelect = (item) => {
    onValueChange(item)
    closeMenu()
  }

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            style={[styles.button, { borderColor: theme.colors.outline ?? theme.colors.border }]}
            contentStyle={styles.buttonContent}
            icon={({ size, color }) => <Ionicons name="chevron-down" size={size} color={color} />}
            labelStyle={{ color: theme.colors.onSurface }}
          >
            {value}
          </Button>
        }
      >
        {items.map((item) => (
          <Menu.Item
            key={item}
            onPress={() => handleSelect(item)}
            title={item}
            titleStyle={{ color: theme.colors.onSurface }}
          />
        ))}
      </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    width: "100%",
    height: 50,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
})

export default DropdownSelect
