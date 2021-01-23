import request from '@/utils/request'
import resource from '@/service/api/resourceAPI'

// 获取详细信息【get 请求】
export function getRes(params) {
  resource.getResource.params = params
  return request(resource.getResource)
}

// 获取详细列表信息【get 请求】
export function listRes(params) {
  resource.resourceList.params = params
  return request(resource.resourceList)
}

// 新增
export function addRes(entity) {
  resource.addResource.data = entity
  return request(resource.addResource)
}

// 删除
export function delRes(id) {
  resource.delResource.params = {
    id: id
  }
  return request(resource.delResource)
}
// pl删除
export function batchDel(ids) {
  resource.batchDel.params = {
    ids: ids
  }
  return request(resource.batchDel)
}

// 修改
export function updRes(entity) {
  resource.updResource.data = entity
  return request(resource.updResource)
}
