<template>
    <div>
        <el-dialog 
            class="alertBoxs"
            @open="openCallback"
            :show-close = false
            :before-close="handleClose"
            :visible.sync="alertBox" width="40%">
            <div class="content"><slot></slot></div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    data: function() {
        return {
            closeTime: 1000 //定时1秒关闭
        };
    },
    props: ["alertBox"],
    created() {},
    methods: {
        handleClose() {
            this.$emit('close')
        },
        openCallback() {
            let that =this;
            setTimeout(()=> {
                that.$emit('close')
            }, that.closeTime)
        }
    }
};
</script>

<style scoped>
    .content {
        font-size: 15px;
        font-weight: 400;
    }
</style>

