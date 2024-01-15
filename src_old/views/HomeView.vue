<template>
  <div class="home">
    <!-- <ai-talk></ai-talk> -->
    <ai-talk-stream></ai-talk-stream>
  </div>
</template>

<script>
import AiTalk from '@/components/AiTalk.vue'
import AiTalkStream from '@/components/AiTalkStream.vue'
export default {
  name: 'HomeView',
  components: {
    // AiTalk,
    AiTalkStream,
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
}
</script>
