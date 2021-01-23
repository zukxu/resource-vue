const TYPE_API = {
  //获取资源列表
  typeList: {
    method: 'get',
    url: '/type/list',
    params: ''
  },
  //获取资源
  getTypeById: {
    method: 'get',
    url: '/type',
    params: ''
  },
  //新增资源 form-data,application/json
  addType: {
    method: 'post',
    url: '/type',
    data: ''
  },
  //更新资源
  updType: {
    method: 'put',
    url: '/type',
    data: ''
  },
  //删除资源
  delType: {
    method: 'delete',
    url: '/type',
    params: ''
  }
}
export default TYPE_API
