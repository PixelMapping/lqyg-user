import request from '@/utils/request.js';


//获取打款的信息
export async function enBatchPaymentInfo(params: any) {
  return request('/manger/settlement/enBatchPaymentInfo.do', {
    method: 'GET',
    params: params,
  });
}

//批次列表接口
export async function bathList(params: any) {
  return request('/manger/settlement/bathList.do', {
    method: 'post',
    data: params,
  });
}

//运营审核
export async function operationAudit(params: any) {
  return request('/manger/settlement/operationAudit.do', {
    method: 'post',
     data: params,
  });
}

//财务审核
export async function financialAudit(params: any) {
  return request('/manger/settlement/financialAudit.do', {
    method: 'post',
     data: params,
  });
}


//财务负责人审核
export async function financialLeaderAudit(params: any) {
  return request('/manger/settlement/financialLeaderAudit.do', {
    method: 'post',
     data: params,
  });
}

//获取财务人员列表
export async function getFinancrPerson(params: any) {
  return request('/manger/settlement/getFinancrPerson.do', {
    method: 'GET',
    params: params,
  });
}

//结算接口
export async function settlementCompleted(params: any) {
  return request('/manger/settlement/settlementCompleted.do', {
    method: 'post',
     data: params,
  });
}

//结算接口
export async function settleBatchList(params: any) {
  return request('/manger/settlement/settleBatchList.do', {
    method: 'post',
     data: params,
  });
}