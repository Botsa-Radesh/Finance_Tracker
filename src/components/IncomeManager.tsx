import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const IncomeManager = () => {
  const { user } = useAuth();
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMonthlyIncome();
    }
  }, [user]);

  const fetchMonthlyIncome = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('monthly_income')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setMonthlyIncome(Number(data?.monthly_income) || 0);
    } catch (error: any) {
      toast.error("Failed to load monthly income: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditValue(monthlyIncome.toString());
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleSave = async () => {
    const newIncome = parseFloat(editValue);
    
    if (isNaN(newIncome) || newIncome < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ monthly_income: newIncome })
        .eq('id', user?.id);

      if (error) throw error;

      setMonthlyIncome(newIncome);
      setIsEditing(false);
      toast.success("Monthly income updated!");
    } catch (error: any) {
      toast.error("Failed to update income: " + error.message);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-8 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
        <CardDescription>Set your monthly income to track budget</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-income">Amount (₹)</Label>
              <Input
                id="monthly-income"
                type="number"
                placeholder="Enter monthly income"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-foreground">
              ₹{monthlyIncome.toLocaleString('en-IN')}
            </div>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeManager;
