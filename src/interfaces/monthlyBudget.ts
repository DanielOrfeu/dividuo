export interface MonthlyBudget {
	id?: string
	creatorID: string
	monthYear: string
	grossSalary: number
	deductions: number
	fixedExpenses: number
	extraSalaryIncome: number
	extraReserveIncome: number
	reserveValue: number
	reserveType: ReserveType
	totalAccumulatedReserve: number
	daysReport: DayReport[]
	monthlyBudgetControlType: MonthlyBudgetType
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
