<template>
  <div id="app">
    <router-view></router-view>
    <tabbar v-show='showTabber' v-model='actived'>
      <tabbar-item
        v-for='(tab, i) in tabList'
        :key='i'
        :link='tab.path'>
        <i slot="icon" :class='tab.icon'></i>
        <span slot="label">{{tab.text}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'

export default {
  name: 'app',
  components: {
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      actived: 0,
      tabList: [
        {
          icon: 'icon-icon_buy',
          text: '订咖啡',
          path: '/'
        },
        {
          icon: 'icon-icon_coffee',
          text: '我的咖啡库',
          path: '/lib'
        },
        {
          icon: 'icon-icon_my',
          text: '我的订单',
          path: '/order'
        }
      ]
    }
  },
  computed: {
    showTabber () {
      const p = this.$route.path
      if (p.match('ordercomplete') || p.match('getcoupon')) {
        return false
      }
      return this.$store.getters.totalSelectCount === 0
    },
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  watch: {
    '$route': function (newV) {
      this.actived = this.tabList.findIndex(i => i.path === newV.path)
    }
  },
  created () {
    this.actived = this.tabList.findIndex(i => i.path === this.$route.path)
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="less">
@import './assets/fonts.css';
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/close.less';

html {
  font-size: 100px;
}
html, body, #app {
  height: 100%;
}
@media screen and (max-width: 320px) {
  html {
    font-size: 80px;
  }
}
.vux-loading,.weui-dialog {
  font-size: 0.16rem;
}
.weui-tabbar {
  position: fixed !important;
  background-color: #FBFCFF !important;
  &:before {
    border-top: none !important;
  }
  .weui-tabbar__item {
    padding-top: 10px;
    .weui-tabbar__label, .weui-tabbar__icon i {
      margin: 1px 0;
      color: #C6C6C6;
    }
    &.weui-bar__item_on {
      .weui-tabbar__icon, .weui-tabbar__icon > i, .weui-tabbar__label {
        color: #FE8516;
      }
    }
  }

}
</style>
