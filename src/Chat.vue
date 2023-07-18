<template>

  <div>
    <!-- <div class="row"><br></div> -->
    <nav class="navbar fixed-top bg-body-tertiary shadow" style="height: 58px;">
      <div class="container-fluid" style="margin-top: -4px;">
        <a class="navbar-brand" href="#">

        </a>
        <a class="navbar-brand" href="#">
          <div class="dropdown">
            <button class="btn dropdown-toggle shadow" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
              <i class="bi bi-list"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li class="mb-2"><a class="dropdown-item" href="#" @click="goToLogin"><i class="bi bi-box-arrow-in-left me-2"></i>重新登录</a></li>
              <!-- <li><hr class="dropdown-divider"></li> -->
              <!-- <li class="mb-2"><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@fat"><i class="bi bi-envelope me-2"></i>意见箱</a></li> -->
              <!-- <li><hr class="dropdown-divider"></li> -->
              <li><a class="dropdown-item" href="#" tabindex="0" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="bottom" data-bs-content="如遇到使用问题，请刷新页面，并重新登录"><i class="bi bi-question-circle me-2"></i>帮助</a></li>
            </ul>
          </div>
        </a>
      </div>
    </nav>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h1 class="modal-title fs-5" id="exampleModalLabel">意见箱</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body border-0 pb-0">
            <div class="mb-3">
              <label for="recipient-name" class="col-form-label">联系方式:</label>
              <input type="text" class="form-control" id="recipient-name" placeholder="非必填">
            </div>
            <div class="mb-3">
              <label for="message-text" class="col-form-label">意见建议:</label>
              <textarea class="form-control" id="message-text"></textarea>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-secondary shadow" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary shadow">提交</button>
          </div>
        </div>
      </div>
    </div>

    <div id="message-list" class="row" style="margin-top: 74px;">
      <div class="message" v-for="(item, idx) in messageList" :key="idx">
        <img :class="[item.isRobot ? 'avator-left' : 'avator-right', 'img-thumbnail', 'shadow', 'border-0']" :src="item.src" alt="头像" />
        <div :class="[item.class, 'shadow', 'border-0']">
          <!-- <vue-markdown :id="item.id" :source="item.message" class="card-body"></vue-markdown> -->
          <div :id="item.id" class="card-body" v-html="item.message"></div>
        </div>
        <div style="clear: both;"><br></div>
      </div>
      <div class="message-list-bottom"><br></div>
    </div>
    <div class="row fixed-bottom">
      <div><button class="btn btn-stop btn-sm shadow" @click="stopAnswer" type="button"><i class="bi bi-slash-square"></i></button></div>
      <div class="col-1 col-sm-1">
      </div>
      <div class="col-8 col-sm-9">
        <div class="input-group footer-input">
          <textarea class="form-control shadow border-0" id="message-input" rows="3" style="line-height: 30px;" type="text" v-model="question" @keydown.enter="ctrlSendMessage" placeholder="Ctrl+Enter: 换行" />
        </div>
      </div>
      <div class="col-2 col-sm-1">
        <div class="input-group footer-btn">
          <button @click="sendMessge" class="btn btn-outline-primary btn-lg shadow" type="button"><i class="bi bi-send"></i></button>
        </div>
      </div>
      <div class="col-sm-1">

      </div>
    </div>
  </div>

</template>

<script>
const baseUrl = 'https://ai-fozhu.cn'
const standByMsg = '请稍候...'
const errRespondMsg = '请求出错...'
const md = window.markdownit('default')

