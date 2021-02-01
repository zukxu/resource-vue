<template>
  <div id="app">
    <a-config-provider :locale="zhCN">
      <router-view v-wechat-title='$route.meta.title'></router-view>
    </a-config-provider>
  </div>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'

export default {
  data() {
    return {
      zhCN,
    }
  },
}
</script>
<style lang="less">
#app{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100%;
  height: 100%;
}
</style>
