import { debounce } from './utils'
import BackTop from 'components/content/backTop/BackTop'
export const itemListenerMiXin = {
  data () {
    return {
      itemImgListener: null,
      newRefresh: null // 防止refesh() 被频繁调用
    }
  },
  mounted () {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // console.log('我是混入中的内容')
  }
}
export const backTopMixin = {
  components: {
    BackTop
  },
  data: function () {
    return {
      showBackTop: false
    }
  },
  methods: {
    backTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 300)
    }
  }
}
