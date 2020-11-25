<template>
<div class="header"><p @click.stop="openBoardEdit">{{board.boardName}}</p>
<p>{{board.boardDesc}}</p>
<!-- <p v-if="board.members > 1">شما و چند نفر دیگر در این بورد مشترک هستید</p> -->
<div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalAddList" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>ایجاد لیست جدید</template>
 <div class="createBoardc">    <InputText type="text" v-model="listname" placeholder="نام کارت" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="listdesc" :autoResize="true" rows="5" cols="30" placeholder="توضیحات کارت" />

    <Button label="ایجاد کارت" v-on:click.stop="createNewList" />
</div>
</Dialog>
</div>
<div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalEditList" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>ویرایش لیست</template>
 <div class="createBoard"> <p class="name">نام</p> <InputText type="text" class="name" v-model="listname" placeholder="نام لیست" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Button label="حذف" class="remove" v-on:click.stop="removeList" />
    <Button label="ذخیره" class="save" v-on:click.stop="editList" />
</div>
</Dialog>

</div>
<!-- edit list -->
<!-- <div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalEditList" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>ویرایش لیست</template>
 <div class="createBoardc">    <InputText type="text" v-model="listname" placeholder="نام کارت" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Button label="ذخیره" v-on:click.stop="editList" />
</div>
</Dialog>
</div> -->
<!-- edit board-->
<div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalEditBoard" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>ویرایش بورد</template>
 <div class="createBoard"> <p class="name">نام</p> <InputText type="text" class="name" v-model="board.boardName" placeholder="نام لیست" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="board.boardDesc" class="desc" :autoResize="true" rows="5" cols="30" placeholder="توضیحات لیست" />
    <Button label="حذف" class="remove" v-on:click.stop="removeBoard" />
    <Button label="ذخیره" class="save" v-on:click.stop="updateBoard" />
</div>
</Dialog>

</div>
<!-- end edit board-->
<div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalEdit" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>جزییات تسک</template>
 <div class="createBoard"> <p class="name">نام</p> <InputText type="text" class="name" v-model="cardData.cardName" placeholder="نام لیست" />
 <!-- <Dropdown v-model="selectedUser" :options="boardMembers" optionLabel="userName" placeholder="Select a City" /> -->
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="cardData.cardDescription" class="desc" :autoResize="true" rows="5" cols="30" placeholder="توضیحات لیست" />
    <Button label="حذف" class="remove" v-on:click.stop="removeCard" />
    <Button label="ذخیره" class="save" v-on:click.stop="updateCard" />
</div>
</Dialog>

</div>
<!-- add card -->
<div class="dialogModal">
  <Dialog header="Header" v-model:visible="modalAddCard" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
