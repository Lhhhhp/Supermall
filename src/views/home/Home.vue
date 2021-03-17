<template>
  <div class="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
        :titles="tabControlTitles"
        @tabClick="tabClick"
        ref="tabControl"
        class="home-tab-control"
        v-show="isShowTab"
    />
    <scroll
        class="scroll-height"
        :probe-type="3"
        ref="scroll"
        @backTopScroll="backTopScroll"
        :pull-up-load="true"
        @pullingUp="loadMore"
    >
    <my-swiper :swiper-list="banners" @swiperLoad="swiperLoad" />
    <recommend-view :recommends="recommends" />
    <!-- 本周流行 -->
    <feature-view />
    <tab-control
        :titles="tabControlTitles"
        @tabClick="tabClick"
        class="home-tab-control"
        ref="tabControl2"
    />
    <goods-list :goods="goods[curType].list" />
    </scroll>
    <transition name="scroll">
      <back-top @click.native="backTop" v-show="isShowBackTop"/>
    </transition>
  </div>
</template>

<script>

import NavBar from "../../components/common/navbar/NavBar";
import MySwiper from "../../components/common/swiper/MySwiper";
import RecommendView from "./children/RecommendView";
import FeatureView from "./children/FeatureView";
import TabControl from "../../components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backTop/BackTop";


import { getHomeGoodsData, getHomeMultiData} from "@/network/home";
import { backTopMixin, imgListenerMixin} from "@/common/mixin";


export default {
  name: 'Home',
  components: {
    TabControl,
    MySwiper,
    NavBar,
    RecommendView,
    FeatureView,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      tabControlTitles: ["流行", "新款", "精选"],
      goods: {
        pop: {page: 0, list: []},
        new: {page: 0, list: []},
        sell: {page: 0, list: []},
      },
      curType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
    };
  },
  mixins: [ backTopMixin, imgListenerMixin],
  computed: {
    isShowTab() {
      return this.curPosition >= this.tabOffsetTop;
    }
  },
  methods: {
    // 1、请求多个数据
    getHomeMultiData() {
      getHomeMultiData().then(res => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoodsData(type) {
      const page = this.goods[type].page + 1;
      getHomeGoodsData(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        this.$refs.scroll.finishPullUp();
      });
    },
    // backTop() {
    //   this.$refs.scroll.scrollTo()
    // },
    backTopScroll(position) {
      this.isShowBackTop = (-position.y) > 1000
      this.curPosition = position ? -position.y : 0;
    },
    tabClick(index) {
      if (index === 0) {
        this.curType = "pop";
      } else if (index === 1) {
        this.curType = "new";
      } else if (index === 2) {
        this.curType = "sell";
      }
      this.$refs.tabControl.curIndex = index;
      this.$refs.tabControl2.curIndex = index;
  },
  loadMore() {  //上拉加载更多
    this.getHomeGoodsData(this.curType);
  },
  swiperLoad() {
    this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
  },
  },
  created() {
    this.getHomeMultiData();
    this.getHomeGoodsData("pop");
    this.getHomeGoodsData("new");
    this.getHomeGoodsData("sell");
  },
  activated() {
    // 同时刷新better-scroll防止不能滚动
    this.$refs.scroll.refresh();
  },
  mounted() {
    // this.$bus.$on('imgLoad', () => {
    //   this.$refs.scroll.refresh();
    // })
  },
  // keep-alive状态下离开的时候的生命周期
  deactivated() {
    // 取消home组件事件总线的监听
    this.$bus.$off("imgLoad", this.imgListener);
  }
}
</script>

<style scoped>
 .home {
   position: relative;
   height: 100%;
 }
 .home .home-nav {
   font-weight: 600;
   color: white;
   background: #ff8198;
 }
 .home-tab-control {
   position: relative;
   z-index: 9;
   background-color: white;
 }
 .scroll-height {
   position: absolute;
   top: 44px;
   right: 0;
   bottom: 50px;
   left: 0;
   overflow: hidden;
 }
 /* vue的淡入淡出动画 */
 .scroll-enter-active,
 .scroll-leave-active {
   transition: all 0.3s;
 }

 .scroll-enter,
 .scroll-leave-to {
   opacity: 0;
 }

 .scroll-enter-to,
 .scroll-leave {
   opacity: 1;
 }
</style>
