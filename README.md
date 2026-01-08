<h1 align="center">Hi there</h1>	

There is a simple program for monitoring offers for renting apartments and rooms on the [Kufar.by]
<hr/>

## Start project

- [Create] Telegram bot
- Create an `.env`:

```sh
MONGO_DB_URL=...
TELEGRAM_BOT_TOKEN=...
CHECK_INTERVAL_MS=...

# Chat id with bot (check method registerBaseHandlers in src/services/bot.ts)
CHAT_ID=...

# Url with list (example: https://re.kufar.by/l/minsk/snyat/kvartiru)
KUFAR_URL=...

# Between 0 and 30
MAX_RENTAL_SAVED=...
```

- Start:

```sh
make build-no-cache
make up
```

[Create]: <https://core.telegram.org/bots#how-do-i-create-a-bot>
[Kufar.by]: <https://www.kufar.by/>