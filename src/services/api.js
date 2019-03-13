import { stringify } from 'qs';
import request from '@/utils/request';

/**
 *  库存资源
 * @param params
 * @returns {Promise<void>}
 */
export async function queryResource(params) {
  return request(`/aps/resource/materiel/list?${stringify(params)}`);
}

export async function addResource(params) {
  return request('/aps/resource/materiel/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delResource(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());

  return request('/aps/resource/materiel/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateResource(params) {
  return request('/aps/resource/materiel/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryResourceBrief(params) {
  return request(`/aps/resource/materiel/brief/list?${stringify(params)}`);
}

/**
 *  采购计划
 * @param params
 * @returns {Promise<void>}
 */
export async function queryPurchase(params) {
  return request(`/aps/procurement/list?${stringify(params)}`);
}

export async function addPurchase(params) {
  return request('/aps/procurement/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delPurchase(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/aps/procurement/delete', {
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
  return request(`/aps/resource/device/record/list?${stringify(params)}`);
}

export async function queryEquipBrief(params) {
  return request(`/aps/resource/device/record/brief/list?${stringify(params)}`);
}

export async function addEquip(params) {
  return request('/aps/resource/device/record/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delEquip(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/aps/resource/device/record/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateEquip(params) {
  return request('/aps/resource/device/record/update', {
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
  return request(`/aps/resource/mold/list?${stringify(params)}`);
}

export async function queryMoldBrief(params) {
  return request(`/aps/resource/mold/brief/list?${stringify(params)}`);
}

export async function addMold(params) {
  return request('/aps/resource/mold/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delMold(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/aps/resource/mold/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateMold(params) {
  return request('/aps/resource/mold/update', {
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
  return request(`/aps/shift/list?${stringify(params)}`);
}

export async function addShifts(params) {
  return request('/aps/shift/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delShifts(params) {
  const formData = new FormData();
  formData.append(`id`, params.id);
  return request('/aps/shift/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateShifts(params) {
  return request('/aps/shift/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 产品档案
 */
export async function queryProducts(params) {
  return request(`/aps/product/products?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function queryRoutesByProId(params) {
  return request(`/aps/product/routes?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function addProducts(params) {
  return request('/aps/product/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delProducts(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/aps/product/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateProducts(params) {
  return request('/aps/product/update', {
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
  return request(`/aps/bom/boms?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function addBoms(params) {
  return request('/aps/bom/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delBoms(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/aps/bom/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateBoms(params) {
  return request('/aps/bom/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 产品工艺
 */
export async function queryCrafts(params) {
  return request(`/aps/crafts/craftsList?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function queryCraftsById(params) {
  return request(`/aps/crafts/get?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function addCrafts(params) {
  return request('/aps/crafts/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delCrafts(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/aps/crafts/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateCrafts(params) {
  return request('/aps/crafts/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 产品工艺线路
 */
export async function queryProRoutes(params) {
  return request(`/aps/processRoute/processRoutes?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function queryProRoutesById(params) {
  return request(`/aps/processRoute/get?${stringify(params)}`, {
    method: 'POST',
  });
}

export async function addProRoutes(params) {
  return request('/aps/processRoute/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function delProRoutes(params) {
  const formData = new FormData();
  formData.append(`ids`, params.ids.toString());
  return request('/aps/processRoute/delete', {
    method: 'POST',
    body: formData,
  });
}

export async function updateProRoutes(params) {
  return request('/aps/processRoute/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 订单排产列表
 */
export async function queryOrderList(params) {
  return request(`/aps/order/list?${stringify(params)}`, {
    method: 'get',
  });
}
export async function queryOrderAllList(params) {
  return request(`/aps/plan/all?${stringify(params)}`, {
    method: 'get',
  });
}
export async function addOrder(params) {
  return request('/aps/order/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function scheduleOrder(params) {
  const formData = new FormData();
  formData.append(`orderIds`, params.orderIds.toString());
  formData.append(`type`, params.type);
  return request('/aps/plan/schedule', {
    method: 'POST',
    body: formData,
  });
}

export async function queryOrderProgress(params) {
  return request(`/aps/plan/progress?${stringify(params)}`, {
    method: 'get',
  });
}

export async function scheduleExecute(params) {
  const formData = new FormData();
  formData.append(`execute`, params.execute.toString());
  return request('/aps/plan/execute', {
    method: 'POST',
    body: formData,
  });
}


export async function scheduleOptimize() {
  return request('/aps/plan/schedule/optimize', {
    method: 'POST',
  });
}


export async function scheduleCancel() {
  return request('/aps/plan/cancel', {
    method: 'get',
  });
}

/**
 * 设备负荷图表列表
 */
export async function queryDeviceL(params) {
  return request(`/aps/statistics/device/load?${stringify(params)}`);
}

export async function queryDeviceExport(params) {
  return request(`/aps/statistics/device/load/export?${stringify(params)}`);
}

/**
 * 模具负荷图表列表
 */
export async function queryMoldL(params) {
  return request(`/aps/statistics/mold/load?${stringify(params)}`);
}

export async function queryMoldExport(params) {
  return request(`/aps/statistics/mold/load/export?${stringify(params)}`);
}

/**
 * 投料计划图表列表
 */
export async function queryMaterials(params) {
  return request(`/aps/statistics/materials/plan?${stringify(params)}`);
}

export async function queryMaterialsExport(params) {
  return request(`/aps/statistics/materials/plan/export?${stringify(params)}`);
}

/**
 * DemoApi
 * @returns {Promise<void>}
 */
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
