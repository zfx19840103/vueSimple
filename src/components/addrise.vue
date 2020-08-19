<template>
    <div class="bg">
        <div class="ms-content addrise">
            
            <div class="unit menu" v-if="this.$route.query.edit == 1">
                <span>抬头类型</span>
                <label>
                    <input type="radio" name="riseType" disabled v-model="param.look_up" value="1" /> 个人/非企业单位
                </label>
                <label>
                    <input type="radio" name="riseType" disabled v-model="param.look_up" value="2" /> 单位
                </label>
            </div>
            <div class="unit menu" v-else>
                <span>抬头类型</span>
                <label>
                    <input type="radio" name="riseType" v-model="param.look_up" value="1" /> 个人/非企业单位
                </label>
                <label>
                    <input type="radio" name="riseType" v-model="param.look_up" value="2" /> 单位
                </label>
            </div>
            
            <div v-if="param.look_up == 2">
                 <div class="unit">
                     <i>*</i>
                    <span>公司抬头</span>
                    <input type="text" v-model="param.company1" maxlength="50" placeholder="输入公司抬头" />
                </div>
                <div class="unit mb10px">
                    <i>*</i>
                    <span>公司税号</span>
                    <input type="text" v-model="param.tax_number" maxlength="50"  placeholder="输入公司税号" />
                </div>
                <div class="unit">
                    <span>注册地址</span>
                    <input type="text" v-model="param.address" maxlength="50" placeholder="请输入注册地址" />
                </div>
                <div class="unit">
                    <span>注册电话</span>
                    <input type="text" v-model="param.tel" maxlength="50" placeholder="请输入注册电话" />
                </div>
                <div class="unit">
                    <span>开户银行</span>
                    <input type="text" v-model="param.account_bank" maxlength="50" placeholder="请输入开户行名称" />
                </div>
                <div class="unit">
                    <span>银行账号</span>
                    <input type="text" v-model="param.bank_card" maxlength="50" placeholder="请输入开户账号" />
                </div>
            </div>
            <div v-else class="unit">
                <i>*</i>
                <span>抬头名称</span>
                <input type="text" v-model="param.company2" maxlength="50" placeholder="请填写抬头名称" />
            </div>
            <button class="saverise" @click="saveriseFunc">{{this.$route.query.edit == 1 ? '编辑并使用' : '保存并使用'}}</button>
        </div>
        <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
    </div>
</template>

<script>
import { saverise, editrise } from "@/api/addrise";
import AlertBox from "./alertbox";
import Cookie from "js-cookie";

