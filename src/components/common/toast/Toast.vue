<template>
  <div class='toast'
       v-show="isShow">
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'Toast',
  components: {},
  data () {
    return {
      message: '',
      isShow: false
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    show (message = '默认值', duration = 2000) {
      this.isShow = true
      this.message = message
      setTimeout(() => {
        this.isShow = false
        this.message = ''
      }, duration)
    }
  }
}
</script>

<style scoped>
.toast {
  left: 50%;
  top: 50%;
  position: fixed;
  transform: translate(-50%, -50%);
  padding: 8px 10px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 9;
}
</style>