<template #header>افزودن تسک</template>
 <div class="createBoard"> <p class="name">نام</p> <InputText type="text" class="name" v-model="cardData.cardName" placeholder="نام لیست" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="cardData.cardDescription" class="desc" :autoResize="true" rows="5" cols="30" placeholder="توضیحات لیست" />
    <Button label="ذخیره" class="save" v-on:click.stop="createCard" />
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
      <p class="listname" :id="list._id" @click.stop="openmodalEditList">{{list.listName}}</p>
      <div class="todos" :value=list._id>
              <p v-for="task in list.cards" :key="task._id" v-on:click.stop="openEdit" :id="task._id">
                {{task.cardName}}
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
import { get, post, refreshToken, put, del } from '@/utils/http'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
// import Dropdown from 'primevue/dropdown'
// import Card from 'primevue/card'
export default defineComponent({
  name: 'Board',
  components: {
    // 'vue-scroll': vuescroll
    // Card,
    // Dropdown,
    Dialog,
    InputText,
    Textarea,
    Button
  },
  data() {
    return {
      lists: [],
      selectedUser: null,
      modalEdit: false,
      modalEditBoard: false,
      modalEditList: false,
      modalAddCard: false,
      board: { _id: '', boardName: '', boardDesc: '', cards: [] },
      gotdata: false,
      activeSlide: 0,
      name: '',
      description: '',
      listIndex: '',
      listId: '',
      listname: '',
      boardid: '',
      boardMembers: '',
      modalAddList: false,
      cardData: { _id: '', cardName: '', cardDescription: '' },
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
        if (!this.modalAddCard) {
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
      this.modalAddCard = true
      this.listId = event.currentTarget.id
    },
    openBoardEdit(event: any) {
      this.modalEditBoard = true
      console.log(event.currentTarget)
    },
    removeBoard() {
      del('/v2/board', { boardId: this.board._id }).then((res) => {
        if (res.status === 'success') {
          this.modalEditBoard = false
          this.$router.push('/login')
        }
      })
    },
    updateBoard() {
      if (this.board.boardName !== '') {
        put('/v2/board', { boardId: this.board._id, boardName: this.board.boardName, boardDesc: this.board.boardDesc }).then((res) => { this.modalEditBoard = false })
      }
    },
    openEdit(event: any) {
      console.log(event.currentTarget.id)
      get(`/v2/cards/${event.currentTarget.id}`).then((res) => {
        this.cardData = res.message
        this.modalEdit = true
      })
      this.modalEdit = true
    },
    openmodalEditList(event: any) {
      this.listname = event.currentTarget.innerText
      this.listId = event.currentTarget.id
      this.modalEditList = true
    },
    editList() {
      if (this.listname !== '') {
        put('/v2/list', { listId: this.listId, listName: this.listname }).then(res => {
          console.log(res)
          this.getlisttasks()
          this.modalEditList = false
        })
      }
    },
    closeAdd() {
      this.modalAddCard = false
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
        post('/v2/list', {
          listName: this.listname,
          // eslint-disable-next-line @typescript-eslint/camelcase
          boardId: this.board._id
        }).then((res) => {
          if (res.status === 'success') {
            this.getlisttasks()
            this.modalAddList = false
          }
        })
      }
    },
    updateCard() {
      if (this.cardData.cardName !== '' && this.cardData.cardDescription !== '') {
        put(`/v2/cards/${this.cardData._id}`, { cardId: this.cardData._id, cardName: this.cardData.cardName, cardDescription: this.cardData.cardDescription }).then((res) => {
          this.getlisttasks()
          this.modalEdit = false
        })
      }
    },
    removeCard() {
      del(`/v2/cards/${this.cardData._id}`).then(res => {
        console.log(res)
        this.getlisttasks()
        this.modalEdit = false
      })
    },
    getlisttasks() {
      get(`/v2/board/${this.$route.params.id}/lists`).then((res) => {
        if (res.message === 'authorization token not found' || res.message === 'authorization token not valid') {
          try {
            post('/v2/refreshToken', {
            // eslint-disable-next-line @typescript-eslint/camelcase
              rToken: localStorage.getItem('refresh_token')
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
        console.log(res)
        res.message.push({ cards: [{ place: 'holder' }] })
        this.lists = res.message
      })
    },
    removeList(event: any) {
      del('/v2/list', { listId: this.listId }).then((res) => {
        console.log(res)
        this.getlisttasks()
        this.modalEditList = false
      })
    },

    createCard(event: any) {
      post('/v2/cards', {
        cardName: this.cardData.cardName,
        cardDescription: this.cardData.cardDescription,
        listId: this.listId,
        boardId: this.board._id
      }).then((res) => {
        console.log(res)
        this.getlisttasks()
        this.modalAddCard = false
      })
      console.log(this.listId)
    }
  },
  beforeCreate: function () {
    document.body.className = 'board'
  },
  async mounted() {
    setInterval(refreshToken, 300000)
    await get(`/v2/board/${this.$route.params.id}`).then((res) => {
      if (res.status === 'failure') {
        console.error(res.error)
      }
      console.log(res)
      this.board = res
    })

    await get(`/v2/board/${this.$route.params.id}/lists`).then((res) => {
      if (res.message === 'authorization token not found' || res.message === 'authorization token not valid') {
        try {
          post('/v2/refreshToken', {
            // eslint-disable-next-line @typescript-eslint/camelcase
            rToken: localStorage.getItem('refresh_token')
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
      console.log(res)
      res.message.push({ place: 'holder' })
      this.lists = res.message
    })

    await get(`/v2/board/${this.board._id}/members`).then((res) => {
      this.boardMembers = res
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
  display: grid;
  //justify-content: center;
  flex-direction: column;
  height: 100%;
  border: black;
}
.createList {
    align-self: center;
    border: black 0px;
    width: 200px;
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

.createBoard{
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: repeat(3, 1fr);
grid-column-gap: 0px;
grid-row-gap: 0px;
}

.createBoard .name{
  grid-area: 1 / 1 / 2 / 3;
}

.createBoard .remove{
  grid-area: 3 / 2 / 4 / 3;
}
.createBoard .p-button{
  margin: auto;
}
.createBoard .p-inputtext{
  margin: auto 0 auto 0;
}
.createBoard .save { grid-area: 3 / 1 / 4 / 2; }
.createBoard .desc { grid-area: 2 / 1 / 3 / 3; }

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
      display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-gap: .5rem;
    align-items: flex-start;
    grid-auto-flow: column;
      grid-auto-columns: minmax(350px, 1fr);

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
  flex-wrap: wrap;
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
