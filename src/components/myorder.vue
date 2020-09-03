<template>
    <div class="myorder">
        <div class="nodata" v-if="nodata"><span>暂无订单</span></div>
        <div class="wrapper" v-else ref="wrapper" v-bind:style="{ height: windowHeight+'px'}">
            <div class="bscroll-container">
                <ul class="content">
                    <li v-for="(item, index) in myorderData.list" :key="index">
                        <div @click="orderdetail(item)">
                            <div class="top">
                                <span>{{item.created_at|dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                                <em
                                    v-bind:class="{ 'col': item.pay_status == 0 }"
                                >{{order_status_func(item.order_status)}}</em>
                            </div>
                            <div class="center">
                                <img
                                    :src="item.snapshoot_cnt.sku_list[0].images[0]? item.snapshoot_cnt.sku_list[0].images[0] : ''"
                                    :onerror="defaultAvatar"
                                />
                                <p>{{item.snapshoot_cnt.sku_list[0].itemName}}</p>
                                <p class="shopPricesku_count">
                                    ¥{{item.snapshoot_cnt.sku_list[0].shop_price}}
                                    <br />
                                    X{{item.snapshoot_cnt.sku_list[0].sku_count}}
                                </p>
                                <p>共{{item.snapshoot_cnt.sku_list[0].sku_count}}盒 实付：¥{{item.snapshoot_cnt.total_price}}</p>
                            </div>
                        </div>
                        <div class="bottom">
                            <button
                                v-bind:class="{ 'pay': item.pay_status == 0 }"
                                v-if="item.pay_status == 0"
                                @click="gotoPayFunc(item)"
                            >去支付</button>
                            <button v-else @click="onemorePayFunc(item)">再来一单</button>

                            <button
                                v-if="item.order_status == 2 || item.order_status == 3 || item.order_status == 4"
                                @click="deleteorder(item, index)"
                            >取消订单</button>
                            <button
                                v-if="item.order_status == 5 && item.invoice_status == 0"
                                @click="invoiceopen(item)"
                            >申请开票</button>
                            <button
                                v-if="item.order_status == 5 && (item.invoice_status == 1 || item.invoice_status == 2 || item.invoice_status == 4)"
                                @click="invoiceshow(item)"
                            >查看发票</button>
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

        <div class="deleteorderDialog" v-if="deleteorderDialog">
            <div class="deleteorderDialogBg" @click="closedodFunc"></div>
            <div class="dodcontent">
                <div class="doda" v-if="doda">
                    <h3>确认取消订单吗？</h3>
                    <p>
                        <button class="deleteorder" @click="deleteorderFunc">取消订单</button>
                        <button class="wrong" @click="closedodFunc">点错了</button>
                    </p>
                </div>
                <div class="dodb" v-if="dodb">
                    <h3>订单已发货，请联系客服。</h3>
                    <span>客服电话：+86 17610095818</span>
                    <p>
                        <button class="deleteorder" @click="closedodFunc">取消</button>
                        <button class="callphone">
                            <a href="tel:+86 17610095818">拨打</a>
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookie from "js-cookie";

import { orderlist, orderrefund } from "@/api/myorder";
import { ordercreateapi } from "@/api/ordercheck";
import { paycreate } from "@/api/orderdetail";
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
                list: []
            },
            windowHeight: document.documentElement.clientHeight,
            myorderDatapagesize: 10,
            myorderDatapage: 1,
            loadingConnecting: false,
            pulldownMsg: "下拉刷新",
            pullupMsg: "加载更多",
            tipppp: "",
            _scroll: {},
            total: 1,
            pagesthis: 1,
            _order_code: "",
            imgaddress: "",
            deleteorderindex: 1
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
        this.pulldownFunc();
    },
    mounted() {},
    watch: {},
    methods: {
        invoiceopen(item) {
            let data = {
                ivnewscode: item.order_code,
                ivnewsprice: item.snapshoot_cnt.total_price
            };

            this.$router.push({ name: "invoiceopen", query: data });
        },
        invoiceshow(item) {
            console.log(item.snapshoot_cnt.invoice_info)
            let data = {
                ivnewscode: item.order_code,
                ivnewsprice: item.snapshoot_cnt.total_price,

                invoice_status: item.invoice_status,
                invoice_type: item.invoice_info.invoice_type,
                invoice_name: item.invoice_info.invoice_name,
                taxpayer_number:
                    item.invoice_info.taxpayer_number,
                created_at: item.created_at,
                imgaddress: !!item.invoice_res ? item.invoice_res.URL : ""
            };

            this.$router.push({ name: "invoiceshow", query: data });
        },
        closedodFunc() {
            this.deleteorderDialog = false;
        },
        initData() {
            this.getData(res => {
                if (res.data.list.length > 0) {
                    this.myorderData.list = res.data.list;
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
        deleteorderFunc() {
            let that = this;
            let data = {
                order_code: this._order_code
            };
            let newarr = [];
            let thispage =
                Math.ceil(that.deleteorderindex / 10) > 0
                    ? Math.ceil(that.deleteorderindex / 10)
                    : 1;

            orderrefund(data)
                .then(function(res) {
                    if (res.code == 20000) {
                        setTimeout(function() {
                            that.doda = false;
                            that.dodb = false;
                            that.deleteorderDialog = false;

                            that.getData(res => {
                                newarr =
                                    thispage == 1
                                        ? res.data.list
                                        : that.myorderData.list.slice(
                                              0,
                                              thispage > 1
                                                  ? (thispage - 1) * 10
                                                  : 10
                                          );

                                if (thispage > 1) {
                                    newarr = newarr.concat(res.data.list);
                                }

                                newarr = newarr.concat(
                                    that.myorderData.list.slice(
                                        thispage * 10,
                                        that.myorderData.list.length
                                    )
                                );
                                that.myorderData.list = newarr;
                            }, thispage);
                        }, 1000);
                        that.alertBox = {
                            visible: true,
                            tip: "取消成功"
                        };
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            visible: true,
                            tip: res.message
                        };

                        localStorage.removeItem("moon_email");
                        localStorage.removeItem("onemoreobj");
                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                    } else {
                        that.alertBox = {
                            visible: true,
                            tip: res.message
                        };
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        callphoneFunc() {},

        deleteorder(item, index) {
            let that = this;
            that.deleteorderindex = index;
            if (item.order_status == 4) {
                this._order_code = item.order_code;
                this.doda = false;
                this.dodb = true;
                this.deleteorderDialog = true;
            } else {
                this._order_code = item.order_code;
                this.doda = true;
                this.dodb = false;
                this.deleteorderDialog = true;
            }
        },

        orderdetail(item) {
            let that = this;
            localStorage.setItem("order_code", item.order_code);
            that.$router.push({ name: "orderdetail", query: { myorder: 1 } });
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
        order_status_func(status) {
            var str = "";
            if (status == 0) {
                str = "待付款";
            } else if (status == 1) {
                str = "已取消";
            } else if (status == 2) {
                str = "下单成功";
            } else if (status == 3) {
                str = "待发货";
            } else if (status == 4) {
                str = "已发货";
            } else if (status == 5) {
                str = "交易完成";
            } else if (status == 6) {
                str = "交易异常";
            }

            return str;
        },
        pay_status_func(status) {
            var str = "";
            if (status == 0) {
                str = "待支付";
            } else if (status == 1) {
                str = "支付超时";
            } else if (status == 2) {
                str = "支付成功";
            } else if (status == 3) {
                str = "发起退款";
            } else if (status == 4) {
                str = "退款失败";
            } else if (status == 5) {
                str = "退款成功";
            } else if (status == 6) {
                str = "支付异常";
            }

            return str;
        },
        getData(callback, pages) {
            let that = this;
            let data = {
                page: pages,
                pagesize: this.myorderDatapagesize,
                usage_scenario: "bytemoon_pay"
            };
            orderlist(data)
                .then(function(res) {
                    if (res.code == 20000) {
                        callback(res);
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            visible: true,
                            tip: res.message
                        };

                        localStorage.removeItem("moon_email");
                        localStorage.removeItem("onemoreobj");
                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                    } else {
                        that.alertBox = {
                            visible: true,
                            tip: res.message
                        };
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        gotoPayFunc(item) {
            let that = this;

            that.$router.push({
                name: "ordercheck",
                query: {
                    onemore: 1,
                    payloading: 1
                }
            });
            localStorage.removeItem("numordersmethodobj");
            localStorage.removeItem("addressobj");
            localStorage.removeItem("invoiceobj");
            localStorage.setItem("onemoreobj", JSON.stringify(item));
        },
        onemorePayFunc(item) {
            let that = this;

            that.$router.push({
                name: "ordercheck",
                query: {
                    onemore: 1
                }
            });
            localStorage.removeItem("numordersmethodobj");
            localStorage.removeItem("addressobj");
            localStorage.removeItem("invoiceobj");
            localStorage.setItem("onemoreobj", JSON.stringify(item));
        }
    }
};
</script>

<style scoped>
.doda {
}
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
    background: linear-gradient(
        90deg,
        rgba(60, 140, 255, 1) 0%,
        rgba(12, 97, 216, 1) 100%
    );
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
.nodata span {
    font-size: 13px;
    font-weight: normal;
    color: #B6B6B6;
    padding: 1.87rem 0 0;
    display: block;
    width: 100%;
    text-align: center;
}
.nodata {
    position: absolute;
    top: 1.48rem;
    width: 1.83rem;
    height: 1.62rem;
    left: 50%;
    margin-left: -0.915rem;
    background: url(../assets/img/noordericon.png) no-repeat;
    background-size: cover;
}
.wrapper {
    font-size: 14px;
    width: 100%;
    background: #ccc;
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
    height: 170px;
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
    color: #333333;
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
    background: linear-gradient(
        90deg,
        rgba(60, 140, 255, 1) 0%,
        rgba(12, 97, 216, 1) 100%
    );
    border: 0;
    color: #ffffff;
}
</style>