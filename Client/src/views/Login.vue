<template>
  <div class="login">
    <img src="@/assets/logo.png" alt="" class="logo">
    <h1 class="title">به بورد فراوین خوش اومدی!</h1>
    <form v-if="mode === 'login'" class="form" @submit.prevent="login()">
      <label class="input-group">
        <input placeholder="نام کاربری" v-autofocus name="username" autocomplete="username" v-model="username" class="input" type="text">
      </label>
      <label class="input-group">
        <input placeholder="رمز عبور" name="password" autocomplete="password" v-model="password" class="input" type="password">
      </label>
      <button :class="{ 'is-loading': loading }" :disabled="loading" class="submit">
        <fw-loading v-if="loading" class="loading" />
        ورود
      </button>
      <button :disabled="loading" type="button" class="submit secondary-button" @click="$router.push('/register')">ثبت نام</button>
    </form>
    <form v-else class="form" @submit.prevent="register()">
      <label class="input-group">
        <input placeholder="نام کاربری" v-autofocus name="username" v-model="username" class="input" type="text">
      </label>
      <label class="input-group">
        <input placeholder="رمز عبور" name="password" autocomplete="new-password" v-model="password" class="input" type="password">
      </label>
      <label class="input-group">
        <input placeholder="ایمیل" name="email" autocomplete="email" v-model="email" class="input" type="email">
      </label>
      <button :disabled="loading" class="submit">ثبت نام</button>
      <button :disabled="loading" type="button" class="submit secondary-button" @click="$router.push('/login')">ورود</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { post } from '@/utils/http'
import Loading from '@/components/Loading.vue'

export default defineComponent({
  name: 'login',
  components: {
    FwLoading: Loading,
  },
  data() {
    return {
      username: '',
      password: '',
      email: '',
      loading: false,
      mode: '' as 'login' | 'register',
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        this.mode = route.name === 'Login' ? 'login' : 'register'
      },
    },
  },
  methods: {
    login() {
      this.loading = true
      post('/v1/auth/login', {
        username: this.username,
        password: this.password
      })
        .then((res: {status: string; access_token: string; refresh_token: string }) => {
          if (res.status === 'succes') {
            localStorage.setItem('access_token', res.access_token)
            localStorage.setItem('refresh_token', res.refresh_token)
            this.$router.push({ name: 'Boards' })
            console.log('going next page0')
          } else {
            alert('لاگین نشدی!')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    register() {
      this.loading = true
      post('/v1/auth/register', {
        username: this.username,
        password: this.password,
        email: this.email,
      })
        .then(res => {
          console.log(res.status)
          if (res.status === 'success') {
            this.login()
          } else {
            alert('ثبت نام نشدی!')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
</script>

<style scoped lang="scss">

.login {
  color: #e8f5fd;
}

.logo {
  width: 100px;
  display: block;
  margin: 3rem auto 0;
}

.title {
  font-size: 19px;
  text-align: center;
  margin: 2rem 0 2.5rem;
}

.form {
  width: 90%;
  max-width: 450px;
  margin: auto;
}

.input-group {
  display: block;
  margin: 1em 0;
}

.input {
  width: 100%;
  padding: .6rem .9rem;
  border-radius: 3px;
  border: 0;
  outline: 0;
  background: white;
  transition: background-color .3s;
  &:focus {
    background: #e0f4ff;
  }
}

.submit {
  border-radius: 3px;
  border: 0;
  display: block;
  width: 100%;
  padding: .6rem .9rem;
  text-align: center;
  background: #0079bf;
  border: 2px solid #0079bf;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin: 1rem 0;
  position: relative;
  &.is-loading {
    color: transparent;
  }
  &:hover {
    background: lighten($color: #0079bf, $amount: 4);
  }
}

.secondary-button {
  background: transparent;
  color:inherit;
}

.loading {
  font-size: 10px;
  position: absolute;
  right: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);
}
</style>
