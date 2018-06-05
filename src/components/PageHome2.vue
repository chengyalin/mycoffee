<template>
  <div class='page-home'>
    <!--banner图-->
    <Swiper ref="MyvuxSlider"
      :list='sildeList'
      :show-dots='false'
      :interval='5000'
      :loop='true'
      :auto='true'
      height='180px'
      :show-desc-mask='false' />
    <!--<div id="list-container-box" ref="MylistContainerBox">-->
      <div class='ads-bar'>
        <img src="/static/img/icon_sale@3x.png" alt="">
        {{preference}}
      </div>
      <div class="list-box" :class='{checking: totalSelectCount > 0}'>
        <div class="sider-nav">
          <div class="nav-item-parent">
            <div
              @click='() => handleNavSelect(i)'
              class="nav-item"
              :class="{active: i === activedNav}"
              v-for='(label,i) in navList'
              :key='i'>
              {{label}}
            </div>
          </div>
        </div>
        <div class="content-list">
          <!-- <div class="label">
            热销饮品
          </div> -->
          <div class="card-list">
            <div
              class="card-item"
              v-for="item in prodListShow"
              :key='item.product_id' @click='() => handleClickProd(item)'>
              <div class="prod-img">
                <div class="info hot" v-if='item.is_hot'></div>
                <div class="info" v-if='item.is_discount'></div>
                <img v-if='item.market_small_image' :src="item.market_small_image" alt="">
              </div>
              <div class="prod-info">
                <div class="prod-title">
                  {{item.title}}
                </div>
                <!--<div class="prod-desc" v-if="activedNav !== 2">
                  {{item.descp}}
                </div>-->
                <div class="prod-desc flex" v-if="activedNav !== 2">
                  {{item.descp}}
                  <span
                    v-for='i in item.item_info'
                    :key='i.item_id'>
                    {{i.title}}
                </span>
                </div>

                <div class="prod-desc flex" v-if="activedNav === 2">
                <span
                  v-for='i in item.item_info'
                  :key='i.item_id'>
                  {{i.title}}
                </span>
                </div>
                <div class="prod-price" @click='() => handleClickProd(item)'>
                  <span class='vip-price'>￥{{item.vip_price || item.price}}</span>
                  <span class='price' v-if='item.vip_price'>￥{{item.price}}</span>
                </div>
                <div class="prod-action" @click='handleProdSelectParent'>
                <span
                  v-if='item.selectCount > 0'
                  class='icon-minus-circle'
                  @click='() => handleProdSelect(item, -1)'
                />
                  <span class='select-item-count' v-if='item.selectCount'>
                  {{item.selectCount}}
                </span>
                  <i
                    class='icon-add-solid'
                    @click='() => handleProdSelect(item, 1)'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
