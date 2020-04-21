<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick='titleClick'
                    ref="nav" />
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probeType="3">
      <!-- 属性：topImages 传入值: top-images -->
      <detail-swiper :top-images="topImages"
                     ref="base" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop='shop' />
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo"
                         ref="param" />
      <detail-comment-info :commentInfo="commentInfo"
                           ref="comment" />
      <goods-list :goods="recommends"
                  ref="recommend" />
    </scroll>
    <detail-bottom-bar @addCart='addToCart'></detail-bottom-bar>
    <back-top @click.native="backTop"
              v-show="showBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'
import { debounce } from 'common/utils'
import { itemListenerMiXin, backTopMixin } from 'common/mixin'
import { BACKTOP_DISTANCE } from 'common/const'

import { mapActions } from 'vuex'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMiXin, backTopMixin],
  data () {
    return {
      iid: null,
      topImages: null,
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    }
  },
  created () {
    // console.log(this.$route.params.iid)
    // 1. 保存传入的iid
    this.iid = this.$route.params.iid
    // 2. 根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部的图片轮播图数据
      // console.log(res)
      const data = res.result
      this.topImages = res.result.itemInfo.topImages
      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo
      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 6.取出商品的评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })
    // 3. 请求推荐参数
    getRecommend().then(res => {
      // console.log(res)
      this.recommends = res.data.list
    })
    // 给getThemeTopY赋值(对给我们赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(this.$refs.base.$el.offsetTop)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs)
    }, 100)
  },
  mounted () {

  },
  updated () {
  },
  destroyed () {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  computed: {
  },
  watch: {
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad () {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick (index) {
      // console.log(index)
      this.$refs.scroll.scrollTo(0, -(this.themeTopYs[index]), 100)
    },
    contentScroll (position) {
      // 1.监听backTop的显示
      this.showBackTop = -(position.y) > BACKTOP_DISTANCE
      // console.log(this.showBackTop)
      // 1. 获取y
      // console.log(position)
      const positionY = -(position.y)
      // 2.positoinY和主题中值进行对比
      // [0, 7938, 9120, 9452]
      // positoinY 在0和7938之间, index=0
      // positoinY 在7938和9120之间, index = 1
      // positoinY 在9120和9452之间, index = 2

      // positoinY 超过9120值, index= 3
      const length = this.themeTopYs.length
      // hack 做法
      // [0, 7938, 9120, 9452,  Number.MAX_VALUE]
      // positoinY 在0和7938之间, index=0
      // positoinY 在7938和9120之间, index = 1
      // positoinY 在9120和9452之间, index = 2
      // positoinY 超过9120值, index= 3
      for (let i = 0; i < length - 1; i++) {
        if ((this.currentIndex !== i) && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      // 普通做法：
      // for (let i = 0; i < length; i++) {
      //   if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
      //     this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
      //     this.currentIndex = i
      //     // console.log(this.currentIndex)
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }
    },
    addToCart () {
      // 1. 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.newPrice = this.goods.nowPrice
      product.iid = this.iid

      // 2. 将商品添加到购物车里(1.peomise 2.mapActions)
      // this.$store.commit('addCart', product)
      this.addCart(product).then(res => {
        this.$toast.show(res, 2000)
        // console.log(this.$toast)
      })
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res)
      // })
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>
