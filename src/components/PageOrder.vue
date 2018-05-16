<template>
  <div class='page-order'>
    <tab
      active-color='#FE9F47'
      default-color='#3C3B40'>
      <tab-item
        :selected='actived === i'
        @on-item-click="onItemClick"
        v-for='(tab, i) in tabList'
        :key='i'>{{tab}}</tab-item>
    </tab>
    <div class='list-container'>
      <div
        v-for='item in prodListShow'
        :key='item.id'
        class='prod-item'>
        <div class='left'>
          <div class='title'>{{item.title}} x{{item.count}}</div>
          <div class='c-at'>{{item.pay_at}}</div>
        </div>
        <div class='right'>
          {{prodItemDesc}}
        </div>
      </div>
      <div class='empty-tip' v-show='prodListShow.length === 0'>
        暂无任何记录
      </div>
    </div>
    <div v-transfer-dom>
      <loading :show="showLoading" :text="loadText"></loading>
    </div>
  </div>
</template>

<script>
import {
  Tab,
  TabItem,
  Loading,
  TransferDomDirective as TransferDom
} from 'vux'
import moment from 'moment'

export default {
  name: 'order',
  directives: {
    TransferDom
  },
  components: {
    Tab,
    TabItem,
    Loading
  },
  data () {
    return {
      actived: 0,
      tabList: [
        '取货订单',
        '赠亲友订单',
        '购买记录'
      ],
      orderList: [],
      showLoading: true,
      loadText: '加载中...'
    }
  },
  mounted () {
    this.fetchOrderList()
  },
  computed: {
    currentUser () {
      return this.$store.getters.userInfo
    },
    prodListShow () {
      let prodList = []
      let orderList = []
      switch (this.actived) {
        case 0:
          orderList = this.orderList.filter(item => item.is_delivery)
          break
        case 1:
          orderList = this.orderList.filter(item => item.is_received)
          break
        case 2:
          orderList = this.orderList
          break
      }
      orderList.forEach(item => {
        item.product_info.forEach(prod => {
          prod.pay_at = moment(item.update_time).format('lll')
        })
        prodList = prodList.concat(item.product_info)
      })
      return prodList
    },
    prodItemDesc () {
      switch (this.actived) {
        case 0:
          return '取货成功'
        case 1:
          return '赠送成功'
        case 2:
          return '购买成功'
      }
    }
  },
  methods: {
    onItemClick (index) {
      this.actived = index
    },
    fetchOrderList () {
      if (!this.currentUser) {
        this.showLoading = false
        return
      }
      this.$http.get('/accounts/order/list/', {
        params: {
          user_id: this.currentUser.id
        }
      }).then(({data}) => {
        if (data.ok) {
          this.orderList = data.data
          this.showLoading = false
        }
      })
    }
  }
}
</script>

<style lang='stylus' scope>
.page-order
  background-color #FBFCFF
  font-size 0.16rem
  .empty-tip
    text-align center
    color #ddd
    padding 0.5rem 0
  .list-container
    height calc(100vh - 1.04rem)
    overflow auto
    .prod-item
      background-color #fff
      margin 0.1rem 0
      padding 0.2rem 0.28rem
      display flex
      justify-content space-between
      align-items center
      .title
        font-size 0.14rem
        color #343434
      .c-at
        font-size 0.11rem
        color #999999
        margin-top 0.05rem
      .right
        color #FFAF50
        font-size 0.12rem
</style>
