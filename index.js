const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const token = '8749862215:AAGdNvIYYLFSNADnZq1YeUP-x8ZDEorTMGA';

const bot = new TelegramBot(token, { polling: true });

let currentRate = null;
let lastUpdate = null;

// Обновление курса
async function updateRate() {
    try {
        const response = await fetch('https://sberkassa.site/public_deals/fetch?offset=0&limit=3&to=RUB&from=ECR');
        const json = await response.json();

        if (json.result === 'ok' && json.data?.length > 0) {
            currentRate = parseFloat(json.data[0].back_rate);
            lastUpdate = Date.now();
            console.log(`Курс обновлён: ${currentRate} ₽`);
        }
    } catch (error) {
        console.error('Ошибка получения курса:', error);
    }
}

// Обновляем сразу и каждые x минут
updateRate();
setInterval(updateRate, 60 * 60 * 1000);

// Команда для Web App
bot.on('message', (msg) => {
    if (msg.text === '/get_ecr_rate') {
        if (currentRate) {
            bot.sendMessage(msg.chat.id, `CURRENT_RATE:${currentRate}`);
        } else {
            bot.sendMessage(msg.chat.id, 'CURRENT_RATE:0');
        }
    }
});

console.log('✅ Бот запущен...');