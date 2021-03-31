<template>
  <div id="DashBoard">
    <a-badge :count="unReadCount" :overflowCount="99">
      <a-button type="link" @click="showUnRead">消息</a-button>
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
import remindMP3 from '@/assets/voice/remind.mp3'

export default {
  name: 'DashBoard',
  props: {},
  components: {},
  created() {
    this.initWebsocket()
  },
  data() {
    return {
      unReadCount: 0,
      socket: '',
      connectCount: 0,
      userRole: null,
      visible: true
    }
  },
  methods: {
    handleOk() {
      this.voiceRemind(0)
      this.visible = false
    },
    voiceRemind(val) {
      let audio = new Audio(remindMP3)
      audio.volume = Number(val)
      console.log(audio, 'audio')
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

}
</style>
