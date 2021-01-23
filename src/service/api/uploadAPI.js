const UPLOAD_API = {
  //获取文件列表
  fileList: {
    method: 'get',
    url: '/minio/list',
  },

  //上传文件 form-data,application/json
  addFile: {
    method: 'post',
    url: '/minio',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    data: ''
  },

  //删除文件
  delFileByName: {
    method: 'delete',
    url: '/minio/del',
    params: ''
  }
}
export default UPLOAD_API
