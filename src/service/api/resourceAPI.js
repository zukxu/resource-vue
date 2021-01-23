const RESOURCE_API = {
  //获取资源列表
  resourceList: {
    method: 'get',
    url: '/resource/list',
    params: ''
  },
  //获取资源
  getResource: {
    method: 'get',
    url: '/resource',
    params: ''
  },
  //新增资源 form-data,application/json
  addResource: {
    method: 'post',
    url: '/resource',
    data: ''
  },
  //更新资源
  updResource: {
    method: 'put',
    url: '/resource',
    data: ''
  },
  //删除资源
  delResource: {
    method: 'delete',
    url: '/resource',
    params: ''
  },
  //批量删除资源
  batchDel: {
    method: 'delete',
    url: '/resource/batchDel',
    params: ''
  }
}
export default RESOURCE_API
