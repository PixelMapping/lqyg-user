import request from '@/utils/request.js';

//首页信息
export async function homeInfo(params: any) {
  return request('/client/enterprise/homeInfo.do', {
    method: 'GET',
    params: params,
  });
}
