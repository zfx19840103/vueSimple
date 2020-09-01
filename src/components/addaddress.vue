<template>
    <div>
        <div class="ms-content addaddress">
            <div class="unit">
                <label>收货人</label>
                <input type="text" maxlength="100" v-model="param.receiver" :placeholder="placeholder.receiver" />
            </div>
            <div class="unit">
                <label>手机号</label>
                <input
                    type="text"
                    v-model="param.phone"
                    maxlength="11"
                    :placeholder="placeholder.phone"
                />
            </div>
            <div class="unit" @click="areashow = true">
                <label>所在地区</label>
                <input
                    type="text"
                    class="areaaddress"
                    readonly="readonly"
                    v-model="param.area"
                    :placeholder="placeholder.area"
                />
                <i class="el-icon-arrow-right"></i>
            </div>

            <div class="unit">
                <label>详细地址</label>
                <input type="text" class="addressaddress" @click="addressclick" @input="addressbkFunc" v-model="param.addressbk" :placeholder="placeholder.address"/>
                <div id="l-map"></div>
                <div id="r-result">
                    <input
                        v-model="param.address"
                        :placeholder="placeholder.address"
                        id="suggestId"
                    />
                </div>
                <div
                    id="searchResultPanel"
                    style="border:1px solid #C0C0C0;margin:12px 0 0;width:2.3rem;height:auto; display:none;"
                ></div>
            </div>
        </div>
        <button v-if="saveaddress" @click="saveaddressFunc" class="addaddresssave">保存</button>
        <button v-else @click="editaddressFunc" class="addaddresssave">保存编辑</button>
        <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
        <Areacomponent :showChose="areashow" v-on:listenareaFunc="areaemit"></Areacomponent>
    </div>
</template>

<script>
import { addaddress, editaddress } from "@/api/addaddress";

import Cookie from "js-cookie";
import Areacomponent from "./area";
import AlertBox from "./alertbox";

export default {
    data: function() {
        return {
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
            id: "",
            areashow: false,
            alertBox: {
                visible: false,
                tip: "提示"
            },
            placeholder: {
                receiver: "姓名",
                phone: "手机号",
                area: "选择所在地区",
                address: "选择详细地址"
            },
            saveaddress: true,
            ac: {},
        };
    },
    components: { Areacomponent, AlertBox },

    created() {
        if (!!this.$route.query.edit && this.$route.query.edit == 1) {
            this.initEdit();
            this.saveaddress = false;
        }
    },
    mounted() {
        this.addressFunc();
    },
    updated() {

    },
    methods: {
        addressclick() {
            this.ac.setLocation(this.param.areaobj.c);
        },
        addressbkFunc() {
            this.param.address = this.param.addressbk;
        },
        initEdit() {
            let query = this.$route.query;
            this.id = query.id;

                this.param = {
                    areaobj: {
                        p: !!query.provincial ? query.provincial : "",
                        c: !!query.city ? query.city : "",
                        d: !!query.area ? query.area : ""
                    },
                    area:
                        (!!query.provincial ? query.provincial : "") +
                        " " +
                        (!!query.city ? query.city : "") +
                        " " +
                        (!!query.area ? query.area : ""),
                    receiver: query.receiver,
                    phone: query.phone,
                    addressbk: query.address
                };

        },
        editaddressFunc() {
            let that = this;

            let data = {
                address: {
                    provincial: this.param.areaobj.p,
                    city: !!this.param.areaobj.c ? this.param.areaobj.c : '',
                    area: !!this.param.areaobj.d ? this.param.areaobj.d : '',
                    receiver: this.param.receiver,
                    phone: this.param.phone,
                    address: this.param.addressbk
                },
                id: this.id,
            };
            if (this.param.receiver == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.receiver
                };
            } else if (this.param.phone == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.phone
                };
            } else if (!/^1[3456789]\d{9}$/.test(this.param.phone)) {
                this.alertBox = {
                    visible: true,
                    tip: this.placeholder.phone + "格式不对"
                };
            } else if (this.param.area == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.area
                };
            } else if (this.param.address == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.address
                };
            } else {
                editaddress(data)
                    .then(function(res) {
                        that.routerFunc(res,()=>{

                            let _addressobj = JSON.parse(localStorage.getItem('addressobj'));
                            _addressobj.id = data.id;
                            _addressobj.city = data.address.city;
                            _addressobj.area = data.address.area;
                            _addressobj.receiver = data.address.receiver;
                            _addressobj.phone = data.address.phone;
                            _addressobj.address = data.address.address;

                            localStorage.setItem('addressobj', JSON.stringify(_addressobj));
                            that.alertBox = {
                                visible: true,
                                tip: "编辑成功"
                            };
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        },
        addressFunc() {
            let that = this;
            function G(id) {
                return document.querySelectorAll(id);
            }

            var map = new BMap.Map("l-map");
            map.centerAndZoom("北京", 12); // 初始化地图,设置城市和地图级别。

            that.ac = new BMap.Autocomplete({
                input: "suggestId",
                location: map
            }); //建立一个自动完成的对象

            that.ac.setLocation(that.param.areaobj.c);

            that.ac.addEventListener("onhighlight", function(e) {

                //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value =
                        // _value.province +
                        // _value.city +
                        // _value.district +
                        _value.street +
                        _value.business;
                }
                str =
                    "FromItem<br />index = " +
                    e.fromitem.index +
                    "<br />value = " +
                    value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value =
                        // _value.province +
                        // _value.city +
                        // _value.district +
                        _value.street +
                        _value.business;
                }
                str +=
                    "<br />ToItem<br />index = " +
                    e.toitem.index +
                    "<br />value = " +
                    value;
                G("searchResultPanel").innerHTML = str;

            });

            var myValue;
            that.ac.addEventListener("onconfirm", function(e) {
                //鼠标点击下拉列表后的事件

                var _value = e.item.value;
                myValue =
                    // _value.province +
                    // _value.city +
                    // _value.district +
                    _value.street +
                    _value.business;
                G("searchResultPanel").innerHTML =
                    "onconfirm<br />index = " +
                    e.item.index +
                    "<br />myValue = " +
                    myValue;

                setPlace();
            });

            function setPlace() {
                map.clearOverlays(); //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                    map.centerAndZoom(pp, 18);
                    map.addOverlay(new BMap.Marker(pp)); //添加标注
                }
                var local = new BMap.LocalSearch(map, {
                    //智能搜索
                    onSearchComplete: myFun
                });
                that.param.addressbk = myValue;
                // that.param.address = myValue;
                local.search(myValue);
            }
        },
        // 保存地址
        saveaddressFunc() {
            if (this.param.receiver == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.receiver
                };
            } else if (this.param.phone == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.phone
                };
            } else if (!/^1[3456789]\d{9}$/.test(this.param.phone)) {
                this.alertBox = {
                    visible: true,
                    tip: this.placeholder.phone + "格式不对"
                };
            } else if (this.param.area == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.area
                };
            } else if (this.param.address == "") {
                this.alertBox = {
                    visible: true,
                    tip: "请输入" + this.placeholder.address
                };
            } else {
                let data = {
                    address: {
                        provincial: this.param.areaobj.p,
                        city: !!this.param.areaobj.c ? this.param.areaobj.c : '',
                        area: !!this.param.areaobj.d ? this.param.areaobj.d : '',
                        receiver: this.param.receiver,
                        phone: this.param.phone,
                        address: this.param.addressbk
                    }
                };
                let that = this;
                addaddress(data)
                    .then(function(res) {
                        that.routerFunc(res,()=>{
                            localStorage.removeItem('addressobj');
                            that.alertBox = {
                                visible: true,
                                tip: "保存成功"
                            };
                        });
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        },
        routerFunc(res, callback) {
            let that = this;
            let _onemore = this.$route.query.onemore;
            if (!!res && res.code == 20000) {
                
                callback();
                setTimeout(function() {
                    that.$router.push({ name: "ordercheck", query: {
                        onemore: _onemore,
                        isaddress: 1,
                    } });
                            
                }, 1000);
            } else if(!!res && res.code == 113005) {
                this.alertBox = {
                    visible: true,
                    tip: res.message
                };
                
                localStorage.removeItem("moon_email");
                setTimeout(function() {
                    that.$router.push("/login");
                }, 1000);
            }else {
                this.alertBox = {
                    visible: true,
                    tip: res.message
                };
            }

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
        }
    }
};
</script>

