<template>
  <div id="notFound">
    <a-result status="404" sub-title="Sorry, the page you visited does not exist." title="404">
      <template #extra>
        <a-button @click="goHome" type="primary">
          返回首页
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
export default {
  name: 'notFound',
  props: {},
  components: {},
  created() {
  },
  data() {
    return {}
  },
  methods: {
    goHome() {
      this.$router.replace({path:'/'})
    }
  },
}
</script>

<style lang="less" scoped>
#notFound{

}
</style>
