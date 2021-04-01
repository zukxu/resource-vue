<template>
  <div id="Home" ref="container">
    <a-list :data-source="dataList" :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card :key="index" :title="item.name">
          <span style="color: red">{{ index + 1 }}</span>
          {{ item.content }}
          {{ item.remark }}
        </a-card>
      </a-list-item>
    </a-list>
    <a-divider>第{{ page.current - 1 }}页/共{{ page.total }}条数据</a-divider>
    <div class="loadMore">
      <a-button type="primary" @click="loadMore">
        <a-icon type="more"/>
        加载更多
      </a-button>
    </div>
    <div>
      <a-back-top/>
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
      tempList: [],
      page: {
        current: 1,
        size: 20,
        index: '',
        fields: '',
        total: 10
      },
      hasMore: false
    }
  },
  created() {
    this.listInfo()
  },

  methods: {
    listInfo() {
      this.loading = true
      listRes(this.page).then((res) => {
            if (res.data.code !== 1) {
              this.$message.error('请求异常')
              return
            }
            const data = res.data.data
            this.page.total = data.total;
            this.hasMore = false
            if (data.records && data.records.length > 0) {
              this.tempList = data.records
              this.dataList = this.dataList.concat(this.tempList)
              this.page.current++
              this.hasMore = true
            }
            this.loading = false;
          }
      )
    },
    loadMore() {
      if (this.hasMore) {
        this.listInfo();
      } else {
        this.$message.warn('没有更多数据了!')
      }
    },
  }
}
</script>
<style lang="less" scoped>
#Home {
  padding: 20px;

  .pagination-local {
    left: 25%;
    top: 35px;
  }

  .loadMore {
    text-align: center;
  }
}
</style>
