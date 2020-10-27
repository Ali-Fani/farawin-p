<script>
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
export default {
  name: 'modal',
  methods: {
    open() {
      this.$emit('open')
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>
<template>
  <div class="dialogModal">
  <Dialog header="Header" v-model:visible="display" :modal="true" :dismissableMask="true" :rtl="true" :closable="true">
  <Toast position="bottom-right" />
<template #header>جزئیات تسک</template>
 <div class="createBoard">    <InputText type="text" v-model="name" placeholder="نام کارت" />
 <label v-if="missingname" class="validationmessage">{{validationmessage}}</label>
    <Textarea v-model="description" :autoResize="true" rows="5" cols="30" placeholder="توضیحات کارت" />

    <Button label="ایجاد کارت" v-on:click.stop="createBoard" />
</div>
</Dialog>
  </div>
</template>
