<template>
    {{boards}}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { get } from '@/utils/http'
export default defineComponent({
  name: 'Board',
  data() {
    return {
      boards: null,
    }
  },
  mounted() {
    get(`/v1/board/${this.$route.params.id}/lists`).then((res) => {
      console.log(res)
      this.boards = res
    })
  },
})
</script>
