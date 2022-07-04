#!/usr/bin/env node

import * as btc2fiat from "./btc2fiat.js";

let args = process.argv.slice(2);

let exchange = "kraken";
let fiatSymbol = "USD";

let USAGE = `Usage: ${process.argv[1].split("/").slice(-1)[0]} [binance|coinbase|kraken] [usd|eur]`;

if (args.length >= 1) {
    exchange = args[0].toLowerCase();
    if (!["binance", "coinbase", "kraken"].includes(exchange)) {
        console.log(USAGE);
        process.exit(1);
    }
}

if (args.length >= 2) {
    fiatSymbol = args[1].toUpperCase();
    if (!["USD", "EUR"].includes(fiatSymbol)) {
        console.log(USAGE);
        process.exit(1);
    }
}

if (args.length > 2) {
    console.log(USAGE);
    process.exit(1);
}

console.log(await btc2fiat.getValue(exchange, fiatSymbol));
process.exit(0);
