const AFFAIR_API = {
  //审核
  affair: {
    method: 'post',
    url: '/affair',
    data: ''
  },
  //批量审核
  batchAffair: {
    method: 'post',
    url: '/affair/batchAffair',
    header: {'Content-Type': 'application/json'},
    data: ''
  }
}
export default AFFAIR_API
