<template>
  <div id="Type">
    <a-card :bordered="false" :style="{ height: '100%' }">
      <a-row>
        <!--分类树-->
        <a-col :span="10">
          <a-tree :replaceFields="replaceFields" :show-icon=true :tree-data="typeList" @select="onSelect">
            <a-icon slot="icon" type="tags"/>
          </a-tree>
        </a-col>
        <!--按钮组-->
        <a-col :span="12">
          <a-space>
            <a-space>
              <a-button @click="visible = true" type="primary">
                新增顶级分类
              </a-button>
              <a-button
                @click=";(visibleTow = true),(typeIconList = [])"
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
              <a-popconfirm @confirm="confirm" cancel-text="否" ok-text="是" title="确定要删除吗?">
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
                    :disabled="disabled"
                    :file-list="typeIconList"
                    :multiple="false"
                    @change="handleUploadIcon"
                    accept="image/*"
                    action="http://localhost:8099/minio/"
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
              <a-button :style="{ marginRight: '8px' }" @click="onClose">
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
        :visible="visible"
        :width="720"
        @close="onClose"
        title="新增顶级分类"
      >
        <a-form-model :model="addForm" :rules="typeRules" ref="typeRuleForm">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="分类名称" prop="typeName">
                <a-input placeholder="请输入分类名称" v-model.trim="addForm.typeName"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="分类排序" prop="sort">
                <a-input-number placeholder="请输入分类排序" v-model.trim="addForm.sort"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="分类图标">
                <a-upload
                  :file-list="typeIconList"
                  @change="handleUploadIcon"
                  action="/minio/"
                  list-type="picture-card"
                  name="file"
                >
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
          <div
            :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#ffffff',
            textAlign: 'right',
            zIndex: 1
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
      <!--增加子集-->
      <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        :visible="visibleTow"
        :width="720"
        @close="onClose"
        title="新增子级分类"
      >
        <a-form-model :model="addForm" :rules="typeRules" ref="typeRuleForm">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="分类名称" prop="typeName">
                <a-input placeholder="请输入分类名称" v-model="addForm.typeName"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="分类排序" prop="sort">
                <a-input-number placeholder="请输入分类排序" v-model.trim="addForm.sort"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="分类图标">
                <a-upload
                  :file-list="typeIconList"
                  @change="handleUploadIcon"
                  action="/minio/"
                  list-type="picture-card"
                  name="file"
                >
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

          <div
            :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#ffffff',
            textAlign: 'right',
            zIndex: 1
          }">
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
              取消
            </a-button>
            <a-button @click="addTypeTow" type="primary">
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
      typeForm: {
        id: undefined,
        typeName: undefined,
        sort: '',
        icon: ''
      },
      addForm: {
        id: undefined,
        typeName: undefined,
        sort: '',
        icon: ''
      },
      disabled: true,
      pageLoading: true,
      visible: false,
      typeRules: {
        title: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {required: true, max: 5, message: '最大长度为5', trigger: 'blur'}
        ],
        sort: [{required: true, message: '请输入分类排序', trigger: 'blur'}]
      },
    }
  },
  created() {
    this.pageLoading = true
    this.listType()
  },
  methods: {
    //上传
    handleUploadIcon({file, fileList}) {
      this.typeIconList = fileList
      if (file.status == 'done') {
        //获取上传完成返回的对象名
        this.addForm.img = file.response.data.bucketName + '/' + file.response.data.fileName
        this.typeForm.img = file.response.data.bucketName + '/' + file.response.data.fileName
      }
    },
    //确认删除
    confirm(e) {
      console.log(e)
      this.delType()
    },
    //删除
    delType() {
      console.log('---------------------', this.typeForm)
      delType({id: this.typeForm.id}).then(res => {
        if (res.status === 1) {
          this.$message.success('删除成功')
          this.pageLoading = true
          this.onClose()
          this.listType()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    //选中查看详情
    onSelect(checkedKeys, info) {
      console.log(checkedKeys)
      console.log(info)
      console.log(info.node.dataRef)
      this.typeForm = JSON.parse(JSON.stringify(info.node.dataRef))
      //重新置空
      this.typeIconList = []
      this.typeIconList.push(this.typeForm.icon)
      console.log(this.typeForm)
      console.log(this.typeIconList)
    },
    //添加新的子集
    addTypeTow() {
      this.$refs.typeRuleForm.validate(val => {
        if (val) {
          this.addForm.parentId = this.typeForm.id
          addType(this.addForm).then(res => {
            if (res.status === 1) {
              this.$message.success('添加成功')
              this.pageLoading = true
              this.onClose()
              this.listType()

            } else if (res.status === 2) {
              this.$message.success(res.msg)
            } else {
              this.$message.error('添加失败')
            }
          })
        }
      })
    },
    //添加分类
    addType() {
      this.$refs.typeRuleForm.validate(val => {
        if (val) {
          addType(this.addForm).then(res => {
            if (res.status === 1) {
              this.$message.success('添加成功')
              this.pageLoading = true
              this.onClose()
              this.listType()
            } else if (res.status === 2) {
              this.$message.success(res.msg)
            } else {
              this.$message.error('添加失败')
            }
          })
        }
      })
    },
    //更新
    updType() {
      this.$refs.typeRuleForm.validate(val => {
        if (val) {
          console.log(this.typeForm)
          updType(this.typeForm).then(res => {
            if (res.status === 1) {
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
    //关闭drawer
    onClose() {
      this.visible = false
      this.disabled = true
      this.typeForm = {
        id: undefined,
        typeName: undefined
      }
      this.addForm = {
        typeName: undefined,
        parentId: undefined
      }
    },
    //初始化
    listType() {
      listType().then(res => {
        this.typeList = res.data.data.records
        this.pageLoading = false
      })
        .catch(() => {
          this.$message.error('请求失败')
        })
    }
  }
}
</script>
<style lang="less" scoped>
#Type{
  .ant-input-number{
    width: 100%;
  }

}
</style>
