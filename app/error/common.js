'use strict';

const Err_Common_404 = {
  code: 'code_comm_404',
  message: '404 NOT FOUND',
  status: 404,
};

const Err_Common_Exec = {
  code: 'code_comm_100',
  message: '服务器异常',
};

const Err_Common_Parms_Wrong = {
  code: 'code_comm_101',
  message: '请求参数错误',
};

const Err_Common_Add_Duplicated = {
  code: 'code_comm_102',
  message: '已存在，不能重复添加',
};

const Err_Common_Not_Existed = {
  code: 'code_comm_103',
  message: '操作对象不存在',
};
const Err_Common_Not_Login = {
  code: 'code_comm_104',
  message: '未登录，无权操作',
};
const Err_Common_No_Auth = {
  code: 'code_comm_105',
  message: '无权操作',
};
module.exports = {
  Err_Common_404,
  Err_Common_Exec,
  Err_Common_Parms_Wrong,
  Err_Common_Add_Duplicated,
  Err_Common_Not_Existed,
  Err_Common_Not_Login,
  Err_Common_No_Auth,
};
