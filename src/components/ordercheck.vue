<template>
    <div class="ordercheckBg">
        <div v-bind:class="{ 'payloading': payloading }" class="ms_content">
            <div v-if="!payloading">
                <div class="detailowner" v-if="detailowner" @click="drawer = true">
                    <i class="el-icon-location-outline"></i>
                    <p>
                        <span>{{detailownerParam.receiver}}</span>
                        {{detailownerParam.phone}}
                    </p>
                    <p>{{detailownerParam.provincial}} {{detailownerParam.city}} {{detailownerParam.area}} {{detailownerParam.address}}</p>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="detailowner" v-else @click="drawer = true">
                    <span class="detailowneradd"></span>
                    <span class="detailowneraddress">添加收货地址</span>
                </div>
            </div>
            <div v-else>
                <div class="detailowner" v-if="detailowner">
                    <i class="el-icon-location-outline"></i>
                    <p>
                        <span>{{detailownerParam.receiver}}</span>
                        {{detailownerParam.phone}}
                    </p>
                    <p>{{detailownerParam.provincial}} {{detailownerParam.city}} {{detailownerParam.area}} {{detailownerParam.address}}</p>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="detailowner" v-else>
                    <span class="detailowneradd"></span>
                    <span class="detailowneraddress">添加收货地址</span>
                </div>
            </div>
            <div class="order">
                <div class="orderh">
                    <img
                        :src="skuinfoparam.images? skuinfoparam.images : ''"
                        :onerror="defaultAvatar"
                    />
                    <div class="ordercenter">
                        <span>{{skuinfoparam.itemName}}</span>
                        <!-- <span>运费：{{!!skuinfoparam.freight && skuinfoparam.freight !== 0 ? skuinfoparam.freight : '免费'}}</span> -->
                        <span></span>
                        <span>¥{{skuinfoparam.shop_price}}/盒</span>
                    </div>
                </div>
                <p class="paynumall">
                    <span>购买数量</span>
                    <span class="paynumallloading" v-if="!payloading">
                        <i class="el-icon-circle-plus-outline" @click="paynumplus"></i>
                        <input
                            type="number"
                            name="num"
                            v-model="ordercreate.sku_list[0].sku_count"
                            @input="paynuminput"
                            @blur="paynumblur"
                            value="paynum"
                        />
                        <i class="el-icon-remove-outline" @click="paynumremove"></i>
                    </span>
                    <span class="paynumallloading" v-else>
                        <i class="el-icon-circle-plus-outline"></i>
                        <input
                            type="number"
                            name="num"
                            v-model="ordercreate.sku_list[0].sku_count"
                            @input="paynuminput"
                            @blur="paynumblur"
                            disabled
                            value="paynum"
                        />
                        <i class="el-icon-remove-outline"></i>
                    </span>
                </p>
                <p v-if="!payloading" @click="linkInvoice">
                    <span>发票</span>
                    <i v-bind:class="ordercreate.invoice_info.invoice_type == 2 ? 'el-icon-arrow-right company' : 'el-icon-arrow-right'"></i>
                    <em v-if="ordercreate.is_invoice == 0">不开发票</em>
                    <span class="invoicecontent" v-else>
                        <em >{{ordercreate.invoice_info.invoice_name}}</em>
                        <em v-if="ordercreate.invoice_info.invoice_type == 2" class="invoice_taxpaper">{{ordercreate.invoice_info.taxpayer_number}}</em>
                    </span>
                </p>
                <p v-else>
                    <span>发票</span>
                    <i v-bind:class="ordercreate.invoice_info.invoice_type == 2 ? 'el-icon-arrow-right company' : 'el-icon-arrow-right'"></i>
                    <em v-if="ordercreate.is_invoice == 0">不开发票</em>
                    <span class="invoicecontent" v-else>
                        <em >{{ordercreate.invoice_info.invoice_name}}</em>
                        <em v-if="ordercreate.invoice_info.invoice_type == 2" class="invoice_taxpaper">{{ordercreate.invoice_info.taxpayer_number}}</em>
                    </span>
                </p>

                <p>
                    <span>订单备注</span>
                    <!-- <i class="el-icon-arrow-right"></i> -->
                    <em>
                        <input
                            v-if="!payloading"
                            type="text"
                            class="orderdes"
                            v-model="ordercreate.orderdes"
                            placeholder="点击填写备注"
                            maxlength="100"
                        />
                        <input
                            v-else
                            disabled
                            type="text"
                            class="orderdes"
                            v-model="ordercreate.orderdes"
                            placeholder="点击填写备注"
                            maxlength="100"
                        />
                    </em>
                </p>
            </div>
            <div class="payType">
                <h3>支付方式</h3>
                <label>
                    <span class="wxicon"></span>微信支付
                    <input
                        type="radio"
                        name="payType"
                        v-model="ordercreate.pay_method"
                        value="2"
                    />
                </label>
                <label>
                    <span class="alipayicon"></span>支付宝
                    <input
                        type="radio"
                        name="payType"
                        v-model="ordercreate.pay_method"
                        value="1"
                    />
                </label>
            </div>
            <div class="payTogo">
                <span>
                    合计：
                    <em>¥{{priceallFunc(skuinfoparam.shop_price, ordercreate.sku_list[0].sku_count)}}</em>
                    共{{allnumFunc(ordercreate.sku_list[0].sku_count)}}件
                </span>
                <button @click="paysubmit">去支付</button>
            </div>
            <el-drawer
                size="50%"
                :visible.sync="drawer"
                :direction="direction"
                class="orderCheckaddress"
                :show-close="false"
            >
                <h3>选择收货地址</h3>
                <ul v-if="drawerAddress" class="drawerAddress">
                    <li v-for="(item, index) in addressData" data-type="0" :key="index">
                        <div @touchstart="touchStart" @touchend="touchEnd" class="list-box">
                            <label>
                                <input
                                    type="radio"
                                    v-model="selectaddress"
                                    :value="item"
                                    @click="addresslistclick(item)"
                                />
                                <span>{{item.provincial}} {{item.city}} {{item.area}} {{item.address}}</span>
                                <em>{{item.receiver}} {{item.phone}}</em>
                            </label>
                            <i @click="editaddress" :data="JSON.stringify(item)"></i>
                        </div>
                        <div
                            class="delete"
                            @click="deleteItem"
                            :data-index="index"
                            :data-item="JSON.stringify(item)"
                        >删除</div>
                    </li>
                </ul>
                <p v-else>请选择收货地址</p>
                <button @click="addaddress">
                    <i></i>添加收货地址
                </button>
            </el-drawer>
        </div>
        <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
    </div>
