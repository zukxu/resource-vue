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
      allPage: 0,
      lineHeight: 0, //参考线位置。即判断滚动到何处触发事件；
      scrollHeight: 0,//页面卷入的高度
      windowHeight: 0//浏览器窗口的高度
    }
  },
  created() {
    this.listInfo()
  },
  mounted() {
    console.log(33333333333)
    /*this.$nextTick(function () {
      window.addEventListener('scroll', this.lazyLoad());
    })*/
  },

  methods: {
    listInfo() {
      console.log(2222222222)
      this.loading = true
      listRes(this.page).then((res) => {
            console.log(res.data.data)
            if (res.data.code !== 1) {
              this.$message.error('请求异常')
              return
            }
            const data = res.data.data
            this.page.total = data.total
            this.allPage = data.pages
            console.log(this.allPage)
            this.tempList = data.records
            this.dataList = this.dataList.concat(this.tempList)
            this.lineHeight = this.getLineHeight()
            console.log('参考线，文档内容高度',this.lineHeight)
            console.log('窗口高度',this.getClientHeight())
            console.log('滚动条高度',this.getScrollHeight())
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
    // 获取参考线/文档完整的高度
    getLineHeight() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    },
    // 获取滚动条当前的位置
    getScrollHeight() {
      let scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    // 获取当前可视范围的高度
    getClientHeight() {
      let clientHeight = 0
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
      } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
      }
      return clientHeight
    },

    // 滚动事件触发下拉加载
    lazyLoad() {
      if (this.getScrollHeight() - this.getClientHeight() - this.getScrollTop() <= 0) {
        console.log(11111111111)
        console.log(this.page)
        console.log(Math.ceil(this.page.total / this.page.size))
        console.log(this.allPage)
        if (this.page.current <= this.allPage) {
          this.page.current++;
          console.log(this.page)
          this.listInfo()
        } else {
          this.$message.warn('没有更多内容了！！！');
        }
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
