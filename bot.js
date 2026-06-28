const mineflayer = require('mineflayer')
const http = require('http')

const config = {
  host: process.env.MC_HOST || 'eclipsesmpoff.falix.gg',
  port: parseInt(process.env.MC_PORT) || 25565,
  username: process.env.MC_USERNAME || 'AFKBot',
  version: process.env.MC_VERSION || false
}

function createBot() {
  const bot = mineflayer.createBot(config)

  bot.on('login', () => {
    console.log(`[+] Залогинился как ${bot.username}`)
  })

  bot.on('spawn', () => {
    console.log('[+] Бот в игре, AFK режим активен')

    // Дёргаемся каждые 30-60 секунд, чтобы не кикнуло
    setInterval(() => {
      const actions = ['forward', 'back', 'left', 'right', 'jump']
      const action = actions[Math.floor(Math.random() * actions.length)]

      if (action === 'jump') {
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 500)
      } else {
        bot.setControlState(action, true)
        setTimeout(() => bot.setControlState(action, false), 1000)
      }

      console.log(`[*] Действие: ${action}`)
    }, 30000 + Math.random() * 30000)

    // Смотрим в случайные стороны
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2
      const pitch = Math.random() * 180 - 90
      bot.look(yaw, pitch, true)
      console.log('[*] Поворот головы')
    }, 40000 + Math.random() * 20000)
  })

  bot.on('kicked', (reason) => {
    console.log(`[-] Кикнуло: ${reason}`)
    setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.log(`[!] Ошибка: ${err.message}`)
    setTimeout(createBot, 10000)
  })

  bot.on('end', () => {
    console.log('[-] Отключился. Переподключаюсь через 10 сек...')
    setTimeout(createBot, 10000)
  })

  bot.on('message', (jsonMsg) => {
    const msg = jsonMsg.toString().replace(/§[0-9a-fk-or]/g, '')
    console.log(`[Чат] ${msg}`)
  })
}

createBot()

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('OK')
})
server.listen(process.env.PORT || 3000)
console.log(`[+] HTTP сервер на порту ${process.env.PORT || 3000}`)
