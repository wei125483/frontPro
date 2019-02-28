import { stringify } from 'qs';
import request from '@/utils/request';

/**
 *  库存资源
 * @param params
 * @returns {Promise<void>}
 */
export async function queryResource(params) {
  return request(`/server/aps/resource/materiel/list?${stringify(params)}`);
}

export async function addResource(params) {
  return request('/server/aps/resource/materiel/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delResource(params) {
  const formData = new FormData();
  formData.append(`ids`, `[${params.ids.toString()}]`);

  return request('/server/aps/resource/materiel/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateResource(params) {
  return request('/server/aps/resource/materiel/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 *  采购计划
 * @param params
 * @returns {Promise<void>}
 */
export async function queryPurchase(params) {
  return request(`/server/aps/procurement/list?${stringify(params)}`);
}

export async function addPurchase(params) {
  return request('/server/aps/procurement/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delPurchase(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/server/aps/procurement/delete', {
    method: 'POST',
    body: formData,
  });
}

/**
 *  设备资源
 * @param params
 * @returns {Promise<void>}
 */
export async function queryEquip(params) {
  return request(`/server/aps/resource/device/record/list?${stringify(params)}`);
}

export async function addEquip(params) {
  return request('/server/aps/resource/device/record/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delEquip(params) {
  const formData = new FormData();
  formData.append(`ids`, `[${params.ids.toString()}]`);
  return request('/server/aps/resource/device/record/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateEquip(params) {
  return request('/server/aps/resource/device/record/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 *  模具资源
 */
export async function queryMold(params) {
  return request(`/server/aps/resource/mold/list?${stringify(params)}`);
}

export async function addMold(params) {
  return request('/server/aps/resource/mold/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delMold(params) {
  const formData = new FormData();
  formData.append(`ids`, `[${params.ids.toString()}]`);
  return request('/server/aps/resource/mold/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateMold(params) {
  return request('/server/aps/resource/mold/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 *  班次模式
 */
export async function queryShifts(params) {
  return request(`/server/aps/shift/list?${stringify(params)}`);
}

export async function addShifts(params) {
  return request('/server/aps/shift/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delShifts(params) {
  const formData = new FormData();
  formData.append(`ids`, `[${params.ids.toString()}]`);
  return request('/server/aps/shift/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateShifts(params) {
  return request('/server/aps/shift/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 产品BOM
 */
export async function queryBoms(params) {
  return request(`/server/aps/bom/boms?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function addBoms(params) {
  return request('/server/aps/bom/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delBoms(params) {
  const formData = new FormData();
  formData.append(`ids`, `[${params.ids.toString()}]`);
  return request('/server/aps/bom/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateBoms(params) {
  return request('/server/aps/bom/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 设备负荷图表列表
 */
export async function queryDeviceL(params) {
  return request(`/server/aps/statistics/device/load?${stringify(params)}`);
}

export async function queryDeviceExport(params) {
  return request(`/server/aps/statistics/device/load/export?${stringify(params)}`);
}

/**
 * 模具负荷图表列表
 */
export async function queryMoldL(params) {
  return request(`/server/aps/statistics/mold/load?${stringify(params)}`);
}

export async function queryMoldExport(params) {
  return request(`/server/aps/statistics/mold/load/export?${stringify(params)}`);
}

/**
 * 投料计划图表列表
 */
export async function queryMaterials(params) {
  return request(`/server/aps/statistics/materials/load?${stringify(params)}`);
}

export async function queryMaterialsExport(params) {
  return request(`/server/aps/statistics/materials/load/export?${stringify(params)}`);
}

/**
 * DemoApi
 * @returns {Promise<void>}
 */
export async function queryProjectNotice() {
  return request('/server/api/project/notice');
}

export async function queryActivities() {
  return request('/server/api/activities');
}

export async function queryRule(params) {
  return request(`/server/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/server/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/server/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/server/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/server/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/server/api/fake_chart_data');
}

export async function queryTags() {
  return request('/server/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/server/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/server/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/server/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/server/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/server/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/server/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/server/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/server/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/server/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/server/api/captcha?mobile=${mobile}`);
}
