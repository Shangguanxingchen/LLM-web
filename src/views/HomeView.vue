<template>
  <div class="home">
    <!-- <ai-talk></ai-talk> -->
    <my-header></my-header>
    <router-view></router-view>
    <!-- <ai-talk-stream></ai-talk-stream> -->
  </div>
</template>

<script>
import AiTalk from '@/components/AiTalk.vue'
import AiTalkStream from '@/views/AiTalkStream.vue'
import MyHeader from '@/components/MyHeader.vue';
export default {
  name: 'HomeView',
  components: {
    // AiTalk,
    // AiTalkStream,
    MyHeader
  },
  data () {
    return {
    }
  },
}
</script>
