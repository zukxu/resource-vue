<template>
  <div id="Home">
    <a-list :data-source="dataList" :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card :key="index" :title="item.name">
          Card content
        </a-card>
      </a-list-item>
    </a-list>
    <a-pagination
      :page-size="page.size"
      :show-total="total => `共 ${total} 条数据`"
      :total="page.total"
      @change="pageCurrentChange"
      @showSizeChange="pageSizeChange"
      show-size-changer
      v-model="page.current"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span v-if="props.value !== '100'">{{ props.value }}条/页</span>
      </template>
    </a-pagination>
  </div>
</template>
<script>
import {listInfo} from '@/service/resource'

export default {
  data() {
    return {
      loading: false,
      dataList: [],
      page: {
        current: 1,
        size: 10,
        index: '',
        fields: '',
        total: 10
      },
    }
  },
  created() {
    this.listInfo()
  },
  methods: {
    listInfo() {

      this.loading = true
      listInfo(this.page).then((res) => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.page.total = res.data.data.total
          this.dataList = res.data.data.records
          this.loading = false
          console.log(res.data.data.total)
        }
      })
    },
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
  }
}
</script>
<style lang="less" scoped>
#Home{

}
</style>
