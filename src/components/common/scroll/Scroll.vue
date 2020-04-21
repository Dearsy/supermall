<template>
  <div class="wrapper"
       ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: null
    }
  },
  methods: {
    scrollTop (x, y, time = 300) {
      return this.scroll && this.scroll.scrollTo(0, 0)
    },
    finishPullUp () {
      return this.scroll && this.scroll.finishPullUp()
    },
    refresh () {
      // console.log('-----') // 测试防抖
      return this.scroll && this.scroll.refresh()
    },
    getScrollY () {
      return this.scroll ? this.scroll.y : 0
    },
    scrollTo (x, y, time = 300) {
      return this.scroll && this.scroll.scrollTo(x, y, time)
    }
  },
  mounted () {
    // 1. 创建 BSscroll 对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    // 2. 监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        // console.log(position)
        this.$emit('scroll', position)
      })
    }
    // 3.监听滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        // console.log('上拉加载更多')
        this.$emit('pullingUp')
      })
    }
  }
}
</script>

<style scoped>
</style>
