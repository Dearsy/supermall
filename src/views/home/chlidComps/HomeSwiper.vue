<template>
  <swiper>
    <swiper-item :key='index'
                 v-for="(item,index) in banners">
      <a :href="item.link">
        <img :src="item.image"
             alt=""
             @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'components/common/swiper'
export default {
  name: 'HomeSwiper',
  props: {
    banners: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isLoad: false
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  computed: {
  },
  watch: {
  },
  methods: {
    imageLoad () {
      if (!this.isLoad) {
        this.$emit('swiperImgLoad')
        this.isLoad = true
      }
    }
  }
}
</script>

<style scoped>
</style>
