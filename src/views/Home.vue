<template>
  <div id="Home">
    <a-list :data-source="dataList" :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card :key="index" :title="item.name">
          Card content
        </a-card>
      </a-list-item>
    </a-list>
    <div class="pagination-local">
      <a-pagination
        :page-size="page.size"
        :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} 数据`"
        :total="page.total"
        @change="pageCurrentChange"
        @showSizeChange="pageSizeChange"
        show-size-changer
        v-model="page.current"
      >
      </a-pagination>
    </div>
  </div>
</template>
<script>
import {listRes} from '@/service/resource'

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
      console.log(this.page)
      listRes(this.page).then((res) => {
          console.log(res)
          if (res.data.code !== 1) {
            this.$message.error('请求异常')
            return
          }
          const data = res.data.data
          this.page.total = data.total
          this.dataList = data.records
          this.loading = false
          console.log(data.total)
        }
      )
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
  padding: 20px;

  .pagination-local{
    left: 25%;
    top: 35px;
  }
}
</style>
