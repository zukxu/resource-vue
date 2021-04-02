<template>
  <div id="Home">
    <div class="res-nav-header">
      <!--筛选-->
      <div>
        <a-input-search
            v-model="page.fields"
            allow-clear
            enter-button="Search"
            placeholder="输入资源名称"
            size="large"
            @search="onSearch"
        />
      </div>
    </div>
    <div class="res-index-content-list">
      <a-tabs default-active-key="-1" @change="changeTab">
        <template v-for="(type) in typeList">
          <a-tab-pane :key="type.value" :tab="type.text">
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
                <div style="float: right">
                  <a-icon type="right-circle"/>
                  {{ item.typeName }}
                </div>
                <a-button type="link" @click="openLink(item.content)">进入</a-button>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </template>
      </a-tabs>
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
import {listType} from '@/service/type'
import request from '@/utils/request'

export default {
  data() {
    return {
      loading: false,
      dataList: [],
      tempList: [],
      typeList: [{
        value: -1,
        text: '全部'
      }],
      page: {
        current: 1,
        size: 10,
        index: '',
        fields: '',
        total: 10,
        allPages: 10
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
    this.typeInfo()
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
            this.page.allPages = data.pages;
            this.hasMore = false
            console.log(data)
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
    //分类查询
    typeInfo() {
      listType().then((res) => {
        console.log(res)
        const result = res.data.data
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
    loadMore() {
      if (this.page.current - 1 === this.page.allPages) {
        this.hasMore = false
      }
      if (this.hasMore) {
        this.listInfo();
      } else {
        this.$message.warn('没有更多数据了!');
      }
    },
    changeTab(key) {
      console.log(key);
      this.page.current = 1
      if (-1 === key) {
        this.page.index = undefined
      } else {
        this.page.index = key
      }
      this.dataList = []
      this.listInfo()

    },
    onChange() {
      console.log(111)
      if (this.page.fields.length <= 0) {
        console.log(222)
        this.onSearch()
      }
    },
    onSearch() {
      //重置查询参数
      this.page.current = 1
      this.dataList = []
      this.listInfo()
    },
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
  }
}
</script>
<style lang="less" scoped>
#Home {
  padding: 20px;

  .res-nav-header, .res-index-content-list {
    width: 70%;
    margin: 0 auto;
  }

  .res-index-content-list {
    margin-top: 20px;
  }


  .loadMore {
    text-align: center;
  }

}
</style>
