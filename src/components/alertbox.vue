<template>
    <div>
        <el-dialog 
            class="alertBox"
            @open="openCallback"
            :show-close = false
            :modal = false
            :before-close="handleClose"
            :visible.sync="alertBox" width="2.71rem">
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
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: #FFE9CB;
        line-height: 22px;
    }
</style>

