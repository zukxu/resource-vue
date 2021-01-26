<template>
  <div id="Type">
    <a-card :bordered="false" :style="{ height: '100%' }">
      <a-row>
        <!--分类树-->
        <a-col :span="10">
          <a-tree
            :replaceFields="replaceFields"
            :tree-data="typeList"
            @select="onSelect"
            defaultExpandAll
            show-icon>
            <a-icon slot="switchIcon" type="tags"/>
          </a-tree>
        </a-col>
        <a-col :span="12">
          <!--按钮组-->
          <a-space>
            <a-space>
              <a-button @click="openDrawer" type="primary">
                新增分类
              </a-button>
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
                    :style="{width:'100%'}"
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
                    @preview="handlePreview"
                    accept="image/*"
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
      <!--新增分类-->
      <a-drawer
        :body-style="{ paddingBottom: '80px' }"
        :visible="visible"
        :width="420"
        @close="onClose"
        title="新增分类"
      >
        <a-form-model :model="addForm" :rules="typeRules" ref="typeRuleForm">
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
              @preview="handlePreview"
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
    <!--预览-->
    <a-modal :footer="null" :visible="previewVisible" @cancel="handleCancel">
      <img :src="previewImage" alt="预览" style="width: 100%"/>
    </a-modal>
  </div>
</template>
<script>
import {addType, delType, listType, updType} from '@/service/type'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  data() {
    return {
      typeList: [],
      //树形组件配置
      replaceFields: {children: 'children', title: 'typeName', key: 'id'},
      //图标上传列表
      typeIconList: [],
      addIconList: [],
      previewVisible: false,
      previewImage: '',

      typeForm: {
        id: undefined,
        typeName: undefined,
        sort: '',
        pics: ''
      },
      addForm: {
        id: undefined,
        typeName: undefined,
        parentId: undefined,
        parentName: undefined,
        sort: '',
        pics: ''
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
      console.log(file)
      if (file.status === 'done') {
        //获取上传完成返回的对象名
        console.log(file)
        this.typeForm.pics = file.response.data.url
      }
      if (file.status === 'removed') {
        this.typeForm.pics = undefined
      }
    },
    //上传
    handleAddIcon({file, fileList}) {
      this.addIconList = fileList
      if (file.status === 'done') {
        //获取上传完成返回的对象名
        console.log(file)
        this.addForm.pics = file.response.data.url
      }
      if (file.status === 'removed') {
        this.addForm.pics = undefined
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    //选中查看详情
    onSelect(checkedKeys, info) {
      this.disabled = true
      this.typeForm = JSON.parse(JSON.stringify(info.node.dataRef))
      this.addForm.parentName = this.typeForm.typeName
      //重新置空
      this.typeIconList = []
      if (this.typeForm.pics !== undefined) {
        this.typeIconList.push({
          uid: this.typeForm.id,
          url: this.minio + this.typeForm.pics,
          name: 'image' + 1,
          status: 'done'
        })
      }
    },
    openDrawer() {
      this.visible = true
      this.addIconList = []
    },
    //确认添加分类
    addType() {
      console.log(this.addForm)
      this.$refs['typeRuleForm'].validate(val => {
        console.log(val)
        if (val) {
          if (this.addForm.pics.length < 1) {
            this.addForm.pics = undefined
          }
          addType(this.addForm).then(res => {
            console.log(res.data)
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
        let list = res.data.data
        this.typeList = this.setIcon(list)
        this.pageLoading = false
      }).catch(() => {
        this.$message.error('请求失败')
      })
    },

    setIcon(dataArray) {
      let res = []
      dataArray.forEach(item => {
        item.scopedSlots = {icon: 'switchIcon'}
        res.push(item)
        if (!item.children || !item.children.length) return
        this.setIcon(item.children)
      })
      return res
    },
  }
}
</script>
<style lang="less" scoped>
#Type{

}
</style>
