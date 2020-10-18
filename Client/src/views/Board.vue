<template>
<!-- {{boards}} -->

<Accordion v-for="board in boards" :key="board._id" v-on:click=opentasks :id="board._id">
<AccordionTab :header=board.name>
  <div v-for="task in tasks" :key="task._id" class="task">
    <li>{{task.name}}</li>
    <li>{{task.desc}}</li>
  </div>
</AccordionTab>
</Accordion>
<!-- <Accordion>
<AccordionTab v-for="(board,index) in boards" :key="index" :header="board.name">
    {{ board.name }}
  </AccordionTab>
</Accordion> -->
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { get, post } from '@/utils/http'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
// import Card from 'primevue/card'
// import 'primevue/resources/primevue.min.css '

export default defineComponent({
  name: 'Board',
  components: {
    Accordion: Accordion,
    AccordionTab: AccordionTab,
    // Card: Card
  },
  data() {
    return {
      boards: null,
      tasks: null,

    }
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
    const array = document.getElementsByClassName('accordion')

    // console.log(document.getElementsByClassName('accordion'))
    console.log(array)
    console.log(array.length)
    for (let index = 0; index < array.length; index++) {
      console.log(index)
      // const element = array[index]
      console.log('hello world')
    }
    // array.forEach((element) => {
    //   element.addEventListener('click', function () {
    //     this.classList.toggle('active')
    //     const panel = this.nextElementSibling as HTMLElement
    //     if (panel.style.display === 'block') {
    //       panel.style.display = 'none'
    //     } else {
    //       panel.style.display = 'block'
    //     }
    //   }
    //   )
    // })

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
.app{
  background: red;
  margin: auto;
}

.accordion{
    background-color: #eee;
    margin: auto;
  color: #444;
  list-style-type: none;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 18px;
  min-width: 30vw;
  max-width: 60vw;
  text-align: center;
  border: none;
  outline: none;
  transition: 0.4s;
  border-radius: 10px;
}
.active, .accordion:hover {
  background-color: #ccc;
}
.panel {
  padding: 0 18px;
  background-color: white;
  display: none;
  overflow: hidden;
}
.task{
  list-style-type: none;
}
.list p{
  margin: auto;
  width: 100%;
  text-align: center;
}
</style>
