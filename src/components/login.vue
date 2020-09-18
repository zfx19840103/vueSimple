<template>
    <div style="height: 100%;">
        <div
            class="scrollFunc"
            @touchstart="touchstartFunc"
            @touchmove="touchmoveFunc"
            @touchend="touchendFunc"
        ></div>
        <span class="orderCenter" @click="orderCenter">
            <i>我的</i>
        </span>
        <div class="loginParent">
            <div class="loginBg"></div>
        </div>
        <div class="login-wrap" v-if="loginShow">
            <div class="login_wrap_content">
                <div class="loginunit">
                    <label>
                        <span class="logintitle">手机号：</span>
                        <input class="emailinput" v-model="param.email" maxlength="11" />
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
                    >手机登录</button>
                    <button class="login-btn" v-else @click="submitForm()">手机登录</button>
                </div>
                <a :href="feishuhref" class="feis">
                    <i></i>微信登录
                </a>
            </div>
        </div>
        <div v-else class="login-wrap-login">
            <div class="loginunitbtn">
                <button class="login-btn">手机</button>
            </div>
        </div>
        <!-- <div class="loginwrapIcon" @click="linkproduct" v-if="arrow">
            <i class="el-icon-arrow-down"></i>
            <span></span>
            <span></span>
        </div> -->
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
import BScroll from "better-scroll";
export default {
    data() {
        return {
            smartCaptcha: "",
            alertBoxVisible: false,
            alertBoxContent: "",
            captchaClass: false,
            loginShow: true,
            arrow: true,
            vcCodepostfontcontent: "发送验证",
            verifydata: {},
            feishuhref:
                "https://tsingapi.tsingglobal.com/openapi/auth/login/feishu",
            param: {
                email: "",
                vcCode: "",
                disabled: true
            },
            routerurl: "ordercheck",
            startIndex: "",
            endIndex: "",
            swiper: "",
            touchIndex: "",
            tranX: "",
            tranBack: ""
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.urlparamFunc();
        // if(!!localStorage.getItem('moon_vcodetime')) {
        //     this.timecodeFunc();
        //     this.param.email = Cookie.getItem('moonxing_email')
        //     this.loginShow = true;
        // }
        // this.touchFunc();
    },
    mounted() {
        this.pushCodeFunc();
    },
    methods: {
        touchstartFunc(event) {
            let that = this;
            event.preventDefault();
            var ctouch = event.changedTouches[0];
            console.log("start" + ctouch.pageY);
            that.startIndex = ctouch.pageY; //获取到刚开始的X
        },
        touchmoveFunc(event) {
            let that = this;
            event.preventDefault();
            that.touchIndex = event.changedTouches[0].pageY; //获取到移动时不断改变的X轴上的值
            that.tranX = that.touchIndex - that.startIndex; //移动过程中X轴上的差值
            // console.log(that.tranX);
        },
        touchendFunc(event) {
            let that = this;
            event.preventDefault();
            //获取最终触摸的X轴（手指离开屏幕时获取的）
            that.endIndex = event.changedTouches[0].pageY;
            that.tranBack = that.endIndex - that.startIndex;

            console.log("end" + that.endIndex);
            console.log(that.tranBack);
            if (that.tranBack < 0 && Math.abs(that.tranBack) > 80) {
                this.$router.push("/product");
            }
        },

        urlparamFunc() {
            if (!!this.$route.query.loginShow) {
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
                        email: that.param.email,
                        verify: that.verifydata
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
            let that = this;

            let reg = /^1[3456789]\d{9}$/;

            if (this.param.email !== "") {
                if (!reg.test(this.param.email)) {
                    that.alertBoxVisible = true;
                    that.alertBoxContent = "请输入有效手机号";
                } else {
                    if (this.vcCodepostfontcontent !== "发送验证") {
                        return;
                    } else {
                        this.captchaClass = true;
                    }
                }
            } else {
                this.alertBoxVisible = true;
                this.alertBoxContent = "请输入手机号";
            }
        },
        timecodeFunc() {
            let n = !!localStorage.getItem("moon_vcodetime")
                    ? localStorage.getItem("moon_vcodetime")
                    : 59,
                that = this;
            // Cookie.setItem('moonxing_email', that.param.email);
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
        submitForm() {
            let data = {
                email: this.param.email,
                captcha: this.param.vcCode
                // verify: this.verifydata,
            };
            let that = this;
            if (this.param.email === "") {
                that.alertBoxVisible = true;
                that.alertBoxContent = "请输入手机号";
            } else if (this.param.vcCode === "") {
                that.alertBoxVisible = true;
                that.alertBoxContent = "请输入验证码";
            } else {
                let regcode = /^\d+$/;
                let reg = /^1[3456789]\d{9}$/;
                
                if (!regcode.test(this.param.vcCode)) {
                    that.alertBoxVisible = true;
                    that.alertBoxContent = "验证码为数字";
                }else if(!reg.test(this.param.email)) {
                    that.alertBoxVisible = true;
                    that.alertBoxContent = "请输入有效手机号";
                } else {
                    loginPost(data)
                        .then(function(res) {
                            that.alertBoxVisible = true;
                            if (!!res && res.code == 20000) {
                                localStorage.setItem(
                                    "moonxing_email",
                                    that.param.email
                                );
                                _czc.push(["_trackEvent", "login", "loginh5"]);

                                that.alertBoxContent = "登录成功";
                                setTimeout(function() {
                                    that.$router.push("/myorder");
                                }, 1000);
                            } else {
                                that.alertBoxContent = res.message;
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
            if (!!localStorage.getItem("moonxing_email")) {
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
.login-wrap-login {
    width: 2.6rem;
    position: absolute;
    bottom: 1rem;
    left: 50%;
    margin: 0 0 0 -1.3rem;
    z-index: 1;
}

.scrollFunc {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    /* background: #f00; */
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
.loginwrapIcon {
    -webkit-animation: bounce-down 1s linear infinite;
    animation: bounce-down 1s linear infinite;
    z-index: 10000;
}
.feis i {
    background-image: url(../assets/img/weixin.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    top: 5px;
    left: -7px;
    width: 25px;
    height: 25px;
    position: relative;
    display: inline-block;
}
.feis {
    position: relative;
    width: 100%;
    height: 38px;
    line-height: 38px;
    padding: 0 0 5px;
    box-sizing: border-box;
    display: block;
    border-radius: 19px;
    box-sizing: border-box;
    border: #7D472B solid 1px;
    background-color: rgba(125, 71, 43, 0.24);
    margin-top: 13px;
    font-weight: 400;
    color: #ffffff;
    text-decoration: none;
    font-size: 14px;
    bottom: 0;
    left: 0;
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
    z-index: 999999;
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
.loginParentbk {
    position: relative;
    left: 0;
    top: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
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
    transform: rotate(180deg);
    font-size: 16px;
    color: #ffffff;
    position: relative;
    top: 0;
    left: 0;
    display: block;
}
.loginwrapIcon span {
    width: 0.03rem;
    height: 0.03rem;
    background: #ffffff;
    border-radius: 50%;
    display: block;
    margin: 0 auto 0.06rem;
}
.loginwrapIcon {
    position: absolute;
    text-align: center;
    bottom: 0.1rem;
    height: 38px;
    width: 1rem;
    left: 50%;
    margin-left: -0.5rem;
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
    color: #7D472B;
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
    background:#7D472B;
    border: 0;
    outline: 0;
    font-size: 16px;
    font-weight: 400;
    color:#F7E3BE;
    letter-spacing: 3px;
}

.loginBg {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100vw;
    height: 100vh;
    background-image: url(../assets/img/loginBg.png);
    background-color: #DDB275;
    background-repeat: no-repeat;
    background-position: 0 0; 
    background-size: auto 100%;
}
.login-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;
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
    border-left: #7D472B solid 1px;
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
    color: #7D472B;
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
    height: 22px;
    line-height: 22px;
    margin: 8px 0;
    /* background: #ffcccc; */
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
    background: rgba(255, 255, 255, 0.4);
    position: relative;
    margin-top: 13px;
    top: 0;
    left: 0;
}
.login_wrap_content {
    width: 2.6rem;
    position: absolute;
    bottom: 0.21rem;
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

