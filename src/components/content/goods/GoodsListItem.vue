<template>
  <div class="goods-item"
       @click="goodsItemClick">
    <img v-lazy="showImages"
         alt=""
         @load="loadImg">
    <div class="goods-info ">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsListItem',
  props: {
    goodsItem: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {},
  data () {
    return {
    }
  },
  computed: {
    showImages () {
      return this.goodsItem.image || this.goodsItem.show.img
    }
  },
  watch: {
  },
  methods: {
    loadImg () {
      // console.log('loadImg')
      this.$bus.$emit('itemImgLoad')
      // 思路一: 每一个页面监听不同的事件,来知道图片加载完成
      // if (this.$route.path.indexof('/home')) {
      //   this.$bus.$emit('homeItemImgLoad')
      // } else if (this.$route.path.indexof('/detail')) {
      //   this.$bus.$emit('detailItemImgLoad')
      // }
      // 思路二 取消全局事件的监听
    },
    goodsItemClick () {
      // console.log('goodsItemClick')
      this.$router.push('/detail/' + this.goodsItem.iid)
    }
  }
}
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;

  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
