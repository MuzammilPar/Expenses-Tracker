import { useState } from "react"
import { View, ScrollView, StyleSheet, Dimensions, Platform, StatusBar, TextInput } from "react-native"
import { Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useExpense } from "../context/ExpenseContext"
import StatCard from "../components/StatCard"
import ProgressBar from "../components/ProgressBar"

const { width } = Dimensions.get("window")
const HEADER_HEIGHT = 220

const DashboardScreen = ({ navigation }) => {
  const {
    salary,
    savingsGoal,
    setSalary,
    setSavingsGoal,
    formatPKR,
    calculateDailyBudget,
    calculateSavings,
    calculateSavingsProgress,
    calculateRemainingToSave,
    calculateCurrentMonthExpenses,
    calculateAvgDailyExpense,
  } = useExpense()

  const [salaryInput, setSalaryInput] = useState(salary.toString())
  const [savingsGoalInput, setSavingsGoalInput] = useState(savingsGoal.toString())

  const handleSalaryChange = (text) => {
    setSalaryInput(text)
    const value = Number.parseFloat(text) || 0
    setSalary(value)
  }

  const handleSavingsGoalChange = (text) => {
    setSavingsGoalInput(text)
    const value = Number.parseFloat(text) || 0
    setSavingsGoal(value)
  }

  const dailyBudget = calculateDailyBudget()
  const currentSavings = calculateSavings()
  const savingsProgress = calculateSavingsProgress()
  const remainingToSave = calculateRemainingToSave()
  const totalExpenses = calculateCurrentMonthExpenses()
  const avgDailyExpense = calculateAvgDailyExpense()

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

      {/* Header */}
      <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle} numberOfLines={1}>Dashboard</Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>Your financial overview</Text>
              </View>
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => navigation.navigate("Settings")}
              >
                <Icon name="cog" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue} numberOfLines={1}>{formatPKR(salary)}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>Monthly Salary</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue} numberOfLines={1}>{formatPKR(savingsGoal)}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>Savings Goal</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Cards */}
        <View style={styles.inputCards}>
          <LinearGradient 
            colors={["#10B981", "#059669"]} 
            style={[styles.inputCard, { marginRight: 8 }]}
          >
            <View style={styles.inputCardContent}>
              <Icon name="cash" size={24} color="white" />
              <Text style={styles.inputCardLabel}>Monthly Salary</Text>
              <TextInput
                style={styles.inputField}
                value={salaryInput}
                onChangeText={handleSalaryChange}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="rgba(255,255,255,0.7)"
                numberOfLines={1}
              />
            </View>
          </LinearGradient>

          <LinearGradient 
            colors={["#3B82F6", "#2563EB"]} 
            style={[styles.inputCard, { marginLeft: 8 }]}
          >
            <View style={styles.inputCardContent}>
              <Icon name="piggy-bank" size={24} color="white" />
              <Text style={styles.inputCardLabel}>Savings Goal</Text>
              <TextInput
                style={styles.inputField}
                value={savingsGoalInput}
                onChangeText={handleSavingsGoalChange}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="rgba(255,255,255,0.7)"
                numberOfLines={1}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Budget Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Daily Budget"
              value={formatPKR(dailyBudget)}
              icon="calendar"
              color="#8B5CF6"
              theme="dark"
            />
            <StatCard
              title="Current Savings"
              value={formatPKR(currentSavings)}
              icon="wallet"
              color={currentSavings >= 0 ? "#10B981" : "#EF4444"}
              theme="dark"
            />
          </View>
        </View>

        {/* Savings Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Savings Progress</Text>
            <Text style={styles.progressText}>
              {Math.round(savingsProgress)}% of goal
            </Text>
          </View>
          <ProgressBar
            progress={savingsProgress / 100}
            color={savingsProgress >= 100 ? "#10B981" : "#3B82F6"}
            height={12}
            style={styles.progressBar}
          />
          <View style={styles.savingsStats}>
            <View style={styles.savingsStat}>
              <Text style={styles.savingsStatLabel}>Goal</Text>
              <Text style={styles.savingsStatValue} numberOfLines={1}>{formatPKR(savingsGoal)}</Text>
            </View>
            <View style={styles.savingsStat}>
              <Text style={styles.savingsStatLabel}>Saved</Text>
              <Text style={styles.savingsStatValue} numberOfLines={1}>{formatPKR(currentSavings)}</Text>
            </View>
            <View style={styles.savingsStat}>
              <Text style={styles.savingsStatLabel}>Remaining</Text>
              <Text style={styles.savingsStatValue} numberOfLines={1}>{formatPKR(remainingToSave)}</Text>
            </View>
          </View>
        </View>

        {/* Expense Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Tracking</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="This Month"
              value={formatPKR(totalExpenses)}
              icon="receipt"
              color="#EF4444"
              theme="dark"
            />
            <StatCard
              title="Daily Average"
              value={formatPKR(avgDailyExpense)}
              icon="chart-line"
              color="#F59E0B"
              theme="dark"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate("Expenses")}
          >
            <LinearGradient 
              colors={["#6366F1", "#8B5CF6"]} 
              style={styles.quickActionGradient}
            >
              <Icon name="plus-circle" size={24} color="white" />
              <Text style={styles.quickActionText} numberOfLines={1}>Add Expense</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate("Analytics")}
          >
            <LinearGradient 
              colors={["#EC4899", "#DB2777"]} 
              style={styles.quickActionGradient}
            >
              <Icon name="chart-bar" size={24} color="white" />
              <Text style={styles.quickActionText} numberOfLines={1}>View Analytics</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: HEADER_HEIGHT,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    minWidth: 0, // Prevents overflow
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  inputCards: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  inputCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 140,
  },
  inputCardContent: {
    flex: 1,
  },
  inputCardLabel: {
    fontSize: 14,
    color: "white",
    marginTop: 8,
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  inputField: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    width: "100%",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  progressBar: {
    marginBottom: 16,
  },
  savingsStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  savingsStat: {
    alignItems: "center",
    flex: 1,
    minWidth: 0, // Prevents overflow
  },
  savingsStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    textAlign: "center",
  },
  savingsStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 16,

  },
  quickAction: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    
    
  },
  quickActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  quickActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    flexShrink: 1,
  },
})

export default DashboardScreen