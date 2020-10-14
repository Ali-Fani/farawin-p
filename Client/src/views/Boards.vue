<template>
<div class="header">
<p>تخته ها</p>
<p> {{}}</p>
<b v-on:click= createBoard>+</b>
</div>
<div class="boards" v-on:click= openboard v-if=" boards.length < 1 ">
    <div class="board"  v-for="board in boards" :key="board._id" :id="board._id">
        <div class="board_name">{{board.name}}</div>
        <div class="board_desc">{{board.description}}</div>
    </div>
</div>
<div v-else>
  <p>no boards found!</p>
</div>
<div class="createboard">
  <input type="text" placeholder="Board Name">
  <input type="text" placeholder="Board Description">
  <input type="button" value="Create Board" v-on:clicl="createBoard">
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { get, post } from '@/utils/http'
export default defineComponent({
  name: 'Boards',
  data() {
    return {
      boards: [],
    }
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
      if (res.error === 'middle ware erro') {
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
      this.boards = res
    })
    console.log(this.boards)
  },
  methods:
  {
    openboard: function (event) {
      const target = event.target.id
      this.$router.push('/board/' + target)
    },
    createBoard: function (event) {
      console.log(event)
    }
  }
})
</script>

<style scoped lang="scss">
// $colorPrimary:#1059bc;
$colorPrimary:#FFFFFF;
$colorWhite:#fff;
$colorBlack:#000;
.body{
  background-color: #F2F2F2;
}
.board{
display: flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content: flex-start;
align-items: flex-start;
background-color: $colorPrimary;
margin: 1rem;
border-radius: 12px;
padding: 1rem;
}
.board_name{
  color: $colorBlack;
  font-size: 16px;
}
.board_desc{
  color: $colorBlack;
  opacity: 60%;
}
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
</style>
