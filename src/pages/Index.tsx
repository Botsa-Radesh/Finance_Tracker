import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, PiggyBank, Shield, DollarSign, Calendar, LogOut } from "lucide-react";
import ExpenseTracker from "@/components/ExpenseTracker";
import BudgetManager from "@/components/BudgetManager";
import IncomeManager from "@/components/IncomeManager";
import SpendingChart from "@/components/SpendingChart";
import Recommendations from "@/components/Recommendations";
import FeasibilityChecker from "@/components/FeasibilityChecker";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'budget' | 'recommendations' | 'feasibility'>('dashboard');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch monthly income
      const { data: profile } = await supabase
        .from('profiles')
        .select('monthly_income')
        .eq('id', user?.id)
        .single();

      setMonthlyIncome(Number(profile?.monthly_income) || 0);

      // Fetch total expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount');

      const expenseTotal = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      setTotalExpenses(expenseTotal);

      // Fetch total budget
      const { data: budgets } = await supabase
        .from('budgets')
        .select('limit_amount');

      const budgetTotal = budgets?.reduce((sum, budget) => sum + Number(budget.limit_amount), 0) || 0;
      setTotalBudget(budgetTotal);
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const remainingBudget = monthlyIncome - totalExpenses;

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
            <div className="flex gap-2 items-center">
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
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Income Manager */}
            <IncomeManager />

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                  <TrendingUp className="w-4 h-4 text-success" />
                </CardHeader>
                <CardContent>
                  {dataLoading ? (
                    <div className="animate-pulse h-8 bg-muted rounded"></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-foreground">₹{monthlyIncome.toLocaleString('en-IN')}</div>
                      <p className="text-xs text-muted-foreground mt-1">Set your income above</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <DollarSign className="w-4 h-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  {dataLoading ? (
                    <div className="animate-pulse h-8 bg-muted rounded"></div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-foreground">₹{totalExpenses.toLocaleString('en-IN')}</div>
                      <p className="text-xs text-muted-foreground mt-1">All time expenses</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
                  <PiggyBank className="w-4 h-4 text-accent" />
                </CardHeader>
                <CardContent>
                  {dataLoading ? (
                    <div className="animate-pulse h-8 bg-muted rounded"></div>
                  ) : (
                    <>
                      <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-success' : 'text-destructive'}`}>
                        ₹{remainingBudget.toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {remainingBudget >= 0 ? 'Available to spend' : 'Over budget'}
                      </p>
                    </>
                  )}
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
