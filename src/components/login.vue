<template>
    <div class="loginParent">
        <div class="loginBg"></div>
        <div class="login-wrap">
            <span class="orderCenter" @click="orderCenter">订单中心</span>
            <div class="login_wrap_content" v-if="loginShow">
                <div class="loginunit">
                    <label>
                        <span class="logintitle">邮箱：</span>
                        <input class="emailinput" v-model="param.email" />
                    </label>
                </div>
                <div class="loginunit">
                    <label>
                        <span class="logintitle">验证码：</span>
                        <input v-model="param.vcCode" maxlength="6" />
                    </label>
                    <div class="vcCodepost">
                        <div class="vcCodepostfont" @click="vcCodepostfont">
                            <em></em>
                            {{vcCodepostfontcontent}}
                        </div>
                    </div>
                </div>
                <div class="loginunitbtn">
                    <button
                        class="login-btn"
                        v-if="!param.disabled"
                        @click="submitForm()"
                        disabled
                    >登录</button>
                    <button class="login-btn" v-else @click="submitForm()">登录</button>
                </div>
            </div>
            <div class="loginwrapIcon" v-if="arrow">
                <span></span>
                <span></span>
                <i class="el-icon-arrow-down" @click="linkproduct"></i>
            </div>
        </div>
        <div class="captchacontentDialog" v-bind:class="{ 'captchaClass': captchaClass }">
            <div class="captchacontentBg" @click="captchaClass = false"></div>
            <div class="captchacontent">
                <div id="captcha"></div>
            </div>
        </div>
        <AlertBox :alertBox="alertBoxVisible" @close="alertBoxVisible=false">{{alertBoxContent}}</AlertBox>
    </div>
</template>

