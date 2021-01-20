import request from '@/utils/request'
import af from '../service/affairAPI'

// 审核
export function affair(entity) {
  af.affair.data = entity
  return request(af.affair)
}
// 批量审核
export function batchAffair(entity) {
  af.batchAffair.data = entity
  return request(af.batchAffair)
}
