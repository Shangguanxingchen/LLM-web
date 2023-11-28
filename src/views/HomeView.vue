<template>
  <div class="home">
    <ai-talk></ai-talk>
  </div>
</template>

<script>
import AiTalk from '@/components/AiTalk.vue'
export default {
  name: 'HomeView',
  components: {
    AiTalk
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
}
</script>