<!--    </div>-->
    <!--加载弹出框-->
    <div v-transfer-dom>
      <loading :show="showLoading" :text="loadText"></loading>
    </div>
    <!--商品详情弹窗-->
    <div v-transfer-dom>
      <x-dialog
        :hide-on-blur='true'
        v-model="showProdDetail"
        class='prod-modal'>
        <div class="popup-prod" v-if='currentPord'>
          <img
            v-if='currentPord.makret_big_image'
            :src="'http://www.zhongkakeji.com/' + currentPord.makret_big_image"
            alt="">
          <div class="prod-title">
            {{currentPord.title}}
          </div>
          <div class="prod-desc" v-if="activedNav !== 2">
            {{currentPord.descp}}
          </div>
          <div class="prod-desc flex" v-if="activedNav === 2">
            <span
              v-for='i in currentPord.item_info'
              :key='i.item_id'>
              {{i.title}}
            </span>
          </div>
          <div class="bot">
            <div class='price'>￥{{currentPord.vip_price || currentPord.price}}</div>
            <div class="prod-action inline">
              <i
                v-if='currentPord.selectCount > 0'
                class='icon-minus-circle'
                @click='() => handleProdSelect(currentPord, -1)'
              />
              <span class='select-item-count' v-if='currentPord.selectCount'>
                {{currentPord.selectCount}}
              </span>
              <i
                class='icon-add-solid'
                @click='() => handleProdSelect(currentPord, 1)'
              />
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
    <!--点击领取好友赠送的咖啡-->
    <div v-transfer-dom>
      <div class="fake" v-if='showFriendGive' @click='recevieFriendCoffee'></div>
      <x-dialog
        v-model="showFriendGive"
        class='friend-co-modal'>
        <div class="body" v-if='showFriendGiveObj'>
          您的好友 {{showFriendGiveObj.nick}} 为您赠送了一杯 {{showFriendGiveObj.prod}}
        </div>
        <div class='btn' @click='skipCafe'>点击领取</div>
      </x-dialog>
      <div class="fake" v-if='showCouponFirst' @click='recevieFirstFree'></div>
    </div>
    <!--首页赠送者进入可以看到好友领取了礼物后的弹窗消息-->
    <div v-transfer-dom>
      <x-dialog
        v-model="showFriendGiveMsg"
        class='friend-co-modal'>
        <div class="body" v-if='noticeMsgObj'>{{noticeMsgObj.text}}
        </div>
        <div class='btn' @click='iAlreadyrRead'>我已经阅读了</div>
      </x-dialog>
    </div>
    <!--新人领取咖啡-->
    <div v-transfer-dom>
      <x-dialog
        v-model="showCouponFirst"
        class='coupon-index-modal'>
        <div class='body'>hi，新朋友～众咖为您准备了一份新人礼物，点领取即可存入咖啡库。</div>
      </x-dialog>
    </div>
    <!-- <div v-transfer-dom>
      <x-dialog
        v-model="showCouponList"
        class='coupon-list-modal'>
        <div class='coupon-title'>来来来，别客气~</div>
        <div class="list-container">
          <div
            v-for="coupon in couponList"
            :key="coupon.id"
            class='coupon-item'>
            <div class="cp-icon"><img src="/static/img/red/pic_coffee@3x.png" alt=""></div>
            <div class="cp-content">
              <div class="cp-item-t">{{coupon.title}}</div>
              <div class="cp-item-dur">有效期至 {{deadTime(coupon.dead_line)}}</div>
            </div>
          </div>
        </div>
        <div class="btn">
          <x-button type="primary" @click.native='getAllCoupon'>一键领取并使用</x-button>
        </div>
        <div @click="handleCloseCouponList">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div> -->
    <!--已经选择到购物车的商品列表-->
    <div v-transfer-dom>
      <popup v-model="showDetailSelected" max-height="40%">
        <div class="popup">
          <group>
            <div class="header">
              <div class="label">
                已选商品
              </div>
              <div class="ac-right" @click='handleEmptyCart'>
                清 空
              </div>
            </div>
            <cell
              v-for='item in productSelectedList'
              :key='item.product_id'
            >
              <span slot='title'>{{item.title}}</span>
              <div slot='default' class='content-right'>
                <span class='price'>￥{{item.vip_price}}</span>
                <div class="prod-action inline">
                  <i
                    v-if='item.selectCount > 0'
                    class='icon-minus-circle'
                    @click='() => handleProdSelect(item, -1)'
                  />
                  <span class='select-item-count' v-if='item.selectCount'>
                    {{item.selectCount}}
                  </span>
                  <i
                    class='icon-add-solid'
                    @click='() => handleProdSelect(item, 1)'
                  />
                </div>
              </div>
            </cell>
          </group>
        </div>
      </popup>
    </div>
    <!--购物车结算-->
    <CheckListBar
      btnText='去结算'
      :handleCheckout='handleCheckout'
      :handleClickBadge='handleToggleDetail' />
    <!--清空购物车-->
    <div v-transfer-dom>
      <confirm
        v-model="showConfirm"
        title="操作提示"
        @on-cancel="onCancel"
        @on-confirm="onConfirm">
        <p>确认清空购物车吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import {
  Swiper,
  Loading,
  Popup,
  Group,
  Cell,
  Confirm,
  XDialog,
  XButton,
  TransferDomDirective as TransferDom
} from 'vux'
import moment from 'moment'
import CheckListBar from './CheckListBar'

