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
    </div>

  </div>

</template>

<script>

import constant from './constant'
// eslint-disable-next-line no-undef
const bcrypt = dcodeIO.bcrypt

export default {
  name: 'Login',
  data () {
    return {
      isShowAppreciateQRCode: false,
      username: '',
      password: ''
    }
  },
  methods: {
    signIn () {
      if (this.username.length === 0 || this.password.length === 0) {
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
      }
      console.log(constant.BASE_URL)
      fetch(`${constant.BASE_URL}/api/login`, requestOptions)
        .then(response => {
          if (response.ok) {
          // 处理响应的数据
            response.json().then(data => {
              console.log(data)
              if (data.code === 0) {
                localStorage.setItem('felixChatGPT_expire_time', data.data.expire_time)
                localStorage.setItem('felixChatGPT_username', this.username)
                this.goToChat()
              } else {
                alert(data.msg)
              }
            })
          } else {
            alert('服务器出错')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    goToChat () {
      this.$router.push({name: 'chat'})
    }
  }
}

</script>

<style>
</style>
