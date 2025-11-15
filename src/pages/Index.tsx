import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, PiggyBank, Shield, DollarSign, Calendar } from "lucide-react";
import ExpenseTracker from "@/components/ExpenseTracker";
import BudgetManager from "@/components/BudgetManager";
import SpendingChart from "@/components/SpendingChart";
import Recommendations from "@/components/Recommendations";
import FeasibilityChecker from "@/components/FeasibilityChecker";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'budget' | 'recommendations' | 'feasibility'>('dashboard');

  // Sample data - in a real app, this would come from a backend/state management
  const totalBalance = 12450.75;
  const monthlyIncome = 5000;
  const monthlyExpenses = 3250.40;
  const savingsGoal = 10000;
  const currentSavings = 8500;

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FinanceWise</h1>
                <p className="text-sm text-muted-foreground">Your Personal Finance Assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant={activeTab === 'expenses' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('expenses')}
              >
                Expenses
              </Button>
              <Button 
                variant={activeTab === 'budget' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('budget')}
              >
                Budget
              </Button>
              <Button 
                variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('recommendations')}
              >
                Insights
              </Button>
              <Button 
                variant={activeTab === 'feasibility' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('feasibility')}
              >
                Feasibility
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${totalBalance.toLocaleString()}</div>
                  <p className="text-xs text-success mt-1">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${monthlyIncome.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                  <Calendar className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${monthlyExpenses.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Savings Progress</CardTitle>
                  <PiggyBank className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${currentSavings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">of ${savingsGoal.toLocaleString()} goal</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-success h-2 rounded-full transition-all" 
                      style={{ width: `${(currentSavings / savingsGoal) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Spending Overview</CardTitle>
                  <CardDescription>Your spending patterns this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <SpendingChart />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Insights</CardTitle>
                  <CardDescription>AI-powered recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Consider Emergency Fund</p>
                      <p className="text-xs text-muted-foreground">Build 3-6 months of expenses as safety net</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Investment Opportunity</p>
                      <p className="text-xs text-muted-foreground">Low-risk index funds match your profile</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <PiggyBank className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Savings Goal On Track</p>
                      <p className="text-xs text-muted-foreground">You're 85% to your target - keep going!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && <ExpenseTracker />}
        {activeTab === 'budget' && <BudgetManager />}
        {activeTab === 'recommendations' && <Recommendations />}
        {activeTab === 'feasibility' && <FeasibilityChecker />}
      </main>
    </div>
  );
};

export default Index;
