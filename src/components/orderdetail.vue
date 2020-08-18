<template>
    <div>
        <div class="ms_content">
            <div class="detailTip">
                <h3 v-if="this.$route.query.myorder == 1">{{order_status_func(info.pay_status)}}</h3>
                <h3 v-else>{{orderloadingtime}} {{orderloading}}</h3>
                <div v-if="logisticsinfo" class="tip" @click="logisticsinfoFunc">
                    <span>仓库处理中</span>
                    <em>{{info.created_at|dateformat('YYYY-MM-DD HH:mm:ss')}}</em>
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div class="detailowner">
                <i class="el-icon-location-outline"></i>
                <p>
                    <span>{{info.snapshoot_cnt.receive_info.name}}</span>
                    {{info.snapshoot_cnt.receive_info.mobile}}
                </p>
                <p>{{info.snapshoot_cnt.receive_info.province}} {{info.snapshoot_cnt.receive_info.city}} {{info.snapshoot_cnt.receive_info.area}} {{info.snapshoot_cnt.receive_info.detailAddress}}</p>
            </div>
            <div class="order">
                <div class="orderh" v-for="(item, index) in info.snapshoot_cnt.sku_list" v-bind:key="index">
                    <img :src="item.images? item.images: ''" :onerror="defaultAvatar" />
                                
                    <div class="ordercenter">
                        <span>{{item.itemName}}</span>
                        <span>运费：{{item.freight == 0 ? '免运费' : '¥'+item.freight}}</span>
                        <span>¥{{item.shop_price}}/盒</span>
                    </div>
                    <div class="orderNum">X{{item.sku_count}}</div>
                </div>
                <p class="total_sku_price">
                    <span>商品合计：</span>
                    <em>¥{{info.snapshoot_cnt.total_sku_price}}</em>
                </p>
                <p class="freight">
                    <span>运费：</span>
                    <em>{{info.snapshoot_cnt.freight == 0 ? '免运费' : '¥'+info.snapshoot_cnt.freight}}</em>
                </p>
                <p class="total_price">
                    <em>¥{{info.snapshoot_cnt.total_price}}</em>
                    <i>实付款：</i>
                </p>
            </div>
            <div class="invoice" v-if="info.snapshoot_cnt.is_invoice == 1">
                <h3>发票</h3>
                <p>
                    <span>发票抬头</span>
                    <em>{{info.snapshoot_cnt.invoice_info.invoice_name}}</em>
                </p>
                <p>
                    <span>纳税人识别号：</span>
                    <em>{{info.snapshoot_cnt.invoice_info.taxpayer_number}}</em>
                </p>
            </div>
            <div class="no_invoice invoice" v-else>
                <h3>发票</h3>
                <p>
                    <span>不开发票</span>
                </p>
            </div>
            <div class="ordernews">
                <h3>订单信息：</h3>
                <p>
                    <span>订单编号：</span>
                    <em>{{info.order_code}}</em>
                </p>
                <p>
                    <span>下单时间：</span>
                    <em v-if="!!info.created_at">{{info.created_at|dateformat('YYYY-MM-DD HH:mm:ss')}}</em>
                    <em v-else></em>
                </p>
                <p>
                    <span>支付方式：</span>
                    <em>{{info.snapshoot_cnt.pay_method == 1 ? '支付宝' : '微信支付'}}</em>
                </p>
                <p>
                    <span>支付时间：</span>
                    <em v-if="!!info.updated_at">{{info.updated_at|dateformat('YYYY-MM-DD HH:mm:ss')}}</em>
                    <em v-else></em>
                </p>
                <p>
                    <span>配送方式：</span>
                    <em>{{info.logistics_name}}</em>
                </p>
                <p>
                    <span>完成时间：</span>
                    <em v-if="!!info.deleted_at">{{info.deleted_at|dateformat('YYYY-MM-DD HH:mm:ss')}}</em>
                    <em v-else></em>
                </p>
            </div>
            <button class="orderdetailbtn" @click="paycreateFunc">再来一单</button>
        </div>
        <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
    </div>
</template>

<script>
import Cookie from "js-cookie";
import moment from "moment";
import {
    orderinfo,
    paycreate,
    paypolling,
    payovertime
} from "@/api/orderdetail";
import AlertBox from "./alertbox";

