<template>
<div class="header">
<p>تخته ها</p>
</div>
<div class="boards" v-on:click= openboard>
    <div class="board" v-for="board in boards" :key="board._id" :id="board._id">
        <div class="board_name">{{board.name}}</div>
        <div class="board_desc">{{board.description}}</div>
    </div>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { get } from '@/utils/http'
export default defineComponent({
  name: 'Boards',
  data() {
    return {
      boards: null,
    }
  },
  mounted() {
    get('/v1/board').then((res) => {
      console.log(res)
      this.boards = res
    })
  },
  methods:
  {
    openboard: function (event) {
      const target = event.target.id
      this.$router.push('/board/' + target)
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
}
</style>
