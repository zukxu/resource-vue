<template>
  <div id="DashBoard">
    <a-badge :count="unReadCount" :overflowCount="99">
      <div id="echarts-pie" ref="chart"></div>
      <a-modal :closable="false" :keyboard="false" :maskClosable="false" :visible="visible" title="欢迎">
        欢迎来到资源管理系统
        <!-- 加上插槽，显示一个按钮 -->
        <div slot="footer">
          <a-button type="primary" @click="handleOk">确定</a-button>
        </div>
      </a-modal>
    </a-badge>
  </div>
</template>

<script>
const remindMP3 = require('@/assets/voice/remind.mp3');
const echarts = require('echarts');
import {countType} from '@/service/type'

export default {
  name: 'DashBoard',
  props: {},
  components: {},
  created() {
    this.initWebsocket()
    this.countType()
  },
  mounted() {
    echarts.init(this.$refs.chart).setOption(this.echartsPie)
  },
  data() {
    return {
      unReadCount: 0,
      socket: '',
      connectCount: 0,
      userRole: null,
      visible: true,
      echartsPie: {
        title: {
          text: '资源分类统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          bottom: 10
        },
        series: {
          name: '资源分类',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [{
            value: 65,
            name: 'PS'
          },
            {
              value: 55,
              name: '前端HTML'
            },
            {
              value: 85,
              name: '备战考研'
            },
            {
              value: 75,
              name: '办公技能'
            },
            {
              value: 100,
              name: '学习能力'
            }
          ].sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      }
    }
  },
  methods: {
    countType() {
      countType().then((res) => {
        this.echartsPie.series.data=res.data.data
        echarts.init(this.$refs.chart).setOption(this.echartsPie)
      })
    },
    handleOk() {
      this.voiceRemind(0)
      this.visible = false
    },
    voiceRemind(val) {
      let audio = new Audio(remindMP3)
      audio.volume = Number(val)
      // 播放提示音
      audio.play()
    },
    showUnRead() {
      console.log(this.unReadCount)
    },
    initWebsocket() {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        const path = 'ws://localhost:8099/websocket/123'
        // 实例化socket
        this.socket = new WebSocket(path)
        // 监听socket连接
        this.socket.onopen = this.onOpen
        // 监听socket错误信息
        this.socket.onerror = this.onError
        // 监听socket消息
        this.socket.onmessage = this.onMessage
        // 关闭socket消息
        this.socket.onclose = this.onClose
      }
    },
    onOpen() {
      console.log('打开socket连接')
    },
    onMessage(msg) {
      console.log(msg.data)
      if (msg.data == '连接成功') {
        //执行业务代码
        this.voiceRemind(1)
        this.connectCount = 0
      }
    },
    onError() {
      console.log('连接错误')
    },
    onClose(e) {
      console.log(e, 'socket已经关闭')
      //重练操作
      if (this.connectCount < 3) {
        this.connectCount++
        this.initWebsocket()
      } else {
        console.log(e, 'socket连接3次都失败了')
      }
    },
    onSend(params) {
      this.socket.send(params)
    },
  },
}
</script>

<style lang="less" scoped>
#DashBoard {
  text-align: center;
  #echarts-pie {
    width: 600px;
    height: 400px;
  }
}
</style>
