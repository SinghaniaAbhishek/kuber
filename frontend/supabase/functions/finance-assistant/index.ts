import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, financialData } = await req.json();
    console.log('Received query:', query);
    console.log('Financial data keys:', Object.keys(financialData));

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare financial summary for the AI
    const summary = {
      totalIncome: financialData.income.reduce((sum: number, inc: any) => sum + inc.amount, 0),
      totalExpenses: financialData.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0),
      monthlyBudget: financialData.settings.monthlyBudget,
      expenses: financialData.expenses,
      goals: financialData.goals,
      bills: financialData.bills,
      subscriptions: financialData.subscriptions,
      debts: financialData.debts,
      challenges: financialData.challenges,
      badges: financialData.badges
    };

    const systemPrompt = `You are a helpful personal finance assistant. Analyze the user's financial data and provide clear, actionable insights. 

Financial Summary:
- Total Income: ₹${summary.totalIncome}
- Total Expenses: ₹${summary.totalExpenses}
- Monthly Budget: ₹${summary.monthlyBudget}
- Net Balance: ₹${summary.totalIncome - summary.totalExpenses}

Detailed Data:
${JSON.stringify(summary, null, 2)}

Provide concise, friendly advice. Use emojis sparingly. Focus on actionable insights and encouragement.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in finance-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
