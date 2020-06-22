import request from '@/utils/request.js';

//个体信息
export async function signUserPage(params: any) {
  return request('/client/sign/signUserPage.do', {
    method: 'GET',
    params: params,
  });
}

//签约信息
export async function signPage(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/signPage.do', {
    method: 'GET',
    params: params,
  });
}

//签约批次
export async function signBatchPage(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/signBatchPage.do', {
    method: 'GET',
    params: params,
  });
}


//签约明细
export async function signDetailPage(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/signDetailPage.do', {
    method: 'GET',
    params: params,
  });
}


//个体信息详情
export async function personDetailBasic(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/personUser/personDetailBasic.do', {
    method: 'GET',
    params: params,
  });
}


//导入数据校验
export async function importBatchSign(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/importBatchSign.do', {
    method: 'POST',
    data: params,
  });
}

//导入数据校验
export async function batchSign(params: any) {
  // return request(`/api/login/captcha?mobile=${mobile}`);
  return request('/client/sign/batchSign.do', {
    method: 'POST',
    data: params,
  });
}