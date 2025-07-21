import { ScrollView, StyleSheet, Alert, Share } from "react-native"
import { Card, Button, List, useTheme, Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useExpense } from "../context/ExpenseContext"
import Header from "../components/Header"

const SettingsScreen = () => {
  const theme = useTheme()
  const { clearAllData, expenses } = useExpense()

  const handleClearData = () => {
    Alert.alert("Clear All Data", "Are you sure you want to clear all data? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear Data",
        onPress: () => {
          clearAllData()
          Alert.alert("Success", "All data has been cleared.")
        },
        style: "destructive",
      },
    ])
  }

  const handleExportData = async () => {
    try {
      if (expenses.length === 0) {
        Alert.alert("No Data", "There are no expenses to export.")
        return
      }

      const headers = ["Date", "Category", "Amount (PKR)", "Payment Method", "Notes"]
      const csvRows = [
        headers.join(","),
        ...expenses.map((expense) =>
          [
            expense.date,
            `"${expense.category}"`,
            expense.amount,
            `"${expense.paymentMethod || "Cash"}"`,
            `"${(expense.notes || "").replace(/"/g, '""')}"`,
          ].join(","),
        ),
      ]
      const csvContent = csvRows.join("\n")

      await Share.share({
        title: `Expense Export - ${new Date().toLocaleDateString()}`,
        message: csvContent,
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      Alert.alert("Export Failed", "There was an error exporting your data.")
    }
  }

  const handleAbout = () => {
    Alert.alert(
      "About Expense Tracker",
      "Expense Tracker v1.0.0\n\nA simple app to track your expenses and savings goals.\n\nDeveloped with React Native.",
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Settings" />

      <ScrollView style={styles.scrollView}>
        {/* Data Management Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Title
            title="Data Management"
            left={() => <Ionicons name="server-outline" size={24} color={theme.colors.primary} />}
          />
          <Card.Content>
            <Button mode="outlined" onPress={handleExportData} style={styles.button} icon="export">
              Export Data as CSV
            </Button>

            <Button
              mode="outlined"
              onPress={handleClearData}
              style={styles.button}
              textColor={theme.colors.error} // ✅ ensures delete text is visible
              icon="delete"
            >
              Clear All Data
            </Button>
          </Card.Content>
        </Card>

        {/* App Info Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Title
            title="App Information"
            left={() => <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />}
          />
          <Card.Content>
            <List.Item
              title="About"
              description="App version and information"
              left={(props) => <List.Icon {...props} icon="information" />}
              onPress={handleAbout}
            />

            <List.Item
              title="Storage Used"
              description={`${expenses.length} expenses stored`}
              left={(props) => <List.Icon {...props} icon="database" />}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  button: {
    marginVertical: 8,
  },
})

export default SettingsScreen
