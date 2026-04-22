const mineflayer = require('mineflayer')

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('Usage : node main.js <host> [<name>] [<port>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  // if bot doesnt connecting to an aternos server, use dynamic ip address from aternos website.
  host: process.argv[2], // minecraft server ip
  username: process.argv[3] ? process.argv[3] : 'NotABot',
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: parseInt(process.argv[4] ? process.argv[4] : 25565),
})

work_flag = false

bot.on('chat', (username, message) => {
  if (username === bot.username || !message.toString().includes(bot.username)) return

  message_str = message.toString().toLowerCase()

  message_str = message_str.replace(bot.username.toLowerCase(), '').trim()

  switch (message_str) {
    case 'привет':
    case 'здравствуй':
      bot.chat(`Привет, ${username}! Я бот, который может отвечать на сообщения в чате! И кликать на калитки 😉, для того чтобы ваш aternos сервер не выключался.`)
      break
    case 'калитка':
      bot.chat(`Начинаю работать...`)
      work_flag = true
      break
    case 'стоп':
      bot.chat(`Пока, ${username}! Если тебе нужна помощь, просто напиши мне!`)
      work_flag = false
      break
    case 'помощь':
      bot.chat(`Команды: "привет", "здравствуй", "калитка", "стоп", "помощь", "уходи", использование: *Юзернейм бота* + команда.`)
      break
    case 'уходи':
      bot.chat(`Пока, ${username}!`)
      bot.quit()
      break
  }
})

async function clickGate() {
  if (work_flag) {
    const block = bot.blockAt(bot.entity.position.offset(0, 0, 1))
    if (block && block.name.includes('gate')) {
      bot.activateBlock(block)
    }
  }
}

setInterval(clickGate, 1000) // Оно блокирует главный цикл бота, он просто не заходит

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)
