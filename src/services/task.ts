import request from '@/utils/request.js';


//任务大厅列表
export async function getTaskPage(params: any) {
  return request('/manger/task/getTaskPage.do', {
    method: 'GET',
    params: params,
  });
}

//任务详情
export async function getTaskDetail(params: any) {
  return request('/manger/task/getTaskDetail.do', {
    method: 'GET',
    params: params,
  });
}


//任务详情上方统计数据
export async function getTaskDetailNum(params: any) {
  return request('/manger/task/getTaskDetailNum.do', {
    method: 'GET',
    params: params,
  });
}

//录用不录用
export async function employment(params: any) {
  return request('/manger/enroll/employment.do', {
    method: 'PUT',
    data: params,
  });
}

//任务展示/不展示
export async function showTask(params: any) {
  return request('/manger/task/showTask.do', {
    method: 'PUT',
    data: params,
  });
}

//获取全部任务类型
export async function allTaskType(params: any) {
  return request('/manger/taskType/allTaskType.do', {
    method: 'GET',
    params: params,
  });
}

//获取省市所有数据
export async function getAllRegion(params: any) {
  return request('/manger/area/getAllRegion.do', {
    method: 'GET',
    params: params,
  });
}


//发布任务
export async function taskAdd(params: any) {
  return request('/manger/task/taskAdd.do', {
    method: 'POST',
    data: params,
  });
}

//发布任务
export async function bankList(params: any) {
  return request('/manger/bank/bankList.do', {
    method: 'GET',
    params: params,
  });
}

//任务协议
export async function tempList(params: any) {
  return request('/manger/template/tempList.do', {
    method: 'GET',
    params: params,
  });
}

//协议预览
export async function templatePreview(params: any) {
  return request('/manger/task/templatePreview.do', {
    method: 'GET',
    params: params,
  });
}

//结算名单下载
export async function taskSettlementList(params: any) {
  return request('/manger/settleTask/taskSettlementList.do', {
    method: 'GET',
    params: params,
  });
}

//验收名单下载
export async function taskAcceptanceList(params: any) {
  return request('/manger/checkTask/taskAcceptanceList.do', {
    method: 'GET',
    params: params,
  });
}

//验收名单下载
export async function enrollmentManagementList(params: any) {
  return request('/manger/enroll/enrollmentManagementList.do', {
    method: 'GET',
    params: params,
  });
}

//导入名单录用
export async function importEmployUser(params: any) {
  return request('/manger/enroll/importEmployUser.do', {
    method: 'POST',
    data: params,
  });
}

//任务完成
export async function completeTask(params: any) {
  return request('/manger/task/completeTask.do', {
    method: 'PUT',
    data: params,
  });
}

//全部录用
export async function employmentAll(params: any) {
  return request('/manger/enroll/employmentAll.do', {
    method: 'PUT',
    data: params,
  });
}

//任务验收
export async function checkTask(params: any) {
  return request('/manger/enroll/checkTask.do', {
    method: 'PUT',
    data: params,
  });
}


//任务审核
export async function taskExamine(params: any) {
  return request('/manger/task/taskExamine.do', {
    method: 'PUT',
    data: params,
  });
}

//基本信息
export async function getTaskDetailBasic(params: any) {
  return request('/manger/task/getTaskDetailBasic.do', {
    method: 'GET',
    params: params,
  });
}