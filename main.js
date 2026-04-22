const mineflayer = require('mineflayer')

const { loader: baritone, goals } = require('@miner-org/mineflayer-baritone')
const { Vec3 } = require('vec3')

work_flag = false

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('Usage : node main.js <host or host:port> [<port>] [<name>]')
  process.exit(1)
}

const hostPort = process.argv[2].split(':')
host = hostPort[0]
port = hostPort[1] ? parseInt(hostPort[1]) : 25565
port = process.argv[3] ? parseInt(process.argv[3]) : port
username = process.argv[4] ? process.argv[4] : 'NotABot'

const bot = mineflayer.createBot({
  // if bot doesnt connecting to an aternos server, use dynamic ip address from aternos website.
  host: host, // minecraft server ip
  username: username,
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: port,
})

bot.loadPlugin(baritone)

bot.on('chat', async (username, message) => {
  if (username === bot.username || !message.toString().includes(bot.username)) return

  message_str = message.toString().toLowerCase()

  if (message_str.includes('иди')) {
    await bot.waitForChunksToLoad()

    message_str = message_str.replace('иди', '').trim()
    message_str = message_str.replace(bot.username.toLowerCase(), '').trim()

    const args = message_str.split(' ');

    const x = parseInt(args[0]);
    const y = parseInt(args[1]);
    const z = parseInt(args[2]);

    const target = new Vec3(x, y, z);
    const goal = new goals.GoalExact(target)

    bot.ashfinder.enableBreaking()
    bot.ashfinder.enablePlacing()

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      bot.chat('Ошибка: Укажите координаты x y z');
      return;
    }

    bot.chat(`Иду к ${x}, ${y}, ${z}`);
    // Настройка движений (учитывает блоки, двери и т.д.)

    try {
      await bot.ashfinder.goto(goal)
      bot.chat('Цель достигнута!')
    } catch (err) {
      bot.chat('Ошибка пути:', err)
    }

    return
  }

  message_str = message_str.replace(bot.username.toLowerCase(), '').trim()

  switch (message_str) {
    case 'привет':
    case 'здравствуй':
      bot.chat(`Привет, ${username}! Я бот, который может отвечать на сообщения в чате! И кликать на калитки 😉, для того чтобы ваш aternos сервер не выключался. Поставь калитку ровно передо мной, введи команду ${bot.username} "калитка" и я буду работать. "помощь" для команд.`)
      break
    case 'калитка':
      
      const block = bot.blockAt(bot.entity.position.offset(0, 0, 1))
      if (block && block.name.includes('gate')) {
        bot.chat(`Начинаю работать...`)
        bot.activateBlock(block)
        work_flag = true
      } else {
        bot.chat('Не вижу калитку передо мной! Поставь калитку ровно передо мной и введи команду "калитка", чтобы начать работу.')
      }
      break
    case 'стоп':
      if (!work_flag) {
        bot.chat('Я даже не начинал работать! Поставь калитку ровно передо мной и введи команду "калитка", чтобы начать работу.')
        return
      }
      bot.chat(`Заканчиваю работу! Ставьте чайник... 🍵`)
      work_flag = false
      break
    case 'помощь':
      bot.chat(`Команды: "привет", "здравствуй", "калитка", "стоп", "помощь", "уходи", "иди", использование: ${bot.username} + команда.`)
      break
    case 'уходи':
      bot.chat(`Пока, ${username}!`)
      bot.quit()
      break
    default:
      bot.chat(`${username}, я не понимаю эту команду. Напиши "${bot.username} помощь" для списка команд.`)
  }
})

async function clickGate() {
  if (work_flag) {
    const block = bot.blockAt(bot.entity.position.offset(0, 0, 1))
    if (block && block.name.includes('gate')) {
      bot.activateBlock(block)
    } else {
      bot.chat('Калитка куда-то пропала! Поставь калитку ровно передо мной и введи команду "калитка", чтобы начать работу..')
      work_flag = false
    }
  }
}

setInterval(clickGate, 1000)

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)
