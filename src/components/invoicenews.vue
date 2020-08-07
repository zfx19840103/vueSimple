<template>
  <div>
    <Header :titleH="title" :iconH="icon"></Header>
    <div class="ms-content addaddress">
      <!-- <el-form :model="param" :rules="addressrules" ref="address" label-width="80px">
        <el-form-item label="收货人" prop="owner">
          <el-input v-model="param.owner" clearable placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="param.phone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <div id="l-map"></div>
          <div id="r-result">
            <el-input v-model="param.address" clearable placeholder="请输入收货地址" id="suggestId"></el-input>
          </div>
          <div
            id="searchResultPanel"
            style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
          ></div>
        </el-form-item>
        <div class="addressSave" @click="saveEvent('address')">保存</div>
      </el-form> -->
        <div class="unit">
            <label>收货人</label>
            <input type="text" placeholder="输入收货人真实姓名">
        </div>
        <div class="unit">
            <label>手机号</label>
            <input type="text" placeholder="输入收货人手机号">
        </div>
        <div class="unit" @click="areaEvent">
            <label>所在地区</label>
            <i class="el-icon-arrow-right"></i>
        </div>
        <div class="unit">
            <label>详细地址</label>
            <div id="l-map"></div>
            <div id="r-result">
                <input v-model="param.address" clearable placeholder="输入详细收货地址" id="suggestId" />
            </div>
            <div
                id="searchResultPanel"
                style="border:1px solid #C0C0C0;margin:12px 0 0;width:2.3rem;height:auto; display:none;"
            ></div>
        </div>
    </div>
  </div>
</template>

<script>
// import { loginapi } from "@/api/login";
import Header from "./header";
import Cookie from "js-cookie";

export default {
  data: function() {
    let validateowner = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入收货人"));
      } else {
        if (value !== "") {
          //   var reg = /‘’/;
          //   if (!reg.test(value)) {
          //     callback(new Error("请输入有效的收货人"));
          //   }
        }
        callback();
      }
    };
    let validatephone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (value !== "") {
          var reg = /^[\d\w]+$/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的手机号"));
          }
        }
        callback();
      }
    };
    return {
      title: "发票信息",
      icon: "",
      param: {
        owner: "",
        phone: "",
        address: ""
      },
      addressrules: {
        owner: [{ required: true, validator: validateowner, trigger: "blur" }],
        phone: [{ required: true, validator: validatephone, trigger: "blur" }],
        address: [
          { required: true, message: "请输入收货地址", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    Header
  },
  created() {
    this.address();
  },
  methods: {
    address() {
      window.onload = function() {
        function G(id) {
          return document.querySelectorAll(id);
        }

        var map = new BMap.Map("l-map");
        map.centerAndZoom("北京", 12); // 初始化地图,设置城市和地图级别。
        // debugger
        var ac = new BMap.Autocomplete({ input: "suggestId", location: map }); //建立一个自动完成的对象

        ac.addEventListener("onhighlight", function(e) {
          //鼠标放在下拉列表上的事件
          var str = "";
          var _value = e.fromitem.value;
          var value = "";
          if (e.fromitem.index > -1) {
            value =
              _value.province +
              _value.city +
              _value.district +
              _value.street +
              _value.business;
          }
          str =
            "FromItem<br />index = " +
            e.fromitem.index +
            "<br />value = " +
            value;

          value = "";
          if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value =
              _value.province +
              _value.city +
              _value.district +
              _value.street +
              _value.business;
          }
          str +=
            "<br />ToItem<br />index = " +
            e.toitem.index +
            "<br />value = " +
            value;
          G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {
          //鼠标点击下拉列表后的事件
          var _value = e.item.value;
          myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
          G("searchResultPanel").innerHTML =
            "onconfirm<br />index = " +
            e.item.index +
            "<br />myValue = " +
            myValue;

          setPlace();
        });

        function setPlace() {
          map.clearOverlays(); //清除地图上所有覆盖物
          function myFun() {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp)); //添加标注
          }
          var local = new BMap.LocalSearch(map, {
            //智能搜索
            onSearchComplete: myFun
          });
          local.search(myValue);
        }
      };
    },
    saveEvent(param) {
      this.$refs[param].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fatherBackMethod() {
    //   alert(124);
    },
    areaEvent() {
        // alert(1245)
    }
  }
};
</script>

<style scoped>
#l-map {
  width: 100%;
  height: 300px;
  display: none;
}
.ms-content {
  /* margin: 10px; */
  font-size: 14px;
  /* background: #f4f4f4; */
  /* min-height: 100%; */
  background: #f4f4f4;
}
.addressSave {
  position: absolute;
  top: 0;
  height: 50px;
  line-height: 50px;
  right: 20px;
}
/* .el-form-item {
  height: 46px;
  background: #ffffff;
} */
.unit {
    height: 46px;
    line-height: 48px;
    border-bottom: #f4f4f4 solid 1px;
    background: #ffffff;
    overflow: hidden;
}
.unit:nth-child(2) {
    margin-bottom: 8px;
}
.unit input {
    color: #9B9B9B;
    font-size: 12px;
    border: 0;
    text-align: left;
    float: left;
    outline: 0;
    height: 30px;
    line-height: 30px;
    padding: 8px 0 0 12px;
    width: 2.8rem;
}
.unit label {
    float: left;
    color: #333333;
    font-size: 14px;
    padding-left: 12px;
}
.unit:nth-child(4) input {
    height: 48px;
    padding: 0 0 0 12px;
}
.addaddress .el-icon-arrow-right {
    float: right;
    padding: 15px 10px 10px;
}
</style>

