<template>
  <div id="Type">
    <a-card :bordered="false" :style="{ height: '100%' }">
      <a-row>
        <a-col :span="10">
          <a-tree :replaceFields="replaceFields" :tree-data="typeList" @click="onCheck"/>
        </a-col>
        <a-col :span="12">
          <a-space>
            <a-space>
              <a-button @click="visible = true" type="primary">
                新增顶级分类
              </a-button>
              <a-button
                @click=";(visibleTow = true), (fileListBig = []), (fileListSmall = [])"
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
              <a-popconfirm @cancel="cancel" @confirm="confirm" cancel-text="否" ok-text="是" title="确定要删除吗?">
                <a-button type="danger" v-if="typeForm.id">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </a-space>
          <a-form-model :model="typeForm" :rules="typeRules" ref="typeRuleForm">
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="分类名称" prop="label">
                  <a-input :disabled="disabled" placeholder="请输入分类名称" v-model="typeForm.typeName"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="分类排序" prop="sort">
                  <a-input-number
                    :disabled="disabled"
                    placeholder="请输入分类排序(-1 为首页超值必选)"
                    v-model.trim="typeForm.sort"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-model-item label="分类小图标">
                  <a-upload
                    :disabled="disabled"
                    :file-list="fileListSmall"
                    :headers="uploadHeaders"
                    :multiple="false"
                    @change="handleUploadChangeSmall"
                    action="/oss/file/upload"
                    list-type="picture-card"
                    method="POST"
                    name="file"
                  >
                    <div v-if="fileListSmall.length < 1">
                      <a-icon type="plus"/>
                      <div class="ant-upload-text">
                        上传小图标
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
              </a-col>
              <!-- <a-col :span="12">
                 <a-form-model-item label="分类大图标">
                   <a-upload
                     :disabled="disabled"
                     :file-list="fileListBig"
                     :headers="uploadHeaders"
                     :multiple="false"
                     @change="handleUploadChangeBig"
                     action="/oss/file/upload"
                     list-type="picture-card"
                     method="POST"
                     name="file"
                   >
                     <div v-if="fileListBig.length < 1">
                       <a-icon type="plus"/>
                       <div class="ant-upload-text">
                         上传大图标
                       </div>
                     </div>
                   </a-upload>
                 </a-form-model-item>
               </a-col>-->
            </a-row>
            <div v-if="disabled == false">
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
              <a-form-model-item label="分类名称" prop="label">
                <a-input placeholder="请输入分类名称" v-model.trim="addForm.label"/>
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
              <a-form-model-item label="分类小图标">
                <a-upload
                  :file-list="fileListSmall"
                  :headers="uploadHeaders"
                  :multiple="false"
                  @change="handleUploadChangeSmall"
                  action="/oss/file/upload"
                  list-type="picture-card"
                  method="POST"
                  name="file"
                >
                  <div v-if="fileListSmall.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">
                      上传小图标
                    </div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12">
               <a-form-model-item label="分类大图标">
                 <a-upload
                   :file-list="fileListBig"
                   :headers="uploadHeaders"
                   :multiple="false"
                   @change="handleUploadChangeBig"
                   action="/oss/file/upload"
                   list-type="picture-card"
                   method="POST"
                   name="file"
                 >
                   <div v-if="fileListBig.length < 1">
                     <a-icon type="plus"/>
                     <div class="ant-upload-text">
                       上传大图标
                     </div>
                   </div>
                 </a-upload>
               </a-form-model-item>
             </a-col>-->
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
      </a-drawer
      >
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
              <a-form-model-item label="分类名称" prop="label">
                <a-input placeholder="请输入分类名称" v-model="addForm.label"/>
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
              <a-form-model-item label="分类小图标">
                <a-upload
                  :file-list="fileListSmall"
                  :headers="uploadHeaders"
                  :multiple="false"
                  @change="handleUploadChangeSmall"
                  action="/oss/file/upload"
                  list-type="picture-card"
                  method="POST"
                  name="file"
                >
                  <div v-if="fileListSmall.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">
                      上传小图标
                    </div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <!--<a-col :span="12">
              <a-form-model-item label="分类大图标">
                <a-upload
                  :file-list="fileListBig"
                  :headers="uploadHeaders"
                  :multiple="false"
                  @change="handleUploadChangeBig"
                  action="/oss/file/upload"
                  list-type="picture-card"
                  method="POST"
                  name="file"
                >
                  <div v-if="fileListBig.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">
                      上传大图标
                    </div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>-->
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
import {addType, delType, getTypeById, listType, updType} from '@/service/type'

