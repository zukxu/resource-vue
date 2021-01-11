<template>
  <a-table :columns="columns" :data-source="data" :rowKey="record=>record.id" bordered>
    <template
      :slot="col"
      slot-scope="text, record"
      v-for="col in columnName"
    >
      <div :key="col">
        <a-input
          :value="text"
          @change="e => handleChange(e.target.value, record.id, col)"
          style="margin: -5px 0"
          v-if="record.editable"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template
      slot="typeName"
      slot-scope="text, record"
    >
      <div :key="record.id">
        <a-select
          :value="text"
          @change="handleSelectChange"
          style="margin: -5px 0"
          v-if="record.editable"
        >
          <a-select-option :key="d.value" :value="d.value" v-for="d in typeList">{{d.text}}</a-select-option>
        </a-select>
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template slot="action" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.id)">Save</a>
          <a-popconfirm @confirm="() => cancel(record.id)" title="Sure to cancel?">
            <a>Cancel</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.id)">Edit</a>
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
const columnName = [
  'name', 'content', 'remark'
]
const columns = [
  {
    title: '资源名称',
    dataIndex: 'name',
    width: 180,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '资源内容',
    dataIndex: 'content',
    ellipsis: true,
    width: '40%',
    scopedSlots: {customRender: 'content'}
  },
  {
    title: '分类名称',
    dataIndex: 'typeName',
    align: 'center',
    width: 180,
    scopedSlots: {customRender: 'typeName'},
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
    id: 'action',
    width: 180,
    scopedSlots: {customRender: 'action'},
  },
]
import {listRes} from '@/service/resource'

export default {
  created() {
    this.listInfo()
  },
  data() {

    return {
      columns,
      columnName,
      typeList: [
        {
          value: '1307707080979623937',
          text: '插件网站'
        }, {
          value: '1307706763428868098',
          text: '办公网站'
        },
      ],
      page: {
        current: 1,
        size: 10,
        index: undefined,
        fields: '',
        total: 10
      },
      data: [],
      cacheData: [],
      editingKey: '',
    }
  },
  methods: {
    listInfo() {
      listRes(this.page).then((res) => {
        if (res.data.code !== 1) {
          this.$message.error('数据异常')
          return
        }
        const data = res.data.data
        this.page.total = data.total
        this.data = data.records
        this.cacheData = this.data.map(item => ({...item}))
        console.log(this.cacheData)
      }).catch(e => {
        this.$message.error('查询信息失败：' + e)
      })
    },
    handleSelectChange(value) {
      console.log(value)
      const newData = [...this.data]
      const target = this.typeList.filter(item => value === item.value)[0]
      console.log(target)
      /*if (target) {
        target[column] = value
        this.data = newData
      }*/
    },
    handleChange(value, id, column) {
      console.log(value, id, column)
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      console.log(target)
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit(id) {
      console.log(id)
      const newData = [...this.data]
      console.log(newData)
      const target = newData.filter(item => id === item.id)[0]
      console.log(target)
      this.editingKey = id
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(id) {
      console.log(id)
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => id === item.id)[0]
      const targetCache = newCacheData.filter(item => id === item.id)[0]
      if (target && targetCache) {
        delete target.editable
        this.data = newData
        //更新缓存
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel(id) {
      console.log(id)
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
        delete target.editable
        this.data = newData
      }
    },
  },
}
</script>
<style scoped>
.editable-row-operations a{
  margin-right: 8px;
}
</style>
