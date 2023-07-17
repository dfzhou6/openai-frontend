<template>

  <div>
    <div><br></div>
    <h2 class="w-75 mx-auto pt-3">登录你的 FelixChatGPT 账号!</h2>
    <div class="w-75 mx-auto px-3 py-3 mt-5 border text-bg-light rounded shadow">
      <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">账号</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" id="staticEmail" placeholder="请输入你的账号" v-model="username">
        </div>
      </div>
      <div class="mb-3 row">
        <label for="inputPassword" class="col-sm-2 col-form-label">密码</label>
        <div class="col-sm-10">
          <input type="password" class="form-control" id="inputPassword" v-model="password">
        </div>
      </div>
      <div class="mb-3 row px-2">
        <button type="button" class="btn btn-primary" @click="signIn">登录</button>
      </div>
      <div class="mb-3 row text-center"><i><a class="" href="#" title="Please contact with felix">没有账号? 关注微信公众号: felixzhou777, 免费领取</a></i></div>
      <div class="row text-center"><i><a class="" href="#" title="Please contact with felix">忘记密码? 进入微信公众号: felixzhou777, 查看历史</a></i></div>

    </div>
    <div class="w-75 mx-auto px-3 py-3 mb-5">
      <div>
        <p class="text-center"><i>觉得很有帮助？点击 <a class="text-wrap" @click="appreciateAuthor">打赏作者</a> ，你的打赏是我前进的动力</i></p>
        <img :class="[ isShowAppreciateQRCode ? 'showAppreciateQRCode' : 'hiddenAppreciateQRCode', 'img-thumbnail', 'mx-auto' ]" :src="require('./assets/receive.jpg')" alt="你的打赏是我前进的动力" />
      </div>
    </div>


  </div>

</template>

<script>

// import md5 from 'js-md5'
const bcrypt = dcodeIO.bcrypt

export default {
  name: 'Login',
  data () {
    return {
      isShowAppreciateQRCode: false,
      username: "",
      password: ""
    }
  },
  methods: {
    signIn () {
      if (this.username.length == 0 || this.password.length == 0) {
        alert('请输入账号密码')
        return
      }

      let hashPassword = bcrypt.hashSync(md5('si1ow4ox_' + this.password), 10)
      const body = {
        username: this.username,
        password: hashPassword
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
      fetch('https://ai-fozhu.cn/api/login', requestOptions)
      .then(response => {
        if (response.ok) {
          // 处理响应的数据
          response.json().then(data => {
            console.log(data);
            if (data.code == 0) {
              localStorage.setItem('felixChatGPT_expire_time', data.data.expire_time)
              localStorage.setItem('felixChatGPT_username', this.username)
              this.goToChat()
            } else {
              alert(data.msg)
            }
          });
        } else {
          alert('服务器出错');
        }
      })
      .catch(error => {
        console.error(error);
      });

    },
    goToChat () {
      this.$router.push({name: 'chat'})
    },
    appreciateAuthor () {
      this.isShowAppreciateQRCode = !this.isShowAppreciateQRCode
    }
  }
}

</script>

<style>
.showAppreciateQRCode {
  display: block;
  width: 70%;
}

.hiddenAppreciateQRCode {
  display: none;
}
</style>
