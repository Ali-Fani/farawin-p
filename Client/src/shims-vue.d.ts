declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}
declare module '@splidejs/vue-splide';
declare module 'vue-carousel';
declare module 'vue3-carousel'