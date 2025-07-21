"use client"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ExpenseContext = createContext()

export const useExpense = () => useContext(ExpenseContext)

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([])
  const [monthlyData, setMonthlyData] = useState({})
  const [salary, setSalary] = useState(0)
  const [savingsGoal, setSavingsGoal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const expensesData = await AsyncStorage.getItem("expenses")
        const monthlyDataJson = await AsyncStorage.getItem("monthlyData")
        const salaryValue = await AsyncStorage.getItem("salary")
        const savingsGoalValue = await AsyncStorage.getItem("savingsGoal")

        if (expensesData) setExpenses(JSON.parse(expensesData))
        if (monthlyDataJson) setMonthlyData(JSON.parse(monthlyDataJson))
        if (salaryValue) setSalary(Number.parseFloat(salaryValue))
        if (savingsGoalValue) setSavingsGoal(Number.parseFloat(savingsGoalValue))
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("expenses", JSON.stringify(expenses))
        await AsyncStorage.setItem("monthlyData", JSON.stringify(monthlyData))
        await AsyncStorage.setItem("salary", salary.toString())
        await AsyncStorage.setItem("savingsGoal", savingsGoal.toString())
      } catch (error) {
        console.error("Error saving data:", error)
      }
    }

    if (!isLoading) {
      saveData()
    }
  }, [expenses, monthlyData, salary, savingsGoal, isLoading])

  useEffect(() => {
    if (!isLoading) {
      updateMonthlyData()
    }
  }, [expenses, salary, savingsGoal, isLoading])

  const getCurrentMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
  }

  const getDaysInCurrentMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  }

  const getDaysPassedInMonth = () => new Date().getDate()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const formatMonthYear = (monthYear) => {
    const [year, month] = monthYear.split("-")
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  const formatPKR = (value) => `Rs. ${Math.round(value).toLocaleString("en-PK")}`

  const calculateDailyBudget = () => {
    const daysInMonth = getDaysInCurrentMonth()
    return salary > 0 ? Math.floor(salary / daysInMonth) : 0
  }

  const calculateCurrentMonthExpenses = () => {
    const currentMonth = getCurrentMonth()
    return expenses.filter((e) => e.date.startsWith(currentMonth)).reduce((acc, item) => acc + item.amount, 0)
  }

  const calculateSavings = () => salary - calculateCurrentMonthExpenses()

  const calculateAvgDailyExpense = () => {
    const currentMonth = getCurrentMonth()
    const currentMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))
    const total = currentMonthExpenses.reduce((acc, item) => acc + item.amount, 0)
    const daysPassed = getDaysPassedInMonth()
    return currentMonthExpenses.length > 0 ? total / daysPassed : 0
  }

  const calculateSavingsProgress = () => {
    const currentSavings = calculateSavings()
    return savingsGoal > 0 ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0
  }

  const calculateRemainingToSave = () => {
    const currentSavings = calculateSavings()
    return Math.max(savingsGoal - currentSavings, 0)
  }

  const updateMonthlyData = () => {
    const currentMonth = getCurrentMonth()
    const currentMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth))
    const totalExpenses = currentMonthExpenses.reduce((acc, item) => acc + item.amount, 0)
    const savings = salary - totalExpenses
    const categories = {}

    currentMonthExpenses.forEach((e) => {
      categories[e.category] = (categories[e.category] || 0) + e.amount
    })

    const topCategory =
      Object.keys(categories).length > 0
        ? Object.keys(categories).reduce((a, b) => (categories[a] > categories[b] ? a : b))
        : "None"

    setMonthlyData((prev) => ({
      ...prev,
      [currentMonth]: {
        expenses: totalExpenses,
        savings,
        goalAchievement: savingsGoal > 0 ? Math.min((savings / savingsGoal) * 100, 100) : 0,
        topCategory,
        salary,
        expenseCount: currentMonthExpenses.length,
      },
    }))
  }

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
    return newExpense
  }

  const updateExpense = (id, updatedExpense) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense, lastModified: new Date().toISOString() } : expense,
      ),
    )
  }

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const clearAllData = async () => {
    try {
      setExpenses([])
      setMonthlyData({})
      setSalary(0)
      setSavingsGoal(0)
      await AsyncStorage.multiRemove(["expenses", "monthlyData", "salary", "savingsGoal"])
    } catch (error) {
      console.error("Error clearing data:", error)
    }
  }

  const getCategoryTotals = (month = null) => {
    const targetMonth = month || getCurrentMonth()
    const monthExpenses = expenses.filter((e) => e.date.startsWith(targetMonth))
    const categories = {}

    monthExpenses.forEach((e) => {
      categories[e.category] = (categories[e.category] || 0) + e.amount
    })

    return categories
  }

  const getPaymentMethodTotals = (month = null) => {
    const targetMonth = month || getCurrentMonth()
    const monthExpenses = expenses.filter((e) => e.date.startsWith(targetMonth))
    const paymentMethods = {}

    monthExpenses.forEach((e) => {
      const method = e.paymentMethod || "Cash"
      paymentMethods[method] = (paymentMethods[method] || 0) + e.amount
    })

    return paymentMethods
  }

  const getMonthlyTrendsData = () => {
    const months = Object.keys(monthlyData).sort()
    const expensesData = months.map((month) => monthlyData[month]?.expenses || 0)
    const savingsData = months.map((month) => monthlyData[month]?.savings || 0)

    return {
      months: months.map((month) => formatMonthYear(month)),
      expensesData,
      savingsData,
    }
  }

  const getAllMonthsData = () => {
    const months = Object.keys(monthlyData).sort().reverse()
    return months.map((month) => ({
      month,
      formattedMonth: formatMonthYear(month),
      expenses: monthlyData[month]?.expenses || 0,
      savings: monthlyData[month]?.savings || 0,
      salary: monthlyData[month]?.salary || salary,
      goalAchievement: monthlyData[month]?.goalAchievement || 0,
      topCategory: monthlyData[month]?.topCategory || "None",
      expenseCount: monthlyData[month]?.expenseCount || 0,
    }))
  }

  const getExpensesForMonth = (month) => {
    return expenses.filter((e) => e.date.startsWith(month))
  }

  const getMonthSummary = (month) => {
    const monthExpenses = getExpensesForMonth(month)
    const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const monthSalary = monthlyData[month]?.salary || salary
    const savings = monthSalary - totalExpenses
    const goalAchievement = savingsGoal > 0 ? Math.min((savings / savingsGoal) * 100, 100) : 0

    return {
      totalExpenses,
      savings,
      goalAchievement,
      expenseCount: monthExpenses.length,
      salary: monthSalary,
      avgDailyExpense: monthExpenses.length > 0 ? totalExpenses / 30 : 0, // Approximate
    }
  }

  const getExpensesByCategory = (month = null) => {
    const targetMonth = month || getCurrentMonth()
    const monthExpenses = getExpensesForMonth(targetMonth)
    const categories = {}

    monthExpenses.forEach((expense) => {
      if (!categories[expense.category]) {
        categories[expense.category] = []
      }
      categories[expense.category].push(expense)
    })

    return categories
  }

  const getTopExpenses = (month = null, limit = 5) => {
    const targetMonth = month || getCurrentMonth()
    const monthExpenses = getExpensesForMonth(targetMonth)
    return monthExpenses.sort((a, b) => b.amount - a.amount).slice(0, limit)
  }

  const getRecentExpenses = (limit = 10) => {
    return expenses.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)).slice(0, limit)
  }

  const searchExpenses = (query, month = null) => {
    const searchExpenses = month ? getExpensesForMonth(month) : expenses

    return searchExpenses.filter(
      (expense) =>
        expense.description?.toLowerCase().includes(query.toLowerCase()) ||
        expense.category?.toLowerCase().includes(query.toLowerCase()) ||
        expense.paymentMethod?.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const getExpenseStats = () => {
    const currentMonth = getCurrentMonth()
    const currentMonthExpenses = getExpensesForMonth(currentMonth)
    const totalExpenses = calculateCurrentMonthExpenses()
    const avgDailyExpense = calculateAvgDailyExpense()
    const dailyBudget = calculateDailyBudget()
    const savings = calculateSavings()
    const savingsProgress = calculateSavingsProgress()

    return {
      totalExpenses,
      avgDailyExpense,
      dailyBudget,
      savings,
      savingsProgress,
      expenseCount: currentMonthExpenses.length,
      remainingBudget: salary - totalExpenses,
      daysLeft: getDaysInCurrentMonth() - getDaysPassedInMonth(),
    }
  }

  const value = {
    // State
    expenses,
    monthlyData,
    salary,
    savingsGoal,
    isLoading,

    // Setters
    setSalary,
    setSavingsGoal,

    // CRUD Operations
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllData,

    // Formatters
    formatPKR,
    formatDate,
    formatMonthYear,

    // Calculations
    calculateDailyBudget,
    calculateCurrentMonthExpenses,
    calculateSavings,
    calculateAvgDailyExpense,
    calculateSavingsProgress,
    calculateRemainingToSave,

    // Data Getters
    getCategoryTotals,
    getPaymentMethodTotals,
    getMonthlyTrendsData,
    getCurrentMonth,
    getAllMonthsData,
    getExpensesForMonth,
    getMonthSummary,
    getExpensesByCategory,
    getTopExpenses,
    getRecentExpenses,
    searchExpenses,
    getExpenseStats,

    // Utility
    getDaysInCurrentMonth,
    getDaysPassedInMonth,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}
