<template>
    <div class="ordercheckBg">
        <div v-bind:class="{ 'payloading': payloading }" class="ms_content">
            <div class="ordercheckicon"></div>
            <div class="ordercheckicon1"></div>
            <span class="orderCenter" @click="orderCenter">
                <i>我的</i>
            </span>
            <div class="pricescsc">
                <span>市场价：¥598</span>
            </div>
            <div class="duihuantip">
                <h3>兑换须知</h3>
                <ul>
                    <li>
                        <i>1.</i>
                        <span>下滑页面填写收件信息，可兑换星巴克【星奕】月饼礼盒。</span>
                    </li>
                    <li>
                        <i>2.</i>
                        <span>兑换成功后，全国免费配送，48小时之内发货。</span>
                    </li>
                    <li>
                        <i>3.</i>
                        <span>发货后，收件人将收到短信提示及货运单号。</span>
                    </li>
                    <li>
                        <i>4.</i>
                        <span>
                            收件时请务必开箱验收，如遇到破损等情况，请拨打售后电话
                            <strong>4006-196-136</strong>。
                        </span>
                    </li>
                </ul>
            </div>
            <div class="addressinput">
                <h4>请填写详细信息</h4>
                <div class="addressinputcontent">
                    <div class="unit">
                        <label>*收货人</label>
                        <input
                            type="text"
                            class="addressinputcontentinput"
                            v-model="param.receiver"
                            maxlength="50"
                            :placeholder="placeholder.receiver"
                            @blur="resetfixed"
                        />
                    </div>
                    <div class="unit">
                        <label>*手机号</label>
                        <input
                            class="addressinputcontentinput"
                            type="text"
                            v-model="param.phone"
                            maxlength="11"
                            :placeholder="placeholder.phone"
                            @blur="resetfixed"
                        />
                    </div>
                    <div class="unit" @click="areashow = true">
                        <label>*所在地区</label>
                        <input
                            type="text"
                            class="areaaddress addressinputcontentinput"
                            readonly="readonly"
                            v-model="param.area"
                            :placeholder="placeholder.area"
                        />
                        <i class="el-icon-arrow-right"></i>
                    </div>

                    <div class="unit nounit">
                        <label>*详细地址</label>
                        <input
                            type="text"
                            class="addressaddress addressinputcontentinput"
                            @click="addressclick"
                            @input="addressbkFunc"
                            v-model="param.addressbk"
                            :placeholder="placeholder.address"
                            @blur="resetfixed"
                        />
                    </div>
                </div>
            </div>
            <div class="exchange">
                <span>输入兑换码</span>
                <div class="drawerexchangeinputbg">
                    <input
                        type="text"
                        class="drawerexchangeinput"
                        maxlength="8"
                        v-model.trim="drawerexchangeinput"
                        placeholder="请输入兑换码"
                        @blur="resetfixed"
                    />
                </div>
            </div>
            <div class="payTogo" v-bind:class="bgicon">
                <button @click="paysubmit">立即兑换</button>
            </div>
            <div class="captchacontentDialog" v-bind:class="{ 'captchaClass': captchaClass }">
                <div class="captchacontentBg" @click="captchaClass = false"></div>
                <div class="captchacontent">
                    <div id="captcha"></div>
                </div>
            </div>
        </div>
        <Areacomponent :showChose="areashow" v-on:listenareaFunc="areaemit"></Areacomponent>
        <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
        <div class="duihuansuc" v-if="duihuansuc">
            <div class="duihuansucmark" @click="duihuansucfalse"></div>
            <div class="duihuansuccontent">
                <span class="duihuansucicon"></span>
                <p>兑换成功</p>
                <div class="duihuansuciconscce">
                    <i @click="duihuansucfalsebtn" class="fl">继续兑换</i>
                    <i @click="orderCenter" class="fr">我的订单</i>
                </div>
            </div>
        </div>
        <!-- <div class="iconsrcollTip" @click="iconsrcollTipshowFunc" v-if="iconsrcollTipshow">
            <div class="iconsrcollTipbg"></div>
            <span></span>
        </div> -->
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
    orderpollingpay,
    exchangeData,
    codecheck
} from "@/api/ordercheck";
import { loginPost, pushCode, verify } from "@/api/login";
import Areacomponent from "./area";
export default {
    data() {
        return {
            _scrollTopsce: 0,
            moonxing_phone: localStorage.getItem("moonxing_phone"),
            iconsrcollTipshow: true,
            bgicon: `bgicon${this.$route.name}`,
            duihuansuc: false,
            smartCaptcha: "",
            captchaClass: false,
            verifydata: {},
            duihuancode: "",
            exchange_code: "",
            drawerexchangeinput: "",
            drawerexchange: false,
            detailowner: false,
            drawer: false,
            direction: "btt",
            selectaddress: {},
            param: {
                receiver: "",
                phone: "",
                area: "",
                address: "",
                addressbk: "",
                areaobj: {
                    p: "",
                    c: "",
                    d: ""
                }
            },
            areashow: false,
            placeholder: {
                receiver: "输入收货人姓名",
                phone: "输入收货人手机号",
                area: "选择所在地区",
                address: "输入详细收货地址"
            },
            ac: {},
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
                    : false,
            skuinfodata: [],

            vcCodepostfontcontent: "发送验证",
            feishuhref: 'https://tsingapi.tsingglobal.com/openapi/auth/login/feishu',
        };
    },
    components: {
        Areacomponent,
        AlertBox
    },
    created() {
        // this.addaddressList();
        let query = this.$route.query;
        let that = this;
        if (!!query.addressedit && query.addressedit == 1) {
            that.detailowner = true;
            that.detailownerParam = {
                id: 1,
                receiver: query.receiver,
                phone: query.phone,
                address: query.address,
                user_id: query.user_id,
                provincial: query.provincial,
                city: query.city,
                area: query.area
            };
        }
        if (this.onemore != 1) {
            this.skuinfoFunc();
        } else {
            this.skuinfodata = JSON.parse(
                localStorage.getItem("onemoreobj")
            ).snapshoot_cnt.sku_list;
        }
        this.drawerexchangeinput = this.$route.query.duihuancode;
        this.initinvoiceFunc();
        this.initonemoreFunc();
    },
    computed: {
        // defaultAvatar() {
        //     return 'this.src="' + require("../assets/img/default.png") + '"';
        // },
    },
    mounted() {
        let that = this;
        this.pushCodeFunc();
        this.addressFunc();

        setTimeout(() => {
            document.documentElement.scrollTop = 0;
            that.srcollTipfunc();
        }, 500);
    },
    methods: {
         orderCenter() {
                this.$router.push("/myorder");
        },
        resetfixed() {
            document.documentElement.scrollTop = this._scrollTopsce;
        },
        srcollTipfunc() {
            let that = this;
            window.onscroll = function(e) {
                var _scrollTop = 0;
                if (
                    document.documentElement &&
                    document.documentElement.scrollTop
                ) {
                    _scrollTop = document.documentElement.scrollTop;
                } else if (document.body) {
                    _scrollTop = document.body.scrollTop;
                }
                if (_scrollTop > 50) {
                    that.iconsrcollTipshow = false;
                } else {
                    // that.iconsrcollTipshow = true;
                }
                that._scrollTopsce = _scrollTop;
            };
        },
        iconsrcollTipshowFunc() {
            var nt = 0,
                _height = window.innerHeight,
                _scrollheight = document.documentElement.scrollHeight,
                _duihuantipheight = document.querySelectorAll(".duihuantip")[0]
                    .offsetTop;

            var timeFuncccccc = function() {
                nt += 10;
                setTimeout(() => {
                    if (nt < Number(_duihuantipheight)) {
                        document.documentElement.scrollTop = Number(nt);
                        timeFuncccccc();
                    }
                }, 1);
            };
            timeFuncccccc();
        },
        duihuansucfalse() {
            this.duihuansuc = false;
            this.drawerexchangeinput = "";
        },
        duihuansucfalsebtn() {
            let that = this;
            this.duihuansuc = false;
            this.drawerexchangeinput = "";
            _czc.push(["_trackEvent", "goonexchange", that.$route.name]);
        },
        areashowclose() {
            this.areashow = false;
        },
        areaemit(areaparam) {
            this.param.areaobj = {
                p: areaparam.p,
                c: areaparam.c,
                d: areaparam.d
            };
            this.param.area =
                areaparam.p +
                " " +
                areaparam.c +
                " " +
                (!!areaparam.d ? areaparam.d : "");
        },
        addressFunc() {
            // let that = this;
            // function G(id) {
            //     return document.querySelectorAll(id);
            // }
            //
            // var map = new BMap.Map("l-map");
            // map.centerAndZoom("北京", 12); // 初始化地图,设置城市和地图级别。
            //
            // that.ac = new BMap.Autocomplete({
            //     input: "suggestId",
            //     location: map
            // }); //建立一个自动完成的对象
            //
            // that.ac.setLocation(that.param.areaobj.c);
            //
            // that.ac.addEventListener("onhighlight", function(e) {
            //     //鼠标放在下拉列表上的事件
            //     var str = "";
            //     var _value = e.fromitem.value;
            //     var value = "";
            //     if (e.fromitem.index > -1) {
            //         value =
            //             // _value.province +
            //             // _value.city +
            //             // _value.district +
            //             _value.street + _value.business;
            //     }
            //     str =
            //         "FromItem<br />index = " +
            //         e.fromitem.index +
            //         "<br />value = " +
            //         value;
            //
            //     value = "";
            //     if (e.toitem.index > -1) {
            //         _value = e.toitem.value;
            //         value =
            //             // _value.province +
            //             // _value.city +
            //             // _value.district +
            //             _value.street + _value.business;
            //     }
            //     str +=
            //         "<br />ToItem<br />index = " +
            //         e.toitem.index +
            //         "<br />value = " +
            //         value;
            //     G("searchResultPanel").innerHTML = str;
            // });
            //
            // var myValue;
            // that.ac.addEventListener("onconfirm", function(e) {
            //     //鼠标点击下拉列表后的事件
            //
            //     var _value = e.item.value;
            //     myValue =
            //         // _value.province +
            //         // _value.city +
            //         // _value.district +
            //         _value.street + _value.business;
            //     G("searchResultPanel").innerHTML =
            //         "onconfirm<br />index = " +
            //         e.item.index +
            //         "<br />myValue = " +
            //         myValue;
            //
            //     setPlace();
            // });
            //
            // function setPlace() {
            //     map.clearOverlays(); //清除地图上所有覆盖物
            //     function myFun() {
            //         var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            //         map.centerAndZoom(pp, 18);
            //         map.addOverlay(new BMap.Marker(pp)); //添加标注
            //     }
            //     var local = new BMap.LocalSearch(map, {
            //         //智能搜索
            //         onSearchComplete: myFun
            //     });
            //     that.param.addressbk = myValue;
            //     // that.param.address = myValue;
            //     local.search(myValue);
            // }
        },
        addressclick() {
            // this.ac.setLocation(this.param.areaobj.c);
        },
        addressbkFunc() {
            this.param.address = this.param.addressbk;
            // this.addressFunc();
        },
        drawerexchangeFunc() {
            this.drawerexchange = true;
            this.drawerexchangeinput = "";
        },
        exchangeFunc() {
            let that = this;

            let data = {
                exchange_code: this.drawerexchangeinput
            };

            codecheck(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        that.exchange_code = that.drawerexchangeinput;
                        that.drawerexchange = false;
                        that.duihuancode = res.data.info.exchange_code;
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };
                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                        localStorage.removeItem("moon_xbk_email");
                        localStorage.removeItem("onemoreobj");
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
        handleCloseexchange(done) {
            done();
        },
        initonemoreFunc() {
            // let that = this;
            let onemoreobj = JSON.parse(localStorage.getItem("onemoreobj"));
            if (this.onemore == 1) {
                this.ordercreate.orderdes = !!onemoreobj.snapshoot_cnt.orderdes
                    ? onemoreobj.snapshoot_cnt.orderdes
                    : "";
                this.skuinfodata = onemoreobj.snapshoot_cnt.sku_list;

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
            let query = this.$route.query;
            if (query.invoice == 1) {
                this.ordercreate.is_invoice = query.is_invoice;
                this.ordercreate.invoice_info = {
                    invoice_type: query.invoice_type,
                    invoice_name: query.invoice_name,
                    register_phone: query.register_phone,
                    register_address: query.register_address,
                    taxpayer_number: query.taxpayer_number,
                    register_bank: query.register_bank,
                    register_bank_account: query.register_bank_account
                };
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
            let data = {
                code: this.$route.name
            };
            skuinfo(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        that.skuinfodata = res.data;
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };

                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                        localStorage.removeItem("moon_xbk_email");
                        localStorage.removeItem("onemoreobj");
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
                province: item.provincial,
                city: item.city,
                area: item.area
            };

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
                            that.selectaddress = that.addressData[0];

                            if (that.$route.query.onemore != 1) {
                                that.detailownerParam = {
                                    id: res.data[0].id,
                                    receiver: res.data[0].receiver,
                                    phone: res.data[0].phone,
                                    address: res.data[0].address,
                                    user_id: res.data[0].user_id,
                                    provincial: res.data[0].provincial,
                                    city: res.data[0].city,
                                    area: res.data[0].area
                                };
                                that.detailowner = true;
                            }
                            that.drawerAddress = true;
                        } else {
                            that.detailowner = false;
                            that.drawerAddress = false;
                        }
                        // } else if (!!res && res.code == 113005) {
                        //     that.alertBox = {
                        //         tip: res.message,
                        //         visible: true
                        //     };

                        //     setTimeout(function() {
                        //         that.$router.push("/login");
                        //     }, 1000);
                        //     localStorage.removeItem("moon_xbk_email");
                        //     localStorage.removeItem("onemoreobj");
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
            let that = this;
            let _query = that.$route.query;
            let data = {};

            data.duihuancode = that.drawerexchangeinput;
            data.code = that.$route.query.code;
            data.title = that.$route.query.title;
            that.$router.push({ name: "addaddress", query: data });
        },
        handleClose() {},
        //编辑地址
        editaddress(e) {
            let that = this;
            let data = {
                provincial: this.detailownerParam.provincial,
                city: this.detailownerParam.city,
                area: this.detailownerParam.area,
                receiver: this.detailownerParam.receiver,
                phone: this.detailownerParam.phone,
                address: this.detailownerParam.address
            };
            data.edit = 1;

            data.code = that.$route.query.code;
            data.duihuancode = this.drawerexchangeinput;
            data.title = that.$route.query.title;
            this.$router.push({ name: "addaddress", query: data });
        },
        pushCodeFunc() {
            let that = this;

            this.smartCaptcha = new smartCaptcha({
                renderTo: "#captcha",
                width: 300,
                height: 42,
                default_txt: "点击按钮开始智能验证",
                success_txt: "验证成功",
                fail_txt: "验证失败，请在此点击按钮刷新",
                scaning_txt: "智能检测中",
                success: function(data) {
                    console.log(NVC_Opt.token);
                    console.log(data.sessionId);
                    console.log(data.sig);
                    console.log(data);
                    that.captchaClass = false;
                    let obj = {
                        token: NVC_Opt.token,
                        sessionid: data.sessionId,
                        sig: data.sig,
                        scene: "ic_other"
                    };
                    let datas = {
                        out_biz_code:
                            new Date().getTime() +
                            "" +
                            Math.floor(Math.random() * 4000 + 1000),
                        receive_info: {
                            province: that.param.areaobj.p,
                            city: that.param.areaobj.c,
                            area: that.param.areaobj.d,
                            name: that.param.receiver,
                            phone: that.param.phone,
                            detailAddress: that.param.addressbk
                        },
                        orderdes: that.ordercreate.orderdes,
                        usage_scenario: "bytemoon_exchange",
                        exchange_code: that.drawerexchangeinput,
                        verify: obj,
                        code: that.$route.name
                    };

                    ordercreateapi(datas)
                        .then(function(res) {
                            if (!!res && res.code == 20000) {
                                that.duihuansuc = true;

                            } else {
                                that.alertBox = {
                                    tip: res.message,
                                    visible: true
                                };

                                that.drawerexchangeinput = "";
                            }
                            that.smartCaptcha.reset();
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                },
                fail: function(data) {
                    console.log("ic error");
                }
            });
            this.smartCaptcha.init();
        },
        vcCodepostfont() {
            if (this.param.email !== "") {
                if (this.vcCodepostfontcontent !== "发送验证") {
                    return;
                } else {
                    this.captchaClass = true;
                }
            } else {
                this.alertBoxVisible = true;
                this.alertBoxContent = "请输入邮箱地址";
            }
        },
        timecodeFunc() {
            let n = !!localStorage.getItem("moon_vcodetime")
                    ? localStorage.getItem("moon_vcodetime")
                    : 59,
                that = this;
            // Cookie.setItem('moon_email', that.param.email);
            let timecode = () => {
                if (n >= 0) {
                    that.vcCodepostfontcontent = n + "秒";
                    localStorage.setItem("moon_vcodetime", n);
                    n -= 1;
                    setTimeout(function() {
                        timecode();
                    }, 1000);
                } else {
                    localStorage.removeItem("moon_vcodetime");
                    that.vcCodepostfontcontent = "发送验证";
                    that.smartCaptcha.reset();
                }
            };
            timecode();
        },
        //创建订单
        paysubmit() {
            let that = this;

            let data = {
                out_biz_code:
                    new Date().getTime() +
                    "" +
                    Math.floor(Math.random() * 4000 + 1000),

                receive_info: {
                    province: !!that.detailownerParam.provincial
                        ? that.detailownerParam.provincial
                        : that.detailownerParam.province,
                    city: that.detailownerParam.city,
                    area: that.detailownerParam.area,
                    name: that.detailownerParam.receiver,
                    phone: !!that.detailownerParam.phone
                        ? that.detailownerParam.phone
                        : that.detailownerParam.mobile,
                    detailAddress: that.detailownerParam.address
                },
                orderdes: that.ordercreate.orderdes,
                usage_scenario: "bytemoon_exchange",
                exchange_code: that.drawerexchangeinput
            };
            console.log(data);
            if (this.param.receiver == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请" + this.placeholder.receiver
                };
            } else if (this.param.phone == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请" + this.placeholder.phone
                };
            } else if (!/^1[3456789]\d{9}$/.test(this.param.phone)) {
                this.alertBox = {
                    visible: true,
                    tip: this.placeholder.phone + "格式不对"
                };
            } else if (this.param.area == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请" + this.placeholder.area
                };
            } else if (this.param.address == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请" + this.placeholder.address
                };
            } else if (!that.drawerexchangeinput) {
                this.alertBox = {
                    visible: true,
                    tip: "请输入兑换码"
                };
            } else if (
                !/^[A-Za-z0-9]+$/.test(that.drawerexchangeinput) ||
                that.drawerexchangeinput.length != 8
            ) {
                this.alertBox = {
                    visible: true,
                    tip: "兑换码格式不正确"
                };
            } else {
                that.captchaClass = true;
            }
        },

        linkInvoice() {
            this.$router.push("/addinvoice");
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
                id: item.id,
                token: Cookie.get("moon_token")
            };

            deleteaddress(data)
                .then(function(res) {
                    that.alertBox.visible = true;
                    if (!!res && res.code == 20000) {
                        that.alertBox.tip = "删除成功";
                        that.restSlide();

                        that.addressData.splice(index, 1);
                        that.selectaddress = that.addressData[0];

                        if (that.addressData.length == 0) {
                            that.detailowner = false;
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
                        localStorage.removeItem("moon_xbk_email");
                        localStorage.removeItem("onemoreobj");
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
.pricescsc span {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #9F6324;
    display: block;
}
.pricescsc {
    position: absolute;
    top: 1.14rem;
    left: 0.24rem;
}
.orderCenter i {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #986136;
    text-align: center;
    width: 44px;
    height: 44px;
    background:#FAE2BF;
    display: block;
    border-radius: 20px;
    font-style: normal;
    line-height: 44px;
    box-sizing: border-box;
    position: absolute;
    top: 7px;
    left: 10px;
}
.orderCenter {
    width: 63px;
    height: 56px;
    background: rgba(153, 98, 55, 0.79);
    border-radius: 27px 0 0 27px;
    position: absolute;
    top: 27px;
    right: 0;
    z-index: 9999;
}
@keyframes bounce-down {
    25% {
        transform: translateY(5px);
    }
    50% {
        transform: translateY(0);
    }
    75% {
        transform: translateY(-5px);
    }
    100% {
        transform: translateY(0);
    }
}
@-webkit-keyframes bounce-down {
    25% {
        transform: translateY(5px);
    }
    50% {
        transform: translateY(0);
    }
    75% {
        transform: translateY(-5px);
    }
    100% {
        transform: translateY(0);
    }
}

.login_wrap_content {
    width: 2.6rem;
    margin: 0 auto;
}
.loginunit {
    width: 100%;
    height: 38px;
    border-radius: 19px;
    background: rgba(255, 255, 255, 0.4);
    position: relative;
    margin-top: 13px;
    top: 0;
    left: 0;
}
.emailinput {
    width: 65%;
}
.loginunit label input {
    border: 0;
    outline: 0;
    background: rgba(255, 255, 255, 0);
    font-size: 12px;
    height: 22px;
    line-height: 22px;
    margin: 8px 0;
}
.logintitle {
    width: 0.7rem;
    float: left;
    text-align: right;
    top: 0;
    left: 0;
    height: 100%;
    line-height: 38px;
    padding-left: 12px;
}
.loginunitbtn {
    position: relative;
    top: 0;
    margin-top: 13px;
    height: 39px;
    left: 0;
}
.login-btn {
    width: 100%;
    position: absolute;
    left: 0;
    height: 39px;
    line-height: 39px;
    border-radius: 19px;
    background: #ee7571;
    border: 0;
    outline: 0;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 3px;
}
.feis i {
    background-image: url(../assets/img/logofeis.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    top: 3px;
    left: -7px;
    width: 17px;
    height: 17px;
    position: relative;
    display: inline-block;
}
.feis {
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    position: relative;
    border-radius: 19px;
    box-sizing: border-box;
    border: rgba(255, 255, 255, 0.3) solid 1px;
    margin-top: 13px;
    /* bottom: 0; */
    left: 0;
    width: 100%;
    height: 38px;
    line-height: 38px;
    text-decoration: none;
    display: block;
}
.vcCodepostfont em {
    height: 22px;
    position: absolute;
    top: 8px;
    left: 0;
    border-left: rgba(229, 229, 229, 1) solid 1px;
}
.vcCodepostfont {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    width: 100%;
    font-style: normal;
    height: 38px;
    line-height: 38px;
    text-align: center;

    font-size: 12px;
}
.vcCodepost {
    width: 0.65rem;
    height: 38px;
    position: absolute;
    right: 0;
    top: 0;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
}
.loginunit label {
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    height: 38px;
    line-height: 38px;
}





.iconsrcollTip {
    position: fixed;
    z-index: 99999;
    bottom: 0;
    width: 100%;
    height: 0.59rem;
    left: 0;
}
.iconsrcollTipbg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(159, 117, 52, 0) 0%, #a07632 100%);
    z-index: 0;
}
.iconsrcollTip span {
    background-image: url(../assets/img/iconTipscroll.png);
    background-size: 100% 100%;
    width: 15px;
    height: 16px;
    display: block;
    -webkit-animation: bounce-down 1s linear infinite;
    animation: bounce-down 1s linear infinite;
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    margin: 0 0 0 -0.08rem;
    z-index: 1;
}
.duihuansucicon {
    background-image: url(../assets/img/iconTip.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 1.14rem;
    height: 0.83rem;
    display: block;
    margin: 0.1rem auto 0;
}
.fl {
    float: left;
    text-align: right;
}
.fr {
    float: right;
    text-align: left;
}
.duihuansuccontent i {
    position: relative;
    display: block;
    width: 42%;
    font-style: normal;
    font-size: 16px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: #7D472B;
    line-height: 22px;

}
.duihuansuccontent p {
    margin: 0.15rem 0 0;
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
}
.duihuansuccontent {
    text-align: center;
    width: 2.71rem;
    height: 1.94rem;
    background: #ffffff;
    border-radius: 6px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.97rem 0 0 -1.36rem;
    z-index: 1;
}
.duihuansucmark {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
}
.duihuansuciconscce {
    position: absolute;
    top: 1.55rem;
    left: 0;
    width: 100%;
}
.duihuansuc {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
}
#suggestId {
    opacity: 0;
    position: relative;
    z-index: -1;
    float: left;
    height: 30px;
    width: 2.6rem;
    margin: -30px 7px 0 0;
    border: 0;
    outline: 0;
}
.addressinputcontent .unit.nounit input.addressinputcontentinput {
    width: 2.6rem;
}
input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #BF9F6C;
}
input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #BF9F6C;
}
input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #BF9F6C;
}
input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #BF9F6C;
}

.drawerexchangeinputbg input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #895638;
}
.drawerexchangeinputbg input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #895638;
}
.drawerexchangeinputbg input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #895638;
}
.drawerexchangeinputbg input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #895638;
}