export default {
  name: 'ChatPage',
  data () {
    return {
      question: '',
      messageList: [],
      count: 0,
      requestId: 0,
      timeOutList: [],
      eventSource: null
    }
  },
  mounted () {
    if (!this.isLogin()) {
      alert('请重新登录')
      this.$router.push({name: 'login'})
      return
    }
    this.requestId = Date.now() + '_' + Math.round(Math.random() * 10000)
    this.setHelloMsg()
  },
  methods: {
    setHelloMsg() {
      const that = this
      let messageItem = {id: uuidv4(), isRobot: true, src: require('./assets/robot.png'), message: md.render(''), class: ['md-left', 'card', 'col-9', 'col-sm-6']}
      this.messageList.push(messageItem)
      const weekdays = ['日','一','二','三','四','五','六']
      let curDate = new Date
      const year = curDate.getFullYear();
      const month = String(curDate.getMonth() + 1).padStart(2, '0');
      const day = String(curDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      fetch('https://ai-fozhu.cn/api/hello', requestOptions)
      .then(response => {
        if (response.ok) {
          // 处理响应的数据
          response.json().then(data => {
            console.log(data);
            if (data.code == 0) {
              const source = data.data.source
              const words = data.data.words
              let curMessage = ''
              let helloMsg = '你好呀，今天是 ' + formattedDate + '，星期' + weekdays[curDate.getDay()] + '。\n\n"' + words + '"\n———《' + source + '》\n\n' + '新的一天，享受当下，要开心哦 ~\n\n让我们开始聊天吧 ~ '
              let startTime = 0
              let timeOutList = []
              for (let i = 0; i < helloMsg.length; i++) {
                startTime += 80
                let timeOutId = setTimeout(function () {
                  curMessage += helloMsg[i]
                  messageItem.message = md.render(curMessage)
                  if (i == helloMsg.length-1) {
                    messageItem.class.push('md-left-done')
                  }
                  window.scrollTo(0, document.body.scrollHeight)
                }, startTime)
                timeOutList.push(timeOutId)
              }
            } else {

            }
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
    },
    isLogin () {
      let expireTime = localStorage.getItem('felixChatGPT_expire_time')
      let curtime = Date.parse(new Date()) / 1000
      if (typeof(expireTime) === 'undefined') {
        return false
      }
      expireTime = parseInt(expireTime)
      if (expireTime == 0 || isNaN(expireTime) || curtime >= expireTime) {
        return false
      }
      return true
    },
    sendMessge () {
      let len = this.question.length
      if (len > 0) {
        if (len > 2000) {
          alert('内容长度不能超过2000')
          return
        }
        if (!this.isLogin()) {
          alert('请重新登录')
          this.$router.push({name: 'login'})
          return
        }

        let username = localStorage.getItem('felixChatGPT_username')
        let robotClass = ['md-left', 'card', 'col-9', 'col-sm-6']
        let meClass = ['md-right', 'card', 'col-9', 'col-sm-6']
        let uuidMe = uuidv4()
        this.messageList.push({id: uuidMe, isRobot: false, src: require('./assets/me.png'), message: md.render(this.question), class: meClass})
        setTimeout(function () {
          window.scrollTo(0, document.body.scrollHeight)
        }, 30)

        let uuidRobot = uuidv4()
        let messageItem = {id: uuidRobot, isRobot: true, src: require('./assets/robot.png'), message: md.render(standByMsg), class: robotClass}
        this.messageList.push(messageItem)
        setTimeout(function () {
          window.scrollTo(0, document.body.scrollHeight)
        }, 30)

        let startTime = 0
        const eventSource = new EventSource(`${baseUrl}/api/chat?username=${username}&req_id=${this.requestId}&question=${this.question}`)
        this.eventSource = eventSource
        const that = this
        let curMessage = ''
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
                curMessage += txt
                messageItem.message = md.render(curMessage)
                window.scrollTo(0, document.body.scrollHeight)
              }, startTime)
              that.timeOutList.push(timeOutId)
              startTime += 30
            }
          }
        }
        eventSource.onerror = function (e) {
          messageItem.message = md.render(errRespondMsg)
          messageItem.class.push('md-left-err')
          eventSource.close()
          alert('请重新登录')
          that.$router.push({name: 'login'})
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
    goToLogin() {
      this.$router.push({name: 'login'})
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
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 40%;
  font-size: medium;
}
.btn-send {
  width: 80px;
  font-size: medium;
}
.footer-input {
  margin-bottom: 20px;
}
.footer-btn {
  margin-top: 5px;
}
.message-list-bottom {
  height: 230px;
}
</style>
