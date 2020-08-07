<template>
    <div>
        <header class="qylHeader">
            <div class="qlyHeaderIcon" @click="iconEventIndex" v-if="iconH == 'index'">
                <i class="el-icon-s-home"></i>
            </div>
            <div class="qlyHeaderIcon" @click="iconEventBack" v-else>
                <i class="el-icon-arrow-left"></i>
            </div>
            <span class="qlyHeaderTitle">{{titleH}}</span>
        </header>
    </div>
</template>

<script>
import Cookie from "js-cookie";
export default {
  data() {
    return {};
  },
  props: ["titleH", "iconH"],
  created() {},
  methods: {
    iconEventIndex() {},
    iconEventBack() {
      this.$parent.fatherBackMethod();
    }
  }
};
</script>

<style scoped>
.qylHeader {
    font-size: 14px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-bottom: #ccc solid 1px;
    overflow: hidden;
}
.qlyHeaderIcon {
  float: left;
  margin: 2px 0 0 10px;
  color: #C8C8C8;
}
.qlyHeaderTitle {
    margin-left: -15px;
    font-size: 16px;
    color: #333333;
}
</style>

