declare namespace Types {
  export type Offer = {
    priceBYN?: string;
    priceUSD?: string;
    parameters?: string;
    address?: string;
    description?: string;
    link?: string;
    dateTime?: string;
    images: string[];
  };


  export type Data = {
    link: string
    address: string,
    priceBYN: string,
    priceUSD: string,
    parameters: string,
    description: string,
    images: string[];
  }

  export namespace Env {
    export type Key = 'TELEGRAM_BOT_TOKEN' | 'CHAT_ID' | 'MONGO_DB_URL' | 'KUFAR_URL' | 'INTERVAL_DELAY_MS' | 'MAX_RENTAL_SAVED'
  }
}