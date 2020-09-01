<template>
    <div class="invoiceopen">
        <div class="ivnews">
            <p>订单编号 {{ivnewscode}}</p>
            <p>开票金额 <em>¥{{ivnewsprice}}</em></p>
        </div>
        <div class="ivcontent">
            <p><span class="left">发票类型</span><span class="right">增值税电子普通发票</span></p>
            <p>
                <span class="left"><i>*</i>抬头类型</span>
                <label class="right">
                <input type="radio" class="ivtype" @click="inputradio" name="ivcontent" v-model="invoice_info.invoice_type" value="1" />
                个人/非企业单位
                </label>
                <label class="right">
                <input type="radio" class="ivtype" @click="inputradio" name="ivcontent" v-model="invoice_info.invoice_type" value="2" />
                企业
                </label>
            </p>
            <p v-if="invoice_info.invoice_type==2"><span class="left"><i>*</i>发票抬头</span><input maxlength="50" v-model.trim="invoice_info.invoice_name2" class="right inputtext" type="text" placeholder="抬头名称" /></p>
            <p v-if="invoice_info.invoice_type==1"><span class="left"><i></i>发票抬头</span><input maxlength="50" v-model.trim="invoice_info.invoice_name1" class="right inputtext" type="text" placeholder="填写需开具的抬头名称，默认为“个人”" /></p>
            <p v-if="invoice_info.invoice_type == 2"><span class="left"><i>*</i>税号</span><input maxlength="50" v-model.trim="invoice_info.taxpayer_number" class="right inputtext"  type="text" placeholder="纳税人识别号" /></p>
        </div>
        <div class="ivtextarea">
            <p><span class="left">发票内容</span><label class="right">
                <input type="radio" name="ivtextarea" checked />明细</label></p>
        </div>
        <button class="ivbutton ivbuttontop" @click="opensubmit">提交申请</button>
        <button class="ivbutton" @click="noinvoice">不开发票</button>
        <div class="deleteorderDialog" v-if="deleteorderDialog">
            <div class="deleteorderDialogBg" @click="closedodFunc"></div>
            <div class="dodcontent">
                <div class="doda">
                    <h3>是否确认提交该申请？</h3>
                    <p>
                        <button class="deleteorder" @click="closedodFunc">取消</button>
                        <button class="wrong" @click="submitivopen">确定</button>
                    </p>
                </div>
            </div>
        </div>
        <AlertBox :alertBox="alertBoxVisible" @close="alertBoxVisible=false">{{alertBoxContent}}</AlertBox>
    </div>
</template>

<script>
import { orderinvoice } from "@/api/invoiceopen";
import Cookie from "js-cookie";
import * as CryptoJS from "crypto-js";
import AlertBox from "./alertbox";

