<template>

<div class="header">
<p>تخته ها</p>

<b v-on:click= openModal>+</b>
<Dialog header="Header" v-model:visible="display" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
  <Toast position="bottom-right" />
<template #header>ایجاد بورد جدید</template>
 <div class="createBoard">    <InputText type="text" v-model="name" placeholder="نام بورد" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="description" :autoResize="true" rows="5" cols="30" placeholder="توضیحات بورد" />

    <Button label="ایجاد بورد جدید" v-on:click.stop="createBoard" />
</div>
</Dialog>
</div>
<div class="boards" v-on:click= openboard v-if="boards">
<div class="grid-container" v-for="(board,index) in boards" :key="board._id" :id="index" v-on:click= openboard >
<p class="remove" v-on:click.stop=deleteboard :id="index">حذف</p>
  <div class="name" :id="index">{{board.name}}</div>
  <div class="description"  :id="index">{{board.description}}</div>
</div>
</div>
<div v-else class="boards">
  <p>no boards found!</p>
</div>

<!-- <div class="createboard">
  <input type="text" placeholder="Board Name">
  <input type="text" placeholder="Board Description">
  <input type="button" value="Create Board" v-on:clicl="createBoard">
</div> -->
</template>

<script>
import { defineComponent } from 'vue'
import { get, post, del } from '@/utils/http'
import modal from '@/components/Modal'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
// import InlineMessage from 'primevue/inlinemessage'
export default defineComponent({
  name: 'Boards',
  components: {
    // modal,
    InputText,
    Textarea,
    Button,
    Dialog,
    Toast,
    // InlineMessage
  },
  data() {
    return {
      boards: [],
      name: '',
      missingname: false,
      validationmessage: '',
      display: false,
      description: '',
      isModalVisible: false,
      items: [
        {
          label: 'ویرایش',
          icon: 'pi pi-fw pi-pencil'
        },
        {
          label: 'حذف',
          icon: 'pi pi-fw pi-trash',
          command: (event) => {
            this.display = !this.display
            const id = event.originalEvent
            console.log(id)
            // del('/v1/board', {
            //   id: id
            // }).then((res) => {
            //   console.log(res)
            // })
            // event.originalEvent: Browser event
            // event.item: Menuitem instance
          }
        }
      ]
    }
  },

  watch: {
    items: {
      handler: function () {
        console.log('caught!')
      },
      deep: true
    },
    name: function () {
      if (this.name === '') {
        this.missingname = true
        this.validationmessage = 'نام بورد را وارد کنید'
      } else {
        this.missingname = false
        this.validationmessage = ''
      }
    }
  },
  mounted() {
    get('/v1/board').then((res) => {
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
      this.boards = res
    })
  },
  methods:
  {
    addMessages() {
      this.messages = [
        { severity: 'warn', content: 'نام بورد را وارد کند', life: 5000 }
      ]
    },
    openboard: function (event) {
      const target = this.boards[event.target.id]._id
      console.log(event.target.id)
      this.$router.push('/board/' + target)
    },
    showModal() {
      this.isModalVisible = true
    },
    openModal() {
      this.display = true
    },
    closeModal() {
      this.display = false
    },
    toggle: function (event) {
      this.$refs.menu.toggle(event)
    },
    createBoard: function (event) {
      if (this.name === '') {
        this.$toast.add({ severity: 'error', summary: 'خطا', detail: 'نام بورد را وارد کنید!', life: 3000, baseZIndex: 2 })
        return
      }
      post('/v1/board', {
        name: this.name,
        description: this.description,
        type: 'private'
      }).then((res) => {
        if (res.status === 'failure') {
          console.error(res.error)
        }
        this.display = false
        get('/v1/board').then((res) => {
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
          this.boards = res
        })
      })

      console.log(this.name + this.description)
    },
    deleteboard: function (event) {
      // console.log(this.boards[event.target.id]._id)
      const id = this.boards[event.target.id]._id
      del('/v1/board', {
        id: id
      }).then((res) => {
        if (res.deletedCount) {
          this.boards = this.boards.filter(function (obj) {
            return obj.id !== id
          })
          get('/v1/board').then((res) => {
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
            this.boards = res
          })
        }
      })
    },
    editboard: function (event) {
      console.log(event.currenttarget)
    }
  }
})
</script>

<style scoped lang="scss">
// $colorPrimary:#1059bc;
$colorPrimary:#FFFFFF;
$colorWhite:#fff;
$colorBlack:#000;

.header{
  min-height: 200px;
  display: flex;
  flex-flow: row;
  background-color: #1059BC;
  align-items: center;
  justify-content: flex-start;
}
.p-toast{
  margin: auto;
}
.createBoard{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.header p{
  // align-items: center;
  margin: 1rem;
  font-size: 34px;
  color: $colorWhite;
  font-weight: bold;
  flex-grow: 1;
}
.validationmessage{
  color: red;
}
.break {
  flex-basis: 100%;
  height: 0;
}
.header b{
  margin-left: 1rem;
  color: $colorWhite;
  font-weight: bold;
  cursor: pointer;
}
.grid-container {
  background: $colorPrimary;
  margin: 1rem;
  border-radius: 10px;
  display: grid;
  min-height: 80px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px 0px;
  grid-template-areas:
    "name name remove"
    "description description remove";
}

.menu{ grid-area: remove;margin: auto auto auto 0.5rem;border: 0; background: $colorWhite; }
.remove { grid-area: remove;margin: auto auto auto 0.5rem; cursor: pointer; }

.name { grid-area: name;padding: 0.5rem;}

.description { grid-area: description;padding-right: 0.5rem; }

</style>
