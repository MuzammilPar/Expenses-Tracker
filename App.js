import 'react-native-gesture-handler';
import { useState, useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper"
import { View, StyleSheet } from "react-native"
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import DashboardScreen from "./screens/DashboardScreen"
import ExpensesScreen from "./screens/ExpensesScreen"
import AnalyticsScreen from "./screens/AnalyticsScreen"
import SettingsScreen from "./screens/SettingsScreen"
import MonthlyRecordsScreen from "./screens/MonthlyRecordsScreen"
import MonthDetailsScreen from "./screens/MonthDetailsScreen"

import { ExpenseProvider } from "./context/ExpenseContext"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Custom theme extensions
const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366F1',
    secondary: '#8B5CF6',
    tertiary: '#A855F7',
  }
}

const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8B5CF6',
    secondary: '#A855F7',
    tertiary: '#C084FC',
  }
}

const AnalyticsStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      <Stack.Screen name="AnalyticsMain" component={AnalyticsScreen} />
      <Stack.Screen name="MonthlyRecords" component={MonthlyRecordsScreen} />
      <Stack.Screen name="MonthDetails" component={MonthDetailsScreen} />
    </Stack.Navigator>
  )
}

const ExpensesStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      <Stack.Screen name="ExpensesMain" component={ExpensesScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setIsReady(true)
      }
    }

    loadInitialData()
  }, [])

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <StatusBar style="auto" />
        </View>
      </GestureHandlerRootView>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={isDarkMode ? CustomDarkTheme : CustomLightTheme}>
          <ExpenseProvider>
            <AppContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ExpenseProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

function AppContent({ isDarkMode, setIsDarkMode }) {
  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === "Dashboard") {
              iconName = focused ? "home" : "home-outline"
            } else if (route.name === "Expenses") {
              iconName = focused ? "list" : "list-outline"
            } else if (route.name === "Analytics") {
              iconName = focused ? "analytics" : "analytics-outline"
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline"
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: isDarkMode ? '#A855F7' : '#6366F1',
          tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 4,
          },
          tabBarItemStyle: {
            borderRadius: 10,
            marginHorizontal: 6,
            marginVertical: 4,
          },
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ 
            tabBarLabel: 'Dashboard',
          }} 
        />
        <Tab.Screen 
          name="Expenses" 
          component={ExpensesStack} 
          options={{ 
            tabBarLabel: 'Expenses',
          }} 
        />
        <Tab.Screen 
          name="Analytics" 
          component={AnalyticsStack} 
          options={{ 
            tabBarLabel: 'Analytics',
          }} 
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ 
            tabBarLabel: 'Settings',
          }} 
          initialParams={{ isDarkMode, setIsDarkMode }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
})