.addressinputcontent .unit input.addressinputcontentinput.areaaddress {
    width: 2.35rem;
}
.addressinputcontent .unit input.addressinputcontentinput {
    float: left;
    position: relative;
    height: 33px;
    line-height: 33px;
    width: 2.75rem;
    outline: 0;
    border: 0;
    background-color:#F2C58A;
    padding: 0 0 0 0.1rem;
    margin: 14px 0 0;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3e3e3e;
}
.addressinputcontent .unit label {
    float: left;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #7D472B;
}
.addressinputcontent .unit.nounit {
    border-bottom: none;
}
.addressinputcontent .unit {
    position: relative;
    height: 54px;
    line-height: 60px;
    overflow: hidden;
    margin: 0 0.07rem;
    border-bottom: #0f0f0f solid 1px;
}
.addressinputcontent {
    width: 3.61rem;
    background-color: #F2C58A;
    height: 220px;
}
.addressinput {
    /* background-color: #F2C58A; */
    padding: 0 0.07rem;
}
.addressinput h4 {
    padding: 0 0 0 0.07rem;
    height: 42px;
    text-align: left;
    line-height: 42px;
    font-size: 16px;
    font-style: normal;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1e1e1e;
}

.duihuantip li span {
    display: block;
    float: left;
    text-align: left;
    margin: 0 0 0 0.03rem;
    width: 3.2rem;
    font-size: 11px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #733A1E;
    line-height: 18px;

}
.duihuantip li i {
    float: left;
    width: 0.1rem;
    font-weight: normal;
    font-style: normal;
    font-size: 11px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #733A1E;
}
.duihuantip li strong {
    color: #733A1E;
    font-style: normal;
    text-decoration: none;
    font-size: 11px;
    font-weight: 400;
    display: inline-block;
}
.duihuantip li {
    overflow: hidden;
    list-style: none;
    font-size: 12px;
    text-align: left;
    width: 100%;
}
.duihuantip h3 {
    font-size: 11px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #733A1E;
    padding: 19px 0 0;
    font-weight: normal;
    font-style: normal;
    text-align: left;
}
.duihuantip ul {
    margin: 7px 0 0;
}
.duihuantip {
    background-color:#F2C58A;
    height: 133px;
    width: 3.47rem;
    margin: 613px auto 0;
    box-sizing: border-box;
    padding: 0 0 0 0.1rem;
}
.ordercheckicon {
    position: absolute;
    top:0;
    left: 0;
    z-index: -1;
    width: 3.75rem;
    height: 5.98rem;
    background-color: #CE9654;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(../assets/img/ordercheckbg1.png);
}
.ordercheckicon1 {
    position: absolute;
    top:5.98rem;
    left: 0;
    z-index: -1;
    width: 3.75rem;
    height: 6.7rem;
    background-color: #CE9654;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(../assets/img/ordercheckbg2.png);
}
.detailowner_bottom_bg {
    width: 110%;
}
.detailowner_bottom {
    height: 0.04rem;
    line-height: 0.04rem;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
}
.detailowner_bottom .bgicon1 {
    background: #325ab4;
}
.detailowner_bottom .bgicon2 {
    background: #00c8d2;
}
.detailowner_bottom span {
    margin: 0 0.13rem 0 0;
    width: 0.27rem;
    height: 0.04rem;
    -webkit-transform: skew(-45deg);
    -moz-transform: skew(-45deg);
    -o-transform: skew(-45deg);
    transform: skew(-45deg);
    display: inline-block;
    float: left;
}

