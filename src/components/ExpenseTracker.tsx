import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', amount: 45.50, category: 'Food', description: 'Groceries', date: '2025-01-10' },
    { id: '2', amount: 120.00, category: 'Transportation', description: 'Gas', date: '2025-01-09' },
    { id: '3', amount: 85.25, category: 'Entertainment', description: 'Movie tickets', date: '2025-01-08' },
  ]);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Utilities',
    'Shopping',
    'Education',
    'Other'
  ];

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: newExpense.date
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    toast.success("Expense added successfully!");
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success("Expense deleted");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>Track your daily spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What did you buy?"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addExpense} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Total: ${totalExpenses.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-semibold">
                      ${expense.amount.toFixed(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">{expense.category}</span>
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
