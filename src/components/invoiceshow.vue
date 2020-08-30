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
                <span class="right">{{invoice_type == "2" ? '企业' : '个人'}}</span>
            </p>
            <p><span class="left"><i>*</i>发票抬头</span><span class="right col9B9B9B">{{invoice_name}}</span></p>
            <p v-if="invoice_type == 2"><span class="left"><i>*</i>税号</span><span class="right col9B9B9B">{{taxpayer_number}}</span></p>
        </div>
        <div class="ivtextarea">
            <p><span class="left">发票状态</span><span class="right">{{invoice_status_func(invoice_status)}}</span></p>
        </div>
        <div class="ivtime">申请时间：{{created_at|dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
        <button class="ivbutton ivbuttontop" @click="postemail">发送邮箱</button>
        <button class="ivbutton" :class="{'isshowinvoice': !this.$route.query.imgaddress}" :disabled="!this.$route.query.imgaddress" @click="invoiceaddress">查看发票</button>
        <div class="deleteorderDialog" v-if="deleteorderDialog">
            <div class="deleteorderDialogBg" @click="closedodFunc"></div>
            <div class="dodcontent">
                <div class="doda">
                    <h3>请确认邮箱地址</h3>
                    <input type="text" maxlength="50" v-model="email" placeholder="用来接受电子发票邮件" class="postmail"/>
                    <p>
                        <button class="deleteorder" @click="closedodFunc">取消</button>
                        <button class="wrong" @click="submitivopen">发送</button>
                    </p>
                </div>
            </div>
        </div>
        <AlertBox :alertBox="alertBoxVisible" @close="alertBoxVisible=false">{{alertBoxContent}}</AlertBox>
    </div>
</template>

<script>
import { invoicemail } from "@/api/invoiceshow";
import Cookie from "js-cookie";
import * as CryptoJS from "crypto-js";
import AlertBox from "./alertbox";

export default {
    data() {
        return {
            alertBoxVisible: false,
            alertBoxContent: '',
            deleteorderDialog: false,

            ivnewscode: '',
            ivnewsprice: '',
            email: '',
            invoice_type: 1,
            invoice_name: '',
            taxpayer_number: '',
            invoice_status: '',
            created_at: '',
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

                invoice_type: this.$route.query.invoice_type,
                invoice_name: this.$route.query.invoice_name,
                taxpayer_number: this.$route.query.taxpayer_number,
                invoice_status: this.$route.query.invoice_status,
                created_at: this.$route.query.created_at,
            }
            if (!!obj.ivnewscode && !!obj.ivnewsprice) {
                localStorage.setItem('ivnews', JSON.stringify(obj))
            }
            let _ivnews = JSON.parse(localStorage.getItem('ivnews'));

            this.ivnewscode = _ivnews.ivnewscode;
            this.ivnewsprice = _ivnews.ivnewsprice;

            this.invoice_type = _ivnews.invoice_type;
            this.invoice_name = _ivnews.invoice_name;
            this.taxpayer_number = _ivnews.taxpayer_number;
            this.invoice_status = _ivnews.invoice_status;
            this.created_at = _ivnews.created_at;

        },
        invoice_status_func(status) {
            var str = "";
            if (status == 0) {
                str = "不开发票";
            } else if (status == 1) {
                str = "待开票";
            } else if (status == 2) {
                str = "开票中";
            } else if (status == 4) {
                str = "已经开票";
            }
            return str;
        },
        closedodFunc() {
            this.email = '';
            this.deleteorderDialog = false;
        },
        postemail() {
            this.deleteorderDialog = true;
        },
        //查看发票
        invoiceaddress() {
            let data = {
                imgaddress: this.$route.query.imgaddress,
            }
            this.$router.push({ name: "invoiceaddress", query: data });
        },
        submitivopen() {
            let that = this;
            let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (!reg.test(this.email)) {
                that.alertBoxVisible = true;
                that.alertBoxContent = "请输入正确邮箱地址";
            }else {
                let data = {
                    order_code: this.ivnewscode,
                    email: this.email,
                }
                invoicemail(data).then(function(res) {
                    if (res.code == 20000) {
                         
                        that.alertBoxVisible = true;
                        that.alertBoxContent = "发送邮件成功";
                        setTimeout(function() {
                            that.$router.push("/myorder");
                        }, 1000);
                        localStorage.removeItem('ivnews');
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
            } 
        }
    }
};
</script>

<style scoped>
.ivbutton.isshowinvoice {
    background: #D3D3D3;
}
.postmail:focus {
    outline: 0;
}
.postmail {
    width: 1.9rem;
    height: 0.2rem;
    padding: 0.08rem 0.15rem;
box-sizing: content-box;
    border-radius:18px;
    border:1px solid rgba(155,155,155,1);
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    /* color:rgba(220,220,220,1); */
    position: absolute;
    overflow: hidden;
    top: 0.71rem;
    left: 0.36rem;
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
.doda {
    position: relative;
    top: 0;
    left: 0;
}
.wrong:focus {
    outline: 0;
}
.doda button, .dodb button {
    width: 0.9rem;
    height: 0.3rem;
    border-radius: 18px;
    font-size: 14px;
    top: 0;
    font-weight: 400;
}
.doda button.wrong, .dodb button.callphone {
    background: linear-gradient(
        90deg,
        rgba(60, 140, 255, 1) 0%,
        rgba(12, 97, 216, 1) 100%
    );
    float: right;
    color: #ffffff;
    border: 0;
    display: inline-block;
    margin-right: 0.38rem;
}
.doda button.deleteorder, .dodb button.deleteorder {
    color: rgba(15, 101, 222, 1);
    display: inline-block;
    outline: 0;
    border: 1px solid rgba(12, 98, 217, 1);
    background: #ffffff;
    margin-left: 0.38rem;
    float: left;
}
.doda p, .dodb p {
    position: absolute;
    top: 1.27rem;
    left: 0;
    width: 100%;
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
    margin: -0.9rem 0 0 -1.49rem;
    width: 2.98rem;
    height: 1.79rem;
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
    .col9B9B9B {
        color: #9B9B9B;
    }
    .ivtime {
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(155,155,155,1);
        position: relative;
        top: 40px;
        text-align: left;
        padding: 0 10px;
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
        margin: 63px auto 0;
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

