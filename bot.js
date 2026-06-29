const mineflayer = require('mineflayer')
const http = require('http')

const PASSWORD = 'qw1qw1qw1'
const CONFIG = {
  host: 'eclipsesmpoff.falix.gg',
  port: 20829,
  username: 'AFKBot',
  version: false
}

let bot = null
let reconnectTimer = null
let actionInterval = null
let lookInterval = null

function cleanup() {
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
  if (actionInterval) { clearInterval(actionInterval); actionInterval = null }
  if (lookInterval) { clearInterval(lookInterval); lookInterval = null }
  if (bot) {
    try { bot.end() } catch (e) {}
    try { bot.removeAllListeners() } catch (e) {}
    bot = null
  }
}

function createBot() {
  cleanup()
  bot = mineflayer.createBot(CONFIG)

  bot.on('login', () => {
    console.log('[+] Залогинился как ' + bot.username)
  })

  bot.on('spawn', () => {
    console.log('[+] Бот в игре, AFK режим активен')

    setTimeout(() => {
      bot.chat('/l ' + PASSWORD)
    }, 3000)

    actionInterval = setInterval(() => {
      const actions = ['forward', 'back', 'left', 'right', 'jump']
      const action = actions[Math.floor(Math.random() * actions.length)]
      if (action === 'jump') {
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 500)
      } else {
        bot.setControlState(action, true)
        setTimeout(() => bot.setControlState(action, false), 1000)
      }
    }, 30000 + Math.random() * 30000)

    lookInterval = setInterval(() => {
      bot.look(Math.random() * Math.PI * 2, Math.random() * 180 - 90, true)
    }, 40000 + Math.random() * 20000)
  })

  bot.on('kicked', (reason) => {
    console.log('[-] Кикнуло: ' + reason)
    reconnectTimer = setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.log('[!] Ошибка: ' + err.message)
    reconnectTimer = setTimeout(createBot, 10000)
  })

  bot.on('end', () => {
    console.log('[-] Отключился. Переподключаюсь через 10 сек...')
    reconnectTimer = setTimeout(createBot, 10000)
  })

  bot.on('message', (jsonMsg) => {
    const msg = jsonMsg.toString().replace(/§[0-9a-fk-or]/g, '').toLowerCase()
    if (msg.includes('register') || msg.includes('/reg')) {
      bot.chat('/reg ' + PASSWORD + ' ' + PASSWORD)
    }
    if (msg.includes('login') || msg.includes('/login')) {
      bot.chat('/login ' + PASSWORD)
    }
  })
}

createBot()

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('OK')
})
server.listen(process.env.PORT || 7860)
