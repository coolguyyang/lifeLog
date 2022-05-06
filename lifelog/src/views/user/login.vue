<template>
  <div class="login">
    <mytitle :isleft="true" :isright="true" />
    <div v-show="logintype" class="input-login">
      <div class="tel">
        <input
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          v-model="count"
        />
      </div>
      <div class="password">
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          maxlength="16"
        />
      </div>
    </div>
    <div v-show="logintype" class="dl">
      <button class="reg" @click="logintype = false">注册</button>
      <button :class="candl" @click="dl()">登录</button>
    </div>

    <div v-show="!logintype" class="input-reg">
      <div class="tel">
        <input
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          @input="cantel()"
          v-model="tel"
        />
        <div class="set" :class="msg.class" @click="send()">{{ msg.v }}</div>
      </div>
      <div class="check">
        <input
          v-model="check"
          type="tel"
          placeholder="请输入短信验证码"
          maxlength="6"
        />
      </div>
      <div class="reg">
        <button :class="canzc" @click="canzc ? (show = true) : ''">注册</button>
      </div>
      <div class="lt" @click="logintype = true">密码登录</div>
    </div>

    <div class="tip">未注册的手机号将自动生成新账号</div>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper">
        <div class="block" @click.stop>
          <input
            v-model="userName"
            type="text"
            placeholder="请输入用户名"
            maxlength="16"
          />
          <input
            v-model="zcpassword"
            type="password"
            placeholder="请输入密码"
            maxlength="16"
          />
          <button :class="cansend" @click="zc()">确认注册</button>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import mytitle from '../../components/mytitle.vue'
import axios from 'axios'
import http from '../../utils/http'
import { Notify } from 'vant'
export default {
  name: 'login',
  data() {
    return {
      logintype: true,
      show: false,
      msg: {
        v: '发送验证码',
        class: '',
      },
      tel: '',
      check: '',
      count: '',
      password: '',
      zcpassword: '',
      userName:'',
    }
  },
  components: {
    mytitle,
  },
  computed: {
    candl() {
      return this.password.length >= 6 && this.count.length === 11
        ? 'canbutton'
        : ''
    },
    canzc() {
      return this.check && this.tel.length === 11 ? 'canbutton' : ''
    },
    cansend() {
      return this.zcpassword.length >= 6 && this.userName.length >0 ? 'canbutton' : ''
    },
  },
  methods: {
    cantel() {
      this.msg.class = this.tel.length === 11 ? 'seted' : ''
    },
    send() {
      if (this.msg.class === '' || this.msg.t2) return
      else {
        let t = 10
        console.log('发送请求tel:' + this.tel)
        this.msg.t2 = setInterval(() => {
          if (t === 0) {
            clearInterval(this.msg.t2)
            this.msg.v = '重新发送'
            this.msg.t2 = ''
            this.msg.class = 'seted'
          } else {
            this.msg.v = t + 's'
            this.msg.class = ''
            t--
          }
        }, 1000)
      }
    },
    dl() {
      if (this.candl) {
        axios
          .post(http.server+'/login', {
            tel: this.count,
            password: this.password,
          })
          .then((res) => {
            let userinfo = { ...res.data.message, token: res.data.token }
            if (res.data.status !== 0) {
              Notify({ type: 'primary', message: res.data.message })
            } else {
              this.$store.dispatch('LoginAction', userinfo)
              this.$router.push('./my')
              this.clear()
            }
          })
      }
    },
    zc() {
      if (this.cansend) {
        axios
          .post(http.server+'/register', {
            tel: this.tel,
            userName: this.userName,
            password: this.zcpassword,
          })
          .then((res) => {
            console.log(res)
            this.show = false
            if (res.data.status === 0) {
              this.logintype = true
              this.clear()
            }
            Notify({ type: 'primary', message: res.data.message })
          })
      }
    },
    clear() {
      this.tel = ''
      this.check = ''
      this.count = ''
      this.password = ''
      this.zcpassword = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  background: #f5f5f5;
  .input-login,
  .input-reg {
    margin-top: 1.3333rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0.48rem;
    display: flex;
    flex-direction: column;
    input {
      border: none;
      outline: none;
      background-color: inherit;
      width: 6.933333rem;
      height: 0.56rem;
    }
    .password,
    .tel,
    .check {
      border-bottom: 0.026667rem solid #e5e5e5;
      padding-bottom: 0.24rem;
    }
    .tel {
      height: 0.56rem;
      position: relative;
    }
    .password input,
    .check input {
      padding-top: 0.533333rem;
    }
  }
  .input-reg {
    .tel {
      .seted {
        color: #df2d2d;
        background-color: #f8f8f8;
        border: 0.026667rem solid #df2d2d;
      }
    }
    .set {
      position: absolute;
      top: 0;
      right: 0;
      color: #999;
      background-color: #dcdcdc;
      border: 0.026667rem solid #dcdcdc;
      text-align: center;
      padding: 0.08rem 0.2rem;
      border-radius: 0.08rem;
    }
    .reg {
      margin: 0.8rem 0;
      button {
        width: 100%;
      }
      .canbutton {
        color: #fff;
        background: #df2d2d;
      }
    }
    .lt {
      width: 1.6rem;
    }
  }
  .dl {
    margin: 0.8rem 0;
    display: flex;
    justify-content: space-around;
    .reg {
      background: #fff;
      border: 1px solid #999;
    }
    .canbutton {
      color: #fff;
      background: #df2d2d;
    }
  }
  button {
    color: #999;
    background: #e5e5e5;
    border: none;
    line-height: 1.04rem;
    text-align: center;
    border-radius: 0.12rem;
    width: 4.5333rem;
    font-size: 0.4rem;
  }
  .tip {
    font-family: PingFangSC-Regular;
    font-size: 0.346667rem;
    color: #999999;
    text-align: center;
  }
}
.login ::placeholder {
  color: -internal-light-dark(rgb(0, 0, 0), white);
  font-size: 0.4rem;
}
.wrapper {
  display: flex;
  justify-content: center;
  height: 100%;
}

.block {
  width: 8.5333rem;
  height: 4.2667rem;
  margin-top: 40%;
  border-radius: 0.6rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  input {
    height: 1rem;
    width: 7rem;
    border-radius: 0.3rem;
  }
  .canbutton {
    color: #fff;
    background: #0dbcd3;
  }
}
</style>
