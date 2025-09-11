import moment from "moment";
import { useState, useEffect } from "react";
import { MonthlyBudget, MonthlyBudgetDetailedValues, ReserveType } from "@interfaces/monthlyBudget";

export function useBudgetDetails(selectedMonthlyBudget?: MonthlyBudget) {
  const [details, setDetails] = useState<MonthlyBudgetDetailedValues>({
    netSalary: 0,
    monthlySpendingLimit: 0,
    dailySpendingLimit: 0,
    reserveAmount: 0,
    totalAvaliableToSpend: 0,
    totalSpending: 0,
    averageDailySpending: 0,
    remainingDaysAverageSpending: 0
  });

  useEffect(() => {
    if (!selectedMonthlyBudget) return;

    const {
      grossSalary,
      deductions,
      fixedExpenses,
      reserveType,
      reserveValue,
      daysReport,
      monthYear,
      customDailySpendingLimit
    } = selectedMonthlyBudget;

    const netSalary = grossSalary - deductions - fixedExpenses;

    let reserveAmount = 0;
    if (reserveType === ReserveType.percentage) {
      reserveAmount = grossSalary * (reserveValue / 100);
    } else {
      reserveAmount = reserveValue;
    }

    const monthlySpendingLimit = netSalary - reserveAmount;

    const totalSpending = daysReport.reduce((total, dayReport) => {
      const dailyTotal = dayReport.dailyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      return total + dailyTotal;
    }, 0);

    const totalAvaliableToSpend = monthlySpendingLimit - totalSpending

    const dailySpendingLimit = customDailySpendingLimit > 0 ? customDailySpendingLimit :
      monthlySpendingLimit / moment(monthYear, "MM/YYYY").daysInMonth();

    const averageDailySpending = totalSpending / moment(selectedMonthlyBudget.monthYear, "MM/YYYY").daysInMonth()

    const today = moment();
    const endOfMonth = moment().endOf("month");
    const remaningDays = endOfMonth.diff(today, "days") + 1;

    const remainingDaysAverageSpending = totalAvaliableToSpend / remaningDays

    setDetails({
      netSalary,
      reserveAmount,
      monthlySpendingLimit,
      dailySpendingLimit,
      totalAvaliableToSpend,
      totalSpending,
      averageDailySpending,
      remainingDaysAverageSpending
    });
  }, [selectedMonthlyBudget]);

  return details;
}
