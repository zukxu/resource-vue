import type from '@/service/api/typeAPI'
import request from '@/utils/request'

// 获取子级详细信息【get 请求】
export function getChildById(id) {
  type.getChildById.params = {
    id: id
  }
  return request(type.getChildById)
}

// 获取详细列表信息【get 请求】
export function listType(params) {
  type.typeList.params = params
  return request(type.typeList)
}

// 新增
export function addType(entity) {
  type.addType.data = entity
  return request(type.addType)
}

// 删除
export function delType(id) {
  type.delType.params = {
    id: id
  }
  return request(type.delType)
}

// 修改
export function updType(entity) {
  type.updType.data = entity
  return request(type.updType)
}
