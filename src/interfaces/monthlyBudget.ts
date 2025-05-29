export interface MonthlyBudget {
	id?: string
	creatorID: string
	monthYear: string
	grossSalary: number
	deductions: number
	fixedExpenses: number
	extraValuesToSpend: number
	extraValuesToReserve: number
	reserveValue: number
	reserveType: ReserveType
	totalAccumulatedReserve: number
	daysReport: DayReport[]
	monthlyBudgetControlType: MonthlyBudgetType
	hasPreviousMonthBudget?: boolean
}

export enum MonthlyBudgetType {
	fixed,
	remainingDays
}

export enum ReserveType {
	percentage,
	amount
}

export interface DayReport {
	day: number
	budget: number
	dailyExpenses: DailyExpense[]
}

export interface DailyExpense {
	description?: string
	amount: number
}

export interface MonthlyBudgetDetailedValues {
	netSalary: number
	monthlySpendingLimit: number
	dailySpendingLimit: number
	reserveAmount: number
	totalAvaliableToSpend: number
	totalSpending: number
	averageDailySpending: number
}