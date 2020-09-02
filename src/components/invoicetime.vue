<template>
    <div class="timeoutbg">
        <div class="timeouticon"></div>
        <p>该订单在线申请已超时，请联系客服</p>
        <p class="f15">客服电话：+86 17610095818</p>
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
            
        };
    },
    components: {
        AlertBox
    },
    created() {
        
    },
    mounted() {

    },
    methods: {}
};
</script>

<style scoped>
    .timeoutbg p {
        font-size:16px;
        margin: 0 0 0.2rem;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:22px;
    }
    .timeoutbg p.f15 {
        font-size:15px; 
    }
    .timeouticon {
        background: url(../assets/img/timeout.png) no-repeat;
        background-size: 100%;
        width: 1.29rem;
        height: 1.31rem;
        margin: 1.13rem auto 0.33rem;
    }
    .timeoutbg {
        background: #F4F4F4;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>

