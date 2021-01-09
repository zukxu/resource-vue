<template>
  <div class="Resource">
    <a-row>
      <a-col span="6">
        <a-select
          :filter-option="filterOption"
          @change="searchSelectChange"
          allowClear
          option-filter-prop="children"
          placeholder="请选择分类"
          show-search
          style="width:180px"
        >
          <a-select-option :key="d.value" :value="d.value" v-for="d in typeList">{{d.text}}</a-select-option>
        </a-select>
      </a-col>
      <a-col span="12">
        <a-input-search
          @search="onSearch"
          allow-clear
          enter-button="搜索"
          placeholder="输入资源名称"
        />
      </a-col>
    </a-row>

    <a-table :columns="columns" :data-source="dataList" :loading="loading" :pagination="false"
             :rowKey="record=>record.id" :scroll="{ x: 1500, y: 480 }">
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
      <a-button @click="details(record)">详情</a-button>
         <a-divider type="vertical"/>
        <a-popconfirm
          @cancel="cancel"
          @confirm="confirm(record.id)"
          cancel-text="取ss消"
          ok-text="确认"
          title="确定要删除吗?"
        >
      <a-button type="danger">删除</a-button>
  </a-popconfirm>
    </span>
    </a-table>
    <a-pagination
      :page-size="page.size"
      :show-total="total => `共 ${total} 条数据`"
      :total="page.total"
      @change="pageCurrentChange"
      @showSizeChange="pageSizeChange"
      show-size-changer
      v-model="page.current"
    >
    </a-pagination>
    <a-modal
      :confirm-loading="confirmLoading"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
      title="编辑"
    >
      <a-form-model :model="formData">
        <a-form-model-item label="资源名称">
          <a-input v-model="formData.name"/>
        </a-form-model-item>
        <a-form-model-item label="资源分类">
          <a-select
            :filter-option="filterOption"
            :value="formData.typeId"
            @change="handleChange"
            option-filter-prop="children"
            placeholder="请选择分类"
            show-search
          >
            <a-select-option :key="d.value" :value="d.value" v-for="d in typeList">{{d.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="资源地址">
          <a-input type="textarea" v-model="formData.content"/>
        </a-form-model-item>
        <a-form-model-item label="资源描述">
          <a-input type="textarea" v-model="formData.remark"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>

import {delRes, listRes, updRes} from '@/service/resource'
import {listType} from '@/service/type'

const columns = [
  {
    title: '资源名称',
    dataIndex: 'name',
    width: 180,
    align: 'center',
    scopedSlots: {customRender: 'names'}
  },
  {
    title: '资源内容',
    dataIndex: 'content',
    ellipsis: true,
    width: 180,
    align: 'center',
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
    fixed: 'right',
    width: 180,
    scopedSlots: {customRender: 'action'},
  },
]
export default {
  name: 'Resource',
  components: {},
  created() {
    this.listInfo()
    this.typeInfo()
  },
  data() {
    return {
      columns,
      loading: false,
      visible: false,
      confirmLoading: false,
      page: {
        current: 1,
        size: 10,
        index: '',
        fields: '',
        total: 100
      },
      searchData: {
        index: undefined,
        fields: ''
      },
      dataList: [],
      typeList: [],
      formData: {},
      tempData: {}
    }
  },
  methods: {
    //列表查询
    listInfo() {
      this.loading = true
      listRes(this.page).then((res) => {
          console.log(res.data)
          if (res.data.code !== 1) {
            this.$message.error('请求异常')
            return
          }
          const data=res.data.data
          this.page.total = data.total
          this.dataList = data.records
          this.loading = false
          console.log(data.total)
        }
      )
    },
    typeInfo() {
      listType().then((res) => {
        const result = res.data.data.records
        result.forEach((r) => {
          this.typeList.push({
            value: r.id,
            text: r.typeName
          })
        })
      })
    }
    ,
//分类查询
    handleChange(value) {
      console.log(`selected ${value}`)
      this.formData.typeId = value
    }
    ,
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
    ,
//新窗口打开
    openLink(url) {
      console.log(url)
      //判断是否保函协议头，不包含则添加
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
    }
    ,
//删除
    del(e) {
      delRes(e).then((res) => {
        console.log(res.data)
        this.$message.success('Success')
        this.listInfo()
      })
    }
    ,
    confirm(e) {
      console.log(e)
      this.del(e)
    }
    ,
    cancel(e) {
      console.log(e)
      this.$message.warn('取消删除！')
    }
    ,
//分页查询
    pageSizeChange(current, pageSize) {
      console.log(current, pageSize)
      this.page.size = pageSize
      this.listInfo()
    }
    ,
    pageCurrentChange(current, pageSize) {
      console.log(current, pageSize)
      this.page.current = current
      this.listInfo()
    }
    ,
//  更新
//查看详情
    details(e) {
      console.log(e)
      this.formData = e
      this.tempData = JSON.stringify(e)
      this.showModal()
    }
    ,
    showModal() {
      this.visible = true
    }
    ,
    handleOk() {
      const isOk = this.tempData === JSON.stringify(this.formData)
      console.log(isOk)
      if (!isOk) {
        this.confirmLoading = true
        updRes(this.formData).then((res) => {
          console.log(res.data)
          if (res.data.code === 200) {
            this.visible = false
            this.confirmLoading = false
            this.$message.success('添加成功')
          }
        })
      } else {
        this.$message.warn('未做任何修改！')
      }
    }
    ,
    handleCancel() {
      this.visible = false
    }
    ,
//  搜索
    searchSelectChange(value) {
      console.log(`selected ${value}`)
      this.searchData.index = value
      this.page.index = this.searchData.index
      this.listInfo()
    }
    ,
    onSearch(value) {
      console.log(value)
      this.searchData.fields = value
      this.page.fields = this.searchData.fields
      this.page.current = 1
      this.listInfo()
    }
    ,
    clearSearch() {
      this.searchData.fields = ''
      this.searchData.index = undefined
      console.log(this.searchData)
      this.listInfo()
    }
    ,
  }
  ,
}
</script>

<style lang="less" scoped>
.Resource{

}
</style>
