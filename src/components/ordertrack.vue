<template>
    <div>
        <div class="ms_content">
            <div class="titNews">
                {{data.Logistics_company}}{{data.mail_no}}
                <span
                    class="iconCopy"
                    title="复制单号"
                    :data-clipboard-text="orderCode"
                    @click="copy"
                ></span>
            </div>
            <div class="orderTrackContent">
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in data.list"
                        :key="index"
                        :icon="activity.icon"
                        :type="activity.type"
                        :color="activity.color"
                        :size="activity.size"
                    >
                        <span v-if="index==0" class="icontimeline"></span>
                        <span>{{activity.content}}</span>
                        <p>{{activity.address}}</p>
                        <div class="time">
                            <i>{{activity.timestamp.substring(0, activity.timestamp.indexOf(' '))}}</i>
                            <br />
                            <em>{{activity.timestamp.substring(activity.timestamp.indexOf(' '), activity.timestamp.length)}}</em>
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
        <AlertBox :alertBox="alertBox.visible" @close="alertBox.visible=false">{{alertBox.tip}}</AlertBox>
    </div>
</template>

<script>
import Cookie from "js-cookie";
import AlertBox from "./alertbox";
import Clipboard from "clipboard";
import { logisticsinfo } from "@/api/ordertrack";
export default {
    data() {
        return {
            alertBox: {
                visible: false,
                tip: ""
            },
            orderCode: this.$route.query.orderCode,
            
            data: {
                list: [
                    // {
                    //     "time": "2020-05-09 19:12:08",
                    //     "desc": "【宁波市】浙江鄞州KH公司小港服务部 已揽收"
                    // },
                    // {
                    //     "time": "2020-05-09 20:51:53",
                    //     "desc": "【宁波市】已到达 浙江宁波分拨中心"
                    // },
                    // {
                    //     "time": "2020-05-09 21:01:41",
                    //     "desc": "【宁波市】已离开 浙江宁波分拨中心；发往 京西地区包"
                    // },
                    // {
                    //     "time": "2020-05-09 21:29:13",
                    //     "desc": "【宁波市】已离开 浙江宁波分拨中心；发往 北京分拨中心"
                    // },
                    // {
                    //     "time": "2020-05-10 21:17:40",
                    //     "desc": "【北京市】已到达 北京分拨中心"
                    // },
                    // {
                    //     "time": "2020-05-10 21:57:21",
                    //     "desc": "【北京市】已离开 北京分拨中心；发往 北京海淀区中关村西北区公司"
                    // },
                    // {
                    //     "time": "2020-05-11 07:54:23",
                    //     "desc": "【北京市】北京海淀区中关村西北区公司派件员：贾荣跃 电话：17610655872 当前正在为您派件"
                    // },
                    // {
                    //     "time": "2020-05-11 12:34:06",
                    //     "desc": "【北京市】您的快件已签收，签收人：二华联，如有问题请电联快递员：贾荣跃【17610655872】，投诉电话：010-58545550。起早摸黑不停忙，如有不妥您见谅，好评激励我向上，求个五星暖心房感谢使用韵达快递，期待再次为您服务"
                    // }
                ],
                logistics_status: "",
                mail_no: "",
                Logistics_company: ""
            },
        };
    },
    components: {
        AlertBox
    },
    created() {
        this.logisticsinfoFunc();
    },
    methods: {
        copy() {
            let that = this;
            var clipboard = new Clipboard(".iconCopy");
            clipboard.on("success", e => {
                that.alertBoxVisible = true;

                clipboard.destroy();
            });
            clipboard.on("error", e => {
                // 不支持复制
                console.log("该浏览器不支持自动复制");
                // 释放内存
                clipboard.destroy();
            });
        },
        logisticsinfoFunc() {
            let that = this;
            let query = this.$route.query;
            let data = {
                orderCode: query.orderCode
            };
            that.data.list = that.dataeidt(that.data.list);
            logisticsinfo(data)
                .then(function(res) {
                    if (!!res && res.code == 20000) {
                            that.data = res.data;
                            that.data.list = that.dataeidt(that.data.list);
                    } else if (!!res && res.code == 113005) {
                        that.alertBox = {
                            visible: true,
                            tip: res.message
                        };

                        localStorage.removeItem("moon_email");
                        localStorage.removeItem("onemoreobj");
                        setTimeout(function() {
                            that.$router.push("/login");
                        }, 1000);
                    } else {
                        that.alertBox = {
                            visible: true,
                            tip: res.message
                        };
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        dataeidt(data) {
            data = data.reverse();
            let dataNew = [];

            for (var i = 0; i < data.length; i++) {
                console.log(i);
                var obj = {};
                if (i == 0) {
                    obj = {
                        content: data[i].desc,
                        address: "",
                        timestamp: data[i].time,
                        type: "primary",
                        color: "#ffffff"
                    };
                } else {
                    obj = {
                        content: data[i].desc,
                        address: "",
                        timestamp: data[i].time
                    };
                }
                dataNew.push(obj);
            }
            return dataNew;
        }
    }
};
</script>

<style scoped>
.ms_content {
    font-size: 14px;
    overflow: hidden;
}
.titNews {
    height: 54px;
    line-height: 54px;
    background: #f4f4f4;
    font-size: 16px;
    text-align: left;
    font-weight: 400;
    padding: 0 0 0 17px;
    overflow: hidden;
    width: 100%;
}
.iconCopy {
    background-image: url(../assets/img/iconCopy.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 0 0 10px;
    width: 15px;
    height: 15px;
    display: inline-block;
}
.orderTrackContent {
    padding: 29px 0 0;
    overflow: hidden;
}
.el-timeline {
    text-align: left;
    float: left;
    padding: 0 0 0 0.87rem;
}
.el-timeline-item {
    min-height: 65px;
}
.el-timeline-item__content span {
    padding: 0 15px 0 0;
    box-sizing: border-box;
    display: block;
    font-size: 14px;
    color: #9b9b9b;
}
.el-timeline-item__content p {
    padding: 0;
    margin: 0;
    font-size: 12px;
    color: #9b9b9b;
}
.el-timeline-item:nth-child(1) .el-timeline-item__content span {
    color: #3C8CFF;
}
.el-timeline-item:nth-child(1) .el-timeline-item__content p {
    color: #3C8CFF;
}
.el-timeline-item__content .time {
    position: absolute;
    top: -5px;
    left: -0.8rem;
}
.el-timeline-item:nth-child(1) .el-timeline-item__content .time {
    top: 0;
}
.el-timeline-item:nth-child(1) .el-timeline-item__content .time i {
    color: #333333;
}
.el-timeline-item:nth-child(1) .el-timeline-item__content .time em {
    color: #333333;
}
.el-timeline-item__content .time i {
    font-style: normal;
    color: #9b9b9b;
    font-size: 14px;
    float: right;
}
.el-timeline-item__content .time em {
    float: right;
    font-style: normal;
    color: #9b9b9b;
    font-size: 12px;
}
.icontimeline {
    background-image: url(../assets/img/timeline.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 0 0 -0.35rem;
    width: 24px;
    height: 24px;
    display: inline-block;
    float: left;
}
</style>

