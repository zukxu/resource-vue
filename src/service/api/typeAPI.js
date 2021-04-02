const TYPE_API = {
  //获取分类列表
  typeList: {
    method: 'get',
    url: '/type/list',
    params: ''
  },
  //获取子级分类
  getChildById: {
    method: 'get',
    url: '/type/getChildType',
    params: ''
  },
  //根据分类id获取详情
  getDetailsById: {
    method: 'get',
    url: '/type/getDetailsById',
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
  },
  //统计分类
  countType: {
    method: 'get',
    url: '/type/countType',
    params: ''
  }
}
export default TYPE_API
