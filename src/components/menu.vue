<template>
  <div style="width: 256px">
    <a-menu
      :default-open-keys="[$route.path]"
      :default-selected-keys="['home']"
      :inline-collapsed="collapsed"
      mode="inline"
      theme="dark"
    >
      <template v-for="item in menuList">
        <a-menu-item :key="item.key">
          <router-link :to="item.path">
            <a-icon :type="item.type"/>
            <span>{{ item.title }}</span>
          </router-link>
        </a-menu-item>
      </template>
      <template v-for="item in subMenuList">
        <a-sub-menu :key="item.key">
          <span slot="title"><a-icon :type="item.type"/><span>{{item.title}}</span></span>
          <template v-for="sub in item.children">
            <a-menu-item :key="sub.key">
              <router-link :to="sub.path">
                {{sub.title}}
              </router-link>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
import req from '@/utils/request'

export default {
  components: {},
  created() {
    this.getData()
  },
  data() {
    return {
      collapsed: false,
      menuList: [],
      subMenuList: []
    }
  },
  methods: {
    getData() {
      req.get('/menu.json').then(res => {
        console.log(res.data)
        this.menuList = res.data.menuItems
        this.subMenuList = res.data.subItems
      })
    },
  },
}
</script>
