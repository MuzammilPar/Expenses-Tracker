import { View, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const ProgressBar = ({ progress, color, height = 8 }) => {
  const theme = useTheme()
  const barColor = color || theme.colors.primary

  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
  },
})

export default ProgressBar
