<template>
  <div id="Home">
    <a-list :data-source="dataList" :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card :key="index" :title="item.name">
          {{ item.content }}
          {{ item.remark }}
        </a-card>
      </a-list-item>
    </a-list>
    <a-affix :offsetBottom="120">
      <a-button :style="{float:'right'}" @click="gotoTop">回到顶部</a-button>
    </a-affix>
<!--    <div class="item tool-coderunner">
      <div class="item-inner">
        <div class="item-hd">
          <a target="_blank" href="https://tool.lu/coderunner/" class="item-icon"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" width="48" height="48" alt="coderunner"></a>
          <h3><a target="_blank" href="https://tool.lu/coderunner/">在线运行代码</a></h3>

          <span class="item-category">[<a target="_blank" rel="nofollow" href="/c/developer">开发类</a>]</span>
          <a title="收藏" class="collectable collect" href="javascript:;" data-slug="coderunner" data-url="https://tool.lu/collect.html"><i class="icon collect"></i><var>加入收藏</var></a>
        </div>
        <div class="item-bd">
          <div class="item-desc" title="在线运行php,c,c++,go,python,java,groovy代码">在线运行php,c,c++,go,python,java,groovy代码</div>
        </div>
        <div class="item-ft">
          <a target="_blank" class="item-link" href="https://tool.lu/coderunner/">https://tool.lu/coderunner/</a>
          <a target="_blank" class="item-btn" href="https://tool.lu/coderunner/">进入</a>
        </div>

      </div>
    </div>-->
    <!--    <div class="pagination-local">
          <a-pagination
            :page-size="page.size"
            :show-total="(total, range) => `第${range[0]}-${range[1]} 条数据  共 ${total} 条数据`"
            :total="page.total"
            @change="pageCurrentChange"
            @showSizeChange="pageSizeChange"
            show-size-changer
            v-model="page.current"
          >
          </a-pagination>
        </div>-->
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
      allPage: 0
    }
  },
  created() {
    this.listInfo()
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('scroll', this.lazyLoad());
    })

  },

  methods: {
    listInfo() {
      this.loading = true
      listRes(this.page).then((res) => {
            console.log(res)
            if (res.data.code !== 1) {
              this.$message.error('请求异常')
              return
            }
            const data = res.data.data
            this.page.total = data.total
            this.tempList = data.records
            this.dataList = this.dataList.concat(this.tempList)
            this.allPage = this.page.total / this.page.size + 1
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

    // 获取滚动条当前的位置
    getScrollTop() {
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
    // 获取文档完整的高度
    getScrollHeight() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    },
    // 滚动事件触发下拉加载
    lazyLoad() {
      if (this.getScrollHeight() - this.getClientHeight() - this.getScrollTop() <= 0) {
        if (this.page.current <= this.allPage) {
          this.page.current++;
          this.listInfo()
        } else {
          this.$message.warn('没有更多内容了！！！');
        }
      }
    },
    gotoTop(){
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