export default {
    data() {
        return {
            alertBoxVisible: false,
            alertBoxContent: '',
            ivnewscode: 'sadfasdfasdf',
            ivnewsprice: '933',
            deleteorderDialog: false,
            order_code: '',
            invoice_info: {
                invoice_type: 1, //1个人，2公司
                invoice_name: "",
                invoice_name1: "",
                invoice_name2: "",
                taxpayer_number: "",
                register_address: "",
                register_phone: "",
                register_bank: "",
                register_bank_account: "",
            },
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.initFunc();
    },
    mounted() {

    },
    methods: {
        initFunc() {
            let obj = {
                ivnewscode: this.$route.query.ivnewscode,
                ivnewsprice: this.$route.query.ivnewsprice,
            }
            if (!!obj.ivnewscode && !!obj.ivnewsprice) {
                localStorage.setItem('ivnews', JSON.stringify(obj))
            }
            let _ivnews = JSON.parse(localStorage.getItem('ivnews'));
            this.ivnewscode = _ivnews.ivnewscode;
            this.ivnewsprice = _ivnews.ivnewsprice;
        },
        inputradio() {
            this.invoice_info.invoice_name1 = '';
            this.invoice_info.invoice_name2 = '';
            this.invoice_info.taxpayer_number = '';
        },
        opensubmit() {
            if (this.invoice_info.invoice_type == 2 && this.invoice_info.invoice_name2 == '') {
                this.alertBoxVisible = true;
                this.alertBoxContent = "请输入抬头名称";
            }else if (this.invoice_info.invoice_type == 2 && this.invoice_info.taxpayer_number == '') {
                this.alertBoxVisible = true;
                this.alertBoxContent = "纳税人识别号";
            }else {
                this.deleteorderDialog = true;
            }
        },
        closedodFunc() {
            this.deleteorderDialog = false;
            this.invoice_info.invoice_name = '';
            this.invoice_info.taxpayer_number = '';
        },
        submitivopen() {
            let that = this;
            let data = {
                order_code: this.ivnewscode,
                invoice_info: {
                    invoice_type: this.invoice_info.invoice_type, //1个人，2公司
                    invoice_name: this.invoice_info.invoice_type == 2 ? this.invoice_info.invoice_name2 : (this.invoice_info.invoice_name1 != '' ? this.invoice_info.invoice_name1 : '个人'),
                    taxpayer_number: this.invoice_info.taxpayer_number,
                    register_address: "",
                    register_phone: "",
                    register_bank: "",
                    register_bank_account: "",
                },
            }
            orderinvoice(data)
                .then(function(res) {
                    if (res.code == 20000) {
                        that.alertBoxVisible = true;
                        that.alertBoxContent = "提交申请成功";
                        setTimeout(function() {
                            that.$router.push("/myorder");
                            localStorage.removeItem('ivnews');
                        }, 1000);
                    } else if (!!res && res.code == 113005) {
                         
                        that.alertBoxVisible = true;
                        that.alertBoxContent = res.message;
                        localStorage.removeItem('ivnews');
                        localStorage.removeItem("moon_email");
                        localStorage.removeItem("onemoreobj");
                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                    } else {
                        that.alertBoxVisible = true;
                        that.alertBoxContent = res.message;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        noinvoice() {
            localStorage.removeItem('ivnews');
            this.$router.push("/myorder");
        }
    }
};
</script>

<style scoped>
.wrong:focus {
    outline: 0;
}
.dodb span {
    display: block;
    text-align: center;
    font-size:14px;
    font-weight:400;
    margin: 0.08rem 0 0;
    color:rgba(51,51,51,1);
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
.doda button, .dodb button {
    width: 0.9rem;
    height: 0.3rem;
    border-radius: 18px;
    font-size: 14px;

    font-weight: 400;
    position: absolute;

    top: 0.92rem;
}
.doda button.wrong, .dodb button.callphone {
    background: linear-gradient(
        90deg,
        rgba(60, 140, 255, 1) 0%,
        rgba(12, 97, 216, 1) 100%
    );
    color: #ffffff;
    border: 0;
    right: 0.46rem;
}
.doda button.deleteorder, .dodb button.deleteorder {
    color: rgba(15, 101, 222, 1);
    display: inline-block;
    outline: 0;
    border: 1px solid rgba(12, 98, 217, 1);
    background: #ffffff;
    left: 0.46rem;
}
.doda p, .dodb p {
    padding: 0.37rem 0 0;
}
.doda h3, .dodb h3 {
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
    .left {
        float: left;
    }
    .left i {
        color: #FF502C;
        margin: 0 5px 0 0;
    }
    .right {
        float: right;
    }
    .ivtextarea input {
        float: left;
        margin: 24px 7px 0 0;
    }
    .ivcontent .ivtype {

    }
    .inputtext {
        border: 0;
        font-size:14px;
        width: 2.44rem;
        height: 0.24rem;
        line-height: 0.24rem;
        font-weight:400;
        text-align: right;
        margin: 20px 0 0;
        outline: 0;
    }
    .ivcontent .ivtype {
        float: left;
        margin: 24px 7px 0 38px;
    }
    .ivbutton {
        width: 2.9rem;
        height: 0.42rem;
        background: linear-gradient( 90deg, rgba(27, 123, 255, 1) 0%, rgba(12, 97, 216, 1) 100% );
    border-radius: 18px;
    outline: 0;
    border: 0;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    overflow: hidden;
    display: block;

    position: relative;
    margin: 15px auto;
    }
    .ivbutton.ivbuttontop {
        margin: 103px auto 0;
        text-align: center;
    }
    .ivtextarea p {
        padding: 0 10px;
        height: 60px;
        line-height: 60px;
        overflow: hidden;
    }
    .ivtextarea {
        height: 60px;
        line-height: 60px;
        position: relative;
        background: #ffffff;

        top: 30px;
        font-size:14px;
font-family:PingFangSC-Regular,PingFang SC;
font-weight:400;
color:rgba(51,51,51,1);
    }
    .ivcontent p {
        height: 60px;
        background: #ffffff;
        border-bottom: #F4F4F4 solid 1px;
        padding: 0 10px;
        line-height: 60px;
        font-size:14px;
font-family:PingFangSC-Regular,PingFang SC;
font-weight:400;
color:rgba(51,51,51,1);
    }
    .ivcontent {
        position: relative;
        top: 20px;
        overflow: hidden;
        font-size: 12px;
    }
    .invoiceopen {
        background: #F4F4F4;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .ivnews p em {
        font-weight:800;
        color:#FF6242;
        font-style: normal;
    }
    .ivnews p {
        height:33px;
        font-size:16px;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:33px;
        font-family:PingFangSC-Regular,PingFang SC;
        text-align: left;
    }
    .ivnews {
        overflow: hidden;
        position: relative;
        height: 93px;
        background: #ffffff;
        top: 10px;
        box-sizing: border-box;
        padding: 10px 10px;
    }
</style>

