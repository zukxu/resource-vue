<template>
  <div id="AddResource">
    <a-form-model :label-col="labelCol" :model="tempForm" :rules="rules" :wrapper-col="wrapperCol" ref="childForm">
      <a-form-model-item label="资源名称" prop="name">
        <a-input v-model="tempForm.name"/>
      </a-form-model-item>
      <a-form-model-item label="资源分类">
        <a-select
          :filter-option="filterOption"
          :value="tempForm.typeId"
          @change="handleChange"
          option-filter-prop="children"
          placeholder="请选择分类"
          show-search
        >
          <a-select-option :key="d.value" :value="d.value" v-for="d in typeList">{{d.text}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="资源地址" prop="content">
        <a-input type="textarea" v-model="tempForm.content"/>
      </a-form-model-item>
      <a-form-model-item label="资源描述">
        <a-input type="textarea" v-model="tempForm.remark"/>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-space>
          <a-button @click="confirm" type="primary">
            确认
          </a-button>
          <a-button @click="()=>{this.$emit('addCancelEvent')}">
            取消
          </a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>

export default {
  name: 'AddResource',
  props: {
    resource: {
      type: Object,
      default: () => ({})
    },
    typeList: {
      type: Array,
      default: () => []
    }
  },
  created() {
    //this.typeInfo()
    if (this.resource.isUpd !== undefined) {
      this.tempForm = this.resource
    }
  },
  data() {
    return {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      tempForm: {},
      //typeList: [],
      rules: {
        name: [
          {required: true, message: '请输入资源名称', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入资源地址', trigger: 'change'}
        ],
      }
    }
  },
  methods: {
    //确认
    confirm() {
      console.log(this.tempForm)
      this.tempForm.isUpd = this.resource.isUpd !== undefined
      this.$emit('addConfirmEvent', this.tempForm)
    },
    //查询分类
    /* typeInfo() {
       listType().then((res) => {
         console.log(res.data)
         const result = res.data.data.records
         result.forEach((r) => {
           this.typeList.push({
             value: r.id,
             text: r.typeName
           })
         })
       })
     },*/
    //选择分类
    handleChange(value) {
      console.log(`selected ${value}`)
      this.tempForm.typeId = value
    },
    //筛选
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
  },
}
</script>

<style lang="less" scoped>
#AddResource{

}
</style>
