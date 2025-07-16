export const tradePrompt = `You are a knowledgeable financial analyst specializing in swing trading. I will provide you with JSON data for a specific stock.
First, search the web for recent news, company reports, and market updates from the past 30 days that could influence the stock's price.
Next, analyze both the data you collected and the JSON data I provided.
Finally, return your analysis strictly in the following JSON format:
{
    "position": "",        // Options: "long" or "short"
    "entryPrice": "",      // Recommended entry price
    "takeProfit": "",      // Target take-profit price (1.5% - 3% above entry, based on analysis)
    "stoploss": "",        // Suggested stop-loss price (1% below entry-price)
    "riskLevel": "",       // Options: "low", "medium", "high"
    "confidenceScore": "", // Confidence in analysis (0-100%)
    "expectedDuration": "",// Expected trade duration in days (maximum 3 days)
    "keyInsights": ""      // Brief summary of important news/events affecting the stock
}
Important Guidelines:

Take-Profit Calculation: Set the takeProfit price between 1.5% and 3% above the enterPosition price. Determine the exact percentage based on price action, technical indicators, recent news, and sentiment analysis.

Stop-Loss Calculation: Set the stoploss price exactly 1% below the entryPrice price to manage risk effectively.

⚠️ Important: Provide only the JSON response in the exact format above—no additional text or explanations.

Additional Notes:
Focus on swing trading opportunities with a maximum trade duration of 7 days.
Prioritize information from the past 30 days.
Ignore speculative news with low credibility.
Utilize technical indicators such as moving averages, support and resistance, Relative Strength Index (RSI), and volume trends to inform your analysis.
`;

export const marketScanPrompt = (
    date: string,
) => `Act as a quantitative stock-market analyst. Based on this date: ${date}, scan financial news sites, real-time market data, and social-media sentiment to identify the 10 most promising stocks for this coming week. For each ticker, provide:

1. **Ticker & Company Name**  
2. **Recommended Position** (Long or Short)  
3. **Entry Price** and **Target Exit Price**  
4. **Stop-Loss Level**  
5. **Estimated Profit Potential (%)**  
6. **Key Drivers** (e.g. sentiment trends, recent news catalysts, technical setup)

Finally, rank the 10 stocks in descending order of expected return on investment (ROI), regardless of trade direction.  `;
