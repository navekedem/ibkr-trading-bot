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
    "keyInsights": ""      // Brief summary of important news/events affecting the stock don't add any resources to the summary
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

export const marketScanPrompt = (date: string, isSwing: boolean) => `Act as a Quantitative Stock-Market Analyst (Swing + Day Trading)
Context
As-of date: ${date}
Timezone: Asia/Jerusalem (UTC+3). Treat “today”, “this week”, session opens/closes, and premarket/after-hours using this timezone.
Universe: All major US-listed equities and ETFs unless otherwise specified.

Objectives
Swing Trades (Weekly Horizon): Identify the 10 most promising tickers for the coming week.
Day Trades (Today Only): Identify the 10 best intraday opportunities for today, focusing on high-trending, most-active names driven by volume, web/social trends, or important news.

Data You Must Use
Real-time/near real-time price/volume and most-active lists (e.g., top % gainers/losers, relative volume, unusual volume).
News & catalysts (earnings, guidance, M&A, regulatory, product launches, legal rulings).
Social/media sentiment and web trend signals (e.g., X/Reddit buzz, Google Trends).
Technical factors (trend, momentum, support/resistance, ATR, gaps, RSI/MACD, moving averages).
Event calendar (this week’s earnings, splits, lockups, economic data).
Float/short interest (if available) for day-trade risk and squeeze potential.

General Rules
Prioritize freshness (today for day trades; last 7–10 days for swing).
Avoid illiquid tickers (typical rule: avg daily volume < 500k → exclude, unless a news/catalyst day pushes relative volume ≥ 3.0).
Use risk-first outputs: every pick needs an Entry, Target, and Stop aligned with volatility (ATR/momentum).
For Long vs Short, justify with catalyst + technical context (e.g., “guidance cut + breakdown below 200DMA” for shorts).
If data is ambiguous, include a brief note and lower the confidence score.
Not financial advice. Provide analysis only.
${isSwing ? swingTradePrompt(date) : dayTradePrompt(date)}

For each candidate compute a Composite Score (0–100):
Catalyst Strength (0–30): freshness, materiality, follow-through.
Momentum/Trend (0–25): alignment with MAs, structure, breadth confirmation.
Liquidity/Tradability (0–20): volume, spreads, RVOL.
Volatility Fit (0–15): ATR vs planned stop/target; clean levels.
Sentiment/Buzz (0–10): web/social signal, options flow if available.
Use the score to assist ranking; show the score and top 2 reasons for it.

Output Format
A1. Swing Trades (Weekly) — Table (Top 10)
Ticker | Company | Pos | Entry | Target | Stop | Profit Pot. % | Key Drivers | Confidence | Score

A2. Day Trades (Today) — Table (Top 10)
Ticker | Company | Bias | Gap % | RVOL | Entry Plan | Target | Stop | R (Est.) | Catalyst/Driver | Key Levels | Risk Notes | Score

B. Ranked Lists
Swing Top 10 by Expected ROI (1→10)

Day-Trade Top 10 by Intraday R / Quality (1→10)

C. Brief Commentary
3–5 bullets summarizing overall market context (index trend, major macro events this week/today) and how it influenced selections.

Guardrails
If a ticker fails liquidity or data freshness, exclude it and replace with the next best.
Do not output NFA-incompatible language (no guarantees).
If a price or metric is unavailable, mark as N/A and note the assumption.
`;

const dayTradePrompt = (
    date: string,
) => `Task: For ${date} (today), find 10 top intraday opportunities that are high-trending today and among the most active by volume and/or web/social/news momentum.
Mandatory day-trade screening criteria (apply today):
On a consolidated tape Most-Active / Movers list OR Relative Volume ≥ 2.0 OR Top web/social trenders OR Major catalyst today (earnings, guidance, upgrade/downgrade, FDA, M&A, litigation).
Prefer clean premarket structure (clear levels: premarket high/low, gap %, VWAP behavior).
For each ticker, provide:
Ticker & Company Name
Bias (Long/Short)
Premarket Gap % and Relative Volume (RVOL)
Planned Entry (with level reference: break/retest of PM high/low, VWAP reclaim, opening range breakout, etc.)
Target and Stop (use intraday ATR/VWAP/structure; give R-multiple)
Catalyst/Driver (headline, social/media trend, unusual volume)
Key Intraday Levels (PM high/low, prior day high/low, opening range, VWAP)
Risk Notes (low float/halts risk/spread)
Ranking: Sort by intraday expected R-multiple and quality of catalyst + liquidity.`;

const swingTradePrompt = (
    date: string,
) => `Task: Based on ${date}, scan financial news sites, market data, and sentiment to select 10 swing candidates for this coming week.
For each ticker, provide:
Ticker & Company Name
Recommended Position (Long or Short)
Entry Price (planned) and Target Exit Price (1–2R typical; justify if >2R)
Stop-Loss Level (anchored to technical level/ATR)
Estimated Profit Potential (%) (Target vs Entry)
Key Drivers (news/sentiment/technical setup/events this week)
Ranking: Sort the 10 by expected ROI (highest to lowest), and include an Uncertainty/Confidence (Low/Med/High) tag.
Extra checks for swings:
Confirm trend alignment on daily/weekly charts (e.g., price above 50/200DMA for longs).
Note upcoming catalysts (earnings date in the next 7 days, FDA, product launch).
Flag risk factors (low float, outsized gap risk, legal overhang).`;