export default {
  name: 'home',
  directives: {
    TransferDom
  },
  components: {
    Swiper,
    XButton,
    Loading,
    Popup,
    Group,
    Cell,
    Confirm,
    XDialog,
    CheckListBar
  },
  data () {
    return {
      showLoading: true,
      showConfirm: false,
      loadText: '加载中...',
      activedNav: 0,
      navList: ['热销', '单品', '套餐'],
      sildeList: [],
      showDetailSelected: false,
      showProdDetail: false,
      currentPord: null,
      couponList: [],
      showCouponList: false,
      preference: '',
      showFriendGive: false,
      showFriendGiveMsg: false,
      showFriendGiveObj: null,
      showCouponFirst: false,
      noticeMsgObj: null
    }
  },
  created () {
    this.fetchSlideList()
    this.fetchProdList()
    this.$store.commit('CLEAR_PRODUCT_LIST')
  },
  mounted () {
    // this.fetchCouponList()
    const userId = this.$route.query.user_id
    const codeId = this.$route.query.code_id
    const shareUser = this.$route.query.share_user_id
    const ts = this.$route.query.ts
    console.log('xxx', userId, codeId, shareUser, ts)
    if (shareUser) {
      this.$router.replace({
        path: 'getcoupon',
        query: {
          share_user_id: shareUser,
          timestamp: ts
        }
      })
      return
    }
    if (userId && codeId) {
      this.getShareUser(userId, (user) => {
        this.$http.get('/code/code_info/query/?code=' + codeId).then(({data}) => {
          if (data.ok) {
            this.showFriendGiveObj = {
              userId,
              codeId,
              nick: user.nickname,
              prod: data.data.title
            }
            this.showFriendGive = true
          }
        })
      })
    }
    if (!this.hasUserFirst) {
      this.showCouponFirst = true
    }
    this.checkNoticeMsg()
  },
  watch: {
    totalSelectCount: function (newV, oldV) {
      if (newV === 0 && this.showDetailSelected) {
        this.showDetailSelected = false
      }
    },
},
  computed: {
    hasUserFirst () {
      return this.$store.getters.hasGetFirst
    },
    productSelectedList () {
      return this.$store.getters.productSelectedList
    },
    prodListShow () {
      switch (this.activedNav) {
        case 0:
          return this.$store.getters.productListHot
        case 1:
          return this.$store.getters.productListSingle
        case 2:
          return this.$store.getters.productListSuit
      }
    },
    totalSelectCount () {
      return this.$store.getters.totalSelectCount
    },
    currentUser () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    getShareUser (shareUid, done) {
      const url = '/accounts/userinfo/query/?user_id=' + shareUid
      this.$http.get(url).then(({data}) => {
        if (data.ok) {
          done(data.data)
        }
      })
    },
    deadTime (time) {
      return moment(time).format('ll')
    },
    handleCheckout () {
      this.$router.push({ path: 'addorder' ,query: { proType: this.activedNav }})
    },
    onCancel () {
      this.showConfirm = false
    },
    onConfirm () {
      this.$store.commit('UNSELECT_ALL_PRODUCT')
    },
    handleEmptyCart () {
      this.showConfirm = true
    },
    handleToggleDetail () {
      this.showDetailSelected = !this.showDetailSelected
    },
    handleNavSelect (idx) {
      this.activedNav = idx;
    },
    handleClickProd (prod) {
      this.currentPord = prod
      this.showProdDetail = true
    },
    handleProdSelectParent (event) {
      event.stopPropagation()
    },
    handleProdSelect (prod, val) {
      const newCount = prod.selectCount + val
      if (newCount < 100 && newCount >= 0) {
        this.$store.commit('SELECT_PRODUCT', {
          target: prod,
          count: newCount
        })
      }
    },
    fetchSlideList () {
      const STATIC_URL = 'http://www.zhongkakeji.com/'
      this.$http.get('/ad/ad/list/', {
        params: {
          is_terminal: 'False'
        }
      }).then(({data}) => {
        if (data.ok) {
          this.preference = data.data[0].preference
          this.sildeList = data.data.map(i => {
            return {
              img: (STATIC_URL + i.image),
              title: i.title
            }
          }).sort((a, b) => a.order > b.order)
        }
      })
    },
    fetchProdList () {
      this.$http.get('/product/market/product/list/').then(({data}) => {
        if (data.ok) {
          const list = data.data.sort((a, b) => a.order > b.order)
          list.forEach(item => {
            item.selectCount = 0
          })
          this.$store.commit('SET_PRODUCT_LIST', list)
          this.showLoading = false
        }
      })
    },
    fetchCouponList () {
      if (!this.currentUser) {
        return
      }
      this.$http.get('/accounts/coupon/list/', {
        params: {
          user_id: this.currentUser.id
        }
      }).then(({data}) => {
        if (data.ok && data.data.length) {
          this.couponList = data.data
          this.showCouponList = true
        }
      })
    },
    handleCloseCouponList () {
      this.showCouponList = false
    },
    getAllCoupon () {
      if (!this.currentUser) {
        this.showCouponList = false
        return
      }
      const couponIds = this.couponList.map(item => item.id).join(',')
      this.$http.get('/accounts/mycoupon/create/', {
        params: {
          user_id: this.currentUser.id,
          coupon_ids: couponIds
        }
      }).then(() => {
        this.showCouponList = false
      })
    },
    recevieFriendCoffee () {
      this.$http.get('/accounts/bank/update/', {
        params: {
          user_id: this.currentUser.id,
          code_id: this.showFriendGiveObj.codeId
        }
      }).then(({data}) => {
        this.showFriendGive = false
        //location.href = '/'
        this.skipCafe()
      })
    },
    //点击领取好友的券跳转到我的咖啡库
    skipCafe(){
      this.$router.replace({path: 'lib'})
    },
    //首页赠送者进入可以看到好友领取了礼物后的弹窗消息
    checkNoticeMsg () {
      this.$http.get('/accounts/notice/list/', {
        params: {
          user_id: this.currentUser.id
        }
      }).then(({data}) => {
        if (data.ok) {
          this.showFriendGiveObj = data.data.filter(obj => obj.is_read === false)[0]
          if (this.noticeMsgObj) {
            this.showFriendGiveMsg = true
          }
        }
      })
    },
      iAlreadyrRead(){
        this.$http.get('/accounts/notice/update/' ,{
          params:{notice_id:this.noticeMsgObj.notice_id}
        }).then(({data}) =>{
          if(data.ok){
            this.showFriendGiveMsg = false;
          }
        })
    },

    recevieFirstFree () {
      this.showCouponFirst = false
      this.$store.commit('SET_USER_FIRST')
    }
  }

}
</script>

