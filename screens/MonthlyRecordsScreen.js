"use client"

import React from "react"
import { View, StyleSheet, Animated, Dimensions, Platform, StatusBar } from "react-native"
import { useExpense } from "../context/ExpenseContext"
import { Title, useTheme, Text } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity } from "react-native-gesture-handler"

const { width, height } = Dimensions.get("window")
const CARD_HEIGHT = 240
const HEADER_HEIGHT = height * 0.35
const CARD_MARGIN = 20
const CARD_WIDTH = width - CARD_MARGIN * 2

const MonthlyRecordsScreen = ({ navigation }) => {
  const { getAllMonthsData, formatPKR, formatMonthYear } = useExpense()
  const theme = useTheme()
  const scrollY = React.useRef(new Animated.Value(0)).current
  const monthsData = getAllMonthsData()

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  })

  const headerScale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  })

  const CircularProgress = ({ progress, size = 60, strokeWidth = 6, color = "#10B981" }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - progress * circumference

    return (
      <View style={{ width: size, height: size }}>
        <View style={styles.circularProgressContainer}>
          <View
            style={[
              styles.circularProgressBg,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: "#F3F4F6",
              },
            ]}
          />
          <View
            style={[
              styles.circularProgressFill,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                transform: [{ rotate: "-90deg" }],
              },
            ]}
          />
          <View style={styles.circularProgressCenter}>
            <Text style={[styles.progressPercentage, { color }]}>{Math.round(progress * 100)}%</Text>
          </View>
        </View>
      </View>
    )
  }

  const WaveBackground = () => (
    <View style={styles.waveContainer}>
      <View style={[styles.wave, styles.wave1]} />
      <View style={[styles.wave, styles.wave2]} />
      <View style={[styles.wave, styles.wave3]} />
    </View>
  )

  const renderItem = ({ item, index }) => {
    const inputRange = [-1, 0, CARD_HEIGHT * index, CARD_HEIGHT * (index + 2)]
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.95],
    })
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.6],
    })
    const translateY = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0, 0, 50],
    })

    const isSavingsPositive = item.savings >= 0
    const progress = Math.min(Math.max(item.goalAchievement / 100, 0), 1)
    const savingsColor = isSavingsPositive ? "#10B981" : "#EF4444"
    const expenseRatio = item.expenses / item.salary
    const savingsRatio = item.savings / item.salary
    const gradientColors = isSavingsPositive ? ["#ECFDF5", "#F0FDF4", "#FFFFFF"] : ["#FEF2F2", "#FEF2F2", "#FFFFFF"]

    return (
      <Animated.View
        key={item.month} // Add unique key here
        style={{
          transform: [{ scale }, { translateY }],
          opacity,
          marginBottom: CARD_MARGIN,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MonthDetails", { month: item.month })}
        >
          <View style={styles.cardShadow}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { height: CARD_HEIGHT }]}
            >
              {/* Decorative Elements */}
              <View
                style={[
                  styles.decorativeCircle,
                  styles.circle1,
                  {
                    backgroundColor: `${savingsColor}15`,
                  },
                ]}
              />
              <View
                style={[
                  styles.decorativeCircle,
                  styles.circle2,
                  {
                    backgroundColor: `${theme.colors.primary}10`,
                  },
                ]}
              />

              <View style={styles.cardContent}>
                {/* Header Section */}
                <View style={styles.cardHeader}>
                  <View style={styles.monthInfo}>
                    <Text style={[styles.monthTitle, { color: theme.colors.text }]}>{formatMonthYear(item.month)}</Text>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: savingsColor,
                        },
                      ]}
                    >
                      <Icon name={isSavingsPositive ? "trending-up" : "trending-down"} size={12} color="white" />
                    </View>
                  </View>
                  <View style={styles.salaryBadge}>
                    <Icon name="wallet" size={16} color="#6366F1" />
                    <Text style={styles.salaryAmount}>{formatPKR(item.salary)}</Text>
                  </View>
                </View>

                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <View style={[styles.metricIconContainer, { backgroundColor: "#FEE2E2" }]}>
                      <Icon name="credit-card-outline" size={20} color="#EF4444" />
                    </View>
                    <View style={styles.metricInfo}>
                      <Text style={styles.metricLabel}>Expenses</Text>
                      <Text style={[styles.metricValue, { color: "#EF4444" }]}>{formatPKR(item.expenses)}</Text>
                      <View style={styles.ratioBar}>
                        <View
                          style={[
                            styles.ratioFill,
                            {
                              width: `${Math.min(expenseRatio * 100, 100)}%`,
                              backgroundColor: "#EF4444",
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.metricCard}>
                    <View
                      style={[
                        styles.metricIconContainer,
                        {
                          backgroundColor: `${savingsColor}20`,
                        },
                      ]}
                    >
                      <Icon name={isSavingsPositive ? "piggy-bank" : "bank-remove"} size={20} color={savingsColor} />
                    </View>
                    <View style={styles.metricInfo}>
                      <Text style={styles.metricLabel}>Savings</Text>
                      <Text style={[styles.metricValue, { color: savingsColor }]}>{formatPKR(item.savings)}</Text>
                      <View style={styles.ratioBar}>
                        <View
                          style={[
                            styles.ratioFill,
                            {
                              width: `${Math.min(Math.abs(savingsRatio) * 100, 100)}%`,
                              backgroundColor: savingsColor,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Goal Progress Section */}
                <View style={styles.goalSection}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalLabel}>Monthly Goal Achievement</Text>
                    <Text style={[styles.goalPercentage, { color: savingsColor }]}>
                      {item.goalAchievement.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <CircularProgress progress={progress} color={savingsColor} size={50} strokeWidth={4} />
                    <View style={styles.actionButton}>
                      <Icon name="chevron-right" size={20} color={theme.colors.primary} />
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const totalSavings = monthsData.reduce((sum, month) => sum + month.savings, 0)
  const avgSavings = monthsData.length > 0 ? totalSavings / monthsData.length : 0
  const bestMonth = monthsData.reduce((best, current) => (current.savings > best.savings ? current : best), {
    savings: Number.NEGATIVE_INFINITY,
  })

  return (
    <View style={[styles.container, { backgroundColor: "#F8FAFC" }]}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <WaveBackground />
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <View>
                  <Title style={styles.screenTitle}>Financial Journey</Title>
                  <Text style={styles.headerSubtitle}>Your monthly expense tracking overview</Text>
                </View>
                <View style={styles.headerIcon}>
                  <Icon name="chart-line" size={32} color="white" />
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Icon name="calendar-month" size={24} color="white" />
                  <Text style={styles.statValue}>{monthsData.length}</Text>
                  <Text style={styles.statLabel}>Months</Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="piggy-bank" size={24} color="white" />
                  <Text style={styles.statValue}>{formatPKR(totalSavings)}</Text>
                  <Text style={styles.statLabel}>Total Saved</Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="trending-up" size={24} color="white" />
                  <Text style={styles.statValue}>{formatPKR(avgSavings)}</Text>
                  <Text style={styles.statLabel}>Avg/Month</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {monthsData.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Monthly Records</Text>
                <Text style={styles.sectionSubtitle}>Tap any card to view detailed breakdown</Text>
              </View>
              {/* Fixed: Added key prop to each rendered item */}
              {monthsData.map((item, index) => renderItem({ item, index }))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient colors={["#F0F9FF", "#E0F2FE"]} style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Icon name="chart-box-outline" size={64} color="#0EA5E9" />
                </View>
                <Title style={styles.emptyTitle}>Start Your Journey</Title>
                <Text style={styles.emptyText}>
                  Begin tracking your expenses to see beautiful monthly summaries and insights here.
                </Text>
                <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate("AddExpense")}>
                  <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.ctaGradient}>
                    <Icon name="plus-circle" size={20} color="white" />
                    <Text style={styles.ctaText}>Add Your First Expense</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  gradientHeader: {
    flex: 1,
    position: "relative",
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  wave1: {
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ scaleX: 1.5 }],
  },
  wave2: {
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
    transform: [{ scaleX: 1.2 }],
  },
  wave3: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  headerContent: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    justifyContent: "space-between",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginTop: 8,
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  contentContainer: {
    padding: CARD_MARGIN,
    marginTop: -30,
  },
  sectionHeader: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 50,
  },
  circle1: {
    width: 100,
    height: 100,
    top: -30,
    right: -30,
  },
  circle2: {
    width: 60,
    height: 60,
    bottom: -20,
    left: -20,
  },
  cardContent: {
    padding: 20,
    flex: 1,
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  monthInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginRight: 12,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  salaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  salaryAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
    marginLeft: 6,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 12,
    borderRadius: 12,
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  ratioBar: {
    height: 3,
    backgroundColor: "#F3F4F6",
    borderRadius: 2,
    overflow: "hidden",
  },
  ratioFill: {
    height: "100%",
    borderRadius: 2,
  },
  goalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 16,
    borderRadius: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  goalPercentage: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circularProgressContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgressBg: {
    position: "absolute",
  },
  circularProgressFill: {
    position: "absolute",
  },
  circularProgressCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  emptyState: {
    marginTop: 40,
  },
  emptyContainer: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
})

export default MonthlyRecordsScreen
