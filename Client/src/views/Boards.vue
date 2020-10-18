<template>
<div class="header">
<p>تخته ها</p>
<p> {{}}</p>
<b v-on:click= createBoard>+</b>
</div>
<div class="boards" @click.prevent= openboard v-if=" boards">
<div class="grid-container" v-for="board in boards" :key="board._id" :id="board._id">
  <Button type="button" label="Toggle" @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu" class="menu" >
<font-awesome-icon icon="ellipsis-v" class="menu" :id="board._id" />
  </Button>
<TieredMenu id="overlay_tmenu" ref="menu" :model="items" :popup="true" />

  <div class="name" :id="board._id">{{board.name}}</div>
  <div class="description"  :id="board._id">{{board.description}}</div>
</div>
</div>
<div v-else class="boards">
  <p>no boards found!</p>
</div>
<div class="newBoard">
</div>
<!-- <div class="createboard">
  <input type="text" placeholder="Board Name">
  <input type="text" placeholder="Board Description">
  <input type="button" value="Create Board" v-on:clicl="createBoard">
</div> -->
</template>

<script>
import { defineComponent } from 'vue'
import { get, post } from '@/utils/http'
import TieredMenu from 'primevue/tieredmenu'

export default defineComponent({
  name: 'Boards',
  data() {
    return {
      boards: [],
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil'
        },
        {
          label: 'Remove',
          icon: 'pi pi-fw pi-trash'
        }
      ]
    }
  },
  components: {
    TieredMenu
  },
  watch: {
    items: {
      handler: function () {
        console.log('caught!')
      },
      deep: true
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
    openboard: function (event) {
      // const target = event.target.parentNode.id
      console.log(event.target.id)
      // this.$router.push('/board/' + target)
    },
    toggle: function (event) {
      this.$refs.menu.toggle(event)
    },
    createBoard: function (event) {
      console.log(event)
    },
    removeBoard: function (event) {
      console.log(event.target.id)
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
.header p{
  // align-items: center;
  margin: 1rem;
  font-size: 34px;
  color: $colorWhite;
  font-weight: bold;
  flex-grow: 1;

}
.header b{
  margin-left: 1rem;
  color: $colorWhite;
  font-weight: bold;
  cursor: pointer;
}
.boards{
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
.remove { grid-area: remove;margin: auto auto auto 0.5rem; }

.name { grid-area: name;padding: 0.5rem;}

.description { grid-area: description;padding-right: 0.5rem; }

</style>