export default {
    data: function() {
        return {
            alertBox: {
                visible: false,
                tip: '',
            },
            param: {
                id: '',
                look_up: 2,
                company1: "",
                company2: "",
                tax_number: "",
                tel: "",
                address: "",
                account_bank: "",
                bank_card: "",
            }
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.initedit()
    },
    methods: {
        initedit() {
            let query = this.$route.query;

            if(query.edit == 1){
                this.param.id = query.id;
                this.param.look_up = query.look_up;
                this.param.tax_number = query.tax_number;
                this.param.tel = query.tel;
                this.param.address = query.address;
                this.param.account_bank = query.account_bank;
                this.param.bank_card = query.bank_card;
                if(query.look_up == 2) {
                    this.param.company1 = query.company;
                }else {
                    this.param.company2 = query.company;
                }
            }    
        },
        saveriseFunc() {
            let that = this;

            if(this.param.look_up == 2) {
                var data = {
                    look_up: this.param.look_up,
                    tax_number: this.param.tax_number,
                    company: this.param.company1,
                    tel: this.param.tel,
                    address: this.param.address,
                    account_bank: this.param.account_bank,
                    bank_card: this.param.bank_card,
                };
                
                if(this.param.company1 == '') {
                    this.alertBox = {
                        visible: true,
                        tip: '输入公司抬头'
                    }
                }else if(this.param.tax_number == '') {
                    this.alertBox = {
                        visible: true,
                        tip: '输入公司税号'
                    }
                }else {
                    
                    if(this.$route.query.edit == 1){
                        this.editriseapi(data)
                    }else {
                        this.saveriseapi(data)
                    }
                }
            }else {
                var data = {
                    look_up: this.param.look_up,
                    company: this.param.company2,
                };
                if(this.param.company2 == '') {
                    this.alertBox = {
                        visible: true,
                        tip: '输入公司抬头'
                    }
                }else {
                    if(this.$route.query.edit == 1){
                        this.editriseapi(data)
                    }else {
                        this.saveriseapi(data)
                    }
                }
            }
        },
        saveriseapi(data) {
            let that = this;
            saverise(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        that.alertBox = {
                            tip: "保存成功",
                            visible: true,
                        };
                        setTimeout(function() {
                            // that.$router.push({ name: "addinvoice", query: {invoiceId: that.$route.query.invoiceId} });
                            that.$router.push({ name: "ordercheck" });
                        }, 1000)
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
                            tip: res.message,
                            visible: true,
                        };
                    }
                    
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        editriseapi(data) {
            let that = this;
            data.id = this.param.id;

            let _invoiceobj = {
                id: data.id,
                invoice: 1,
                invoice_name: data.company,
                invoice_type: data.look_up,
                is_invoice: 1,
                register_address: data.address,
                register_bank: data.account_bank,
                register_bank_account: data.bank_card,
                register_phone: data.tel,
                taxpayer_number: data.tax_number,
            }
            editrise(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                        that.alertBox = {
                            tip: "编辑成功",
                            visible: true,
                        };
                            localStorage.setItem('invoiceobj', JSON.stringify(_invoiceobj))

                        setTimeout(function() {
                            // that.$router.push({ name: "addinvoice", query: {invoiceId: that.$route.query.invoiceId} });
                            that.$router.push({ name: "ordercheck" });
                        }, 1000)
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
                            tip: res.message,
                            visible: true,
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
.bg {
    height: 100%;
    background: #f4f4f4;
}
.ms-content {
    /* margin: 10px; */
    font-size: 14px;
    /* background: #f4f4f4; */
    /* min-height: 100%; */
    background: #f4f4f4;
}
.menu.unit input {
    float: left;
    margin: 0 10px 0 0;
}
.addressSave {
    position: absolute;
    top: 0;
    height: 50px;
    line-height: 50px;
    right: 20px;
}
.unit {
    height: 46px;
    line-height: 48px;
    border-bottom: #f4f4f4 solid 1px;
    background: #ffffff;
    overflow: hidden;
    padding: 0 10px;
    box-sizing: border-box;
}

.unit input {
    /* color: #9b9b9b; */
    font-size: 14px;
    border: 0;
    text-align: right;
    float: right;
    outline: 0;
    height: 30px;
    line-height: 30px;
    padding: 8px 0 0 12px;
    width: 2.7rem;
}
.unit i {
    float: left;
    color: #f00;
    margin-right: 5px;
}
.unit span {
    float: left;
    color: #333333;
    font-size: 14px;
    /* padding-left: 12px; */
}
.mb10px {
    margin-bottom: 10px;
}
.unit:nth-child(1) label input {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-top: 15px;
}
.unit:nth-child(1) label {
    float: right;
    font-size: 14px;
    margin: 0 0 0 30px;
}
.saverise {
    width: 3.4rem;
    height: 50px;
    background: -webkit-gradient(linear,left top, right top,from(rgba(27,123,255,1)),to(rgba(12,97,216,1)));
    background: linear-gradient(90deg,rgba(27,123,255,1) 0%,rgba(12,97,216,1) 100%);
    border-radius: 25px;
    color: #ffffff;
    font-size: 18px;
    border: 0;
    outline: 0;
    margin-top: 22px;
}
</style>

