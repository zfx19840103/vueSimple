<template>
    <div>
        <div class="ms-content addinvoice">
            <div class="header" @click="checkedFunc('')">
                <input type="radio" name="selectinvoice" value="0" v-model="invoiceId" />不开发票
            </div>
            <h4>发票信息</h4>
            <h5 @click="addtt">
                <i class="el-icon-plus"></i>添加抬头
            </h5>
            <ul>
                <li v-for="(item, index) in invoiceData" data-type="0" :key="index">
                    <div  @touchstart="touchStart" @touchend="touchEnd" class="list-box">
                        <label @click="checkedFunc(item)">
                            <input type="radio" v-model="invoiceId" name="selectinvoice" :value= item.id />
                            <span>{{item.company}}</span>
                            <em v-if="item.look_up == 2">税号:{{item.tax_number}}</em>
                        </label>
                        <i class="editicon" @click="editinvoiceFunc" :data="JSON.stringify(item)"></i>
                    </div>
                    <div class="delete" @click="deleteItem" :data-index="index" :data-item="JSON.stringify(item)">删除</div>
                </li>
            </ul>
        </div>
        <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
    </div>
</template>

<script>
import { getData, deleteinvoice } from "@/api/addinvoice";

import Cookie from "js-cookie";
import AlertBox from "./alertbox";

export default {
    data: function() {
        return {
            alertBox: {
                visible: false,
                tip: '',
            },
            invoiceId: '',
            invoiceData: [
                {
                    id: 1,
                    value: 1,
                    address: "东煌大厦17层00516",
                    receiver: "用户",
                    phone: "16789492242"
                },
                {
                    id: 2,
                    value: 2,
                    address: "东煌大厦17层006",
                    receiver: "用户1",
                    phone: "16789492242"
                },
                {
                    id: 3,
                    value: 3,
                    address: "东煌大厦176",
                    receiver: "用户1",
                    phone: "16789492242"
                }
            ]
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.getDataFunc();
        this.invoiceId = this.$route.query.invoiceId;
    },
    methods: {
        getDataFunc() {
            let that = this;
            getData()
                .then(function(res) {

                    if (!!res && res.code == 20000) {
                        that.alertBox = {
                            tip: "请求成功"
                        };
                        that.invoiceData = res.data;
                    } else {
                        
                        that.alertBox = {
                            tip: res.message,
                            visible: true
                        };
                        localStorage.removeItem("moon_email");

                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        addtt() {

            this.$router.push({ name: "addrise" });
        },      
        editinvoiceFunc(e) {

            console.log(e.target);
            let data = e.target.getAttribute("data");

            data = eval("(" + data + ")");
            data.edit = 1;
            data.invoiceId = this.$route.query.invoiceId;
            this.$router.push({ name: "addrise", query: data });
        },
        checkedFunc(item) {
            let obj = {};

            if(!!item) {
                obj = {
                    id: item.id,
                    invoice_type: item.look_up,
                    register_phone: item.tel,
                    register_address: item.address,
                    taxpayer_number: item.tax_number,
                    invoice_name: item.company,
                    register_bank: item.account_bank,
                    register_bank_account: item.bank_card,
                    invoice:1,
                    is_invoice: 1,
                }
            }else {
                obj = {
                    id:0,
                    invoice:1,
                    is_invoice: 0,
                    invoice_type: item.look_up,
                }
            }
            this.$router.push({
                name: "ordercheck",

            });

            localStorage.setItem('invoiceobj', JSON.stringify(obj))

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
            let listItems = document.querySelectorAll(".addinvoice ul li");
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
            deleteinvoice(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        that.alertBox = {
                            visible: true,
                            tip: "删除成功"
                        }
                        that.restSlide();
                        that.invoiceData.splice(index, 1);
                    } else {
                        that.alertBox = {
                            visible: true,
                            tip: res.message
                        }
                    }
                })
                .catch(function(error) {
                    that.alertBox = {
                        visible: true,
                        tip: "删除失败"
                    }
                    console.log(error);
                });
        },
    }
};
</script>

<style scoped>
.ms-content {
    font-size: 14px;
    background: #f4f4f4;
}
.addinvoice h5 {
    overflow: hidden;
    height: 70px;
    line-height: 70px;
    margin: 0;
    padding: 0;
    text-align: left;
    line-height: 72px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    background: #ffffff;
    border-bottom: #f4f4f4 solid 1px;
}
.addinvoice h5 .el-icon-plus {
    font-size: 18px;
    float: left;
    margin: 27px 10px 0 17px;
}
.addinvoice ul li span {
    position: absolute;
    top: 10px;
    left: 43px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
}
.addinvoice ul li em {
    position: absolute;
    top: 37px;
    left: 43px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(155, 155, 155, 1);
    font-style: normal;
}
.addinvoice ul li .delete {
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
.addinvoice li i.editicon {
    background-image: url("../assets/img/edit.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 18px;
    height: 18px;
    position: absolute;
    top: 31px;
    right: 17px;
}
.addinvoice ul li input {
    position: absolute;
    top: 23px;
    left: 16px;
}

.addinvoice ul li {
    position: relative;
    list-style: none;
    height: 70px;
    border-bottom: #f4f4f4 solid 1px;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}

.addinvoice li .list-box label {
    position: absolute;
    width: 85%;
    height: 100%;
    overflow: hidden;
    left: 0;
}
.addinvoice li .list-box {
    display: flex;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    justify-content: flex-end;
    height: 75px;
}
.addinvoice li[data-type="0"] {
    transform: translate3d(0, 0, 0);
}
.addinvoice li[data-type="1"] {
    transform: translate3d(-0.48rem, 0, 0);
}

.addinvoice ul {
    background: #ffffff;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.addinvoice .header input {
    float: left;
    margin: 15px 11px 0 16px;
}
.addinvoice .header {
    background: #ffffff;
    height: 46px;
    overflow: hidden;
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 45px;
}
.addinvoice h4 {
    font-size: 12px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 45px;
    background: #f4f4f4;
    margin: 0;
    padding: 0 0 0 16px;
    box-sizing: border-box;
    text-align: left;
}
</style>

