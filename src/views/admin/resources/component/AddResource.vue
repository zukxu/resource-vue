<template>
  <div id="AddResource">
    <a-modal
      :maskClosable="false"
      :title="title"
      :visible="isShow"
      @cancel="cancel"
      @ok="confirm"
    >
      <a-form-model :label-col="labelCol" :model="tempForm" :rules="rules" :wrapper-col="wrapperCol" ref="tempForm">
        <a-form-model-item label="资源名称" prop="name">
          <a-input placeholder="请输入资源名称" v-model="tempForm.name"/>
        </a-form-model-item>
        <a-form-model-item label="资源分类">
          <a-select
            :filter-option="filterOption"
            :value="typeId"
            @change="handleChange"
            option-filter-prop="children"
            placeholder="请选择分类"
            show-search
          >
            <a-select-option :key="d.value" :value="d.value" v-for="d in typeList">{{d.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="资源地址" prop="content">
          <a-input placeholder="请输入资源地址" type="textarea" v-model="tempForm.content"/>
        </a-form-model-item>
        <a-form-model-item label="资源描述">
          <a-input type="textarea" v-model="tempForm.remark"  placeholder="请输入资源描述"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'AddResource',
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    resource: {
      type: Object,
      default: null
    },
    title: {
      type: String,
    },
    typeList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    resource() {
      this.tempForm = JSON.parse(JSON.stringify(this.resource))
      this.typeId=this.tempForm.typeId
    }
  },
  data() {
    return {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      tempForm: {},
      typeId: undefined,
      rules: {
        name: [
          {required: true, message: '请输入资源名称', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入资源地址', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    //确认
    confirm() {
      this.$refs.tempForm.validate(valid => {
        if (valid) {
          let isEquals = JSON.stringify(this.resource) === JSON.stringify(this.tempForm)
          if (isEquals) {
            this.$message.warn('未做任何修改')
            return
          }
          this.tempForm.isUpd = this.resource.isUpd !== undefined
          this.$emit('callBackUpdateForm', this.tempForm)
        }
      })
    }
    ,
    //取消
    cancel() {
      this.tempForm = JSON.parse(JSON.stringify(this.resource))
      this.typeId = this.tempForm.typeId
      this.$emit('callBackUpdateForm', null)
      this.$refs.tempForm.resetFields()
    },
    //清空表单
    resetForm() {
      this.tempForm = {
        name: undefined,
        typeId: undefined,
        content: undefined,
        remark: undefined
      }
      this.$refs.tempForm.resetFields()
    }
    ,
    //选择分类
    handleChange(value) {
      this.typeId = value
      this.tempForm.typeId = this.typeId
    }
    ,
    //筛选
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
    ,
  },
}
</script>

<style lang="less" scoped>
#AddResource{

}
</style>
