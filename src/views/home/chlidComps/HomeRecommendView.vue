<template>
<div class="recommend">
  <div :key="index" v-for="(item,index) in recommends" class="recommend-item">
    <a :href="item.link">
      <img :src="item.image" alt="">
      <div>{{item.title}}</div>
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: 'HomeRecommendView',
  props: {
    recommends: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components:{},
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
.recommend {
  display: flex;
  width: 100%;
  text-align: center;
  padding: 10px 20px;
  border-bottom: 10px solid #eee;
}
.recommend-item {
  flex: 1;
}
.recommend-item img{
  width: 70px;
  height: 70px;
}
</style>
