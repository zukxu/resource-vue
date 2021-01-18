<template>
  <div id="Resource">
    <a-card>
      <template slot="title">
        <a-icon type="search"/>
        筛选/搜索
      </template>
      <template slot="extra">
        <a-space>
          <a-button @click="clearSearch">重置</a-button>
          <a-button @click="onSearch" type="primary">查询结果</a-button>
        </a-space>
      </template>
      <div class="search-form-body">
        <a-form :model="page" layout="inline">
          <a-form-model-item label="输入搜索：">
            <a-input placeholder="输入资源名称"
                     v-model="page.fields"
            />
          </a-form-model-item>
          <a-form-model-item label="资源分类：">
            <a-select
              :filter-option="filterOption"
              :value="page.index"
              @change="searchTypeChange"
              allowClear
              option-filter-prop="children"
              placeholder="请选择分类"
              show-search
              style="width:200px"
            >
              <a-select-option :key="d.value" :value="d.value" v-for="d in typeList">{{d.text}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form>
      </div>
    </a-card>
    <a-table :columns="columns" :data-source="dataList" :loading="loading" :pagination="false"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :rowKey="record=>record.id"
             :scroll="{ x: 960, y: 480 }"
             bordered
             style="margin-top:10px;"
    >
      <template slot="title">
        <a-icon type="profile"/>
        资源列表
        <a-button @click="addNew" style="float: right" type="primary">添加</a-button>
      </template>
      <template slot="footer">
        <a-row justify="space-around" type="flex">
          <a-col span="6">
            <a-space>
              <a-select
                :filter-option="filterOption"
                @change="batchChange"
                allowClear
                option-filter-prop="children"
                placeholder="批量操作"
                show-search
                style="width:200px"
              >
                <a-select-option :key="d.value" :value="d.value" v-for="d in batchList">{{d.text}}</a-select-option>
              </a-select>
              <a-button type="primary">确认</a-button>
            </a-space>
          </a-col>
          <a-col span="12">
            <a-pagination
              :page-size="page.size"
              :show-total="total => `共 ${total} 条`"
              :total="page.total"
              @change="pageCurrentChange"
              @showSizeChange="pageSizeChange"
              show-size-changer
              size="small"
              v-model="page.current"
            >
            </a-pagination>
          </a-col>
        </a-row>
      </template>
      <span slot="names" slot-scope="text">
        <a-tag color="#f50">
          {{text.indexOf('（')!==-1?text.substr(0,text.indexOf('（')):text}}</a-tag>
      </span>
      <span slot="links" slot-scope="text">
        <a-tooltip :title="text" placement="topLeft">
          <a-button @click="openLink(text)" type="link">{{text}}</a-button>
        </a-tooltip>
      </span>
      <span slot="tags" slot-scope="text">
        <a-tag color="#2db7f5">{{text}}</a-tag>
      </span>
      <span slot="remark" slot-scope="text">
        <a-tooltip :title="text" placement="topLeft">
          <span>{{text}}</span>
        </a-tooltip>
      </span>
      <span slot="action" slot-scope="record">
        <a-space>
      <a-button @click="update(record)">编辑</a-button>
        <a-popconfirm
          @cancel="cancel"
          @confirm="confirm(record.id)"
          cancel-text="取消"
          ok-text="确认"
          title="确定要删除吗?"
        >
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </a-space>
    </span>
    </a-table>
    <AddResource :resource="tempData" @addCancelEvent="addCancelEvent" @addConfirmEvent="addConfirmEvent"
                 v-if="visible"></AddResource>
  </div>
</template>

<script>

import {addRes, delRes, listRes, updRes} from '@/service/resource'
import {listType} from '@/service/type'
import {AddResource} from '@/views/admin/resources/component/AddResource'

const columns = [
  {
    title: '资源名称',
    dataIndex: 'name',
    width: 180,
    scopedSlots: {customRender: 'names'}
  },
  {
    title: '资源内容',
    dataIndex: 'content',
    ellipsis: true,
    width: '40%',
    scopedSlots: {customRender: 'links'}
  },
  {
    title: '分类名称',
    dataIndex: 'typeName',
    align: 'center',
    width: 180,
    scopedSlots: {customRender: 'tags'},
  },
  {
    title: '资源描述',
    dataIndex: 'remark',
    width: 180,
    ellipsis: true,
    scopedSlots: {customRender: 'remark'}
  }, {
    title: '收集时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    scopedSlots: {customRender: 'action'},
  },
]
export default {
  name: 'Resource',
  components: {AddResource},
  created() {
    this.listInfo()
    this.typeInfo()
  },
  data() {
    return {
      columns,//表格行配置
      selectedRowKeys: [],//选中行
      loading: false,//加载
      visible: false,//显示
      confirmLoading: false,
      //查询参数
      page: {
        current: 1,
        size: 10,
        index: undefined,
        fields: '',
        total: 10
      },
      dataList: [],
      typeList: [],
      formData: {},
      //组件传递参数
      tempData: {},
      //批量操作
      batchList: [
        {
          value: 'batchDel',
          text: '批量删除',
        }, {
          value: 'batchAffair',
          text: '批量审核',
        }
      ]
    }
  },
  methods: {
    //列表查询
    listInfo() {
      this.loading = true
      listRes(this.page).then((res) => {
        console.log(res.data)
        if (res.data.code !== 1) {
          this.$message.error('数据异常')
          return
        }
        const data = res.data.data
        this.page.total = data.total
        this.dataList = data.records
        this.loading = false
        console.log(data.total)
      }).catch(e => {
        this.loading = false
        this.$message.error('查询信息失败：' + e)
      })
    },
    //分类查询
    typeInfo() {
      listType().then((res) => {
        const result = res.data.data.records
        result.forEach((r) => {
          this.typeList.push({
            value: r.id,
            text: r.typeName
          })
        })
      }).catch(e => {
        this.$message.error('查询信息失败：' + e)
      })
    },

    handleChange(value) {
      console.log(`selected ${value}`)
      this.formData.typeId = value
    },
    //选中数据行
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    //分类过滤
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    //新窗口打开链接
    openLink(url) {
      console.log(url)
      //判断是否包含协议头，不包含则添加
      const p1 = 'http'
      const p2 = 'https'
      //indexOf 不存在则返回-1
      if (url.indexOf(p1) !== -1) {
        window.open(url, '_blank')
        return
      } else if (url.indexOf(p2) === -1) {
        url = p2 + '://' + url
        console.log(url)
      }
      window.open(url, '_blank')
    },
    //行删除操作
    del(e) {
      delRes(e).then((res) => {
        console.log(res.data)
        this.$message.success('Success')
        this.listInfo()
      })
    },

    confirm(e) {
      console.log(e)
      this.del(e)
    },
    cancel(e) {
      console.log(e)
      this.$message.warn('取消删除！')
    },
    //页数切换，每页显示多少条数据
    pageSizeChange(current, pageSize) {
      console.log(current, pageSize)
      this.page.size = pageSize
      this.listInfo()
    },
    //分页切换
    pageCurrentChange(current, pageSize) {
      console.log(current, pageSize)
      this.page.current = current
      this.listInfo()
    },
    //组件操作
    //添加
    addNew() {
      this.tempData = {}
      this.switchModal()
    },
    //  更新
    update(e) {
      e.isUpd = true
      console.log(e)
      this.tempData = JSON.stringify(e)
      this.showModal()
    },
    //切换组件显示
    switchModal() {
      this.visible = !this.visible
    },
    handleOk() {
      const isOk = this.tempData === JSON.stringify(this.formData)
      console.log(isOk)
      if (!isOk) {
        this.confirmLoading = true

      } else {
        this.$message.warn('未做任何修改！')
      }
    },
    handleCancel() {
      this.visible = !this.visible
    },

    //批量操作
    batchChange(value) {
      console.log(`selected ${value}`)
    },
    //  搜索分类切换
    searchTypeChange(value) {
      console.log(`selected ${value}`)
      this.page.index = value
      console.log(this.page)
      //this.listInfo()
    },
    //搜索
    onSearch() {
      this.listInfo()
    },
    clearSearch() {
      if (this.page.fields.length > 0 || this.page.index !== undefined) {
        this.page.fields = ''
        this.page.index = undefined
        this.listInfo()
      }
    },
    //  子组件取消事件
    addCancelEvent() {
      console.log('子组件取消事件')
    },
    //  子组件确认事件
    addConfirmEvent(val) {
      if (val.isUpd === true) {
        addRes(val).then((res) => {
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
        return
      }
      updRes(this.formData).then((res) => {
        console.log(res.data)
        if (res.data.code === 1) {
          this.visible = false
          this.confirmLoading = false
          this.$message.success('修改成功')
        }
      }).catch(e => {
        this.confirmLoading = false
        this.$message.error('修改失败' + e)
      })
    },
  },
}
</script>

<style lang="less" scoped>
#Resource{
  .search-form-body{
    padding: 5px 40px;
  }
}
</style>
