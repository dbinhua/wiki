<template>
  <div id="app">
    <router-view :onlineCount="onlineCount" @onNoticeVal="onNoticeVal"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      onlineCount: 0,
      websock: null,
      timeout: 45 * 1000,
      frequency: 0,
      maxFrequency: 5,
      reconnection: null,
      userOnlineNotice: 0
    }
  },
  destroyed () {
    this.websock.close()
  },
  created () {
    this.initWebSocket()
  },

  methods: {
    initWebSocket () {
      const wsuri = 'ws://itman.uicp.net:9602'
      this.websock = new WebSocket(wsuri)
      this.websock.onopen = this.websocketonopen
      this.websock.onmessage = this.websocketonmessage
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
      if (this.reconnection) {
        clearInterval(this.reconnection)
      }
      setInterval(() => {
        if (this.websock.readyState === 1) {
          let actions = {'type': 99}
          this.websocketsend(JSON.stringify(actions))
        } else {
          this.initWebSocket()
        }
      }, this.timeout)
    },
    websocketonerror () {
      if (this.reconnection === null) {
        this.reconnection = setInterval(() => {
          this.frequency += 1
          console.log('连接失败，第' + this.frequency + '次尝试重连...')
          this.initWebSocket()
          if (this.frequency > this.maxFrequency) {
            clearInterval(this.reconnection)
          }
        }, 5000)
      }
    },
    websocketonmessage (e) {
      const redata = JSON.parse(e.data)
      switch (redata.code) {
        case 1:
          this.onlineCount = redata.onlineCount
          if (this.userOnlineNotice === '1' && redata.isNew === 0) {
            this.info()
          }
          break
      }
    },
    websocketsend (Data) {
      this.websock.send(Data)
    },
    websocketclose (e) {
      console.log('断开连接', e)
    },
    info () {
      this.$Notice.info({
        title: '有新的小伙伴上线啦'
      })
    },
    onNoticeVal (isNotice) {
      this.userOnlineNotice = isNotice
    },
    newApiNotice (apiName) {
      this.$Notice.info({
        title: 'API更新通知',
        duration: 8,
        render: h => {
          return h('span', {
            attrs: {
              style: 'line-height: 21px'
            }
          }, [
            apiName + ' 已更新，',
            h('a', {
              attrs: {
                href: 'https://baidu.com'
              }
            }, '点击查看')
          ])
        }
      })
    }
  }
}
</script>

<style>
body {
  background: #f8f8f9;
}
</style>
