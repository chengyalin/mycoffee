<template>
  <div class='page-all-bank'>
    <div class='header'>
      <div class='label'>我的咖啡库</div>
    </div>
    <div class='bank-list'>
      <div
        class='bank-item'
        v-for="(item, i) in bankList"
        @click='() => handleBankItemClick(item)'
        :key='i'>
        <div class='img'>
          <img :src="'http://www.zhongkakeji.com/' + item.item_info.image" alt="">
        </div>
        <div class='title'>{{item.item_info.title}}</div>
        <div class='desc'>单品详情</div>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog
        :hide-on-blur='true'
        v-model="showModal"
        v-if="current"
        class="info-modal ty-1">
        <div class='bg'>
          <img :src="'http://www.zhongkakeji.com/' + current.item_info.image" alt="">
        </div>
        <div class="share-tips" v-show='showTip'>
          <p>点击右上角，“发送给朋友”， 把温暖送到朋友手边吧！</p>
          <p>关注“众咖”公众号，在咖啡商城中 即可查询您的库存及优惠唷！</p>
        </div>
        <div class="content">
          <div class="title">{{current.item_info.title}}</div>
          <div class="t1">提货码: <span class="code">{{current.code}}</span></div>
          <div class="tip">请到附近众咖现磨咖啡机提取饮品哦~</div>
        </div>
        <div class='btn' v-if='current.is_send'>
          <x-button type="primary" @click.native="share">赠送亲友</x-button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {
  XDialog,
  XButton,
  TransferDomDirective as TransferDom
} from 'vux'
const BASE_URL = 'http://www.zhongkakeji.com/'

export default {
  name: 'library',
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    XButton
  },
  data () {
    return {
      bankList: [],
      current: null,
      showModal: false,
      showTip: false
    }
  },
  mounted () {
    this.fetchBankList()
  },
  computed: {
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    handleBankItemClick (item) {
      this.current = item
      this.showModal = true
      this.showTip = false
    },
    share (i) {
      this.showTip = true
      const title = this.currentUser.nickname +
      '给您赠送了一杯' + this.current.item_info.title
      const url = BASE_URL + '#/?user_id=' + this.currentUser.id + '&code_id=' +
      this.current.code
      console.log(title, url)
      this.$wechat.onMenuShareAppMessage({
        title,
        desc: '众咖-让现磨咖啡触手可及',
        type: 'link',
        imgUrl: (BASE_URL + 'static/favicon.ico'),
        link: url,
        success: () => {
          //this.showTip = false
          this.current = false
          this.bankList.splice(i,1)//分享成功产品列表减1
        }
      })
    },
    fetchBankList () {
      if (!this.currentUser) {
        return
      }
      this.$http.get('/accounts/bank/list/', {
        params: {
          user_id: this.currentUser.id
        }
      }).then(({data}) => {
        if (data.ok) {
          this.bankList = data.data
        }
      })
    }
  }
}
</script>

<style lang='stylus' scope>
.page-all-bank
  .header
    display flex
    justify-content space-between
    padding 0.1rem 0.15rem
    background-color #F9F9F8
    align-items center
    .label
      color #434343
      font-size 0.14rem
    .link
      color #C6C6C6
      font-size 0.12rem
  .bank-list
    display flex
    flex-wrap wrap
    padding 0.2rem 0.2rem 0 0.2rem
    justify-content space-between
    .bank-item
      flex 0 1 45%
      text-align center
      border 1px solid #F0F0F0
      margin-bottom 0.2rem
      height 1.6rem
      .img
        margin 0 auto
        width 70%
        height 1rem
        overflow hidden
        img
          display block
          width 100%
      .title
        margin-top 0.05rem
        color #343434
        font-size 0.14rem
      .desc
        font-size 0.11rem
        color #999999
        margin-top 0.05rem
.info-modal
  .weui-dialog
    font-size 0.16rem
    .share-tips
      padding 0.1rem
      box-sizing border-box
      color white
      font-size 0.14rem
      background-color rgba(0,0,0,0.65)
      border-radius 0.05rem
      margin-top 0.9rem
      position absolute
      width 100%
      top 0
      left 0
      z-index 200
      p + p
        margin-top 0.2rem
    .bg
      height 2rem
      img
        max-width 100%
    .content
      text-align center
      .t1
        color #434343
        font-size 0.14rem
        text-align left
        margin-top 0.2rem
        padding-left 0.35rem
        .code
          margin-left 0.2rem
          color #F5B44C
          font-size 0.2rem
  &.ty-1
    .weui-dialog
      background-color white
    .weui-btn_primary
      background-color #F5B44C
      font-size 0.16rem
      padding 2px 0
      &:active
        background-color #F5B44C
  .btn
    margin 0.2rem auto
    width 2rem
</style>
