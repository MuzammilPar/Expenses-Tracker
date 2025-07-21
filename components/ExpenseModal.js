import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  HelperText,
  useTheme,
} from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import DropdownSelect from "./DropdownSelect"

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Bills & Utilities",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Groceries",
  "Personal Care",
  "Other",
]

const PAYMENT_METHODS = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Mobile Payment",
  "Online Payment",
]

const ExpenseModal = ({ visible, onDismiss, onSave, expense }) => {
  const theme = useTheme()

  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [date, setDate] = useState(new Date())
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0])
  const [notes, setNotes] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString())
      setCategory(expense.category)
      setDate(new Date(expense.date))
      setPaymentMethod(expense.paymentMethod || PAYMENT_METHODS[0])
      setNotes(expense.notes || "")
    } else {
      resetForm()
    }
  }, [expense, visible])

  const resetForm = () => {
    setAmount("")
    setCategory(CATEGORIES[0])
    setDate(new Date())
    setPaymentMethod(PAYMENT_METHODS[0])
    setNotes("")
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatDate = (date) => {
    const months = [
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
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const formatDateForStorage = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSave = () => {
    if (!validateForm()) return

    const expenseData = {
      amount: parseFloat(amount),
      category,
      date: formatDateForStorage(date),
      paymentMethod,
      notes: notes.trim(),
    }

    onSave(expenseData)
    resetForm()
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          {expense ? "Edit Expense" : "Add New Expense"}
        </Text>

        <ScrollView style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>
              <Ionicons
                name="cash-outline"
                size={16}
                color={theme.colors.onBackground}
              />{" "}
              Amount (PKR)
            </Text>
            <TextInput
              mode="outlined"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              error={!!errors.amount}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              style={styles.input}
            />
            {errors.amount && <HelperText type="error">{errors.amount}</HelperText>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>
              <Ionicons
                name="pricetag-outline"
                size={16}
                color={theme.colors.onBackground}
              />{" "}
              Category
            </Text>
            <DropdownSelect
              value={category}
              onValueChange={setCategory}
              items={CATEGORIES}
              theme={theme}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.colors.onBackground}
              />{" "}
              Date
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              icon="calendar"
            >
              {formatDate(date)}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>
              <Ionicons
                name="card-outline"
                size={16}
                color={theme.colors.onBackground}
              />{" "}
              Payment Method
            </Text>
            <DropdownSelect
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              items={PAYMENT_METHODS}
              theme={theme}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>
              <Ionicons
                name="create-outline"
                size={16}
                color={theme.colors.onBackground}
              />{" "}
              Notes (Optional)
            </Text>
            <TextInput
              mode="outlined"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional details..."
              multiline
              numberOfLines={3}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              style={styles.textArea}
            />
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <Button mode="contained" onPress={handleSave} style={styles.saveButton} icon="check">
            Save
          </Button>
          <Button mode="outlined" onPress={onDismiss} style={styles.cancelButton}>
            Cancel
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 8,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  form: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "transparent",
    height: 50,
  },
  textArea: {
    backgroundColor: "transparent",
    minHeight: 80,
  },
  dateButton: {
    height: 50,
    justifyContent: "center",
  },
  actions: {
    flexDirection: "column",
    gap: 8,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 8,
  },
})

export default ExpenseModal
