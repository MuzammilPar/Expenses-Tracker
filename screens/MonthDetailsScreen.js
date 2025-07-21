"use client"

import { useState, useMemo } from "react"
import { View, Text, StyleSheet, FlatList, Platform, StatusBar, TextInput } from "react-native"
import { useExpense } from "../context/ExpenseContext"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { TouchableOpacity } from "react-native-gesture-handler"

const MonthDetailsScreen = ({ route, navigation }) => {
  const { month } = route.params
  const { getExpensesForMonth, formatPKR, formatDate, formatMonthYear, getMonthSummary, getCategoryTotals } =
    useExpense()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("date") // date, amount, category
  const [sortOrder, setSortOrder] = useState("desc") // asc, desc

  const expenses = getExpensesForMonth(month)
  const monthSummary = getMonthSummary(month)
  const categoryTotals = getCategoryTotals(month)

  const categories = ["All", ...Object.keys(categoryTotals)]

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

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((expense) => {
        const description = expense.description || ""
        const category = expense.category || ""
        return (
          description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((expense) => expense.category === selectedCategory)
    }

    // Sort expenses
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "amount":
          comparison = (a.amount || 0) - (b.amount || 0)
          break
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "")
          break
        case "date":
        default:
          comparison = new Date(a.date || 0) - new Date(b.date || 0)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [expenses, searchQuery, selectedCategory, sortBy, sortOrder])

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const renderExpenseItem = ({ item }) => {
    const categoryColor = getCategoryColor(item.category)

    return (
      <View style={styles.expenseCard}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.leftSection}>
              <View style={[styles.categoryIcon, { backgroundColor: `${categoryColor}15` }]}>
                <Icon name={getCategoryIcon(item.category)} size={20} color={categoryColor} />
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.description} numberOfLines={1}>
                  {item.description || "No description"}
                </Text>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <Text style={[styles.amount, { color: categoryColor }]}>{formatPKR(item.amount || 0)}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}10` }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>{item.category || "Other"}</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Icon name="credit-card-outline" size={14} color="#666" />
              <Text style={styles.paymentText}>{item.paymentMethod || "Cash"}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderCategoryFilter = ({ item }) => {
    const isSelected = selectedCategory === item
    const categoryColor = item === "All" ? "#6366F1" : getCategoryColor(item)

    return (
      <TouchableOpacity
        style={[
          styles.categoryFilterItem,
          isSelected && { backgroundColor: `${categoryColor}15`, borderColor: categoryColor },
        ]}
        onPress={() => setSelectedCategory(item)}
      >
        {item !== "All" && (
          <Icon
            name={getCategoryIcon(item)}
            size={16}
            color={isSelected ? categoryColor : "#666"}
            style={styles.categoryFilterIcon}
          />
        )}
        <Text style={[styles.categoryFilterText, isSelected && { color: categoryColor, fontWeight: "600" }]}>
          {item}
        </Text>
        {item !== "All" && categoryTotals[item] && (
          <Text style={[styles.categoryCount, { color: categoryColor }]}>
            {expenses.filter((e) => e.category === item).length}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  const isSavingsPositive = monthSummary.savings >= 0

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.monthTitle}>{formatMonthYear(month)}</Text>
          <Text style={styles.expenseCount}>
            {filteredAndSortedExpenses.length} of {expenses.length} expenses
          </Text>
        </View>

        <TouchableOpacity style={styles.headerAction}>
          <Icon name="chart-line" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={[styles.summaryValue, { color: "#EF4444" }]}>{formatPKR(monthSummary.totalExpenses)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Savings</Text>
            <Text style={[styles.summaryValue, { color: isSavingsPositive ? "#10B981" : "#EF4444" }]}>
              {formatPKR(monthSummary.savings)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Daily Average</Text>
            <Text style={[styles.summaryValue, { color: "#6366F1" }]}>{formatPKR(monthSummary.avgDailyExpense)}</Text>
          </View>
        </View>
      </View>

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

      {/* Category Filters */}
      {categories.length > 1 && (
        <View style={styles.filtersContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryFilter}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilters}
          />
        </View>
      )}

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "date" && styles.sortButtonActive]}
            onPress={() => toggleSort("date")}
          >
            <Text style={[styles.sortButtonText, sortBy === "date" && styles.sortButtonTextActive]}>
              Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "amount" && styles.sortButtonActive]}
            onPress={() => toggleSort("amount")}
          >
            <Text style={[styles.sortButtonText, sortBy === "amount" && styles.sortButtonTextActive]}>
              Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "category" && styles.sortButtonActive]}
            onPress={() => toggleSort("category")}
          >
            <Text style={[styles.sortButtonText, sortBy === "category" && styles.sortButtonTextActive]}>
              Category {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expenses List */}
      <View style={styles.expensesContainer}>
        {filteredAndSortedExpenses.length > 0 ? (
          <FlatList
            data={filteredAndSortedExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.expensesList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="inbox-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No expenses found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "No expenses recorded for this month"}
            </Text>
            {(searchQuery || selectedCategory !== "All") && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  expenseCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#1F2937",
  },
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  categoryFilters: {
    paddingHorizontal: 20,
  },
  categoryFilterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryFilterIcon: {
    marginRight: 6,
  },
  categoryFilterText: {
    fontSize: 14,
    color: "#6B7280",
  },
  categoryCount: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "600",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sortLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginRight: 12,
  },
  sortOptions: {
    flexDirection: "row",
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  sortButtonActive: {
    backgroundColor: "#6366F1",
  },
  sortButtonText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  sortButtonTextActive: {
    color: "#FFFFFF",
  },
  expensesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  expensesList: {
    paddingVertical: 16,
  },
  expenseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardFooter: {
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
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  clearFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#6366F1",
    borderRadius: 8,
  },
  clearFiltersText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default MonthDetailsScreen
