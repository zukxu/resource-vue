import request from '@/utils/request'
import upload from '@/service/api/uploadAPI'

// 获取详细列表信息【get 请求】
export function fileList() {
  return request(upload.fileList)
}

// 新增
export function addFile(entity) {
  upload.addType.data = entity
  return request(upload.addFile)
}

// 删除
export function delFileByName(fileName) {
  upload.delType.params = {
    fileName: id
  }
  return request(upload.delFileByName)
}
