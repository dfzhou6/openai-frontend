<template>
  <div id="app" class="container">
    <div><br></div>
    <div id="message-list" class="row">
      <div class="message" v-for="(item, idx) in messageList" :key="idx">
        <img :class="[item.isRobot ? 'avator-left' : 'avator-right', 'img-thumbnail']" :src="item.src" alt="头像" />
        <div :class="item.class">
          <vue-markdown :id="item.id" :source="item.message" class="card-body"></vue-markdown>
        </div>
        <div style="clear: both;"><br></div>
      </div>
    </div>
    <div class="row">
      <button class="btn btn-secondary btn-stop" @click="stopAnswer" type="button">停止回答</button>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="input-group">
          <textarea class="form-control" id="message-input" type="text" v-model="question" @keydown.enter="ctrlSendMessage" placeholder="请输入...  (Enter : 发送, Ctrl+Enter : 换行)" />
          <button @click="sendMessge" class="btn btn-primary btn-send" type="button">发送</button>
        </div>
      </div>
    </div>
    <div class="row">
      <br>
    </div>

  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

const baseUrl = 'https://ai-fozhu.cn'
const helloMsg = '你好呀，我是AI机器人，有什么可以帮到你的吗？'
const standByMsg = '请稍候...'
const errRespondMsg = '请求出错...'

export default {
  name: 'App',
  components: {
    VueMarkdown
  },
  data () {
    return {
      question: '',
      messageList: [{id: uuidv4(), isRobot: true, src: require('./assets/robot.png'), message: helloMsg, class: ['md-left', 'md-left-done', 'card', 'col-6']}],
      count: 0,
      requestId: 0,
      timeOutList: [],
      eventSource: null
    }
  },
  mounted () {
    this.requestId = Date.now() + '_' + Math.round(Math.random() * 10000)
  },
  methods: {
    sendMessge () {
      if (this.question.length > 0) {
        let robotClass = ['md-left', 'card', 'col-6']
        let meClass = ['md-right', 'card', 'col-6']
        let uuidMe = uuidv4()
        this.messageList.push({id: uuidMe, isRobot: false, src: require('./assets/me.png'), message: this.question, class: meClass})

        let uuidRobot = uuidv4()
        let messageItem = {id: uuidRobot, isRobot: true, src: require('./assets/robot.png'), message: standByMsg, class: robotClass}
        this.messageList.push(messageItem)

        window.scrollTo(0, document.body.scrollHeight)
        window.scrollTo(0, document.documentElement.scrollHeight)

        let startTime = 0
        const that = this
        const eventSource = new EventSource(`${baseUrl}/index.php?req_id=${this.requestId}&question=${this.question}`)
        this.eventSource = eventSource
        eventSource.onmessage = function (e) {
          if (e.data === '[DONE]') {
            startTime += 30
            let timeOutId = setTimeout(function () {
              messageItem.class.push('md-left-done')
              that.stopAnswer()
            }, startTime)
            that.timeOutList.push(timeOutId)
            eventSource.close()
          } else {
            let txt = JSON.parse(e.data).choices[0].delta.content
            if (txt !== undefined) {
              if (startTime === 0) {
                messageItem.message = ''
              }
              let timeOutId = setTimeout(function () {
                messageItem.message += txt
                window.scrollTo(0, document.body.scrollHeight)
              }, startTime)
              that.timeOutList.push(timeOutId)
              startTime += 30
            }
          }
        }
        eventSource.onerror = function (e) {
          messageItem.message = errRespondMsg
          messageItem.class.push('md-left-err')
          eventSource.close()
        }

        this.question = ''
      }
    },
    ctrlSendMessage (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.question = this.question + '\n'
      } else {
        e.preventDefault()
        this.sendMessge()
      }
    },
    stopAnswer () {
      if (this.eventSource !== null) {
        this.eventSource.close()
        this.eventSource = null
      }
      if (this.timeOutList.length > 0) {
        for (const v of this.timeOutList) {
          clearTimeout(v)
        }
        this.timeOutList = []
      }
    }
  }
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
</script>

<style>
.avator-left {
  width: 40px;
  height: 40px;
  float: left;
  margin-right: 5px;
}
.avator-right {
  width: 40px;
  height: 40px;
  float: right;
  margin-left: 5px;
}
.md-left {
  float: left;
  background-color: #eaeef2;
}
.md-left-done {
  background-color: #e7f8e8;
}
.md-left-err {
  background-color: #f6dcdc;
}
.md-right {
  float: right;
  background-color: #e7f8ff;
}
.btn-stop {
  margin: 0 auto 25px auto;
  width: 100px;
  font-size: medium;
}
.btn-send {
  width: 80px;
  font-size: medium;
}
</style>
