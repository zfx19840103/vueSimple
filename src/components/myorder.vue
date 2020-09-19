<template>
  <div class="myorder">
    <div class="wrapper" ref="wrapper" v-bind:style="{ height: windowHeight+'px'}">
      <div class="pageHead">
        <div class="headImg"></div>
        <div class="phone">{{phone}}</div>
        <div class="logOut" @click="logOut">退出</div>
      </div>
      <div v-if="myorderData.list.length == 0" class="nodata">
        <div class="noneWL"></div>
        <div class="noneHead">暂无订单</div>
      </div>
      <div v-else class="bscroll-container">
        <ul class="content">
          <li v-for="(item, index) in myorderData.list" :key="index">
            <div>
              <div class="top">
                <span>{{item.created_at|dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                <em>{{order_status_func(item.order_status, item.order_code)}}</em>
              </div>
              <div class="center">
                <img :src="item.snapshoot_cnt.sku_list[0].images ? item.snapshoot_cnt.sku_list[0].images[0] : ''"
                  :onerror="defaultAvatar" />
                <p>{{item.snapshoot_cnt.sku_list[0].itemName}}</p>
                <button @click="onemorePayFunc(item)">查看物流</button>
              </div>
            </div>
          </li>
        </ul>
        <!-- 底部提示信息 -->
        <div class="bottom-tip">
          <span class="loading-hook">{{pullupMsg}}</span>
        </div>
      </div>
    </div>
    <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>

  </div>
</template>

<script>
  import Cookie from "js-cookie";

  import {
    logout
  } from "@/api/login";
  import {
    orderlist
  } from "@/api/myorder";
  import {
    logisticsinfo
  } from "@/api/ordertrack";
  import AlertBox from "./alertbox";

  import BScroll from "better-scroll";

  export default {
    data() {
      return {
        deleteorderDialog: false,
        doda: true,
        dodb: false,

        alertBox: {
          visible: false,
          tip: ""
        },
        nodata: false,
        myorderData: {
          list: [],
          list1: [{
              "invoice_status": 0,
              "invoice_info": null,
              "invoice_res": null,
              "usage_scenario": "bytemoon_pay",
              "user_id": 15,
              "out_biz_code": "15_16004048640993637",
              "order_code": "1004048644405Bkbw",
              "pay_req_code": "05f762ea-f96b-11ea-9dea-00163e0bb9a2",
              "snapshoot_cnt": {
                "out_biz_code": "15_16004048640993637",
                "sku_list": [{
                  "itemCode": "MA0000001",
                  "shopPrice": 1,
                  "itemName": "2020中秋月饼礼盒",
                  "images": [
                    "https://static.tsingglobal.com/activity/bytemoon/images/items001.png"
                  ],
                  "barCode": "MA0000001",
                  "warehouseCode": "25670",
                  "customerid": "",
                  "ownercode": "",
                  "status": 0,
                  "created_at": "2020-09-17T09:56:01.000000Z",
                  "updated_at": "2020-09-17T09:56:01.000000Z",
                  "actstock": 1000,
                  "shop_price": "0.01",
                  "freight": "0.00",
                  "sku_count": "1"
                }],
                "pay_method": 2,
                "receive_info": {
                  "province": "北京市",
                  "city": "北京市",
                  "area": "朝阳区",
                  "name": "王",
                  "detailAddress": "哈哈哈",
                  "mobile": "15910793391"
                },
                "is_invoice": "0",
                "pathway": "1",
                "orderdes": "",
                "usage_scenario": "bytemoon_pay",
                "user_id": 15,
                "session_id": "cgdqRBbV0aOZRuvZYjHy1zqHLIP6QXlw8rwBd1Ik",
                "pay_expired_at": 1600405164,
                "order_code": "1004048644405Bkbw",
                "total_sku_price": "0.01",
                "freight": "0.00",
                "total_price": "0.01",
                "split_orders": {
                  "25670": [{
                    "itemCode": "MA0000001",
                    "shopPrice": 1,
                    "itemName": "2020中秋月饼礼盒",
                    "images": [
                      "https://static.tsingglobal.com/activity/bytemoon/images/items001.png"
                    ],
                    "barCode": "MA0000001",
                    "warehouseCode": "25670",
                    "customerid": "",
                    "ownercode": "",
                    "status": 0,
                    "created_at": "2020-09-17T09:56:01.000000Z",
                    "updated_at": "2020-09-17T09:56:01.000000Z",
                    "actstock": 1000,
                    "shop_price": "0.01",
                    "freight": "0.00",
                    "sku_count": "1"
                  }]
                },
                "warehouse_code": 25670
              },
              "pay_status": 2,
              "order_status": 2,
              "created_at": "2020-09-18T04:54:24.000000Z",
              "updated_at": "2020-09-18T04:54:42.000000Z",
              "deleted_at": null,
              "logistics_name": "顺丰",
              "user_email": "jianzhuo.wang@tsingglobal.com",
              "mail_no": ""
            },

            {
              "invoice_status": 0,
              "invoice_info": null,
              "invoice_res": null,
              "usage_scenario": "bytemoon_pay",
              "user_id": 9364,
              "out_biz_code": "9364_16000699918453438",
              "order_code": "1000699849965b766",
              "pay_req_code": "51dcc6fa-f65f-11ea-bf7d-00163e02a168",
              "snapshoot_cnt": {
                "freight": "0.00",
                "pathway": "1",
                "user_id": 9364,
                "orderdes": "",
                "sku_list": [{
                  "images": [
                    "https://static.tsingglobal.com/activity/bytemoon/images/items001.png?11"
                  ],
                  "status": 0,
                  "barCode": "MA0000001-pt",
                  "freight": "0.00",
                  "actstock": 1,
                  "itemCode": "MA0000001",
                  "itemName": "2020中秋月饼礼盒",
                  "shopPrice": 13600,
                  "sku_count": "1",
                  "created_at": "2020-09-06T12:03:16.000000Z",
                  "shop_price": "136.00",
                  "updated_at": "2020-09-06T12:03:16.000000Z",
                  "warehouseCode": "CAN216"
                }],
                "is_invoice": "0",
                "order_code": "1000699849965b766",
                "pay_method": 1,
                "session_id": "ufSmPXbwdgBisZK5V4t5U37GtewAyVrvZ8Cf74l3",
                "total_price": "136.00",
                "invoice_info": "",
                "out_biz_code": "9364_16000699918453438",
                "receive_info": {
                  "area": "拱墅区",
                  "city": "杭州市",
                  "name": "钱磊",
                  "mobile": "13750811558",
                  "province": "浙江省",
                  "detailAddress": "白马大厦"
                },
                "split_orders": {
                  "CAN216": [{
                    "images": [
                      "https://static.tsingglobal.com/activity/bytemoon/images/items001.png?11"
                    ],
                    "status": 0,
                    "barCode": "MA0000001-pt",
                    "freight": "0.00",
                    "actstock": 1,
                    "itemCode": "MA0000001",
                    "itemName": "2020中秋月饼礼盒",
                    "shopPrice": 13600,
                    "sku_count": "1",
                    "created_at": "2020-09-06T12:03:16.000000Z",
                    "shop_price": "136.00",
                    "updated_at": "2020-09-06T12:03:16.000000Z",
                    "warehouseCode": "CAN216"
                  }]
                },
                "pay_expired_at": 1600070284,
                "usage_scenario": "bytemoon_pay",
                "warehouse_code": "CAN216",
                "total_sku_price": "136.00"
              },
              "pay_status": 2,
              "order_status": 2,
              "created_at": "2020-09-14T07:53:04.000000Z",
              "updated_at": "2020-09-14T12:10:50.000000Z",
              "deleted_at": null,
              "logistics_name": "顺丰",
              "user_email": "",
              "mail_no": ""
            }
          ]
        },
        windowHeight: document.documentElement.clientHeight,
        myorderDatapagesize: 10,
        myorderDatapage: 1,
        loadingConnecting: false,
        pulldownMsg: "下拉刷新",
        pullupMsg: "加载更多",
        tipppp: "",
        total: 1,
        pagesthis: 1,
        imgaddress: "",
        deleteorderindex: 1,
        phone: localStorage.getItem('xingbake')
      };
    },
    components: {
      AlertBox
    },
    computed: {
      defaultAvatar() {
        return 'this.src="' + require("../assets/img/default.png") + '"';
      }
    },
    created() {
      let that = this;
      this.initData();
      // this.pulldownFunc();
    },
    mounted() {},
    watch: {},
    methods: {
      initData() {
        this.getData(res => {
          this.myorderData.list = res.data.list;
          if (res.data.list.length > 0) {
            this.myorderDatapage++;
            this.total = res.data.total;
            if (this.total < this.myorderDatapagesize) {
              this.pullupMsg = "已是最后一页";
            }

            // this.nodata = true; //模拟无数据
          } else {
            this.nodata = true;
          }
        }, 1);
      },

      pulldownFunc() {
        let that = this;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.wrapper, {
            //初始化better-scroll
            probeType: 3, //1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
            click: true //是否派发click事件
          });
          // 滑动过程中事件
          this.scroll.on("scroll", pos => {
            // that.tipppp = that.myorderDatapage<=Math.ceil(that.total/that.myorderDatapagesize)
          });
          //滑动结束松开事件
          this.scroll.on("touchEnd", pos => {
            //上拉刷新

            if (pos.y < this.scroll.maxScrollY - 50) {
              if (
                that.myorderDatapage > 1 &&
                that.myorderDatapage <=
                Math.ceil(that.total / that.myorderDatapagesize)
              ) {
                //下拉加载
                this.pullupMsg = "加载中。。。";

                that.getData(res => {
                  this.myorderData.list = this.myorderData.list.concat(
                    res.data.list
                  );
                  if (
                    that.myorderDatapage >
                    Math.ceil(
                      that.total / that.myorderDatapagesize
                    )
                  ) {
                    this.pullupMsg = "已是最后一页";
                  }
                }, that.myorderDatapage++);
              }
            }
          });
        });
      },
      order_status_func(status, order_code) {
        var str = "";
        // if (status == 0) {
        //     str = "待兑换";
        // } else if (status == 1) {
        //     str = "已取消";
        // } else if (status == 2) {
        //     str = "下单成功";
        // } else if (status == 3) {
        //     str = "待发货";
        // } else if (status == 4) {
        //     str = "已发货";
        // } else if (status == 5) {
        //     str = "兑换完成";
        // } else if (status == 6) {
        //     str = "兑换异常";
        // }
        if (status == 4 || status == 5) {
          let data = {
            orderCode: order_code
          }
          logisticsinfo(data).then(function(res) {
            if (!!res && res.code == 20000) {
              str = res.data.logistics_status
            } else if (!!res && res.code == 113005) {
              that.alertBox = {
                visible: true,
                tip: res.message
              };
              localStorage.removeItem("moon_email");
              localStorage.removeItem("onemoreobj");
              localStorage.removeItem("xingbake");
              localStorage.removeItem("USERINFO");
              setTimeout(function() {
                that.$router.push("/login");
              }, 1000);
            } else {
              that.alertBox = {
                visible: true,
                tip: res.message
              };
            }
          }).catch(function(error) {
            console.log(error);
          })
        } else {
          str = '兑换成功'
        }
        return str;
      },
      getData(callback, pages) {
        let that = this;
        let data = {
          page: pages,
          pagesize: this.myorderDatapagesize,
          usage_scenario: "bytemoon_exchange"
        };
        orderlist(data).then(function(res) {
          if (res.code == 20000) {
            callback(res);
          } else if (!!res && res.code == 113005) {
            that.alertBox = {
              visible: true,
              tip: res.message
            };

            localStorage.removeItem("moonxing_email");
            localStorage.removeItem("onemoreobj_xing");
            localStorage.removeItem("xingbake");
            localStorage.removeItem("USERINFO");
            setTimeout(function() {
              that.$router.push("/login");
            }, 1000);
          } else {
            that.alertBox = {
              visible: true,
              tip: res.message
            };
          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      // 点击查看物流
      onemorePayFunc(item) {
        let that = this;
        localStorage.setItem("USERINFO", JSON.stringify(item.snapshoot_cnt.receive_info));
        that.$router.push({
          name: "ordertrack",
          query: {
            orderCode: item.order_code
          }
        });
      },

      // 退出登录
      logOut() {
        let that = this;
        logout().then(function(res) {
            if (!!res && res.code == 20000) {
              that.alertBox = {
                  visible: true,
                  tip: "退出成功"
                },
                localStorage.removeItem("xingbake");
                localStorage.removeItem("USERINFO"); 
              setTimeout(function() {
                that.$router.push('/login')
              }, 1000)
            } else {
              that.alertBox = {
                visible: true,
                tip: res.message
              }
            }
          })
          .catch(function(error) {

          });
      },
    }
  };
</script>

<style scoped>
  .pageHead {
    padding: 10px 0;
    text-align: left;
    overflow: hidden;
  }

  .headImg {
    width: 28px;
    height: 28px;
    background-image: url(../assets/img/head.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    margin-left: 17px;
    margin-right: 13px;
    vertical-align: middle;
  }

  .phone {
    color: #7D472B;
    display: inline-block;
    vertical-align: middle;
  }

  .logOut {
    width: 37px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 11px;
    background: #D7A666;
    float: right;
    color: #ffffff;
    font-size: 12px;
    margin-right: 12px;
    margin-top: 3px;
  }

  .doda {}

  .dodb span {
    display: block;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    margin: 0.08rem 0 0;
    color: rgba(51, 51, 51, 1);
  }

  div.dodb button:focus {
    outline: none;
  }

  div.dodb button.callphone a {
    color: #ffffff;
    text-decoration: none;
  }

  div.dodb button {
    top: 0.95rem;
  }

  .doda button,
  .dodb button {
    width: 0.9rem;
    height: 0.3rem;
    border-radius: 18px;
    font-size: 14px;

    font-weight: 400;
    position: absolute;

    top: 0.92rem;
  }

  .doda button.wrong,
  .dodb button.callphone {
    background: linear-gradient(90deg,
      rgba(60, 140, 255, 1) 0%,
      rgba(12, 97, 216, 1) 100%);
    color: #ffffff;
    border: 0;
    right: 0.46rem;
  }

  .doda button.deleteorder,
  .dodb button.deleteorder {
    color: rgba(15, 101, 222, 1);
    display: inline-block;
    outline: 0;
    border: 1px solid rgba(12, 98, 217, 1);
    background: #ffffff;
    left: 0.46rem;
  }

  .doda p,
  .dodb p {
    padding: 0.37rem 0 0;
  }

  .doda h3,
  .dodb h3 {
    padding: 0;
    font-size: 18px;
    padding: 0.3rem 0 0;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
  }

  .dodcontent {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.75rem 0 0 -1.49rem;
    width: 2.98rem;
    height: 1.5rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 14px;
    z-index: 2;
  }

  .deleteorderDialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .deleteorderDialogBg {
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .nodata {
    background: #FFFFFF;
    height: 100%;
    overflow: hidden;
  }

  .noneWL {
    width: 183px;
    height: 162px;
    background-image: url(../assets/img/noneOrder.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 90px;
  }

  .noneHead {
    color: #B6B6B6;
    margin-top: 16px;
  }

  .wrapper {
    font-size: 14px;
    width: 100%;
    background: #F4F4F4;
    overflow: hidden;
    position: relative;
    -webkit-overflow-scrolling: touch;
  }

  div.myorder ul li .center p.shopPricesku_count {
    text-align: right;
    height: 34px;
    margin-top: -17px;
    font-size: 14px;
  }

  /* 下拉、上拉提示信息 */
  .top-tip {
    position: absolute;
    top: -40px;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #555;
  }

  .bottom-tip {
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #777;
    background: #f2f2f2;
    position: absolute;
    bottom: -35px;
    left: 0;
  }

  .myorder ul {
    margin: 0;
    padding: 0 0 10px;
  }

  ul li {
    list-style: none;
    background: #ffffff;
    margin-bottom: 10px;
    position: relative;
  }

  .myorder ul li .top {
    height: 32px;
    line-height: 34px;
    border-bottom: #f4f4f4 solid 1px;
    font-size: 12px;
    padding: 0 12px;
  }

  .myorder ul li .top span {
    color: #9b9b9b;
    float: left;
  }

  .myorder ul li .top em {
    color: #7D472B;
    float: right;
    font-style: normal;
  }

  .myorder ul li .top em.col {
    color: #ff502c;
  }

  .myorder ul li .center {
    box-sizing: border-box;
    height: 90px;
    padding: 10px 12px 0;
    border-bottom: #f4f4f4 solid 1px;
  }

  .myorder ul li .center img {
    float: left;
    width: 68px;
    height: 68px;
    overflow: hidden;
    margin: 0 16px 0 0;
  }

  .myorder ul li .center p {
    text-align: left;
    padding: 0;
    margin: 0;
  }

  .myorder ul li .center p:nth-child(2) {
    color: #333333;
    font-size: 15px;
    height: 21px;
    line-height: 21px;
    width: 2.9rem;
  }

  .myorder ul li .center p:nth-child(3) {
    color: #9b9b9b;
    font-size: 12px;
    height: 17px;
    line-height: 17px;
  }

  .myorder ul li .center p:nth-child(4) {
    color: #333333;
    font-size: 14px;
    padding: 12px 0 0;
    height: 20px;
    line-height: 20px;
    text-align: right;
  }

  .myorder ul li .center button {
    width: 76px;
    height: 30px;
    border-radius: 18px;
    color: #FFFFFF;
    border: none;
    outline: none;
    background: #D7A666;
    float: right;
    margin-top: 16px;
  }

  .myorder ul li .bottom button {
    float: right;
    margin: 8px 0 0 10px;
    color: #0f65de;
    font-size: 14px;
    background: #ffffff;
    outline: 0;
    width: 90px;
    height: 30px;
    border-radius: 18px;
    border: 1px solid rgba(12, 98, 217, 1);
  }

  .myorder ul li .bottom {
    height: 46px;
    padding: 0 12px;
  }

  .myorder ul li .bottom button.pay {
    background: linear-gradient(90deg,
      rgba(60, 140, 255, 1) 0%,
      rgba(12, 97, 216, 1) 100%);
    border: 0;
    color: #ffffff;
  }
</style>
