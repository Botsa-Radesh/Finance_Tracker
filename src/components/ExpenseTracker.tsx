import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const ExpenseTracker = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedExpenses = data.map(exp => ({
        id: exp.id,
        amount: Number(exp.amount),
        category: exp.category,
        description: exp.description || '',
        date: exp.date,
      }));

      setExpenses(formattedExpenses);
    } catch (error: any) {
      toast.error("Failed to load expenses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const expenseAmount = parseFloat(newExpense.amount);

      // Insert the expense
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id: user.id,
          amount: expenseAmount,
          category: newExpense.category,
          description: newExpense.description,
          date: newExpense.date
        }])
        .select()
        .single();

      if (error) throw error;

      // Update the corresponding budget's spent amount
      const { data: budget } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', newExpense.category)
        .maybeSingle();

      if (budget) {
        const newSpent = Number(budget.spent) + expenseAmount;
        await supabase
          .from('budgets')
          .update({ spent: newSpent })
          .eq('id', budget.id);
      }

      const newExp: Expense = {
        id: data.id,
        amount: Number(data.amount),
        category: data.category,
        description: data.description || '',
        date: data.date,
      };

      setExpenses([newExp, ...expenses]);
      setNewExpense({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      toast.success("Expense added and budget updated!");
    } catch (error: any) {
      toast.error("Failed to add expense: " + error.message);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      // Find the expense to get its amount and category
      const expenseToDelete = expenses.find(e => e.id === id);
      
      if (expenseToDelete) {
        // Delete the expense
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Update the corresponding budget's spent amount
        const { data: budget } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user?.id)
          .eq('category', expenseToDelete.category)
          .maybeSingle();

        if (budget) {
          const newSpent = Math.max(0, Number(budget.spent) - expenseToDelete.amount);
          await supabase
            .from('budgets')
            .update({ spent: newSpent })
            .eq('id', budget.id);
        }

        setExpenses(expenses.filter(e => e.id !== id));
        toast.success("Expense deleted and budget updated!");
      }
    } catch (error: any) {
      toast.error("Failed to delete expense: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

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
              <Label htmlFor="amount">Amount (₹)</Label>
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
          <CardDescription>Total: ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-semibold">
                      ₹{expense.amount.toFixed(0)}
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
