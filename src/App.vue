<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  /* margin-top: 60px; */
}
h1,h2,h3,h4,h5,h6,div,p,span,input,em,i,ul,li{
    margin: 0;
    padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
}
*{-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color:transparent;}
.copyTip {
    font-size: 14px;
}
.addaddress .el-input__inner {
    border: 0;
}
.orderCheckaddress .el-drawer__close-btn {
    position: absolute;
    margin: 0;
    padding: 0;
    top: 10px;
    right: 16px;
    width: 20px;
    height: 23px;
}
.orderCheckaddress .el-drawer__body {
    overflow: hidden;
}
.orderCheckaddress .el-drawer__header {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
}
.alertBox .el-dialog {
    color: rgba(255,255,255,1);
    background: rgba(86, 61, 41, 0.9);
    border-radius: 6px;
}
.alertBox .el-dialog__header {
    padding: 0;
}
.alertBox .el-dialog__body {
    padding: 10px 0;
}
</style>
