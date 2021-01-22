<template>
  <a-layout id="BaseLayout">
    <a-layout-sider :trigger="null" breakpoint="lg" v-model="collapsed">
      <div class="logo"/>
      <a-menu
        :default-open-keys="['resourceMgr']"
        :default-selected-keys="[$route.path]"
        mode="inline" theme="dark">
        <a-sub-menu key="resourceMgr">
          <div slot="title">
            <a-icon type="unordered-list"/>
            <span>资源管理系统</span>
          </div>
          <a-menu-item key="/resource">
            <router-link to="/resource">
              <span>资源管理</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/type">
            <router-link to="/type">
              <span>分类管理</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/affair">
            <router-link to="/affair">
              <span>事务管理</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="uploadMgr">
          <div slot="title">
            <a-icon type="upload"/>
            <span>文件管理系统</span>
          </div>
          <a-menu-item key="/upload">
            <router-link to="/upload">
              <span>图片上传</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #ffffff; padding: 0">
        <span class="global-header-trigger">
        <a-icon
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
          class="trigger"
        />
        </span>
        <div class="global-header-user-index">
        <span class="account-avatar">
          <span class="avatar-img">
            <img alt="" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"/>
          </span>
          <span>ZUK XU</span>
        </span>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#ffffff', minHeight: '610px' }"
      >
        <router-view v-wechat-title='$route.meta.title'></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false,
    }
  },
}
</script>
<style lang="less" scoped>
#BaseLayout{
  .global-header-trigger{
    height: 64px;
    font-size: 20px;
    cursor: pointer;

    .trigger{
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }

    .trigger:hover{
      color: #1890ff;
    }
  }

  .global-header-user-index{
    float: right;
    height: 100%;
    margin-right: 8px;
    margin-left: auto;
    overflow: hidden;


    .account-avatar{
      display: inline-block;
      box-sizing: border-box;
      height: 100%;
      padding: 0 12px;
      cursor: pointer;
      transition: all .3s;

      .avatar-img{
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        padding: 20px 8px 20px 0;
        vertical-align: top;

        > img{
          display: block;
          height: 100%;
        }
      }
    }
  }

  .logo{
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
}

</style>
