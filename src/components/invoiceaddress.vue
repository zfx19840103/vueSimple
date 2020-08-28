<template>
    <div class="invoiceaddress">
        <pdf :src= imgaddress> </pdf>
    </div>
</template>

<script>

import Cookie from "js-cookie";
import * as CryptoJS from "crypto-js";
import pdf from 'vue-pdf'

export default {
    data() {
        return {
            imgaddress: '',
        };
    },
    components: {pdf},
    created() {
        this.initFunc();
        this.imgaddress = pdf.createLoadingTask(this.imgaddress)
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
    .invoiceaddress {
        min-height: 90%;
    }
    .imgaddress {
        
        margin: 0 auto;
    }
</style>

