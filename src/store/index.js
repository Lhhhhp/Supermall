import Vue from 'vue'
import Vuex from 'vuex'
import getters from "@/store/getters";
import actions from "@/store/actions";
import mutations from "@/store/mutations";

Vue.use(Vuex);

const state = {
// 默认tabBar显示
  tabBarShow: true,
  // 购物车数据
  cartList: [],
  // 是否开启请求加载
  isLoading: true
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
