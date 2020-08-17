<template>
    <div class="myorder">
        <div class="nodata" v-if="nodata">暂无数据</div>
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
                                <img :src="item.snapshoot_cnt.sku_list[0].images[0]? item.snapshoot_cnt.sku_list[0].images[0] : ''" :onerror="defaultAvatar" />
                                <p>{{item.snapshoot_cnt.sku_list[0].itemName}}</p>
                                <p class="shopPricesku_count">
                                    ¥{{item.snapshoot_cnt.sku_list[0].shopPrice}}
                                    <br />
                                    X{{item.snapshoot_cnt.sku_list[0].sku_count}}
                                </p>
                                <p>共{{item.snapshoot_cnt.sku_list[0].sku_count}}盒</p>
                            </div>
                        </div>
                        <div class="bottom">
                            <button
                                v-bind:class="{ 'pay': item.order_status == 0 }"
                                v-if="item.order_status == 0"
                                @click="gotoPayFunc(item)"
                            >去支付</button>
                            <button v-else @click="onemorePayFunc(item)">再来一单</button>
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

import { orderlist } from "@/api/myorder";
import { ordercreateapi } from "@/api/ordercheck";
import { paycreate } from "@/api/orderdetail";
import AlertBox from "./alertbox";

import BScroll from "better-scroll";

export default {
    data() {
        return {
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
            total: 1
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
        this.getData(res => {
            if (res.data.list.length > 0) {
                this.myorderData.list = res.data.list;
                this.myorderDatapage++;
                this.total = res.data.total;
            } else {
                this.nodata = true;
            }
        }, 1);
        this.pulldownFunc();
    },
    mounted() {},
    watch: {},
    methods: {
        orderdetail(item) {
            let that = this;
            localStorage.setItem("order_code", item.order_code);
            that.$router.push({ name: "orderdetail", query: {myorder:1} });
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
            if (!!status) {
                if (status == 0) {
                    str = "待付款";
                } else if (status == 1) {
                    str = "取消订单";
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
            }
            return str;
        },
        getData(callback, pages) {
            let data = {
                page: pages,
                pagesize: this.myorderDatapagesize,
                usage_scenario: "bytemoon_buy"
            };
            let that = this;
            orderlist(data)
                .then(function(res) {
                    if (res.code == 20000) {
                        callback(res);
                    } else if (!!res && res.code == 113005) {
                        this.alertBox = {
                            visible: true,
                            tip: res.message
                        };
                        localStorage.removeItem("moon_email");
                        localStorage.removeItem("onemoreobj");
                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                    } else {
                        this.alertBox = {
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

            localStorage.setItem("onemoreobj", JSON.stringify(item));
        }
    }
};
</script>

<style scoped>
.nodata {
    width: 100%;
    font-size: 16px;
    line-height: 100px;
    text-align: center;
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
    margin: 8px 0 0;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(
        90deg,
        rgba(27, 123, 255, 1) 0%,
        rgba(12, 97, 216, 1) 100%
    );
    outline: 0;
    width: 90px;
    height: 30px;
    border-radius: 18px;
    border: 0;
}
.myorder ul li .bottom {
    height: 46px;
    padding: 0 12px;
}

.myorder ul li .bottom button.pay {
    background: #ff502c;
    color: #ffffff;
}
</style>