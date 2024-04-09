<template>

  <div>
    <div><br></div>
    <h2 class="w-75 mx-auto pt-3">每日一句问候</h2>
    <div class="w-75 mx-auto px-3 py-3 mt-5 border text-bg-light rounded shadow">
      <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">内容</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" placeholder="请输入内容" v-model="words">
        </div>
      </div>
      <div class="mb-3 row">
        <label for="inputPassword" class="col-sm-2 col-form-label">来源</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" placeholder="请输入来源" v-model="source">
        </div>
      </div>
      <div class="mb-3 row px-2">
        <button type="button" class="btn btn-primary" @click="updateHelloMsg">更新</button>
      </div>
    </div>

  </div>

</template>

<script>

import constant from './constant'

export default {
  name: 'HelloMsg',
  data () {
    return {
      words: '',
      source: ''
    }
  },
  methods: {
    updateHelloMsg () {
      if (this.words.length === 0 || this.source.length === 0) {
        alert('内容不能为空')
        return
      }

      const body = {
        words: this.words,
        source: this.source
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
      fetch(`${constant.BASE_URL}/api/hello`, requestOptions)
        .then(response => {
          if (response.ok) {
          // 处理响应的数据
            response.json().then(data => {
              console.log(data)
              if (data.code === 0) {
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
