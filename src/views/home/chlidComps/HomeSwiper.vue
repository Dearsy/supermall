<template>
  <swiper>
    <swiper-item :key='index' v-for="(item,index) in banners">
      <a :href="item.link">
        <img :src="item.image" alt="">
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
  methods: {}
}
</script>

<style scoped>

</style>
