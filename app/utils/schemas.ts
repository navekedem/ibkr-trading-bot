export const dayTradeSchema = {
    type: 'object',
    properties: {
        stocks: {
            type: 'array',
            minItems: 1,
            maxItems: 10,
            items: {
                type: 'object',
                properties: {
                    ticker: {
                        type: 'string',
                        description: 'Ticker symbol',
                    },
                    companyName: { type: 'string', description: 'Company name' },
                    position: {
                        type: 'string',
                        description: 'Trade position (Long/Short)',
                        enum: ['Long', 'Short'],
                    },
                    gapPct: {
                        type: 'number',
                        description: 'Premarket Gap % (e.g., 5.2 means +5.2%)',
                    },
                    entryPrice: {
                        type: 'number',
                        description: 'Recommended entry price',
                    },
                    targetExitPrice: {
                        type: 'number',
                        description: 'Target exit price',
                    },
                    stopLoss: {
                        type: 'number',
                        description: 'Stop-loss level',
                    },
                    estimatedProfitPotential: {
                        type: 'number',
                        description: 'Estimated profit potential in percentage',
                    },
                    keyDrivers: {
                        type: 'string',
                        description: 'Key drivers for the stock recommendation',
                    },
                    riskNotes: {
                        type: 'string',
                        description: 'Risk Notes (low float/halts/spread)',
                    },
                    score: {
                        type: 'integer',
                        description: 'Composite score 0–100',
                        minimum: 0,
                        maximum: 100,
                    },
                },
                required: [
                    'ticker',
                    'companyName',
                    'position',
                    'gapPct',
                    'targetExitPrice',
                    'stopLoss',
                    'keyDrivers',
                    'score',
                    'riskNotes',
                    'entryPrice',
                    'estimatedProfitPotential',
                ],
                additionalProperties: false,
            },
        },
    },
    required: ['stocks'],
    additionalProperties: false,
};

export const analysisSchema = {
    name: 'financial_analysis',
    strict: true,
    schema: {
        type: 'object',
        properties: {
            position: {
                type: 'string',
                description: 'Options: "long" or "short"',
            },
            entryPrice: {
                type: 'number',
                description: 'Recommended entry price',
            },
            takeProfit: {
                type: 'string',
                description: 'Target take-profit price (1.5% - 3% above entry, based on analysis)',
            },
            stoploss: {
                type: 'string',
                description: 'Target take-profit price (1.5% - 3% above entry, based on analysis)',
            },
            riskLevel: {
                type: 'string',
                description: 'Options: "low", "medium", "high"',
            },
            confidenceScore: {
                type: 'number',
                description: 'Confidence in analysis (0-100%)',
            },
            expectedDuration: {
                type: 'string',
                description: 'Expected trade duration in days (maximum 3 days)',
            },
            keyInsights: {
                type: 'string',
                description: 'Brief summary of important news/events affecting the stock',
            },
        },
        required: ['keyInsights', 'expectedDuration', 'confidenceScore', 'stoploss', 'takeProfit', 'entryPrice', 'position', 'riskLevel'],
        additionalProperties: false,
    },
};

export const swingTradeSchema = {
    title: 'Swing Trades (Weekly) — Top 10',
    type: 'object',
    properties: {
        swingTrades: {
            type: 'array',
            minItems: 1,
            maxItems: 10,
            items: {
                type: 'object',
                properties: {
                    ticker: {
                        type: 'string',
                        description: 'Ticker symbol',
                        pattern: '^[A-Z][A-Z0-9.\\-]{0,9}$',
                    },
                    company: { type: 'string', description: 'Company name' },
                    position: {
                        type: 'string',
                        description: 'Recommended Position (Pos)',
                        enum: ['Long', 'Short'],
                    },
                    entry: {
                        type: 'number',
                        description: 'Planned entry price',
                        exclusiveMinimum: 0,
                    },
                    target: {
                        type: 'number',
                        description: 'Target exit price',
                        exclusiveMinimum: 0,
                    },
                    stop: {
                        type: 'number',
                        description: 'Stop-loss level',
                        exclusiveMinimum: 0,
                    },
                    profitPotentialPct: {
                        type: 'number',
                        description: 'Profit Pot. % (e.g., 12.5 means +12.5%)',
                    },
                    keyDrivers: {
                        description: 'Key Drivers (news/sentiment/technical setup)',
                        oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' }, minItems: 1 }],
                    },
                    confidence: {
                        type: 'string',
                        description: 'Analyst confidence',
                        enum: ['Low', 'Medium', 'High'],
                    },
                    score: {
                        type: 'integer',
                        description: 'Composite score 0–100',
                        minimum: 0,
                        maximum: 100,
                    },
                },
                required: ['ticker', 'company', 'position', 'entry', 'target', 'stop', 'profitPotentialPct', 'keyDrivers', 'confidence', 'score'],
                additionalProperties: false,
            },
        },
    },
    required: ['swingTrades'],
    additionalProperties: false,
};