<style scope lang='stylus'>
.vux-slider
  height 1.8rem
.fake
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 9999
.coupon-index-modal .weui-dialog
  background url('/static/img/s2.png') no-repeat top
  background-size cover
  max-width 3.2rem !important
  width 3.2rem !important
  height 1.31rem
  .body
    padding 0.3rem 0.8rem 0 0.8rem
    color #fff
    font-size 0.13rem
.friend-co-modal .weui-dialog
  background url('/static/img/s1.png') no-repeat top
  background-size cover
  max-width 2.8rem !important
  width 2.8rem !important
  height 2rem
  .body
    padding 1.15rem 0.1rem 0 0.1rem
    line-height 1.2
    color #333333
    font-size 0.15rem
  .btn
    position absolute
    bottom 0
    padding 0.1rem 0
    width 100%

.coupon-list-modal .weui-dialog
  overflow visible !important
  max-width 3.15rem !important
  width 3.15rem !important
  background url('/static/img/red/bg_red@3x.png') no-repeat top
  background-size cover
  height 3.75rem
  background-color transparent !important
  .coupon-title
    position absolute
    top 0.7rem
    width 100%
    font-size 0.2rem
    color white
    text-align center
  .btn
    margin 0.2rem
  .weui-btn_primary
    background-color #F5B44C
    color #E7120B
  .list-container
    margin-top 1.3rem
    padding 0rem 0.2rem 0 0.2rem
    height 1.5rem
    overflow auto
    .coupon-item
      height 0.7rem
      background-color #fff
      display flex
      border-radius 0.1rem
      & + .coupon-item
        margin-top 0.1rem
      .cp-content
        flex 1
        padding 0.13rem 0
      .cp-item-t
        color #E7120B
        font-size 0.15rem
        text-align left
      .cp-item-dur
        color #999999
        font-size 0.11rem
        text-align left
      .cp-icon
        flex 0 1 0.8rem
        align-items center
        display flex
        img
          width 0.37rem
          margin 0 auto
