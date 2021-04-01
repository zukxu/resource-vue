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
    <a-affix :offset-top="120" @change="change">
      <a-button>返回顶部</a-button>
    </a-affix>
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
      isRefreshBool: true
    }
  },
  created() {
    this.listInfo()
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('scroll', this.isRefresh, true);
    })
  },

  methods: {
    listInfo() {
      this.loading = true
      listRes(this.page).then((res) => {
            console.log(res.data.data)
            if (res.data.code !== 1) {
              this.$message.error('请求异常')
              return
            }
            const data = res.data.data
              this.page.total = data.total;
              this.page.current++
              this.isRefreshBool = true
            if (data.records) {
              this.tempList = data.records
              this.dataList = this.dataList.concat(this.tempList)
            }else {
              this.$message.warn('没有更多数据了!!!')
            }
            this.loading = false
          }
      )
    },
    pageSizeChange(current, pageSize) {
      console.log(current, pageSize)
      this.page.size = pageSize
      this.listInfo()
    },
    pageCurrentChange(current, pageSize) {
      console.log(current, pageSize)
      this.page.current = current
      this.listInfo()
    },
    // 获取当前可视范围的高度
    getWindowHeight() {
      let clientHeight = 0
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
      } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
      }
      return clientHeight
    },
    // 获取滚动条/文档所有的高度
    getScrollHeight() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    },
    // 获取滚动条当前的位置,即滚动条距离顶部的距离
    getScrollTop() {
      let scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    isRefresh() {
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop = this.getScrollTop()
      //变量windowHeight是可视区的高度
      let windowHeight = this.getWindowHeight()
      //变量scrollHeight是滚动条的总高度
      let scrollHeight = this.getScrollHeight()
      //滚动条到底部的条件
      if (scrollTop + windowHeight >= scrollHeight - 200 && this.isRefreshBool&&this.page.current<3) {
        // false防止加载数据函数多次触发
        this.isRefreshBool = false;
        this.listInfo();
      }
    },
    gotoTop() {
      console.log('回到顶部')
    }
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
}
</style>
