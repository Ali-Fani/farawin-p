<template>
<div class="header">{{board.name}}
<p>{{board.description}}</p>

<div v-if="gotdata" class="boardmembers"><p v-if="board.members.lenght > 1">شما و {{board.members.length}} نفر دیگر در این بورد مشترک هستید</p><p v-else>شما تنها عضو این بورد هستید</p></div>
<!-- <p v-if="board.members > 1">شما و چند نفر دیگر در این بورد مشترک هستید</p> -->
<div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalAdd" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>ایجاد کارت جدید</template>
 <div class="createBoardc">    <InputText type="text" v-model="name" placeholder="نام کارت" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="description" :autoResize="true" rows="5" cols="30" placeholder="توضیحات کارت" />

    <Button label="ایجاد کارت" v-on:click.stop="createBoard" />
</div>
</Dialog>

</div>
<div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalAddList" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>ایجاد لیست جدید</template>
 <div class="createBoard">    <InputText type="text" v-model="listname" placeholder="نام لیست" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="listdesc" :autoResize="true" rows="5" cols="30" placeholder="توضیحات لیست" />

    <Button label="ایجاد لیست" v-on:click.stop="createNewList" />
</div>
</Dialog>

</div>
</div>
<div class="slider">
  <div class="slides">
    <div class="slide" v-for="(list,index) in lists" :key="list._id" :id="index" :ref="index">
      <div class="newList" v-if="!list._id">
        <button class="createList" @click.stop="createList">ایجاد لیست جدید</button>
      </div>
      <p class="listname">{{list.name}}</p>
      <div class="todos" :value=list._id>
              <p v-for="task in list.tasks" :key="task._id" v-on:click.stop="openEdit(task)">
                {{task.name}}
              </p>

      </div>
<button class="addTask" v-if="list._id" v-on:click=openAdd :id="list._id">ایجاد کارت جدید <b>+</b></button>

    </div>
  </div>
</div>
<div class="pagination">
  <a v-for="(list,index) in lists" :key="list._id" :href="'#' + index"></a>
</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { get, post, refreshToken } from '@/utils/http'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
// import Card from 'primevue/card'
export default defineComponent({
  name: 'Board',
  components: {
    // 'vue-scroll': vuescroll
    // Card
    Dialog,
    InputText,
    Textarea,
    Button
  },
  data() {
    return {
      lists: null,
      modalAdd: false,
      modalEdit: false,
      board: { _id: '' },
      gotdata: false,
      activeSlide: 0,
      name: '',
      description: '',
      listId: '',
      listname: '',
      listdesc: '',
      boardid: '',
      modalAddList: false,
    }
  },
  watch: {
    list: {
      handler: function () {
        console.log(this.lists)
      },
    },
    modalAdd: {
      handler: function () {
        if (!this.modalAdd) {
          this.listId = ''
        }
      }
    },
    // modalEdit: {
    //   handler: function () {
    //     console.log(this.taskname)
    //     if (!this.modalEdit) {
    //       this.taskname = ''
    //       this.taskdescription = ''
    //       this.taskid = ''
    //     }
    //   }
    // }
  },
  methods: {
    openAdd(event: any) {
      this.modalAdd = true
      this.listId = event.currentTarget.id
    },
    openEdit(task: any) {
      console.log(task._id)
    },
    closeAdd() {
      this.modalAdd = false
      this.name = ''
      this.description = ''
    },
    closeEdit() {
      this.modalEdit = false
    },
    createList() {
      this.modalAddList = true
    },
    createNewList() {
      if (this.board) {
        console.log(this.board._id)
        post('/v1/list', {
          name: this.listname,
          // eslint-disable-next-line @typescript-eslint/camelcase
          board_id: this.board._id
        }).then((res) => {
          if (res.insertedCount === 1) {
            this.getlisttasks()
            this.modalAddList = false
          }
        })
      }
    },
    getlisttasks() {
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
        res.push({ test: 'wow' })
        this.lists = res
      })
    },
    createBoard(event: any) {
      post('/v1/task', {
        name: this.name,
        desc: this.description,
        idList: this.listId
      }).then((res) => {
        console.log(res)
        this.getlisttasks()
        this.modalAdd = false
      })
      console.log(this.listId)
    }
  },
  beforeCreate: function () {
    document.body.className = 'board'
  },
  async mounted() {
    setInterval(refreshToken, 300000)
    await get(`/v1/board/${this.$route.params.id}`).then((res) => {
      if (res.status === 'failure') {
        console.error(res.error)
      }
      console.log(res)
      this.board = res
    })

    await get(`/v1/board/${this.$route.params.id}/lists`).then((res) => {
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
      res.push({ test: 'wow' })
      this.lists = res
    })

    this.gotdata = true
  },
})
</script>
<style lang="scss" scoped>
$colorPrimary:#1059bc;
$colorWhite:#fff;
$colorBlack:#000;
html{
  background: #F2F2F2;
}
.newList {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  border: black;
}
.createList {
    align-self: center;
    border: black 0px;
    width: 40vw;
    height: 5vh;
    text-align: center;
    /* border-style: solid; */
    margin: auto;
    border-radius: 5px;
    background: #f2f2f2;
}
* {
  box-sizing: border-box;
}
.header {
  width: 100%;
  height: 30vh;
  background: #FF6A9E;
  color: #FFFFFF;
  padding: 1rem;
}
.dialogModal {
  width: 60%;
}
.pagination {
     justify-content: center;
    position: absolute;
    bottom: 5vh;
    display: flex;
    width: 100%;

}
.pagination > * {
  margin-left: 10px;
  background: black;
  border-color: black;
  opacity: 0.1;
  width: 0.7rem;
  height: 0.5rem;
  border-radius: 2px;
}
.currentSlide {
  background: #FF6A9E;
  border-color: #FF6A9E;
  height: 1rem;

}
.p-dialog {
  width: 50vh;
}
.boardmembers {
  font-size: 1rem;
}

.createBoardc{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.slider {
  width: 100%;
  overflow: hidden;
  margin: auto;
  margin-top: 2rem;
  top: 100px;
  position: absolute;
  ::after{
    margin-left: 1.5rem;
  }
}
.addTask{
    width: 90%;
    text-align: center;
    /* padding: 1rem; */
    height: 2rem;
    border-radius: 10px;
    border: none;
    background: #F2F2F2;
    color: #616161;
    /* margin-left: 5px; */
    /* justify-content: center; */
    align-self: center;
    margin-bottom: 2vh;
}
.todos{
  font-size: 1rem;
  width: 100%;
    text-align: right;
    overflow-y: auto;
    flex-grow: 1;
    padding-right: 1rem;
}
.slide {
  height: 90%;
    -webkit-box-shadow: 0px 1px 10px 1px rgba(0,0,0,0.25);
-moz-box-shadow: 0px 1px 10px 1px rgba(0,0,0,0.25);
box-shadow: 0px 1px 10px 1px rgba(0,0,0,0.25);
}
.slides {
  height: 75vh;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: auto;

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
  background: transparent;
  border-radius: 10px;
}
.slides::-webkit-scrollbar-track {
  background: transparent;
}
.slides > div {
  scroll-snap-align: center;
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
  font-size: 1rem;
  margin-left: 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  margin-right: 1.5rem;
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
.listname{
  padding-right: 1rem;
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