</template>

<script>
import Cookie from "js-cookie";
import AlertBox from "./alertbox";
import {
    getaddresslistdata,
    skuinfo,
    deleteaddress,
    ordercreateapi,
    orderpollingpay
} from "@/api/ordercheck";

export default {
    data() {
        return {
            h5html: "",
            detailowner: false,
            drawer: false,
            direction: "btt",
            selectaddress: {},
            param: {
                pay: ""
            },
            startX: 0,
            endX: 0,
            alertBox: {
                visible: false,
                tip: ""
            },
            addressData: [],
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
            alertBoxVisible: false,
            alertBoxcontent: "",
            detailownerParam: {
                id: 1,
                receiver: "",
                phone: "",
                address: "",
                user_id: "",
                provincial: "",
                city: "",
                area: ""
            },
            priceall: "",
            orderprice: "",
            infoimages: "",
            itemName: "",
            skuinfoparam: {
                itemCode: "",
                shop_price: "",
                itemName: "",
                images: "",
                barCode: "",
                warehouseCode: "",
                status: "",
                created_at: "",
                updated_at: "",
                shop_price: "",
                freight: ""
            },
            drawerAddress: true,
            ordercreate: {
                out_biz_code: "",
                sku_list: [
                    {
                        sku_code: "",
                        sku_count: 1
                    }
                ],
                pay_method: 2, //1，支付宝 2，微信
                orderdes: "",
                invoice_info: {
                    id: "",
                    invoice_type: 1,
                    register_phone: "",
                    register_address: "",
                    taxpayer_number: "",
                    invoice_name: "",
                    register_bank: "",
                    register_bank_account: ""
                },
                is_invoice: 0, //默认不开发票
                pathway: 2
            },
            maxnum: 100,
            onemore: !!this.$route.query.onemore
                ? this.$route.query.onemore
                : "",
            payloading:
                !!this.$route.query.payloading &&
                this.$route.query.payloading == 1
                    ? this.$route.query.payloading
                    : false
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.addaddressList();

        if (this.onemore != 1) {
            this.skuinfoFunc();
        }
        this.initonemoreFunc();
    },
    computed: {
        defaultAvatar() {
            return 'this.src="' + require("../assets/img/default.png") + '"';
        }
    },
    mounted() {
        this.initinvoiceFunc();
    },
    methods: {
        initonemoreFunc() {
            // let that = this;
            let onemoreobj = JSON.parse(localStorage.getItem("onemoreobj"));

            if (this.onemore == 1) {
                this.skuinfoparam.images =
                    onemoreobj.snapshoot_cnt.sku_list[0].images[0];
                this.skuinfoparam.itemName =
                    onemoreobj.snapshoot_cnt.sku_list[0].itemName;
                this.skuinfoparam.freight =
                    onemoreobj.snapshoot_cnt.sku_list[0].freight;
                this.skuinfoparam.shop_price =
                    onemoreobj.snapshoot_cnt.sku_list[0].shop_price;

                this.skuinfoparam.itemCode =
                    onemoreobj.snapshoot_cnt.sku_list[0].itemCode;
                this.ordercreate.sku_list[0].sku_count =
                    onemoreobj.snapshoot_cnt.sku_list[0].sku_count;

                this.ordercreate.is_invoice =
                    onemoreobj.snapshoot_cnt.is_invoice;
                // this.ordercreate.orderdes = !!onemoreobj.snapshoot_cnt.orderdes ? onemoreobj.snapshoot_cnt.orderdes : '';
                this.ordercreate.pay_method =
                    onemoreobj.snapshoot_cnt.pay_method;

                this.ordercreate.pathway = onemoreobj.snapshoot_cnt.pathway;

                //发票
                this.ordercreate.invoice_info = {
                    invoice_type: !!onemoreobj.snapshoot_cnt.invoice_info
                        ? onemoreobj.snapshoot_cnt.invoice_info.invoice_type
                        : "",
                    register_phone: onemoreobj.snapshoot_cnt.invoice_info
                        ? onemoreobj.snapshoot_cnt.invoice_info.register_phone
                        : "",
                    register_address: onemoreobj.snapshoot_cnt.invoice_info
                        ? onemoreobj.snapshoot_cnt.invoice_info.register_address
                        : "",
                    taxpayer_number: onemoreobj.snapshoot_cnt.invoice_info
                        ? onemoreobj.snapshoot_cnt.invoice_info.taxpayer_number
                        : "",
                    invoice_name: onemoreobj.snapshoot_cnt.invoice_info
                        ? onemoreobj.snapshoot_cnt.invoice_info.invoice_name
                        : "",
                    register_bank: onemoreobj.snapshoot_cnt.invoice_info
                        ? onemoreobj.snapshoot_cnt.invoice_info.register_bank
                        : "",
                    register_bank_account: onemoreobj.snapshoot_cnt.invoice_info
                        ? onemoreobj.snapshoot_cnt.invoice_info
                              .register_bank_account
                        : ""
                };

                //地址
                this.detailowner = true;

                this.detailownerParam.receiver =
                    onemoreobj.snapshoot_cnt.receive_info.name;
                this.detailownerParam.phone =
                    onemoreobj.snapshoot_cnt.receive_info.mobile;
                this.detailownerParam.address =
                    onemoreobj.snapshoot_cnt.receive_info.detailAddress;
                this.detailownerParam.provincial =
                    onemoreobj.snapshoot_cnt.receive_info.province;
                this.detailownerParam.city =
                    onemoreobj.snapshoot_cnt.receive_info.city;
                this.detailownerParam.area =
                    onemoreobj.snapshoot_cnt.receive_info.area;
            }
        },
        initinvoiceFunc() {
            let _invoiceobj = JSON.parse(localStorage.getItem("invoiceobj"));

            if (!!_invoiceobj && this.onemore != 1) {
                this.ordercreate.invoice_info = {
                    id: _invoiceobj.id,
                    invoice_type: _invoiceobj.invoice_type,
                    invoice_name: _invoiceobj.invoice_name,
                    register_phone: _invoiceobj.register_phone,
                    register_address: _invoiceobj.register_address,
                    taxpayer_number: _invoiceobj.taxpayer_number,
                    register_bank: _invoiceobj.register_bank,
                    register_bank_account: _invoiceobj.register_bank_account
                };
                this.ordercreate.is_invoice = _invoiceobj.is_invoice;
            }
        },
        allnumFunc(num) {
            return num == "" || num < 1 ? 1 : num;
        },
        priceallFunc(price, num) {
            if (Number(num) < 1 && Number(num) !== "") {
                num = 1;
            }
            return (
                ((Number(num) * Number(price) +
                    Number(this.skuinfoparam.freight)) *
                    100) /
                100
            ).toFixed(2);
        },
        //获取月饼商品详情
        skuinfoFunc() {
            let that = this;
            skuinfo()
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        let _info = res.data.info;
                        console.log(_info);
                        that.skuinfoparam.shop_price = _info.shop_price; //商品价格
                        that.skuinfoparam.images = _info.images[0];
                        that.skuinfoparam.itemName = _info.itemName;
                        that.skuinfoparam.itemCode = _info.itemCode;
                        that.skuinfoparam.shop_price = _info.shop_price;
                        that.skuinfoparam.barCode = _info.barCode;
                        that.skuinfoparam.warehouseCode = _info.warehouseCode;
                        that.skuinfoparam.status = _info.status;
                        that.skuinfoparam.created_at = _info.created_at;
                        that.skuinfoparam.updated_at = _info.updated_at;
                        that.skuinfoparam.freight = _info.freight;
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };

                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                        localStorage.removeItem("moon_email");
                    } else {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        addresslistclick(item) {
            this.detailownerParam = {
                id: item.id,
                receiver: item.receiver,
                phone: item.phone,
                address: item.address,
                user_id: item.user_id,
                provincial: item.provincial,
                created_at: item.created_at,
                updated_at: item.updated_at,
                city: item.city,
                area: item.area
            };
            localStorage.setItem(
                "addressobj",
                JSON.stringify(this.detailownerParam)
            );
            this.detailowner = true;
            this.drawer = false;
        },
        addaddressList() {
            let data = {
                token: Cookie.get("moon_token")
            };
            let that = this;
            getaddresslistdata()
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        if (res.data.length > 0) {
                            that.addressData = res.data.reverse();

                            //非再来一单的时候
                            if (that.$route.query.onemore != 1) {
                                that.detailowner = true;
                            }
                            if (!!localStorage.getItem("addressobj")) {
                                var _addressobj = JSON.parse(
                                    localStorage.getItem("addressobj")
                                );

                                that.addressData.map(itm => {
                                    if (itm.id == _addressobj.id) {
                                        localStorage.setItem(
                                            "addressobj",
                                            JSON.stringify(itm)
                                        );
                                        that.selectaddress = itm;
                                    }
                                });
                                that.detailownerParam = {
                                    id: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).id,
                                    receiver: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).receiver,
                                    phone: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).phone,
                                    address: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).address,
                                    user_id: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).user_id,
                                    provincial: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).provincial,
                                    created_at: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).created_at,
                                    updated_at: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).updated_at,
                                    city: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).city,
                                    area: JSON.parse(
                                        localStorage.getItem("addressobj")
                                    ).area
                                };
                            } else {
                                that.selectaddress = that.addressData[0];
                                that.detailownerParam = {
                                    id: res.data[0].id,
                                    receiver: res.data[0].receiver,
                                    phone: res.data[0].phone,
                                    address: res.data[0].address,
                                    user_id: res.data[0].user_id,
                                    created_at: res.data[0].created_at,
                                    updated_at: res.data[0].updated_at,
                                    provincial: res.data[0].provincial,
                                    city: res.data[0].city,
                                    area: res.data[0].area
                                };
                            }
                            that.drawerAddress = true;
                        } else {
                            that.detailowner = false;
                            that.drawerAddress = false;
                        }
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };

                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                        localStorage.removeItem("moon_email");
                    } else {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },

        paynumblur() {
            if (this.ordercreate.sku_list[0].sku_count == "") {
                this.ordercreate.sku_list[0].sku_count = 1;
            }
        },

        paynumplus() {
            if (Number(this.ordercreate.sku_list[0].sku_count) < this.maxnum) {
                this.ordercreate.sku_list[0].sku_count =
                    Number(this.ordercreate.sku_list[0].sku_count) + 1;
                this.priceall = this.priceallFunc(
                    this.skuinfoparam.shop_price,
                    this.ordercreate.sku_list[0].sku_count
                );
            }
        },
        paynumremove() {
            if (this.ordercreate.sku_list[0].sku_count > 1) {
                this.ordercreate.sku_list[0].sku_count =
                    Number(this.ordercreate.sku_list[0].sku_count) - 1;
            } else {
                this.ordercreate.sku_list[0].sku_count = 1;
            }
            this.priceall = this.priceallFunc(
                this.skuinfoparam.shop_price,
                this.ordercreate.sku_list[0].sku_count
            );
        },
        paynuminput() {
            if (Number(this.ordercreate.sku_list[0].sku_count) > this.maxnum) {
                this.ordercreate.sku_list[0].sku_count = this.maxnum;
            } else if (this.ordercreate.sku_list[0].sku_count == 0) {
                if (this.ordercreate.sku_list[0].sku_count.length > 0) {
                    this.ordercreate.sku_list[0].sku_count = 1;
                }
            } else {
                this.ordercreate.sku_list[0].sku_count = Number(
                    this.ordercreate.sku_list[0].sku_count
                );
            }
        },
        addaddress() {
            this.$router.push({ name: "addaddress" });
        },
        handleClose() {},
        //编辑地址
        editaddress(e) {
            console.log(e.target);
            let data = e.target.getAttribute("data");
            localStorage.setItem("addressobj", data);
            data = eval("(" + data + ")");

            data.edit = 1;

            this.$router.push({ name: "addaddress", query: data });
        },
        //创建订单
        paysubmit() {
            let that = this;

            if (!that.selectaddress.id) {
                that.alertBox = {
                    tip: "请添加收货地址",
                    visible: true
                };
                // }else if(that.ordercreate.invoice_info.invoice_name == '') {
                //     that.alertBox = {
                //         tip: '请选择发票信息',
                //         visible:true,
                //     };
            } else {
                let _out_biz_code =
                    this.$route.query.payloading == 1
                        ? JSON.parse(localStorage.getItem("onemoreobj"))
                              .out_biz_code.substring(JSON.parse(localStorage.getItem("onemoreobj"))
                              .out_biz_code.indexOf('_')+1, JSON.parse(localStorage.getItem("onemoreobj"))
                              .out_biz_code.length)
                        : new Date().getTime() +
                          "" +
                          Math.floor(Math.random() * 4000 + 1000);
                let data = {
                    out_biz_code: _out_biz_code,
                    sku_list: [
                        {
                            sku_code: that.skuinfoparam.itemCode,
                            sku_count: that.ordercreate.sku_list[0].sku_count
                        }
                    ],
                    pay_method: that.ordercreate.pay_method,
                    receive_info: {
                        province: that.detailownerParam.provincial,
                        city: that.detailownerParam.city,
                        area: that.detailownerParam.area,
                        name: that.detailownerParam.receiver,
                        phone: that.detailownerParam.phone,
                        detailAddress: that.detailownerParam.address
                    },
                    orderdes: that.ordercreate.orderdes,
                    invoice_info: {
                        invoice_type: !!that.ordercreate.invoice_info
                            .invoice_type
                            ? that.ordercreate.invoice_info.invoice_type
                            : "",
                        register_phone: !!that.ordercreate.invoice_info
                            .register_phone
                            ? that.ordercreate.invoice_info.register_phone
                            : "",
                        register_address: !!that.ordercreate.invoice_info
                            .register_address
                            ? that.ordercreate.invoice_info.register_address
                            : "",
                        taxpayer_number: !!that.ordercreate.invoice_info
                            .taxpayer_number
                            ? that.ordercreate.invoice_info.taxpayer_number
                            : "",
                        invoice_name: !!that.ordercreate.invoice_info
                            .invoice_name
                            ? that.ordercreate.invoice_info.invoice_name
                            : "",
                        register_bank: !!that.ordercreate.invoice_info
                            .register_bank
                            ? that.ordercreate.invoice_info.register_bank
                            : "",
                        register_bank_account: !!that.ordercreate.invoice_info
                            .register_bank_account
                            ? that.ordercreate.invoice_info
                                  .register_bank_account
                            : ""
                    },
                    is_invoice: that.ordercreate.is_invoice, //是否开发票	0否 1是
                    pathway: that.ordercreate.pathway, //环境配置	1,2
                    usage_scenario: "bytemoon_pay" //bytemoon_pay 月饼支付 bytemoon_exchange 月饼兑换
                };

                ordercreateapi(data)
                    .then(function(res) {
                        if (!!res && res.code == 20000) {
                            //将商品code存在localstorge里
                            localStorage.setItem(
                                "order_code",
                                res.data.order_code
                            );
                            localStorage.setItem("order_isload", 1);
                            localStorage.setItem("orderloadingtime", 0);
                            if (that.ordercreate.pay_method == 1) {
                                //1是支付宝 2是微信
                                that.alipay(res);
                            } else {
                                that.wxpay(res);
                            }
                        } else if (!!res && res.code == 113005) {
                            that.alertBox = {
                                tip: res.message,
                                visible: true
                            };

                            setTimeout(function() {
                                that.$router.push("/login");
                            }, 1000);
                            localStorage.removeItem("moon_email");
                        } else {
                            that.alertBox = {
                                tip: res.message,
                                visible: true
                            };
                        }
                        _czc.push(["_trackEvent", "topay", "topayh5"]);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
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
        },
        linkInvoice() {
            let _invoiceId = !!localStorage.getItem("invoiceobj")
                ? JSON.parse(localStorage.getItem("invoiceobj")).id
                : 0;
            this.$router.push({
                name: "addinvoice",
                query: { invoiceId: _invoiceId }
            });
        },
        touchStart(e) {
            this.startX = e.touches[0].clientX;
        },
        touchEnd(e) {
            let parentElement = e.currentTarget.parentElement;

            this.endX = e.changedTouches[0].clientX;

            if (
                parentElement.dataset.type == 0 &&
                this.startX - this.endX > 30
            ) {
                this.restSlide();
                parentElement.dataset.type = 1;
            }

            if (
                parentElement.dataset.type == 1 &&
                this.startX - this.endX < -30
            ) {
                this.restSlide();
                parentElement.dataset.type = 0;
            }
            this.startX = 0;
            this.endX = 0;
        },
        restSlide() {
            let listItems = document.querySelectorAll(".drawerAddress li");
            for (let i = 0; i < listItems.length; i++) {
                listItems[i].dataset.type = 0;
            }
        },
        deleteItem(e) {
            let index = e.currentTarget.dataset.index,
                item = JSON.parse(e.currentTarget.dataset.item);
            let that = this;
            let data = {
                id: item.id
            };

            deleteaddress(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        that.alertBox = {
                            tip: "删除成功",
                            visible: true
                        };

                        that.restSlide();
                        that.addressData.splice(index, 1);
                        if (that.selectaddress.id == item.id) {
                            that.selectaddress = that.addressData[0];
                            localStorage.setItem(
                                "addressobj",
                                JSON.stringify(that.addressData[0])
                            );
                            that.detailownerParam = that.selectaddress;
                        }

                        if (that.addressData.length == 0) {
                            that.detailowner = false;
                            that.drawerAddress = false;
                        } else {
                            that.detailownerParam.receiver =
                                that.addressData[0].receiver;
                            that.detailownerParam.phone =
                                that.addressData[0].phone;
                            that.detailownerParam.address =
                                that.addressData[0].address;
                        }
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };

                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                        localStorage.removeItem("moon_email");
                    } else {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
};
</script>

<style scoped>
.payloading .detailowner p,
.payloading .payTogo span,
.payloading .payTogo span em,
.payloading .el-icon-location-outline,
.payloading .order p span,
.payloading .order p em,
.payloading .order p em input,
.payloading .paynumall span,
.payloading .paynumall span input,
.payloading .detailowner .el-icon-arrow-right,
.payloading .ordercenter span {
    color: #9b9b9b !important;
}
.el-icon-arrow-right.company {
    margin: 20px 12px 0 0;
}
.order p span.invoicecontent {
    float: right;
    width: 2.7rem;
    padding: 14px 0 5px 12px;
}
.order p .invoicecontent em {
    line-height: 18px;
    display: block;
    width: 100%;
    text-align: right;
}
.ordercheckBg {
    background: #f4f4f4;
    height: 100%;
}
.payloading .orderh img {
    opacity: 0.5;
}
.order p span.paynumallloading {
    float: right;
}
.ms_content {
    font-size: 14px;
    background: #f4f4f4;
}
.wxicon {
    float: left;
    background-image: url(../assets/img/wx.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 23px;
    height: 21px;
    margin: 13px 8px 0 10px;
}
.alipayicon {
    float: left;
    background-image: url(../assets/img/alipay.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 23px;
    height: 23px;
    margin: 12px 8px 0 10px;
}
.orderdes {
    border: 0;
    outline: 0;
    width: 2.4rem;
    float: right;
    margin: 15px 12px 0 0;
    text-align: right;
}
.orderCheckaddress p {
    line-height: 100px;
    font-size: 16px;
    color: #9b9b9b;
}

.paynumall input {
    border: 0;
    font-size: 15px;
    outline: 0;
    width: 30px;
    text-align: center;
    margin: 15px 2px 0;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    float: right;
}

.paynumall .el-icon-circle-plus-outline,
.paynumall .el-icon-remove-outline {
    float: right;
    font-size: 26px;
    margin: 10px 0 0;
    padding: 0;
}
.paynumall .el-icon-circle-plus-outline {
    margin-right: 16px;
}
.orderCheckaddress .delete {
    width: 0.48rem;
    height: 0.75rem;
    line-height: 0.75rem;
    background: #ff502c;
    font-size: 12px;
    color: #fff;
    text-align: center;
    position: absolute;
    top: 0;
    right: -0.48rem;
}
.orderCheckaddress h3 {
    position: relative;
    text-align: left;
    font-size: 14px;
    left: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
    height: 40px;
}
.drawerAddress li {
    list-style-type: none;
    margin: 0;
    padding: 0;
    height: 75px;
    border-bottom: #f4f4f4 solid 1px;
    position: relative;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}

.drawerAddress li .list-box label {
    width: 100%;
    height: 100%;
    padding-bottom: 5px;
    /* overflow: hidden; */
    /* background: #f4f4f4; */
}
.drawerAddress li .list-box {
    padding: 5px 0;
    display: flex;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    justify-content: flex-end;
}
.drawerAddress li[data-type="0"] {
    transform: translate3d(0, 0, 0);
}
.drawerAddress li[data-type="1"] {
    transform: translate3d(-0.48rem, 0, 0);
}
.drawerAddress li span {
    position: relative;
    width: 75%;
    text-align: left;
    top: 5px;
    left: 47px;
    float: left;
    font-size: 14px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
}
.drawerAddress li em {
    position: relative;
    top: 5px;
    float: left;
    text-align: left;
    width: 100%;
    left: 47px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    color: rgba(155, 155, 155, 1);
    line-height: 17px;
}
.drawerAddress li i {
    background-image: url("../assets/img/edit.png");

    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 18px;
    height: 18px;
    position: absolute;
    top: 31px;
    right: 17px;
}
.drawerAddress li input {
    position: absolute;
    top: 25px;
    left: 16px;
}
.drawerAddress {
    margin: 0;
    padding: 0;
    height: 2.2rem;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0 0 36px;
}

.orderCheckaddress button i {
    background-image: url("../assets/img/add.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 24px;
    height: 24px;
    display: inline-block;
    left: 0.9rem;
    position: absolute;
}
.orderCheckaddress button {
    position: absolute;
    bottom: 10px;
    left: 0.15rem;
    width: 3.45rem;
    height: 47px;
    background: #f7f7f7;
    border-radius: 23.5px;
    border: 0;
    outline: 0;
    font-size: 18px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
}

.payTogo button {
    float: right;
    margin: 7px 10px 0 0;
    width: 90px;
    height: 36px;
    background: linear-gradient(
        90deg,
        rgba(27, 123, 255, 1) 0%,
        rgba(12, 97, 216, 1) 100%
    );
    border-radius: 18px;
    outline: 0;
    border: 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
}
.payTogo span em {
    font-size: 14px;
    color: rgba(255, 80, 44, 1);
    font-style: normal;
    display: inline-block;
    margin-right: 6px;
}
.payTogo span {
    float: left;
    font-size: 12px;
    margin-left: 12px;
}
.payTogo {
    height: 50px;
    line-height: 50px;
    background: #ffffff;
    position: absolute;
    bottom: 0;
    width: 100%;
}

.payType h3 {
    height: 29px;
    border-bottom: #f4f4f4 solid 1px;
    margin: 0;
    padding: 0 0 0 10px;
    line-height: 32px;
    color: #333333;
    font-weight: 400;
    text-align: left;
}
.payType {
    height: 127px;
    background: #ffffff;
    margin-top: 10px;
}

.payType label:nth-child(2) {
    border-bottom: #f4f4f4 solid 1px;
    height: 46px;
}
.payType label img {
    width: 23px;
    height: 23px;
    float: left;
    margin: 13px 10px 0;
}
.payType label {
    line-height: 50px;
    display: block;
    text-align: left;
}
.payType label input {
    float: right;
    margin: 20px 12px 0 0;
}

.detailowner {
    margin-top: 10px;
    background: #ffffff;
    height: 93px;
    position: relative;
    overflow: hidden;
}
.detailowner .el-icon-arrow-right {
    position: absolute;
    top: 38px;
    right: 12px;
    font-size: 18px;
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
    line-height: 17px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
.order p i {
    float: right;
    margin: 15px 12px 0 0;
}
.order p em {
    float: right;
    font-style: normal;
    margin: 0 12px 0 5px;
}
.order p span {
    color: #333333;
    float: left;
    padding-left: 12px;
}
.order p {
    overflow: hidden;
    margin: 0;
    line-height: 46px;
    border-bottom: #f4f4f4 solid 1px;
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
.ordercenter span {
    position: relative;
    font-size: 14px;
    width: 1.5rem;
    display: block;
}

.detailowneraddress {
    position: absolute;
    left: 63px;
    color: #333333;
    font-size: 22px;
    line-height: 90px;
}

.detailowner .detailowneradd {
    background-image: url(../assets/img/add.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 28px;
    left: 17px;
}
</style>

