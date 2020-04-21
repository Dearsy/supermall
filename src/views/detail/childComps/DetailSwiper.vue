<template>
  <swiper class='detail-swiper'>
    <swiper-item :key="index"
                 v-for="(item,index) in topImages">
      <img :src="item"
           alt="">
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'components/common/swiper'
export default {
  name: 'DetailsSwiper',
  props: {
    topImages: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {}
}
</script>

<style scoped>
.detail-swiper {
  height: 300px;
  overflow: hidden;
}
</style>
