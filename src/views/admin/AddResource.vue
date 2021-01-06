<template>
  <div class="AddResource">
    <a-form-model :label-col="labelCol" :model="form" :wrapper-col="wrapperCol">
      <a-form-model-item label="资源名称">
        <a-input v-model="form.name"/>
      </a-form-model-item>
      <a-form-model-item label="资源分类">
        <a-select
          :filter-option="filterOption"
          :value="form.typeId"
          @change="handleChange"
          option-filter-prop="children"
          placeholder="请选择分类"
          show-search
        >
          <a-select-option :key="d.value" :value="d.value" v-for="d in typeList">{{d.text}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="资源地址">
        <a-input type="textarea" v-model="form.content"/>
      </a-form-model-item>
      <a-form-model-item label="资源描述">
        <a-input type="textarea" v-model="form.remark"/>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button @click="onSubmit" type="primary">
          添加
        </a-button>
        <a-button style="margin-left: 10px;">
          取消
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import {addRes} from '@/service/resource'
import {listType} from '@/service/type'

export default {
  name: 'Resource',
  props: {},
  components: {},
  created() {
    this.typeInfo()
  },
  data() {
    return {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      form: {
        name: '',
        typeId: undefined,
        content: '',
        remark: ''
      },
      page: {
        current: 1,
        size: 10,
        index: '',
        fields: '',
        total: 100
      },
      typeList: []
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!', this.form)
      if (this.form.name.length < 1 || this.form.content.length < 1) {
        this.$message.error('请输入正确的内容')
        return
      }
      addRes(this.form).then((res) => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.form = {
            name: '',
            typeId: undefined,
            content: '',
          }
          this.$message.success('Success')
        } else {
          this.$message.error('Fail')
        }
      })
    },
    typeInfo() {
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
    },
    handleChange(value) {
      console.log(`selected ${value}`)
      this.form.typeId = value
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
  },
}
</script>

<style lang="less" scoped>
.AddResource{

}
</style>