export default {
    data() {
        return {
            orderloadingtime: !!localStorage.getItem('orderloadingtime') ? localStorage.getItem('orderloadingtime') : 0,
            alertBox: {
                visible: false,
                tip: ""
            },
            logisticsinfo: false,
            param: {
                pay: ""
            },
            orderloading: "订单支付中...",
            orderCheckrules: {
                pay: [
                    {
                        required: true,
                        message: "请选择支付方式",
                        trigger: "blur"
                    }
                ]
            },
            moneyOrdercheck: "0",
            numberOrdercheck: "1",
            info: {
                user_id: 12,
                out_biz_code: "", //操作唯一码
                order_code: localStorage.getItem("order_code"), //订单code
                snapshoot_cnt: {
                    user_id: 133,
                    out_biz_code: "",
                    orderdes: '',
                    sku_list: [                      
                        {
                            itemCode: "",
                            shopPrice: '',
                            itemName: "",
                            images: null,
                            barCode: "",
                            warehouseCode: "",
                            status: '',
                            created_at: "",
                            updated_at: "",
                            shop_price: "",
                            freight: "",
                            sku_count: 1
                        }
                    ],
                    pay_method: 1, //付款方式 1，支付宝, 2, 微信 
                    receive_info: {
                        province: "",
                        city: "",
                        area: "",
                        name: "",
                        phone: "",
                        detailAddress:
                            ""
                    },
                    is_invoice: 1, //是否发票
                    invoice_info: {
                        invoice_type: 1,
                        invoice_name: "",
                        taxpayer_number: "",
                        register_address: "",
                        register_phone: "",
                        register_bank_account: ""
                    },
                    pathway: 2, //环境配置	1,2
                    order_code: "", //订单code
                    total_sku_price: "",
                    freight: "",
                    total_price: ""
                },
                pay_status: 1, 
                order_status: 1, //订单类型
                created_at: "",
                updated_at: "",
                deleted_at: ""
            },
            paystatus: '',
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

        if(localStorage.getItem('order_isload') == 1) {
            this.pollpay();
        }else {
            this.orderloading = localStorage.getItem('order_loading')
        }
        if(this.orderloading == '支付成功') {
            this.logisticsinfo = true;
        }
        this.getData();
    },
    methods: {
        logisticsinfoFunc() {
            let that = this;
            this.$router.push({
                name: "ordertrack",
                query: {
                    orderCode: that.info.order_code
                }
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
        getData() {
            let data = {
                order_code: this.info.order_code
            };
            let that = this;
            orderinfo(data)
                .then(function(res) {

                    if (!!res && res.code == 20000) {
                        that.info = res.data.info;
                    } else if(!!res && res.code == 113005) {
                        that.alertBox = {
                            tip: res.message,
                            visible:true,
                        };

                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                        localStorage.removeItem("moon_email");
                    }else {
                        that.alertBox = {
                            visible:true,
                            tip: res.message
                        };
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        paycreateFunc() {

            let that = this;

            that.$router.push({
                name: 'ordercheck',
                query: {
                    onemore: 1,
                }
            })
            
            localStorage.setItem('onemoreobj', JSON.stringify(that.info));


        },
        payovertimeFunc() {
            let data = {
                order_code: this.info.order_code
            };
            let that = this;
            payovertime(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        that.orderloading = '交易失败';  
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            localStorage.setItem('order_loading', that.orderloading)
            localStorage.setItem('order_isload', 0)
        },
        pollpay() {
            let data = {
                order_code: this.info.order_code
            };
            let that = this;
            var n = 60*5,
                t = 0;
            var timeFunc;
            function timec() {
                timeFunc = setTimeout(function() {
                    t += 1;
                    timec();
                    if (t <= n) {
                    console.log(t);
                    that.orderloadingtime = t;
                    localStorage.setItem('orderloadingtime', t);
                        if (t % 2 == 0) {
                            paypolling(data)
                                .then(function(res) {
                                    if (!!res) {
                                        if (res.code == 20000 && !res.data.is_continue) {
                                            clearTimeout(timeFunc);
                                            localStorage.setItem('order_isload', 0)
                                            if(res.data.pay_status == 2) {
                                                that.orderloading = '支付成功';
                                                that.logisticsinfo = true;
                                            }else {
                                                that.orderloading = '支付中...';
                                            }
                                        }else if (res.code == 520001 || res.code == 520002 || res.code == 88888) {
                                            clearTimeout(timeFunc);
                                            localStorage.setItem('order_isload', 0)
                                            that.orderloading = res.message;
                                        }
                                        localStorage.setItem('order_loading', that.orderloading)
                                    }
                                })
                                .catch(function(error) {
                                    console.log(error);
                                });
                        }
                    } else {
                        clearTimeout(timeFunc);
                        that.payovertimeFunc();
                    }
                }, 1000);
            }
            timec();
        },
        wxpay(res) {
            const _html = res.data.html;
            const div = document.createElement("div");
            div.innerHTML = _html;
            document.body.appendChild(div);
        },
        alipay(res) {
            const form = res.data.html;
            const div = document.createElement("div");
            div.id = "alipay";
            div.innerHTML = form;
            document.body.appendChild(div);
            document.querySelector("#alipay").children[0].submit();
        }
    }
};
</script>

<style scoped>
.no_invoice.invoice p span{
    color: #9b9b9b;
}
.no_invoice.invoice {
    height: 75px;
}
.ms_content {
    font-size: 14px;
    height: 100%;
    background: #f4f4f4;
    padding-bottom: 50px;
}
.orderdetailbtn {
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    width: 100%;
    background: -webkit-gradient(linear,left top, right top,from(rgba(27,123,255,1)),to(rgba(12,97,216,1)));
    background: linear-gradient(90deg,rgba(27,123,255,1) 0%,rgba(12,97,216,1) 100%);
    margin-bottom: 20px;
    outline: 0;
    border: 0;
    font-size: 18px;
    border-radius: 18px;
    margin-top: 15px;
    position: relative;
    bottom: 0;
    left: 0;
}
.ordernews {
    margin-top: 10px;
    height: 217px;
    background: #ffffff;
}
div.ordernews p:nth-child(2) {
    margin-top: 5px;
}
div.ordernews p {
    line-height: 30px;
    color: #9b9b9b;
}
div.ordernews p em {
    float: left;
}
.invoice p span,
.ordernews p span {
    float: left;
    font-size: 14px;
}
.invoice p em,
.ordernews p em {
    float: right;
    text-align: right;
    font-size: 12px;
    font-style: normal;
}
.invoice p:nth-child(2) {
    margin-top: 10px;
}
.invoice p,
.ordernews p {
    padding: 0 10px;
    margin: 0;
    /* height: 20px; */
    line-height: 25px;
    overflow: hidden;
}

.invoice h3,
.ordernews h3 {
    height: 29px;
    border-bottom: #f4f4f4 solid 1px;
    margin: 0;
    padding: 0 0 0 10px;
    line-height: 32px;
    color: #333333;
    font-weight: 400;
    text-align: left;
}
.invoice {
    height: 97px;
    margin-top: 10px;
    background: #ffffff;
    overflow: hidden;
}
.order {
    position: relative;
    overflow: hidden;
    margin-top: 10px;
    background: #ffffff;
}
.orderh img {
    width: 90px;
    height: 90px;
    position: absolute;
    top: 10px;
    left: 10px;
}
.orderh {
    position: relative;
    height: 110px;
    border-bottom: #f4f4f4 solid 1px;
}
.ordercenter {
    position: absolute;
    left: 113px;
    margin: 0;
    text-align: left;
}
.ordercenter span:nth-child(1) {
    font-weight: 400;
    top: 15px;
}
.ordercenter span:nth-child(2) {
    font-size: 12px;
    color: #9b9b9b;
    top: 15px;
}
.ordercenter span:nth-child(3) {
    top: 40px;
}
.orderNum {
    font-size: 14px;
    color: #333333;
    font-weight: 400;
    line-height: 20px;
    position: absolute;
    top: 44px;
    right: 13px;
}
.order p {
    overflow: hidden;
    padding: 0 12px;
    margin: 10px 0;
}
.order p span {
    float: left;
    font-size: 14px;
    color: #333333;
    font-weight: 400;
}
.order p em {
    float: right;
    font-size: 14px;
    color: #333333;
    font-weight: 400;
    font-style: normal;
}
.order p.total_sku_price em {
    color: #9b9b9b;
}
.order p.total_price i {
    font-style: normal;
    color: #333333;
    float: right;
}
.order p.total_price em {
    color: #ff502c;
}

.ordercenter span {
    position: relative;
    font-size: 14px;
    width: 1.5rem;
    display: block;
}

.detailowner {
    margin-top: 10px;
    background: #ffffff;
    height: 93px;
    position: relative;
    overflow: hidden;
}
.detailowner .el-icon-location-outline {
    position: absolute;
    top: 37px;
    left: 12px;
    font-size: 25px;
}
.detailowner p {
    position: absolute;
    left: 47px;
    text-align: left;
    margin: 0;
}
.detailowner p:nth-child(2) span {
    font-size: 14px;
    font-weight: 500;
    margin-right: 5px;
}
.detailowner p:nth-child(2) {
    top: 17px;
    color: #333333;
    font-size: 12px;
}
.detailowner p:nth-child(3) {
    top: 42px;
    color: #333333;
    font-size: 12px;
    width: 2.9rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 17px;
}

.detailTip .tip {
    position: relative;
    height: 77px;
    background: #ffffff;
}
.detailTip .tip span {
    color: #333333;
    font-size: 14px;
    position: absolute;
    top: 17px;
    left: 12px;
    font-weight: 500;
}
.detailTip .tip em {
    color: #9b9b9b;
    font-size: 12px;
    position: absolute;
    top: 42px;
    left: 12px;
    font-style: normal;
}
.detailTip .tip .el-icon-arrow-right {
    position: absolute;
    right: 12px;
    top: 34px;
}
.detailTip {
    overflow: hidden;
    margin: 0;
}
.detailTip h3 {
    margin: 0;
    height: 58px;
    line-height: 58px;
    color: #333333;
    font-size: 18px;
    font-weight: 500;
    padding: 0 0 0 14px;
    text-align: left;
}
</style>

