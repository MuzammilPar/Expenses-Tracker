"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert, Platform, StatusBar, Dimensions, TextInput } from "react-native"
import { Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useExpense } from "../context/ExpenseContext"
import ExpenseModal from "../components/ExpenseModal"

const { width } = Dimensions.get("window")

const ExpensesScreen = ({ navigation }) => {
  const { expenses, addExpense, updateExpense, deleteExpense, formatPKR, formatDate, getRecentExpenses } = useExpense()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const recentExpenses = getRecentExpenses(20) // Get last 20 expenses

  const handleAddExpense = () => {
    setEditingExpense(null)
    setModalVisible(true)
  }

  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setModalVisible(true)
  }

  const handleDeleteExpense = (id) => {
    Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteExpense(id),
        style: "destructive",
      },
    ])
  }

  const handleSaveExpense = (expense) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expense)
    } else {
      addExpense(expense)
    }
    setModalVisible(false)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "food",
      Transportation: "car",
      Entertainment: "gamepad-variant",
      Shopping: "shopping",
      Bills: "receipt",
      Healthcare: "medical-bag",
      Education: "school",
      Other: "dots-horizontal",
    }
    return icons[category] || "cash"
  }

  const getCategoryColor = (category) => {
    const colors = {
      Food: "#10B981",
      Transportation: "#3B82F6",
      Entertainment: "#8B5CF6",
      Shopping: "#F59E0B",
      Bills: "#EF4444",
      Healthcare: "#06B6D4",
      Education: "#84CC16",
      Other: "#6B7280",
    }
    return colors[category] || "#6B7280"
  }

  const filteredExpenses = recentExpenses.filter((expense) => {
    if (!searchQuery) return true
    const description = expense.description || ""
    const category = expense.category || ""
    return (
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const renderExpenseItem = (expense) => {
    const categoryColor = getCategoryColor(expense.category)

    return (
      <View key={expense.id} style={styles.expenseCard}>
        <View style={styles.expenseContent}>
          <View style={styles.expenseHeader}>
            <View style={styles.expenseLeft}>
              <View style={[styles.categoryIcon, { backgroundColor: `${categoryColor}15` }]}>
                <Icon name={getCategoryIcon(expense.category)} size={20} color={categoryColor} />
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDescription} numberOfLines={1}>
                  {expense.description || "No description"}
                </Text>
                <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
              </View>
            </View>
            <View style={styles.expenseRight}>
              <Text style={[styles.expenseAmount, { color: categoryColor }]}>{formatPKR(expense.amount)}</Text>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => {
                  Alert.alert("Expense Options", "Choose an action", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Edit", onPress: () => handleEditExpense(expense) },
                    { text: "Delete", onPress: () => handleDeleteExpense(expense.id), style: "destructive" },
                  ])
                }}
              >
                <Icon name="dots-vertical" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.expenseFooter}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}10` }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>{expense.category}</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Icon name="credit-card-outline" size={14} color="#6B7280" />
              <Text style={styles.paymentText}>{expense.paymentMethod || "Cash"}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

      {/* Header */}
      <LinearGradient colors={["#6366F1", "#8B5CF6", "#A855F7"]} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Expenses</Text>
                <Text style={styles.headerSubtitle}>Manage your spending</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <Icon name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{expenses.length}</Text>
                <Text style={styles.statLabel}>Total Expenses</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{filteredExpenses.length}</Text>
                <Text style={styles.statLabel}>Showing</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleAddExpense}>
            <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.quickActionGradient}>
              <Icon name="plus-circle" size={24} color="white" />
              <Text style={styles.quickActionText}>Add Expense</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate("MonthlyRecords")}>
            <LinearGradient colors={["#10B981", "#059669"]} style={styles.quickActionGradient}>
              <Icon name="chart-line" size={24} color="white" />
              <Text style={styles.quickActionText}>View Reports</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Expenses List */}
        <View style={styles.expensesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MonthlyRecords")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {filteredExpenses.length > 0 ? (
            <ScrollView style={styles.expensesList} showsVerticalScrollIndicator={false}>
              {filteredExpenses.map(renderExpenseItem)}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon name="receipt-outline" size={64} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>{searchQuery ? "No expenses found" : "No expenses yet"}</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Add your first expense to get started tracking your spending"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity style={styles.emptyActionButton} onPress={handleAddExpense}>
                  <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.emptyActionGradient}>
                    <Icon name="plus-circle" size={20} color="white" />
                    <Text style={styles.emptyActionText}>Add Your First Expense</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      <ExpenseModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSaveExpense}
        expense={editingExpense}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
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
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  content: {
    flex: 1,
    marginTop: -10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  quickActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  quickActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  expensesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  viewAllText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  expensesList: {
    flex: 1,
  },
  expenseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  expenseContent: {
    padding: 16,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  expenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  expenseDate: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  expenseRight: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  moreButton: {
    padding: 4,
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  emptyActionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  emptyActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyActionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
})

export default ExpensesScreen
