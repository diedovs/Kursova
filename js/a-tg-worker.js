class TelegramBotSetup {
  constructor( token ) {
    this.token = token;
    this.requestUrl = 'https://api.telegram.org/bot';
  }
  api( type, method, body ) {
    return new Promise((resolve, reject) => {
      fetch(this.requestUrl + this.token + type, {
        method: method,
        body: body
      }).then(( res ) => {
        resolve(res.json());
      }).catch(( err ) => {
        reject(err);
      })
    })
  }
}

class Bot extends TelegramBotSetup {
  constructor( botToken, defaultChatID ) {
    super( botToken );
    this.dcid = defaultChatID;
  }
  static start() {
    console.log("Send telegram message with JS\nMaker:https://kotkot.team");
  }

  async getUpdates() {
    try {
      const result = await this.api('/getUpdates', 'GET')
      return await result
    } catch( e ) {
      return await e
    }
  }

  async getInfo() {
    try {
      const result = await this.api('/getMe', 'GET')
      return await result
    } catch(e) {
      return await e
    }
  }

  async sendMessage({text, chatID, parseMode, silent} = {}) {
    try {
      const result = await this.api(`/sendMessage?text=${text}&chat_id=${chatID ? chatID : this.dcid}&parse_mode=${parseMode ? parseMode : 'html'}&disable_notification=${silent ? silent : false}`, 'GET')
      return await result
    } catch(e) {
      return await e
    }
  }
}

Bot.start();