#captcha {
    margin: 0.43rem auto 0;
    padding: 0;
    font-size: 12px;
    width: 300px;
    height: 42px;
}

.captchacontent {
    position: absolute;
    z-index: 10;
    overflow: hidden;
    width: 3.36rem;
    height: 1.3rem;
    background: #ffffff;
    border-radius: 8px;
    top: 50%;
    left: 50%;
    margin: -0.65rem 0 0 -1.68rem;
    text-align: center;
}
.captchaBg {
    position: absolute;
    top: 0;
    left: 0;
    text-align: left;
    background-image: linear-gradient(0deg, #ededed, #fff);
    z-index: 1;
    width: 100%;
    height: 100%;
    font-size: 14px;
    line-height: 44px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    padding: 0 0 0 115px;
}
div.captchaClass {
    visibility: inherit;
}
.captchacontentBg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}
.captchacontentDialog {
    z-index: 10000;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    visibility: hidden;
}
.ordercentersku_count i {
    float: left;
    font-size: 12px;
    font-style: normal;
    color: #9b9b9b;
}
.ordercentersku_count em {
    float: right;
    font-size: 14px;
    font-style: normal;
}
div.ordercenter span.ordercentersku_count {
    padding: 0.03rem 0 0;
    overflow: hidden;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 2.4rem;
    text-align: right;
}
.payloading .detailowner p,
.payloading .payTogo span,
.payloading .payTogo span em,
.payloading .el-icon-location-outline,
.payloading .payType h3,
.payloading .payType label,
.payloading .order p span,
.payloading .order p em,
.payloading .order p em input,
.payloading .paynumall span,
.payloading .paynumall span input,
.payloading .detailowner .el-icon-arrow-right,
.payloading .ordercenter span {
    color: #9b9b9b !important;
}
.payloading .orderh img,
.payloading .wxicon,
.payloading .alipayicon {
    opacity: 0.5;
}
.order p span.paynumallloading {
    float: right;
}
.drawerexchangeinputbg {
    height: 61px;
    /* line-height: 36px; */
    background-color: #F2C58A;
    width: 3.61rem;
    margin: 0 auto;
    display: block;
}
.drawerexchangeinput {
    box-sizing: border-box;
    background-color: #F2C58A;
    margin: 13px 0 0;
    padding: 0 0 0 13px;
    width: 100%;
    border: 0;
    outline: 0;
    height: 34px;
    line-height: 34px;
    color: #0f0f0f;
    font-size: 16px;
    box-shadow: 0;
}

