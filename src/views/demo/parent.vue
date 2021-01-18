<template>
  <div id="parent">
    <button @click="handleAdd">新增</button>

    <hr/>
    <hr/>
    <div :key="index" v-for="(stu,index) in student">
      <h1>姓名：{{stu.name}}</h1>
      <h1>年龄：{{stu.age}}</h1>
      <h1>性别：{{stu.sex}}</h1>
      <button @click="handleUpd(index)">修改</button>
      <button @click="handleDel(index)">删除</button>
      <hr/>
    </div>
    <child :student="childStu" @cancel="cancelChild" @confirm="handleChild" v-if="isShow"></child>
  </div>
</template>
<script>
import child from './component/child'

export default {
  data() {
    return {
      isShow: false,
      student: [{
        name: '张三',
        age: 21,
        sex: '男',
        isUpd: true
      }, {
        name: '李四',
        age: 25,
        sex: '女',
        isUpd: true
      }],
      childStu: {}
    }
  },
  methods: {
    handleChild(val) {
      console.log(val)
      console.log(val.isUpd)
      if (val.isUpd === true) {
        Object.assign(this.student[val.index], val)
      } else {
        this.student.push(val)
      }
      console.log(this.student)
      this.isShow = false
    },
    cancelChild() {
      this.isShow = false
    },
    handleAdd() {
      this.childStu = {}
      this.isShow = true
    },
    handleUpd(index) {
      this.childStu = this.student[index]
      this.childStu.index = index
      this.isShow = true
    },
    handleDel(index) {
      let studentElement = this.student[index]
      console.log(studentElement)
      if (studentElement !== undefined) {
        this.student.splice(index, 1)
      }
    }
  },
  components: {
    child
  }
}
</script>
<style scoped>
#parent{
}
</style>
