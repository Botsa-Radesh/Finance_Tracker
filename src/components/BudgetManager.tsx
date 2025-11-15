import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

const BudgetManager = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: ''
  });

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBudgets = data.map(budget => ({
        id: budget.id,
        category: budget.category,
        limit: Number(budget.limit_amount),
        spent: Number(budget.spent),
      }));

      setBudgets(formattedBudgets);
    } catch (error: any) {
      toast.error("Failed to load budgets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async () => {
    if (!newBudget.category || !newBudget.limit) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          user_id: user.id,
          category: newBudget.category,
          limit_amount: parseFloat(newBudget.limit),
          spent: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const newBudgetItem: Budget = {
        id: data.id,
        category: data.category,
        limit: Number(data.limit_amount),
        spent: Number(data.spent),
      };

      setBudgets([...budgets, newBudgetItem]);
      setNewBudget({ category: '', limit: '' });
      toast.success("Budget created successfully!");
    } catch (error: any) {
      toast.error("Failed to create budget: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading budgets...</p>
        </div>
      </div>
    );
  }

  const getPercentage = (spent: number, limit: number) => {
    return (spent / limit) * 100;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{totalBudget.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">₹{totalSpent.toLocaleString('en-IN')}</div>
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-success">₹{totalRemaining.toLocaleString('en-IN')}</div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Add New Budget</CardTitle>
          <CardDescription>Set spending limits for categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <Input
                id="budget-category"
                placeholder="e.g., Food, Transportation"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-limit">Monthly Limit (₹)</Label>
              <Input
                id="budget-limit"
                type="number"
                placeholder="0.00"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addBudget} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Track your spending against limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.map((budget) => {
              const percentage = getPercentage(budget.spent, budget.limit);
              const remaining = budget.limit - budget.spent;

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{budget.category}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{budget.spent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} of ₹{budget.limit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getStatusColor(percentage)}`}>
                        {percentage.toFixed(0)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{remaining.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} left
                      </p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetManager;
