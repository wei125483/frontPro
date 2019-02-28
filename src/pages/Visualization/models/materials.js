import { queryMaterials, queryMaterialsExport } from '@/services/api';

export default {
  namespace: 'materials',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMaterials, payload);
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
    *exports({ payload, callback }, { call, put }) {
      const response = yield call(queryMaterialsExport, payload);
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
