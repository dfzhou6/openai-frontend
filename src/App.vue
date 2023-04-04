<template>
  <div id="app" class="container">
    <div><br></div>
    <div id="message-list" class="row">
      <div class="message" v-for="(item, idx) in messageList" :key="idx">
        <img :class="[item.isRobot ? 'avator-left' : 'avator-right', 'img-thumbnail']" :src="item.src" alt="头像" />
        <div :class="[item.isRobot ? 'md-left' : 'md-right', 'card', 'col-6']">
          <vue-markdown :id="item.id" :source="item.message" class="card-body"></vue-markdown>
        </div>
        <div style="clear: both;"><br></div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="input-group">
          <input class="form-control" id="message-input" type="text" v-model="question" />
          <button @click="sendMessge" class="btn btn-primary" type="button">发送</button>
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

export default {
  name: 'App',
  components: {
    VueMarkdown
  },
  data () {
    return {
      question: '',
      messageList: [{id: uuidv4(), isRobot: true, src: require('./assets/robot.png'), message: '你好呀，我是AI机器人，有什么可以帮到你的吗？'}],
      count: 0,
      requestId: 0
    }
  },
  mounted () {
    this.requestId = Date.now() + '_' + Math.round(Math.random() * 10000)
  },
  methods: {
    sendMessge () {
      if (this.question.length > 0) {
        let uuidMe = uuidv4()
        this.messageList.push({id: uuidMe, isRobot: false, src: require('./assets/me.png'), message: this.question})

        let uuidRobot = uuidv4()
        let messageItem = {id: uuidRobot, isRobot: true, src: require('./assets/robot.png'), message: '请稍候...'}
        this.messageList.push(messageItem)

        window.scrollTo(0, document.body.scrollHeight)
        window.scrollTo(0, document.documentElement.scrollHeight)

        let startTime = 0
        const eventSource = new EventSource(`https://ai-fozhu.cn/index.php?req_id=${this.requestId}&question=${this.question}`)
        eventSource.onmessage = function (e) {
          if (e.data === '[DONE]') {
            eventSource.close()
          } else {
            let txt = JSON.parse(e.data).choices[0].delta.content
            if (txt !== undefined) {
              if (startTime === 0) {
                messageItem.message = ''
              }
              setTimeout(function () {
                messageItem.message += txt
                window.scrollTo(0, document.body.scrollHeight)
              }, startTime)
              startTime += 30
            }
          }
        }
        eventSource.onerror = function (e) {
          console.log(e)
          eventSource.close()
        }

        this.question = ''
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
.md-right {
  float: right;
  background-color: #e7f8ff;
}
</style>
