<template>
  <div id="Home">
    <div class="res-nav-header">头部</div>
    <div class="res-index-content-list">
      <a-list :data-source="dataList" item-layout="vertical" size="large">
        <div slot="footer"><b>ant design vue</b>资源管理系统</div>
        <a-list-item key="item.id" slot="renderItem" slot-scope="item,index">
          <template v-for="{ type, text } in actions" slot="actions">
        <span :key="type">
          <a-icon :type="type" style="margin-right: 8px"/>
          {{ text }}
        </span>
          </template>
          <img
              slot="extra"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              width="272"
          />
          <a-list-item-meta :description="item.remark">
            <div slot="title" :href="item.content">
              <a-badge
                  :count="index + 1"
                  :number-style="{
        backgroundColor: '#FD9999',
        color: '#fff',
        boxShadow: '0 0 0 1px #d9d9d9 inset',
        fontWeight:'bold'
      }"
              />
              <b style="margin-left: 5px">{{ item.name }}</b>
            </div>
            <a-avatar slot="avatar" :src="avatar"/>
          </a-list-item-meta>
          {{ item.content }}
          <a-button>进入</a-button>
        </a-list-item>
      </a-list>
    </div>
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
      hasMore: false,
      actions: [
        {type: 'star-o', text: '156'},
        {type: 'like-o', text: '156'},
        {type: 'message', text: '2'},
      ],
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
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
            console.log(data.records)
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

  .res-index-content-list {
    width: 70%;
    margin: 0 auto;
  }


  .loadMore {
    text-align: center;
  }

}
</style>
