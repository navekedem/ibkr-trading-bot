// const func = async () => {
//   // console.log(alpaca)
//   const response = await fetch("https://data.alpaca.markets/v2/stocks/bars?symbols=aapl&timeframe=1min&limit=1000&adjustment=raw&feed=sip&sort=asc", {
//     headers: { 'Content-Type': 'application/json', "APCA-API-KEY-ID": "PK0QA42MWURMF476WSJC", "APCA-API-SECRET-KEY": "tNd1pISH73KjhAfGqSyV9aerpyP8oEQNisf3JTkJ"}
//   })
//   const res = await response.json();
//   const result = await alpaca.getBarsV2('AAPL', {
//     baseUrl: "https://paper-api.alpaca.markets",
//     timeframe: "1min",
//     start: "2023-12-03",
//     end: "2023-12-04"
//   })
//   console.log(JSON.stringify(res));
// }
// func();
// const app = express();
// const server = http.createServer(app)
// const alpacaWebSocket = new WebSocket("wss://stream.data.alpaca.markets/v2/bars")
// const wss = new WebSocket.Server({ port: 8080 });
// let connected = false;
// const ib = new IBApi({ port: 7497, });

// alpacaWebSocket.on('open', () => {
//   const authMsg = {
//     action: 'auth',
//     key: 'PK0QA42MWURMF476WSJC',
//     secret: 'tNd1pISH73KjhAfGqSyV9aerpyP8oEQNisf3JTkJ',
//   }
//   alpacaWebSocket.send(JSON.stringify(authMsg))
// })

// alpacaWebSocket.on('connection', (ws:WebSocket) => {
//   ws.on('message', (event: any) => {
//     console.log(event)
//   })
// })