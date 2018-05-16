<template>
  <div class='page-order-complete'>
    <div class='bg'><img src="/static/img/red/pic_done@3x.png" alt=""></div>
    <div class="share-tips" v-show='showTip'>
      <p>点击右上角，“分享到朋友圈” 或“发送给好友”，大家一起领优惠吧！</p>
      <p>关注“众咖”公众号，在咖啡商城中 即可查询您的库存及优惠唷！</p>
    </div>
    <div class='btn'>
      <x-button type="primary" @click.native='handleShare'>分享抢优惠</x-button>
      <x-button type="primary" @click.native='handleBackLib'>返回我的咖啡库</x-button>
    </div>
    <div class="footer">您可关注“众咖科技”公众号，咖啡 商城-我的咖啡库众查看库存与优惠哦，亲~</div>
    <div v-transfer-dom>
      <loading :show="showLoading" :text="loadText"></loading>
    </div>
  </div>
</template>

<script>
import {
  XButton,
  Actionsheet,
  Loading,
  TransferDomDirective as TransferDom
} from 'vux'
import { setTimeout } from 'timers'
const BASE_URL = 'http://www.zhongkakeji.com/'

export default {
  name: 'orderComplete',
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Actionsheet,
    Loading
  },
  data () {
    return {
      showTip: false,
      showLoading: true,
      loadText: '加载中...'
    }
  },
  created () {

  },
  mounted () {
    // this.$wechat.hideMenuItems({
    //   menuList: [
    //     'menuItem:share:appMessage',
    //     'menuItem:share:timeline'
    //   ]
    // })
    const url = BASE_URL + '#/?share_user_id=' + this.currentUser.id +
    '&ts=' + (new Date()).getTime()
    console.log(url)
    this.$wechat.onMenuShareAppMessage({
      title: '众咖福袋了解一下？送你一个，赶快拆开看看吧',
      desc: '众咖-让咖啡触手可及',
      imgUrl: (BASE_URL + 'static/favicon.ico'),
      link: url,
      success: () => {
        this.$router.replace({ path: 'lib' })
      }
    })
    this.$wechat.onMenuShareTimeline({
      title: '众咖福袋了解一下？送你一个，赶快拆开看看吧',
      link: url,
      imgUrl: (BASE_URL + 'static/favicon.ico'),
      success: () => {
        this.$router.replace({ path: 'lib' })
      }
    })
    document.title = '支付成功'
    setTimeout(() => {
      this.showLoading = false
      // this.$wechat.showMenuItems({
      //   menuList: [
      //     'menuItem:share:appMessage',
      //     'menuItem:share:timeline'
      //   ]
      // })
    }, 3000)
  },
  computed: {
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    handleShare () {
      this.showTip = true
      // const url = BASE_URL + '#/getcoupon/?share_user_id=' + this.currentUser.id
    },
    handleBackLib () {
      this.$router.replace({ path: 'lib' })
    }
  }
}
</script>

<style lang='stylus' scope>
.page-order-complete
  text-align center
  padding 0.2rem 0
  .share-tips
    padding 0.2rem
    box-sizing border-box
    color white
    font-size 0.14rem
    background-color rgba(0,0,0,0.65)
    border-radius 0.05rem
    margin-left -40vw
    left 50%
    position absolute
    width 80vw
    top 24vh
    p + p
      margin-top 0.2rem
  .bg
    height 2.8rem
    img
      height 100%
  .footer
    color #999999
    font-size 0.14rem
    width 80vw
    margin 0 auto
    margin-top 0.4rem
  .btn
    margin 0.2rem auto
    width 2rem
    .weui-btn_primary
      background-color #F5B44C
      font-size 0.16rem
      padding 2px 0
</style>
