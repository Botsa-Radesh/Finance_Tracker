import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

const BudgetManager = () => {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food', limit: 500, spent: 345 },
    { id: '2', category: 'Transportation', limit: 300, spent: 220 },
    { id: '3', category: 'Entertainment', limit: 200, spent: 185 },
    { id: '4', category: 'Shopping', limit: 400, spent: 150 },
  ]);

  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: ''
  });

  const addBudget = () => {
    if (!newBudget.category || !newBudget.limit) {
      toast.error("Please fill in all fields");
      return;
    }

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: 0
    };

    setBudgets([...budgets, budget]);
    setNewBudget({ category: '', limit: '' });
    toast.success("Budget created successfully!");
  };

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
            <div className="text-2xl font-bold text-foreground">${totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</div>
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
              <div className="text-2xl font-bold text-success">${totalRemaining.toLocaleString()}</div>
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
              <Label htmlFor="budget-limit">Monthly Limit ($)</Label>
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
                        ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getStatusColor(percentage)}`}>
                        {percentage.toFixed(0)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${remaining.toFixed(2)} left
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
