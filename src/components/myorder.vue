<template>
    <div class="myorder">
        <div style="font-size: 14px; position:absolute; z-index:999; top:0; left:0;">{{tipppp}}</div>
        <div class="wrapper" ref="wrapper" v-bind:style="{ height: windowHeight+'px'}">
            <div class="bscroll-container">
                <!-- 刷新提示信息 -->
                <!-- <div class="top-tip">
                    <span class="refresh-hook">{{pulldownMsg}}</span>
                </div>-->
                <!-- 内容列表 -->
                <ul class="content">
                    <li v-for="(item, index) in myorderData.list" :key="index">
                        <div class="top">
                            {{index}}
                            <span>{{item.created_at}}</span>
                            <em
                                v-bind:class="{ 'col': item.pay_status == 0 }"
                            >{{order_status_func(item.order_status)}}</em>
                        </div>
                        <div class="center">
                            <img :src="item.snapshoot_cnt.sku_list[0].images[0]" />
                            <p>{{item.snapshoot_cnt.sku_list[0].itemName}}</p>
                            <p>运费: {{item.snapshoot_cnt.freight == 0 ? '免费' : '¥'+item.snapshoot_cnt.freight}}</p>
                            <p>共{{item.snapshoot_cnt.sku_list[0].sku_count}}盒 实付：¥{{item.snapshoot_cnt.total_price}}</p>
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
            myorderData: {
                list: [
                    {
                        id: 12,
                        user_id: 112,
                        out_biz_code: "1567898545",
                        order_code: "111223dddd",
                        snapshoot_cnt: {
                            user_id: 112,
                            out_biz_code: "1567898545",
                            sku_list: [
                                {
                                    itemCode: "itemcodeitemcode",
                                    shopPrice: 12,
                                    itemName: "月饼礼盒",
                                    images: [
                                        "https://cdn.learnku.com//uploads/communities/WtC3cPLHzMbKRSZnagU9.png"
                                    ],
                                    barCode: "pariatur",
                                    warehouseCode: "in aliqua non consectetur",
                                    status: 0, //0代付款，1已付款，2已关闭,
                                    created_at: "2020-07-17 10:19:09",
                                    updated_at: "2020-07-17 10:19:09",
                                    shop_price: "0.12",
                                    freight: "0",
                                    sku_count: 3
                                }
                            ],
                            pay_method: 0,
                            receive_info: {
                                province: "北京",
                                city: "北京市",
                                area: "朝阳区",
                                name: "用户名",
                                phone: "15633412233",
                                detailAddress: "朝阳区大悦城"
                            },
                            is_invoice: 1,
                            pathway: 1,
                            order_code: "111223dddd",
                            total_sku_price: "199",
                            freight: "0",
                            total_price: "199"
                        },
                        pay_status: 1,
                        order_status: 1,
                        created_at: "2020-07-19 17:00:00",
                        updated_at: "2020-07-19 17:00:00",
                        deleted_at: "2020-07-19 17:00:00"
                    },
                    {
                        id: -4331724.6716109365,
                        user_id: -34348112.378211714,
                        out_biz_code: "velit est proident des",
                        order_code: "askfjkalsjfkalsfjkladsfj",
                        snapshoot_cnt: {
                            user_id: 58886697.38669899,
                            out_biz_code: "ipsum mollit ",
                            sku_list: [
                                {
                                    itemCode: "itemcodeitemcode",
                                    shopPrice: 12,
                                    itemName: "月饼礼盒",
                                    images: [
                                        "https://cdn.learnku.com//uploads/communities/WtC3cPLHzMbKRSZnagU9.png"
                                    ],
                                    barCode: "pariatur",
                                    warehouseCode: "in aliqua non consectetur",
                                    status: 0, //0代付款，1已付款，2已关闭,
                                    created_at: "2020-07-17 10:19:09",
                                    updated_at: "2020-07-17 10:19:09",
                                    shop_price: "0.12",
                                    freight: "0",
                                    sku_count: 3
                                },
                                {
                                    itemCode: "itemcodeitemcode",
                                    shopPrice: 12,
                                    itemName: "月饼礼盒1",
                                    images: [
                                        "https://cdn.learnku.com//uploads/communities/WtC3cPLHzMbKRSZnagU9.png"
                                    ],
                                    barCode: "pariatur",
                                    warehouseCode: "in aliqua non consectetur",
                                    status: 1, //0代付款，1已付款，2已关闭,
                                    created_at: "2020-07-17 10:19:09",
                                    updated_at: "2020-07-17 10:19:09",
                                    shop_price: "0.12",
                                    freight: "0",
                                    sku_count: 3
                                },
                                {
                                    itemCode: "itemcodeitemcode",
                                    shopPrice: 12,
                                    itemName: "月饼礼盒2",
                                    images: [
                                        "https://cdn.learnku.com//uploads/communities/WtC3cPLHzMbKRSZnagU9.png"
                                    ],
                                    barCode: "pariatur",
                                    warehouseCode: "in aliqua non consectetur",
                                    status: 2, //0代付款，1已付款，2已关闭,
                                    created_at: "2020-07-17 10:19:09",
                                    updated_at: "2020-07-17 10:19:09",
                                    shop_price: "0.12",
                                    freight: "0",
                                    sku_count: 3
                                },
                                {
                                    itemCode: "itemcodeitemcode",
                                    shopPrice: 12,
                                    itemName: "月饼礼盒21",
                                    images: [
                                        "https://cdn.learnku.com//uploads/communities/WtC3cPLHzMbKRSZnagU9.png"
                                    ],
                                    barCode: "pariatur",
                                    warehouseCode: "in aliqua non consectetur",
                                    status: 2, //0代付款，1已付款，2已关闭,
                                    created_at: "2020-07-17 10:19:09",
                                    updated_at: "2020-07-17 10:19:09",
                                    shop_price: "0.12",
                                    freight: "0",
                                    sku_count: 3
                                },
                                {
                                    itemCode: "itemcodeitemcode",
                                    shopPrice: 12,
                                    itemName: "月饼礼盒22",
                                    images: [
                                        "https://cdn.learnku.com//uploads/communities/WtC3cPLHzMbKRSZnagU9.png"
                                    ],
                                    barCode: "pariatur",
                                    warehouseCode: "in aliqua non consectetur",
                                    status: 2, //0代付款，1已付款，2已关闭,
                                    created_at: "2020-07-17 10:19:09",
                                    updated_at: "2020-07-17 10:19:09",
                                    shop_price: "0.12",
                                    freight: "0",
                                    sku_count: 3
                                }
                            ],
                            pay_method: 1,
                            receive_info: {
                                province: "ad enim deserunt irure",
                                city: "dolore irure ea",
                                area: "sint exercitation cillum dolore",
                                name: "labore ea consectetur sit",
                                phone: "cupidatat pariatur ex",
                                detailAddress: "laboris reprehenderit in"
                            },
                            is_invoice: 36582115.7384941,
                            pathway: 42234882.06140268,
                            order_code: "minim",
                            total_sku_price: "299",
                            freight: "0",
                            total_price: "299"
                        },
                        pay_status: -40776657.34044391,
                        order_status: 79758178.0346713,
                        created_at: "2020-07-19 17:00:00",
                        updated_at: "2020-07-19 17:00:00",
                        deleted_at: "2020-07-19 17:00:00"
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
            _scroll: {},
            datas: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                0,
                1,
                2,
                3,
                4,
                5,
                6
            ]
        };
    },
    components: {
        AlertBox
    },
    computed: {},
    created() {
        let that = this;
        this.getData(res => {
            this.myorderData.list = res.data.list;
            // that.tipppp = '..'+this.myorderData.total;
        }, 1);
        this.pulldownFunc();
    },
    mounted() {},
    watch: {},
    methods: {
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
                    that.tipppp =
                        Number(pos.y).toFixed(0) + ".." + that.myorderDatapage;
                });
                //滑动结束松开事件
                this.scroll.on("touchEnd", pos => {
                    //上拉刷新

                    if (pos.y < this.scroll.maxScrollY - 50) {
                        //下拉加载
                        this.pullupMsg = "加载中。。。";

                        that.getData(res => {
                            this.myorderData.list = this.myorderData.list.concat(
                                res.data.list
                            );
                        }, that.myorderDatapage++);
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
                pagesize: this.myorderDatapagesize
            };
            let that = this;
            orderlist(data)
                .then(function(res) {
                    if (res.code == 20000) {
                        callback(res);

                        that.alertBox = {
                            visible: true,
                            tip: "请求成功"
                        };
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
.wrapper {
    font-size: 14px;
    width: 100%;
    background: #ccc;
    overflow: hidden;
    position: relative;
    -webkit-overflow-scrolling: touch;
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
    color: #ff502c;
    font-size: 14px;
    background: #ffffff;
    outline: 0;
    width: 90px;
    height: 30px;
    border-radius: 18px;
    border: 1px solid rgba(255, 80, 44, 1);
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