<style scoped>
#suggestId {
    opacity: 0;
    position: relative;
    z-index: -1;
    float: right;
    margin: -48px 7px 0 0;
}
.addaddresssave {
    position: absolute;
    top: 2.58rem;
    width: 3.31rem;
    height: 0.5rem;
    background: -webkit-gradient(linear,left top, right top,from(rgba(27,123,255,1)),to(rgba(12,97,216,1)));
    background: linear-gradient(90deg,rgba(27,123,255,1) 0%,rgba(12,97,216,1) 100%);
    border-radius: 18px;
    outline: 0;
    border: 0;
    font-size: 18px;
    overflow: hidden;
    left: 0.23rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: 0;
    outline: 0
}
.areaaddress i {
    font-style: normal;
}
#l-map {
    width: 100%;
    height: 300px;
    display: none;
}
.ms-content {
    font-size: 14px;
    background: #f4f4f4;
}
.addressSave {
    position: absolute;
    top: 0;
    height: 50px;
    line-height: 50px;
    right: 20px;
}
/* .el-form-item {
  height: 46px;
  background: #ffffff;
} */
.unit input.areaaddress {
    width: 2.3rem;
}
.unit {
    height: 46px;
    line-height: 48px;
    border-bottom: #f4f4f4 solid 1px;
    background: #ffffff;
    overflow: hidden;
}
.unit:nth-child(2) {
    margin-bottom: 8px;
}
.unit input {
    /* color: #9b9b9b; */
    font-size: 12px;
    border: 0;
    text-align: left;
    float: left;
    outline: 0;
    height: 30px;
    line-height: 30px;
    padding: 8px 0 0 12px;
    width: 2.8rem;
}
.unit label {
    float: left;
    color: #333333;
    font-size: 14px;
    padding-left: 12px;
    width: 68px;
    text-align: left;
}
.unit:nth-child(4) input {
    height: 48px;
    padding: 0 0 0 12px;
}
.addaddress .el-icon-arrow-right {
    float: right;
    padding: 15px 10px 10px;
}
</style>

