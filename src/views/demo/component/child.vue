<template>
  <div id="child">
    <form>
      姓名: <input name="name" type="text" v-model="tempObject.name">
      年龄: <input name="age" type="text" v-model="tempObject.age">
      性别: <input name="sex" type="text" v-model="tempObject.sex">
      <button @click="confirm" type="button">确认</button>
      <button @click="cancel" type="button">取消</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'child',
  data() {
    return {
      tempObject: {},
    }
  },
  props: {
    student: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    console.log(this.student.isUpd !== undefined)
    if (this.student.isUpd !== undefined) {
      this.tempObject = JSON.parse(JSON.stringify(this.student))
    }
  },
  methods: {
    confirm() {
      this.tempObject.isUpd = this.student.isUpd !== undefined
      console.log(this.tempObject)
      this.$emit('confirm', this.tempObject)
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style scoped>
#child{
  background-color: #666666;
  margin-top: 50px;
}
</style>
