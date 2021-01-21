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
              <a-button @click="batchConfirm" type="primary">确认</a-button>
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
          @confirm="confirmDel(record.id)"
          cancel-text="取消"
          ok-text="确认"
          title="确定要删除吗?"
        >
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </a-space>
    </span>
    </a-table>
    <AddResource :isShow="isShow"
                 :resource="tempData"
                 :title="title"
                 :typeList="typeList"
                 @callBackUpdateForm="callBackUpdateForm">
    </AddResource>
  </div>
</template>

<script>

import {batchAffair} from '@/service/affair'
import {addRes, batchDel, delRes, listRes, updRes} from '@/service/resource'
import {listType} from '@/service/type'
import request from '@/utils/request'
import AddResource from '@/views/admin/resources/component/AddResource'

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
  components: {
    AddResource
  },
  created() {
    this.listInfo()
    this.typeInfo()
  },
  data() {
    return {
      columns,//表格行配置
      selectedRowKeys: [],//选中行
      loading: false,//加载
      isShow: false,//显示

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
      //组件传递参数
      tempData: {},
      //标题
      title: '',
      //批量操作
      batchList: [
        {
          value: 'batchDel',
          text: '批量删除',
        }, {
          value: 'batchAffair',
          text: '批量审核',
        }
      ],
      batchParam: undefined//批量操作参数
    }
  },
  methods: {
    //列表查询
    listInfo() {
      this.loading = true
      listRes(this.page).then((res) => {
        if (res.data.code !== 1) {
          this.$message.error('数据异常')
          return
        }
        const result = res.data.data
        this.page.total = result.total
        this.dataList = result.records
        this.loading = false
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
            value: String(r.id),
            text: r.typeName
          })
        })
      }).catch(e => {
        this.$message.error('查询信息失败：' + e)
      })
    },
    //选中数据行
    onSelectChange(row) {
      console.log('选中行: ', row)
      this.selectedRowKeys = row
    },
    //删除
    confirmDel(e) {
      delRes(e).then((res) => {
        console.log(res.data)
        this.$message.success(res.message)
        this.listInfo()
      }).catch(e => {
        this.$message.error('删除异常' + e)
      })
    },
    cancel(e) {
      console.log(e)
      this.$message.warn('取消删除！')
    },
    //每页显示多少条数据
    pageSizeChange(current, pageSize) {
      console.log(current, pageSize)
      this.page.size = pageSize
      this.listInfo()
    },
    //分页切换
    pageCurrentChange(current, pageSize) {
      this.page.current = current
      this.listInfo()
    },
    /****************组件操作**************/
    //添加
    addNew() {
      this.title = '添加资源'
      this.tempData = {}
      this.switchShow()
    },
    //更新
    update(e) {
      this.title = '更新资源'
      e.isUpd = true
      this.tempData = e
      this.switchShow()
    },
    //切换组件显示
    switchShow() {
      this.isShow = !this.isShow
    },
    //  子组件取消事件
    callBackUpdateForm(val) {
      if (val != null) {
        this.addConfirmEvent()
      } else {
        this.switchShow()
      }
    },
    //  子组件确认事件
    async addConfirmEvent(val) {
      if (val.isUpd === true) {
        await updRes(val).then((res) => {
          console.log(res.data)
          if (res.data.code === 1) {
            this.$message.success('修改成功')
          }
        }).catch(e => {
          this.$message.error('修改失败' + e)
        })
      } else {
        await addRes(val).then((res) => {
          console.log(res.data)
          if (res.data.code === 1) {
            this.$message.success('添加成功')
          } else {
            this.$message.error(res.message)
          }
        })
      }
      this.switchShow()
      this.onSearch()
    },
    /*******************************************************/
    //新窗口打开链接
    openLink(url) {
      let pattern = new RegExp('(http|https)')
      let word = new RegExp('[\u4e00-\u9fa5]')
      let w = word.test(url)
      if (w) {
        this.$message.warn('这不是链接')
        return
      }
      let test = pattern.test(url)
      const http = 'http://'
      const https = 'https://'
      if (test) {
        window.open(url, '_blank')
      } else {
        request({
          method: 'get',
          url: http + url,
        }).then((res) => {
          window.open(http + url, '_blank')
        }).catch(e => {
          window.open(https + url, '_blank')
        })
      }
    },
    //批量操作
    batchChange(value) {
      console.log(`selected ${value}`)
      this.batchParam = value
    },
    batchConfirm() {
      let param = this.batchParam
      let rowKeys = this.selectedRowKeys
      let ids = ''
      this.selectedRowKeys.forEach(function(item) {
        ids += item + ','
      })
      ids = ids.substr(0, ids.length - 1)
      console.log(ids)
      if (param !== undefined) {
        if (rowKeys.length < 1) {
          this.$message.warn('未选择数据行')
          return
        }
        if (param === 'batchDel') {
          batchDel(ids).then((res) => {
            this.$message.success(res.data.message)
            this.listInfo()
          }).catch(e => {
            this.$message.error('批量删除异常' + e)
          })
        } else if (param === 'batchAffair') {
          const data = {
            'ids': ids
          }
          batchAffair(data).then(res => {
            this.$message.success(res.data.message)
            this.listInfo()
          }).catch(err => {
            this.$message.error('批量审核异常' + err)
          })
        } else {
          console.log(11)
        }
      }
    },
    //搜索分类切换
    searchTypeChange(value) {
      console.log(`selected ${value}`)
      this.page.index = value
      console.log(this.page)
      //this.listInfo()
    },
    //分类过滤
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    //搜索
    onSearch() {
      this.listInfo()
    },
    clearSearch() {
      if (this.page.fields.length > 0 || this.page.index !== undefined) {
        this.page.fields = ''
        this.page.index = undefined
        this.selectedRowKeys = []
        this.listInfo()
      }
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
