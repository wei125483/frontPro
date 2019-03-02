import { queryEquip,queryEquipBrief, addEquip, delEquip, updateEquip } from '@/services/api';

export default {
  namespace: 'equip',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryEquip, payload);
      const resData = {
        list: response.data.list || [],
        pagination: {
          current: response.data.pageNum || 1,
          pageSize: response.data.pageSize || 10,
          total: response.data.total || 0,
        },
      };
      yield put({
        type: 'save',
        payload: resData,
      });
    },
    * fetchBrief({ payload, callback }, { call, put }) {
      const response = yield call(queryEquipBrief, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addEquip, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(delEquip, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateEquip, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
