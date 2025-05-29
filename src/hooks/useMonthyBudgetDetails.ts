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
    } = selectedMonthlyBudget;

    const netSalary = grossSalary - deductions - fixedExpenses;

    let reserveAmount = 0;
    if (reserveType === ReserveType.percentage) {
      reserveAmount = grossSalary * (reserveValue / 100);
    } else {
      reserveAmount = reserveValue;
    }

    const monthlySpendingLimit = netSalary - reserveAmount;

    const dailySpendingLimit =
      monthlySpendingLimit / moment(monthYear, "MM/YYYY").daysInMonth();

    const totalSpending = daysReport.reduce((total, dayReport) => {
      const dailyTotal = dayReport.dailyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      return total + dailyTotal;
    }, 0);

    const totalAvaliableToSpend = monthlySpendingLimit - totalSpending

    const averageDailySpending = totalSpending / moment(selectedMonthlyBudget.monthYear,"MM/YYYY").daysInMonth()

    setDetails({
      netSalary,
      reserveAmount,
      monthlySpendingLimit,
      dailySpendingLimit,
      totalAvaliableToSpend,
      totalSpending,
      averageDailySpending,
    });
  }, [selectedMonthlyBudget]);

  return details;
}
