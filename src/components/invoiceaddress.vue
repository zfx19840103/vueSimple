<template>
    <div>
        <img class="imgaddress" :src = imgaddress />
    </div>
</template>

<script>

import Cookie from "js-cookie";
import * as CryptoJS from "crypto-js";
import AlertBox from "./alertbox";

export default {
    data() {
        return {
            imgaddress: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598548675978&di=a179c92d24eb78eb37ac4172f465c5d4&imgtype=0&src=http%3A%2F%2Fimg00.hc360.com%2Fhome-a%2F201306%2F201306281434342696.jpg',
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
            this.imgaddress = this.$route.query.imgaddress;
        },
        
    }
};
</script>

<style scoped>
    .imgaddress {
        width: 100%;
    }
</style>