export default {
  data() {
    return {
      fileListSmall: [],
      fileListBig: [],
      uploadHeaders: {
        Authorization: 'Bearer ' + this.$store.getters.accessToken
      },
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
      visibleTow: false,
      disabled: true,
      replaceFields: {children: 'children', title: 'typeName', key: 'id'},
      typeList: [],
      pageLoading: true,
      visible: false,
      banOnSubmit: false,
      typeListTow: [],
      typeRules: {
        label: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {required: true, max: 5, message: '最大长度为5', trigger: 'blur'}
        ],
        sort: [{required: true, message: '请输入分类排序', trigger: 'blur'}]
      },
      treeData: [
        {title: 'Expand to load', key: '0'},
        {title: 'Expand to load', key: '1'},
        {title: 'Tree Node', key: '2', isLeaf: true}
      ],
      eventKey: undefined,
      copyClickData: {},
      router: '/oss/file/preview/'
    }
  },
  created() {
    this.pageLoading = true
    this.listType()
  },
  methods: {
    handleUploadChangeBig({file, fileList}) {
      this.fileListBig = fileList
      if (file.status == 'done') {
        //获取上传完成返回的对象名
        this.addForm.icon = file.response.data.bucketName + '/' + file.response.data.fileName
        this.typeForm.icon = file.response.data.bucketName + '/' + file.response.data.fileName
      }
    },
    handleUploadChangeSmall({file, fileList}) {
      this.fileListSmall = fileList
      if (file.status == 'done') {
        //获取上传完成返回的对象名
        this.addForm.img = file.response.data.bucketName + '/' + file.response.data.fileName
        this.typeForm.img = file.response.data.bucketName + '/' + file.response.data.fileName
      }
    },
    confirm(e) {
      console.log(e)
      this.delType()
      // this.$message.success('删除成功')
    },
    cancel(e) {
      // console.log(e)
      // this.$message.error('Click on No')
    },
    delType() {
      console.log('---------------------', this.typeForm)
      delType(this.typeForm.id).then(res => {
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
    onCheck(checkedKeys, info) {
      console.log(checkedKeys)
      console.log(info)
      this.copyClickData = info
      this.eventKey = info.eventKey
      this.typeForm.id = info.eventKey
      this.typeForm.typeName = info.label
      this.fileListSmall = []
      this.fileListBig = []
      console.log()
      getTypeById(this.typeForm.id).then(res => {
        if (res.status == 1) {
          this.typeForm.sort = res.data.sort
          const smallImgUrl = this.router + res.data.img
          var smallUrl = new Image()
          smallUrl.src = smallImgUrl
          if (res.data.img) {
            this.fileListSmall.push({
              uid: -1,
              url: smallImgUrl,
              name: 'image' + 1,
              status: 'done'
            })
          }
          const bigIconUrl = this.router + res.data.icon
          if (res.data.icon) {
            var ImgObj = new Image()
            ImgObj.src = bigIconUrl
            this.fileListBig.push({
              uid: -1,
              url: bigIconUrl,
              name: 'image' + 1,
              status: 'done'
            })
          }
          console.log('当前选择的值的ID的详情', this.fileListSmall)
        }
      })
    },
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

              // this.onLoadData(this.copyClickData)
            } else if (res.status === 2) {
              this.$message.success(res.msg)
            } else {
              this.$message.error('添加失败')
            }
          })
        }
      })
    },
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
    updType() {
      this.$refs.typeRuleForm.validate(val => {
        if (val) {
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
    onClose() {
      this.visible = false
      this.visibleTow = false
      this.disabled = true
      this.typeForm = {
        id: undefined,
        label: undefined
      }
      this.addForm = {
        label: undefined,
        parentId: undefined
      }
    },
    listTypeTow(id) {
      this.typeListTow = []
      listType(id)
        .then(res => {
          this.typeListTow = res.data
          console.log('子类', this.typeListTow)
          this.$forceUpdate()
          console.log('执行了')
        })
        .catch(() => {
          this.$message.error('请求失败')
        })
    },
    listType() {
      listType()
        .then(res => {
          this.typeList = res.data.data.records
          console.log('父菜单的数据', this.typeList)
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
