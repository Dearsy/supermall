<template>
  <div id="home"
       class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="titles"
                 @tabClick="tabClick"
                 ref="topTabControl"
                 class="topTabControl"
                 v-show="isTabFixed" />
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners='banners'
                   @swiperImgLoad="swiperImgLoad" />
      <home-recommend-view :recommends='recommends' />
      <home-feature-view />
      <tab-control :titles="titles"
                   @tabClick="tabClick"
                   ref="tabControl" />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backTop"
              v-show="showBackTop"></back-top>
  </div>
</template>

<script>

import HomeSwiper from './chlidComps/HomeSwiper'
import HomeRecommendView from './chlidComps/HomeRecommendView'
import HomeFeatureView from './chlidComps/HomeFeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import { getHomeMutildata, getHomeGoods } from 'network/home'
import { debounce } from 'common/utils'
import { itemListenerMiXin, backTopMixin } from 'common/mixin'
import { BACKTOP_DISTANCE } from 'common/const'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins: [itemListenerMiXin, backTopMixin],
  data () {
    return {
      banners: [],
      recommends: [],
      titles: ['流行', '新款', '精选'],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',
      isShowBackTop: false,
      tapOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  created () {
    // 请求多个数据
    this.getHomeMutildata()
    // 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  activated () {
    // console.log(this.$refs.scroll)
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated () {
    // console.log('deactivated')
    // 1.保存Y值
    // console.log(this.$refs.scroll.scroll)
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY)
    // 2.取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  mounted () {
    // 手动点击
    this.tabClick(0) // 方法2 ？？？
    // // 图片完成的时间监听
    // // 这个地方img标签确实被挂载了，但是其中的图片还没有占据高度
    // // this.$refs.scroll.refresh对这个函数进行防抖操作
    // const newRefresh = debounce(this.$refs.scroll.refresh, 100)
    // // 监听item中图片加载完成
    // // 对监听的事件进行保存
    // this.itemImgListener = () => {
    //   newRefresh()
    // }
    // this.$bus.$on('itemImgLoad', this.itemImgListener)
  },
  computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  methods: {
    /**
     * 事件监听相关方法
     *
    */
    tabClick (index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'sell'
          break
        case 2:
          this.currentType = 'pop'
          break
      }
      // 让两个TabControl的currentIndex保持一致
      this.$refs.topTabControl.currentIndex = index // 方法2
      this.$refs.tabControl.currentIndex = index
      // if (this.$refs.topTabControl.currentIndex !== undefined) {
      //   this.$refs.topTabControl.currentIndex = index // 方法1
      //   this.$refs.tabControl.currentIndex = index
      // }
    },
    contentScroll (position) {
      // console.log(position)
      // 判断backTap是否显示
      this.showBackTop = -(position.y) > BACKTOP_DISTANCE
      //  决定tabControl 是否吸顶（position: fixed）
      this.isTabFixed = -(position.y) > this.tapOffsetTop
    },
    loadMore () {
      // console.log('111')
      this.getHomeGoods(this.currentType)
    },
    swiperImgLoad () {
      // 获取tabControl的tabOffsetTop
      // 所有的组件都有一个属性 $el: 用于获取组件中的元素
      this.tapOffsetTop = this.$refs.tabControl.$el.offsetTop
    },
    /**
     * 网络请求相关方法
    */
    getHomeMutildata () {
      getHomeMutildata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res)
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        // 上拉加载更多完成
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  padding-top: 44px;
  height: 100vh; /* 可视高度 */
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
}
/* z-index 只会对定位的元素生效 */
.topTabControl {
  position: relative;
  z-index: 9;
}
/* 在使用浏览器原生滚动时,为了让导航不跟随一起滚动 */
/* .fixed {
  position: fixed;
  right: 0;
  top: 0;
  top: 44px;
} */
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>