.drawerexchangebtn {
    background: linear-gradient(
        90deg,
        rgba(255, 195, 20, 1) 0%,
        rgba(247, 175, 45, 1) 100%
    );
    border-radius: 18px;
    outline: 0;
    border: 0;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    width: 3.06rem;
    height: 40px;
    line-height: 42px;
    color: #fff;
}
.exchange span {
    display: block;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    height: 49px;
    text-align: left;
    line-height: 55px;
    color: #0f0f0f;
    margin: 0 0 0 0.07rem;
}
.exchange {
    margin: 0 0.07rem;
    /* background: #ac8547; */
    position: relative;
    overflow: hidden;
}
.ordercheckBg {
    position: absolute;
    top: 0;
    min-height: 100%;
}
.ms_content {
    position: absolute;
    top: 0;
    font-size: 14px;
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
    font-size: 14px;
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
    line-height: 75px;
    height: 100%;
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
    min-height: 75px;
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
    padding: 10px 0;
    display: flex;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    justify-content: flex-end;
    /* min-height: 75px; */
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
    font-size: 16px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
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

.payTogo.bgiconea562b button {
    background: linear-gradient(180deg, #4a3321 0%, #5a3f2b 57%, #64452b 100%);
}

.payTogo.bgicon6cc8cc button {
    background-color: #300b0a;
}

.payTogo.bgicon7fbb54 button {
    background-color: #0f172e;
}
.payTogo button {
    margin: 0 auto;
    width: 2.89rem;
    height: 49px;
    border-radius: 25px;
    outline: 0;
    background-color: #7D472B;
    border: 0;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F6E1BC;
}

.payTogo {

    height: 49px;

    position: relative;
    padding: 37px 0 31px;
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
    background: #ffffff;
    min-height: 88px;
    position: relative;
    overflow: hidden;
}
.detailowner .el-icon-arrow-right {
    position: absolute;
    top: 30px;
    right: 6px;
    font-size: 18px;
}
.detailowner .el-icon-location-outline {
    position: relative;
    top: 30px;
    float: left;
    left: 12px;
    font-size: 25px;
}
.detailowner p {
    position: relative;
    left: 20px;
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
    top: 35px;
    color: #333333;
    font-size: 12px;
    width: 2.9rem;
}
.detailowner_address span {
    display: table-cell;
    vertical-align: middle;
    text-align: left;
}
.detailowner p.detailowner_address {
    display: table;
    top: 20px;
    padding: 0 0 40px;
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
    top: 40px;
}
.ordercenter span:nth-child(2) {
    font-size: 12px;
    color: #9b9b9b;
    top: 15px;
}
.ordercenter span:nth-child(3) {
    top: 30px;
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
    height: 46px;
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

