<template>
  <div id="Type">
    <a-card :bordered="false" :style="{ height: '100%' }">
      <a-row>
        <!--分类树-->
        <a-col :span="10">
          <a-tree :replaceFields="replaceFields" :tree-data="typeList"
                  @select="onSelect">
            <a-icon slot="icon" type="tags"/>
          </a-tree>
        </a-col>
        <!--按钮组-->
        <a-col :span="12">
          <a-space>
            <a-space>
              <a-button @click="openDrawer(1)" type="primary">
                新增顶级分类
              </a-button>
              <a-button
                @click="openDrawer(2)"
                type="primary"
                v-if="typeForm.id"
              >
                新增子级分类
              </a-button>
            </a-space>
            <a-space>
              <a-button @click="disabled = false" type="primary" v-if="typeForm.id">
                修改
              </a-button>
              <a-popconfirm @confirm="delType" cancel-text="否" ok-text="是" title="确定要删除吗?">
                <a-button type="danger" v-if="typeForm.id">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </a-space>
          <!--表单详情-->
          <a-form-model :model="typeForm" :rules="typeRules" ref="typeRuleForm">
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="分类名称" prop="title">
                  <a-input :disabled="disabled" placeholder="请输入分类名称" v-model="typeForm.typeName"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="分类排序" prop="sort">
                  <a-input-number
                    :disabled="disabled"
                    :min=0
                    placeholder="请输入分类排序"
                    v-model.trim="typeForm.sort"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-model-item label="分类图标">
                  <a-upload
                    :action="basic+'/minio/'"
                    :disabled="disabled"
                    :file-list="typeIconList"
                    :multiple="false"
                    @change="handleUpdIcon"
                    accept="image/*"
                    list-type="picture-card"
                    name="file"
                  >
                    <!--@preview="handlePreview"-->
                    <div v-if="typeIconList.length < 1">
                      <a-icon type="plus"/>
                      <div class="ant-upload-text">
                        上传图标
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>
            </a-row>
            <div v-if="disabled === false">
              <a-button :style="{ marginRight: '8px' }" @click="disabled = true">
                取消
              </a-button>
              <a-button @click="updType" type="primary">
                确定
              </a-button>
            </div>
          </a-form-model>
        </a-col>
      </a-row>
      <!--顶级分类-->
      <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        :title="addTitle"
        :visible="visible"
        :width="420"
        @close="onClose"
      >
        <a-form-model :model="addForm" :rules="typeRules" ref="typeRuleForm">
          <a-form-model-item label="父分类名称" v-if="visibleChild">
            <a-input disabled v-model.trim="addForm.parentName"/>
          </a-form-model-item>
          <a-form-model-item label="分类名称" prop="typeName">
            <a-input placeholder="请输入分类名称" v-model.trim="addForm.typeName"/>
          </a-form-model-item>
          <a-form-model-item label="分类排序" prop="sort">
            <a-input-number :min=0 :style="{width:'100%'}" placeholder="请输入分类排序" v-model.trim="addForm.sort"/>
          </a-form-model-item>
          <a-form-model-item label="分类图标">
            <a-upload
              :action="basic+'/minio/'"
              :file-list="addIconList"
              @change="handleAddIcon"
              list-type="picture-card"
              name="file"
            >
              <div v-if="addIconList.length < 1">
                <a-icon type="plus"/>
                <div class="ant-upload-text">
                  上传图标
                </div>
              </div>
            </a-upload>
          </a-form-model-item>
          <div :style="{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#ffffff',
                  textAlign: 'right',
                  zIndex: 1,
              }"
          >
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
              取消
            </a-button>
            <a-button @click="addType" type="primary">
              确定
            </a-button>
          </div>
        </a-form-model>
      </a-drawer>
    </a-card>
  </div>
</template>
<script>
import {addType, delType, listType, updType} from '@/service/type'

export default {
  data() {
    return {
      typeList: [],
      //树形组件配置
      replaceFields: {children: 'children', title: 'typeName', key: 'id'},
      //图标上传列表
      typeIconList: [],
      addIconList: [],
      typeForm: {
        id: undefined,
        typeName: undefined,
        sort: '',
        icon: ''
      },
      addForm: {
        id: undefined,
        typeName: undefined,
        parentId: undefined,
        parentName: undefined,
        sort: '',
        icon: ''
      },
      disabled: true,
      pageLoading: true,
      visible: false,
      visibleChild: false,
      typeRules: {
        typeName: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
        sort: [{required: true, message: '请输入分类排序', trigger: 'blur'}]
      },
      addTitle: '新增顶级分类'
    }
  },
  created() {
    this.pageLoading = true
    this.listType()
  },
  methods: {
    //修改
    handleUpdIcon({file, fileList}) {
      this.typeIconList = fileList
      if (file.status === 'done') {
        //获取上传完成返回的对象名
        console.log(file)
        this.typeForm.icon = file.response.data.url
      }
    },
    //上传
    handleAddIcon({file, fileList}) {
      this.addIconList = fileList
      if (file.status === 'done') {
        //获取上传完成返回的对象名
        console.log(file)
        this.addForm.icon = file.response.data.url
      }
    },

    //选中查看详情
    onSelect(checkedKeys, info) {
      this.disabled = true
      this.typeForm = JSON.parse(JSON.stringify(info.node.dataRef))
      this.addForm.parentName = this.typeForm.typeName
      //重新置空
      this.typeIconList = []
      if (this.typeForm.icon !== undefined) {
        this.typeIconList.push({
          uid: this.typeForm.id,
          url: this.minio + this.typeForm.icon,
          name: 'image' + 1,
          status: 'done'
        })
      }
    },
    openDrawer(val) {
      this.visible = true
      this.addIconList = []
      if (val === 1) {
        this.addTitle = '新增顶级分类'
      } else {
        this.addTitle = '新增子级分类'
        this.visibleChild = true
        this.addForm.parentId = this.typeForm.id
      }
    },
    //确认添加分类
    addType() {
      console.log(this.addForm)
      this.$refs['typeRuleForm'].validate(val => {
        if (val) {
          if (this.addForm.icon.length < 1) {
            this.addForm.icon = undefined
          }
          addType(this.addForm).then(res => {
            if (res.data.code === 1) {
              this.$message.success('添加成功')
              this.pageLoading = true
              this.onClose()
              this.listType()
            } else {
              this.$message.error('添加失败')
            }
          })
        }
      })
    },
    //更新
    updType() {
      this.$refs['typeRuleForm'].validate(val => {
        if (val) {
          updType(this.typeForm).then(res => {
            if (res.data.code === 1) {
              this.$message.success('修改成功')
              this.pageLoading = true
              this.onClose()
              this.listType()
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      })
    },

    //删除
    delType() {
      delType(this.typeForm.id).then(res => {
        if (res.data.code === 1) {
          this.$message.success('删除成功')
          this.pageLoading = true
          this.onClose()
          this.listType()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    //关闭drawer
    onClose() {
      this.visible = false
      this.visibleChild = false
      this.disabled = true
      this.typeForm = {
        id: undefined,
        typeName: undefined
      }
      this.addForm = {
        typeName: undefined,
        parentId: undefined,
        parentName: undefined
      }
      this.typeIconList = []
      this.$refs['typeRuleForm'].resetFields()
    },
    //初始化
    listType() {
      listType().then(res => {
        this.typeList = res.data.data
        this.pageLoading = false
      })
        .catch(() => {
          this.$message.error('请求失败')
        })
    },
  }
}
</script>
<style lang="less" scoped>
#Type{

}
</style>
