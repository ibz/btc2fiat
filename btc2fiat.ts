const fetch = require('node-fetch');

export abstract class Exchange {
  protected abstract getUrl(fiatSymbol: string) : string;
  protected abstract parseResponse(data: any, fiatSymbol: string): number;

  public async getValue(fiatSymbol: string): Promise<number> {
    var response = await fetch(this.getUrl(fiatSymbol), {method: 'GET'});
    var data = await response.json();
    return this.parseResponse(data, fiatSymbol);
  }
}

export class Binance extends Exchange {
  private static _instance: Binance;
  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    super();
  }

  getUrl(fiatSymbol: string) {
    let shitcoinSymbol = fiatSymbol === 'USD' ? (fiatSymbol + 'T') : fiatSymbol;
    return `https://api.binance.com/api/v3/avgPrice?symbol=BTC${shitcoinSymbol}`;
  }

  parseResponse(data: any, _: string): number {
    return data['price'];
  }
}

export class Coinbase extends Exchange {
  private static _instance: Coinbase;
  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    super();
  }

  getUrl(fiatSymbol: string) {
    return `https://api.coinbase.com/v2/prices/spot?currency=${fiatSymbol}`;
  }

  parseResponse(data: any, _: string): number {
    return data['data']['amount'];
  }
}

export class Kraken extends Exchange {
  private static _instance: Binance;
  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    super();
  }

  getUrl(fiatSymbol: string) {
    return `https://api.kraken.com/0/public/Ticker?pair=XBT${fiatSymbol}`;
  }

  parseResponse(data: any, fiatSymbol: string): number {
    return data['result'][`XXBTZ${fiatSymbol}`]['c'][0];
  }
}

const EXCHANGES: {[k: string]: Exchange} = {'binance': Binance.Instance, 'coinbase': Coinbase.Instance, 'kraken': Kraken.Instance};

export async function getValue(exchange: string = 'kraken', fiatSymbol = "USD") : Promise<number> {
  return await EXCHANGES[exchange.toLowerCase()].getValue(fiatSymbol.toUpperCase());
}