.vux-popup-dialog
  font-size 0.16rem
  margin-bottom 0.5rem
.popup-prod
  font-size 0.16rem
  padding 0.15rem
  text-align left
  img
    width 100%
  .bot
    display flex
    justify-content space-between
    .price
      font-size 0.17rem
      color #FFAF50
.prod-action
  font-size 0.26rem
  color #FFAF50
  vertical-align middle
  .select-item-count
    margin 0 0.06rem
    font-size 0.13rem
    color #343434
  &.inline
    align-items center
    display inline-flex
.popup
  font-size 0.16rem
  .weui-cells
    margin-top 0
  .header
    display flex
    background-color #F9F9F8
    padding 0.1rem 0.15rem
    justify-content space-between
    align-items center
    .label
      color #CECECE
      font-size 0.16rem
    .ac-right
      color #8AE0D7
      font-size 0.14rem
      line-height 1
  .vux-label
    color #434343
  .content-right
    color #FFAF50
    .price
      vertical-align middle
      font-size 0.17rem
      color #F7A111
      margin-right 0.2rem
.prod-desc
  color #999999
  font-size 0.11rem
  &.flex
    display flex
    flex-wrap wrap
    span
      flex 0 0 50%
.page-home
  .list-box
    display flex
    /*height calc(100vh - 0.88rem)*/
    /*height calc(100vh - 2.68rem)*/
    &.checking
      /*height calc(100vh - 2.68rem)*/
    .sider-nav
      flex 0 1 0.8rem
      background-color #F3F3F3
      .nav-item-parent
        position sticky
        top 0.4rem
      .nav-item
        font-size 0.13rem
        color #323232
        line-height 0.5rem
        height 0.5rem
        text-align center
        &.active
          border-left 0.03rem solid #FFAF50
          color #000
          background-color #FBFCFF
          font-weight bold
    .content-list
      flex 1
      background-color #fff
      /*overflow-y auto
      overflow-x hidden*/
      .label
        padding 0.1rem 0.1rem 0 0.1rem
      .card-list
        .card-item
          display flex
          padding 0.07rem 0.1rem
          .prod-img
            flex 0 1 0.9rem
            height 0.9rem
            position relative
            img
              width 100%
              vertical-align top
            .info
              width 0
              height 0
              border-top 0.32rem solid #9EE5E1
              border-right 0.32rem solid transparent
              position absolute
              top 0
              left 0
              &:before
                content '折'
                position absolute
                top -0.3rem
                left 0.04rem
                font-size 0.1rem
                color white
              &.hot
                border-top-color #FF937E
                &:before
                  content '热'
          .prod-info
            flex 1
            padding 0 0.07rem
            position relative
            .prod-title
              font-size 0.14rem
              color #343434
            .prod-desc
              color #999999
              font-size 0.11rem
              min-height 0.34rem
              max-height 0.34rem
              overflow hidden
            .prod-price
              width 1rem
              position absolute
              bottom 0
              font-size 0.16rem
              .vip-price
                color #FFAF50
                font-size 0.18rem
                font-weight bolder
              .price
                font-size 0.1rem
                margin-left 0.1rem
                color #999999
                text-decoration line-through
            .prod-action
              position absolute
              right 0.04rem
              line-height 1
              display flex
              bottom 0px
              align-items center
  .ads-bar
    position sticky
    top 0
    height 0.38rem
    color #3C3B40
    padding 0 0.15rem
    line-height 0.38rem
    font-size 0.12rem
    background-color #fff
    z-index 999
    img
      margin-right 0.1rem
      width 0.13rem
      vertical-align middle


</style>
