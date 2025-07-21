"use client"

import React, { useState } from "react"
import { View, ScrollView, StyleSheet, Dimensions, Platform, StatusBar, Animated } from "react-native"
import { Card, useTheme, Text, Title } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { PieChart, LineChart, BarChart } from "react-native-chart-kit"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useExpense } from "../context/ExpenseContext"

const { width, height } = Dimensions.get("window")
const HEADER_HEIGHT = height * 0.3

const AnalyticsScreen = ({ navigation }) => {
  const theme = useTheme()
  const scrollY = React.useRef(new Animated.Value(0)).current
  const {
    getCategoryTotals,
    getPaymentMethodTotals,
    getMonthlyTrendsData,
    expenses,
    formatPKR,
    getExpenseStats,
  } = useExpense()

  const categoryTotals = getCategoryTotals()
  const paymentMethodTotals = getPaymentMethodTotals()
  const monthlyTrends = getMonthlyTrendsData()
  const expenseStats = getExpenseStats()

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  })

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT * 0.3],
    extrapolate: "clamp",
  })

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#6366F1",
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#E5E7EB",
    },
  }

  const categoryData = Object.keys(categoryTotals).map((category, index) => {
    const colors = [
      "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444",
      "#06B6D4", "#84CC16", "#EC4899", "#6B7280", "#F97316"
    ]
    return {
      name: category,
      amount: categoryTotals[category],
      color: colors[index % colors.length],
      legendFontColor: "#374151",
      legendFontSize: 12,
    }
  })

  const paymentData = {
    labels: Object.keys(paymentMethodTotals),
    datasets: [
      {
        data: Object.values(paymentMethodTotals),
        colors: Object.keys(paymentMethodTotals).map((_, i) => 
          (opacity = 1) => `rgba(59, 130, 246, ${opacity})`
        ),
        strokeWidth: 2,
      },
    ],
  }

  const monthlyData = {
    labels: monthlyTrends.months.slice(-6).map((month) => {
      const parts = month.split(' ')
      return parts[0].substring(0, 3)
    }),
    datasets: [
      {
        data: monthlyTrends.expensesData.slice(-6),
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: monthlyTrends.savingsData.slice(-6),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
    ],
    legend: ["Expenses", "Savings"],
  }

  const StatCard = ({ title, value, icon, color = "#6366F1" }) => (
    <View style={[styles.statCard, { backgroundColor: color === "white" ? "rgba(255,255,255,0.15)" : "white" }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: color === "white" ? "white" : "#1F2937" }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: color === "white" ? "rgba(255,255,255,0.8)" : "#6B7280" }]}>{title}</Text>
    </View>
  )

  const hasData = expenses.length > 0

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          style={styles.gradientHeader}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Title style={styles.screenTitle}>Analytics Dashboard</Title>
                <Text style={styles.headerSubtitle}>Insights into your spending patterns</Text>
              </View>
              <View style={styles.headerIcon}>
                <Icon name="chart-pie" size={32} color="white" />
              </View>
            </View>

            <View style={styles.statsGrid}>
              <StatCard
                title="Total Expenses"
                value={formatPKR(expenseStats.totalExpenses)}
                icon="credit-card-outline"
                color="white"
              />
              <StatCard
                title="Daily Average"
                value={formatPKR(expenseStats.avgDailyExpense)}
                icon="calendar-outline"
                color="white"
              />
              <StatCard
                title="Savings"
                value={formatPKR(expenseStats.savings)}
                icon="piggy-bank"
                color="white"
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ marginTop: HEADER_HEIGHT }}
      >
        {/* Content */}
        <View style={styles.contentContainer}>
          {hasData ? (
            <>
              {/* Category Breakdown */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={[styles.cardIcon, { backgroundColor: "#10B98120" }]}>
                     <Icon name="chart-pie" size={24} color="#10B981" />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Category Breakdown</Text>
                      <Text style={styles.cardSubtitle}>Spending by category</Text>
                    </View>
                  </View>
                </View>

                {categoryData.length > 0 ? (
                  <PieChart
                    data={categoryData}
                    width={width - 40}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                ) : (
                  <View style={styles.emptyChart}>
                    <Icon name="chart-pie-outline" size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>No category data available</Text>
                  </View>
                )}
              </View>

              {/* Monthly Trends */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={[styles.cardIcon, { backgroundColor: "#3B82F620" }]}>
                      <Icon name="trending-up" size={24} color="#3B82F6" />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Monthly Trends</Text>
                      <Text style={styles.cardSubtitle}>Last 6 months overview</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate("MonthlyRecords")}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Icon name="chevron-right" size={16} color="#6366F1" />
                  </TouchableOpacity>
                </View>

                {monthlyTrends.months.length > 0 ? (
                  <LineChart
                    data={monthlyData}
                    width={width - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    withVerticalLines={false}
                    withHorizontalLines={false}
                  />
                ) : (
                  <View style={styles.emptyChart}>
                    <Icon name="trending-up-outline" size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>No monthly data available</Text>
                  </View>
                )}
              </View>

              {/* Payment Methods */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <View style={[styles.cardIcon, { backgroundColor: "#8B5CF620" }]}>
                      <Icon name="credit-card" size={24} color="#8B5CF6" />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>Payment Methods</Text>
                      <Text style={styles.cardSubtitle}>Usage breakdown</Text>
                    </View>
                  </View>
                </View>

                {Object.keys(paymentMethodTotals).length > 0 ? (
                  <BarChart
                    data={paymentData}
                    width={width - 40}
                    height={220}
                    chartConfig={chartConfig}
                    verticalLabelRotation={30}
                    fromZero
                    showBarTops={false}
                  />
                ) : (
                  <View style={styles.emptyChart}>
                    <Icon name="credit-card-outline" size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>No payment data available</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon name="chart-box-outline" size={64} color="#0EA5E9" />
              </View>
              <Title style={styles.emptyTitle}>No Data to Analyze</Title>
              <Text style={styles.emptyDescription}>
                Start adding expenses to see beautiful analytics and insights about your spending patterns.
              </Text>
              <TouchableOpacity 
                style={styles.ctaButton} 
                onPress={() => navigation.navigate("Expenses")}
              >
                <Icon name="plus-circle" size={20} color="white" />
                <Text style={styles.ctaText}>Add Your First Expense</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 10,
  },
  gradientHeader: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  headerContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    padding: 12,
    borderRadius: 12,
    minHeight: 100,
    justifyContent: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitleSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
    marginRight: 4,
  },
  emptyChart: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    marginTop: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default AnalyticsScreen