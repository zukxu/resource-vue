const TYPE_API = {
  //获取分类列表
  typeList: {
    method: 'get',
    url: '/type/list',
    params: ''
  },
  //获取分类
  getTypeById: {
    method: 'get',
    url: '/type',
    params: ''
  },
  //新增分类 form-data,application/json
  addType: {
    method: 'post',
    url: '/type',
    data: ''
  },
  //更新分类
  updType: {
    method: 'put',
    url: '/type',
    data: ''
  },
  //删除分类
  delType: {
    method: 'delete',
    url: '/type',
    params: ''
  }
}
export default TYPE_API
