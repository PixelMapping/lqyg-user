import request from '@/utils/request';

//通道列表
export async function channelList(params: any) {
  return request('/manger/baseChannel/channelList.do', {
    method: 'GET',
    params: params,
  });
}

//商户管理
export async function enterprisePage(params: any) {
  return request('/manger/enterprise/enterprisePage.do', {
    method: 'GET',
    params: params,
  });
}

//添加商户
export async function addEnterPrise(params: any) {
  return request('/manger/enterprise/addEnterPrise.do', {
    method: 'POST',
    data: params,
  });
}

//编辑商户
export async function uptEnterprise(params: any) {
  return request('/manger/enterprise/uptEnterprise.do', {
    method: 'PUT',
    data: params,
  });
}

//商户详情
export async function enterpriseDetail(params: any) {
  return request('/manger/enterprise/detail.do', {
    method: 'GET',
    params: params,
  });
}

//字典列表
export async function getDictListByValue(params: any) {
  return request('/manger/dict/getDictListByValue.do', {
    method: 'GET',
    params: params,
  });
}


//充值管理
export async function auditPage(params: any) {
  return request('/manger/recharge/auditPage.do', {
    method: 'GET',
    params: params,
  });
}

//充值记录详情
export async function getInfo(params: any) {
  return request('/manger/recharge/getInfo.do', {
    method: 'GET',
    params: params,
  });
}

//确认收款
export async function rechargeConfirm(params: any) {
  return request('/manger/recharge/confirm.do', {
    method: 'PUT',
     data: params,
  });
}

//发票管理

//发票申请记录（分页）
export async function applyInvoicePage(params: any) {
  return request('/manger/invoice/applyInvoicePage.do', {
    method: 'GET',
    params: params,
  });
}

//发票记录详情
export async function invoiceInfo(params: any) {
  return request('/manger/invoice/getInfo.do', {
    method: 'GET',
    params: params,
  });
}

//审核人列表
export async function auditorList(params: any) {
  return request('/manger/invoice/auditorList.do', {
    method: 'GET',
    params: params,
  });
}

//审核通过
export async function auditPass(params: any) {
  return request('/manger/invoice/auditPass.do', {
    method: 'POST',
    data: params,
  });
}

//发票审核驳回
export async function reject(params: any) {
  return request('/manger/invoice/reject.do', {
    method: 'POST',
    data: params,
  });
}

//开票完成
export async function invoiceComplete(params: any) {
  return request('/manger/invoice/invoiceComplete.do', {
    method: 'POST',
    data: params,
  });
}

//发票邮寄
export async function express(params: any) {
  return request('/manger/invoice/express.do', {
    method: 'POST',
    data: params,
  });
}

//短信提醒
export async function remind(params: any) {
  return request('/manger/invoice/remind.do', {
    method: 'GET',
    params: params,
  });
}

//首页信息
export async function homeInfo(params: any) {
  return request('/manger/enterprise/homeInfo.do', {
    method: 'GET',
    params: params,
  });
}

//首页信息
export async function tempList(params: any) {
  return request('/manger/template/tempList.do', {
    method: 'GET',
    params: params,
  });
}

//驳回
export async function rechargeReject(params: any) {
  return request('/manger/recharge/reject.do', {
    method: 'PUT',
    data: params,
  });
}


//充值记录列表
export async function channelRecordPage(params: any) {
  return request('/manger/recharge/channelRecordPage.do', {
    method: 'GET',
    params: params,
  });
}

//充值记录详情
export async function rechargeInfo(params: any) {
  return request('/manger/recharge/getInfo.do', {
    method: 'GET',
    params: params,
  });
}

//余额查询
export async function channelBalance(params: any) {
  return request('/manger/baseChannel/channelBalance.do', {
    method: 'GET',
    params: params,
  });
}

//首页柱状图
export async function homeChart(params: any) {
  return request('/manger/enterprise/homeChart.do', {
    method: 'GET',
    params: params,
  });
}