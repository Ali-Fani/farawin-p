<template>
<div class="slider">
  <div class="slides">
    <div class="slide" v-for="board in boards" :key="board._id">
      <input v-model="list" hidden>
      <div class="todos" :value=board._id>
              {{board.name}}
              <p v-for="task in board.tasks" :key="task._id">
                {{task.name}}
              </p>

      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { get, post } from '@/utils/http'
import vuescroll from 'vuescroll'
// import Card from 'primevue/card'
export default defineComponent({
  name: 'Board',
  components: {
    // 'vue-scroll': vuescroll
    // Card
  },
  data() {
    return {
      boards: null,
      tasks: null,
      lists: '',

    }
  },
  watch: {
    list: {
      handler: function () {
        console.log(this.lists)
      },
    },
  },
  methods: {
    opentasks: function (event: { currentTarget: any }) {
      const target = event.currentTarget
      console.log(target.id)

      get(`/v1/list/${target.id}/tasks`).then((res) => {
        console.log(res)
        if (res.error === 'access token is required') {
          try {
            post('/v1/auth/refresh-token', {
            // eslint-disable-next-line @typescript-eslint/camelcase
              refresh_token: localStorage.getItem('refresh_token')
            }).then((res) => {
              if (res.refresh_token) {
                localStorage.setItem('refresh_token', res.refresh_token)
              }
              this.$router.push('/login')
            })
          } catch (error) {
            this.$router.push('/login')
          }
        }
        console.log(res)
        this.tasks = res
      })
    },
  },
  mounted() {
    get('/v1/task').then((res) => {
      console.log(res)
    })
    get(`/v1/board/${this.$route.params.id}/lists`).then((res) => {
      if (res.error === 'access token is required') {
        try {
          post('/v1/auth/refresh-token', {
            // eslint-disable-next-line @typescript-eslint/camelcase
            refresh_token: localStorage.getItem('refresh_token')
          }).then((res) => {
            if (res.refresh_token) {
              localStorage.setItem('refresh_token', res.refresh_token)
            }
            this.$router.push('/login')
          })
        } catch (error) {
          console.log(error)
          this.$router.push('/login')
        }
      }
      this.boards = res
    })
  },
  created() { console.log('created') }
})
</script>
<style lang="scss" scoped>
$colorPrimary:#1059bc;
$colorWhite:#fff;
$colorBlack:#000;

* {
  box-sizing: border-box;
}

.slider {
  width: 100%;
  overflow: hidden;
  margin: auto;
  margin-top: 2rem;
}
.todos{
  font-size: 2rem
}
.slides {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  margin-right: 10px;
  /*
  scroll-snap-points-x: repeat(300px);
  scroll-snap-type: mandatory;
  */
}
.slides::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.slides::-webkit-scrollbar-thumb {
  background: black;
  border-radius: 10px;
}
.slides::-webkit-scrollbar-track {
  background: transparent;
}
.slides > div {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 90%;
  height: 90%;
  border-radius: 10px;
  background: #eee;
  transform-origin: center center;
  transform: scale(1);
  transition: transform 0.5s;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 100px;
  margin-left: 1.5rem;
  padding-right: 1rem;
}
.slides > div:target {
/*   transform: scale(0.8); */
}
.author-info {
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.75rem;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
}
.author-info a {
  color: white;
}
img {
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slider > a {
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  background: white;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 0 0.5rem 0;
  position: relative;
}
.slider > a:active {
  top: 1px;
}
.slider > a:focus {
  background: #000;
}

/* Don't need button navigation */

html, body {
  height: 100%;
  overflow: hidden;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Ropa Sans', sans-serif;
}
</style>