<script>
import { loginPost, pushCode, verify } from "@/api/login";
import Cookie from "js-cookie";
import * as CryptoJS from "crypto-js";
import AlertBox from "./alertbox";
export default {
    data() {
        return {
            smartCaptcha: "",
            alertBoxVisible: false,
            alertBoxContent: "",
            captchaClass: false,
            loginShow: false,
            arrow: true,
            vcCodepostfontcontent: "发送验证",
            verifydata: {},
            param: {
                email: "",
                vcCode: "",
                disabled: true
            }
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.urlparamFunc()
        // if(!!localStorage.getItem('moon_vcodetime')) {
        //     this.timecodeFunc();
        //     this.param.email = Cookie.getItem('moon_email')
        //     this.loginShow = true;
        // }
    },
    mounted() {
        this.pushCodeFunc();
    },
    methods: {
        urlparamFunc() {
            if(!!this.$route.query.loginShow){
                this.loginShow = true;
            }
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
                    that.verifydata = {
                        token: NVC_Opt.token,
                        sessionid: data.sessionId,
                        sig: data.sig,
                        scene: "ic_other"
                    };

                    let paramsdata = {
                        email: that.param.email
                    };
                    
                    pushCode(paramsdata)
                        .then(function(res) {
                            that.timecodeFunc();
                            that.captchaClass = false;
                            console.log(res);
                        })
                        .catch(function(e) {
                            console.log(e.status);
                            console.log(e.responseText);
                            that.smartCaptcha.fail();
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
            let n = !!localStorage.getItem('moon_vcodetime') ? localStorage.getItem('moon_vcodetime') : 59,
                that = this;
                // Cookie.setItem('moon_email', that.param.email);
            let timecode = () => {
                if (n >= 0) {
                    that.vcCodepostfontcontent = n + "秒";
                    localStorage.setItem('moon_vcodetime', n);
                    n -= 1;
                    setTimeout(function() {
                        timecode();
                    }, 1000);
                } else {
                    localStorage.removeItem('moon_vcodetime');
                    that.vcCodepostfontcontent = "发送验证";
                    that.smartCaptcha.reset();
                }
            };
            timecode();
        },
        submitForm() {
            let data = {
                email: this.param.email,
                captcha: this.param.vcCode,
                verify: this.verifydata
            };
            let that = this;
            if (this.param.email === "") {
                that.alertBoxVisible = true;
                that.alertBoxContent = "请输入邮箱地址";
            } else if (this.param.vcCode === "") {
                that.alertBoxVisible = true;
                that.alertBoxContent = "请输入验证码";
            } else {
                let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                let regcode = /^\d+$/;
                if (!reg.test(this.param.email)) {
                    that.alertBoxVisible = true;
                    that.alertBoxContent = "请输入有效邮箱地址";
                } else if (!regcode.test(this.param.vcCode)) {
                    that.alertBoxVisible = true;
                    that.alertBoxContent = "验证码为数字";
                } else {
                    loginPost(data)
                        .then(function(res) {

                            that.alertBoxVisible = true;

                            if (!!res && res.code == 20000) {
                                localStorage.setItem(
                                    "moon_email",
                                    that.param.email
                                );

                                that.alertBoxContent = "登录成功";
                                setTimeout(function() {
                                    that.$router.push("/product");
                                }, 1000);
                            } else {
                                that.alertBoxContent = "登录失败";
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                }
            }
        },
        linkproduct() {
            this.$router.push("/product");
        },
        orderCenter() {
            if (!!localStorage.getItem('moon_email')) {
                this.$router.push("/myorder");
            } else {
                this.loginShow = true;
                this.arrow = false;
            }
        }
    }
};
</script>

<style scoped>
@keyframes bounce-down {
    25% {
        transform: translateY(-5px);
    }
    50% {
        transform: translateY(0);
    }
    75% {
        transform: translateY(5px);
    }
    100% {
        transform: translateY(0);
    }
}
@-webkit-keyframes bounce-down {
    25% {
        transform: translateY(-5px);
    }
    50% {
        transform: translateY(0);
    }
    75% {
        transform: translateY(5px);
    }
    100% {
        transform: translateY(0);
    }
}
.loginwrapIcon {
    -webkit-animation: bounce-down 1s linear infinite;
    animation: bounce-down 1s linear infinite;
}
.orderCenter {
    font-size: 14px;
    position: absolute;
    top: 23px;
    right: 0;
    width: 77px;
    box-sizing: border-box;
    padding-left: 5px;
    height: 31px;
    background: rgba(33, 129, 212, 0.8);
    border-top-left-radius: 17px;
    border-bottom-left-radius: 17px;
    font-weight: 400;
    color: rgba(225, 235, 255, 1);
    line-height: 31px;
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
.loginParent {
    position: relative;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #3469c9;
}
.loginwrapIcon i {
    font-size: 24px;
    color: #ffffff;
    position: relative;
    top: 0;
    left: 0;
    display: block;
}
.loginwrapIcon span {
    width: 0.04rem;
    height: 0.04rem;
    background: #ffffff;
    border-radius: 50%;
    display: block;
    margin: 8px auto 0;
}
.loginwrapIcon {
    position: absolute;
    text-align: center;
    bottom: 30px;
    height: 60px;
    width: 1rem;
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
    width: 3.16rem;
    height: 1.3rem;
    background: #ffffff;
    border-radius: 8px;
    top: 1.91rem;
    left: 50%;
    margin-left: -1.58rem;
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

.loginBg {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 3.75rem;
    height: 6.04rem;
    background-image: url("../assets/img/loginBg.png");
    background-color: #3267c7;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.login-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-size: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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

.emailinput {
    width: 65%;
}
.loginunit label input {
    border: 0;
    outline: 0;
    background: rgba(255, 255, 255, 0);
    font-size: 12px;
    height: 38px;
    line-height: 38px;
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
.loginunit {
    width: 100%;
    height: 38px;
    border-radius: 19px;
    background: rgba(255, 255, 255, 0.6);
    position: relative;
    margin-top: 13px;
    top: 0;
    left: 0;
}
.login_wrap_content {
    width: 2.6rem;
    position: absolute;
    bottom: 47px;
    z-index: 1;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.bg-btn {
    color: #fff;
    font-weight: bold;
    border-color: #1a4a68;
    background-color: #0f405e;
}
</style>

