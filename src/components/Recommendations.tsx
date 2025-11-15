import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, PiggyBank, Shield, Target, Lightbulb, ArrowRight } from "lucide-react";

const Recommendations = () => {
  const recommendations = [
    {
      id: '1',
      title: 'High-Yield Savings Account',
      type: 'Savings',
      description: 'Earn 4.5% APY on your emergency fund. FDIC insured up to $250,000.',
      potential: '+$382/year',
      risk: 'Low',
      icon: PiggyBank,
      color: 'text-success'
    },
    {
      id: '2',
      title: 'Index Fund Investment',
      type: 'Investment',
      description: 'S&P 500 index fund with low fees (0.03% expense ratio). Historical 10% annual returns.',
      potential: '+$500/year potential',
      risk: 'Medium',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      id: '3',
      title: 'Term Life Insurance',
      type: 'Insurance',
      description: '$500,000 coverage for 20 years. Protect your family\'s financial future.',
      potential: '$35/month',
      risk: 'Low',
      icon: Shield,
      color: 'text-secondary'
    },
    {
      id: '4',
      title: 'Retirement Account (401k)',
      type: 'Retirement',
      description: 'Maximize employer match. Contribute 6% to get full 3% employer match.',
      potential: '+$1,800/year free money',
      risk: 'Low',
      icon: Target,
      color: 'text-accent'
    },
  ];

  const spendingTips = [
    {
      category: 'Food',
      tip: 'You spent 15% more on dining out this month. Meal prep 3x/week could save $120/month.',
      savings: '$1,440/year'
    },
    {
      category: 'Entertainment',
      tip: 'Consider bundling streaming services. Save $15/month by switching to family plans.',
      savings: '$180/year'
    },
    {
      category: 'Transportation',
      tip: 'Gas prices are down 8%. Fill up now and consider carpooling twice a week to save more.',
      savings: '$240/year'
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-card bg-gradient-hero border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Based on your financial profile, income, and spending habits
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card key={rec.id} className="shadow-card hover:shadow-elevated transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${rec.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription className="text-xs">{rec.type}</CardDescription>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    rec.risk === 'Low' ? 'bg-success/10 text-success' : 
                    rec.risk === 'Medium' ? 'bg-warning/10 text-warning' : 
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {rec.risk} Risk
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Potential Benefit</p>
                    <p className="font-semibold text-success">{rec.potential}</p>
                  </div>
                  <Button>
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Smart Spending Tips</CardTitle>
          <CardDescription>AI-analyzed opportunities to optimize your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {spendingTips.map((tip, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                    {tip.category}
                  </span>
                  <span className="font-semibold text-success">{tip.savings}</span>
                </div>
                <p className="text-sm text-foreground">{tip.tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;
