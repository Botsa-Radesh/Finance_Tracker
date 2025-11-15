import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";

const FeasibilityChecker = () => {
  const [expense, setExpense] = useState({
    name: '',
    amount: '',
    timeframe: ''
  });

  const [result, setResult] = useState<{
    feasible: boolean;
    message: string;
    details: string[];
    recommendation: string;
  } | null>(null);

  const checkFeasibility = () => {
    if (!expense.name || !expense.amount || !expense.timeframe) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(expense.amount);
    const months = parseInt(expense.timeframe);
    
    // Sample calculations - in a real app, this would use actual user data
    const monthlyIncome = 5000;
    const monthlyExpenses = 3250;
    const currentSavings = 8500;
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const totalCanSave = currentSavings + (monthlySavings * months);
    const feasible = totalCanSave >= amount;

    const percentageOfIncome = ((amount / months) / monthlyIncome) * 100;

    let message = "";
    let details = [];
    let recommendation = "";

    if (feasible) {
      message = `Great news! This expense is feasible within ${months} months.`;
      details = [
        `You can currently save $${monthlySavings.toFixed(2)}/month`,
        `Your current savings: $${currentSavings.toFixed(2)}`,
        `Projected savings in ${months} months: $${totalCanSave.toFixed(2)}`,
        `Required amount: $${amount.toFixed(2)}`
      ];
      
      if (percentageOfIncome > 50) {
        recommendation = "This is a significant expense. Consider extending the timeframe or finding additional income sources.";
      } else if (percentageOfIncome > 30) {
        recommendation = "This is manageable but will require discipline. Consider setting up automatic transfers to a dedicated savings account.";
      } else {
        recommendation = "This expense fits well within your budget. You can proceed with confidence!";
      }
    } else {
      const shortfall = amount - totalCanSave;
      const additionalMonths = Math.ceil(shortfall / monthlySavings);
      
      message = `This expense may be challenging within ${months} months.`;
      details = [
        `Monthly savings capacity: $${monthlySavings.toFixed(2)}`,
        `Projected savings in ${months} months: $${totalCanSave.toFixed(2)}`,
        `Shortfall: $${shortfall.toFixed(2)}`,
        `You'd need ${additionalMonths} more months to save enough`
      ];
      recommendation = `Consider: 1) Extending to ${months + additionalMonths} months, 2) Reducing the expense by $${shortfall.toFixed(2)}, or 3) Finding ways to increase income by $${(shortfall / months).toFixed(2)}/month.`;
    }

    setResult({ feasible, message, details, recommendation });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Expense Feasibility Checker
          </CardTitle>
          <CardDescription>
            Check if a large planned expense fits your budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="e.g., New Car, Vacation, Home Renovation"
                value={expense.name}
                onChange={(e) => setExpense({ ...expense, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount ($)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={expense.amount}
                  onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-timeframe">Timeframe (months)</Label>
                <Input
                  id="expense-timeframe"
                  type="number"
                  placeholder="6"
                  value={expense.timeframe}
                  onChange={(e) => setExpense({ ...expense, timeframe: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={checkFeasibility} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Check Feasibility
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className={`shadow-elevated ${
          result.feasible 
            ? 'border-success bg-success/5' 
            : 'border-warning bg-warning/5'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.feasible ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-warning" />
              )}
              {result.message}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Financial Breakdown:</h4>
              <ul className="space-y-1">
                {result.details.map((detail, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm text-foreground mb-2">Recommendation:</h4>
              <p className="text-sm text-muted-foreground">{result.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Feasibility Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm">New Laptop</p>
                  <p className="text-xs text-muted-foreground">$1,200 over 3 months</p>
                </div>
              </div>
              <span className="text-sm text-success font-medium">Feasible</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-sm">European Vacation</p>
                  <p className="text-xs text-muted-foreground">$5,000 over 4 months</p>
                </div>
              </div>
              <span className="text-sm text-warning font-medium">Challenging</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm">Home Repairs</p>
                  <p className="text-xs text-muted-foreground">$800 over 2 months</p>
                </div>
              </div>
              <span className="text-sm text-success font-medium">Feasible</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeasibilityChecker;
