import {
  queryOrderList,
  addOrder,
  scheduleOrder,
  scheduleCancel,
  queryOrderProgress,
  scheduleExecute,
  scheduleOptimize,
} from '@/services/api';
import moment from 'moment';

export default {
  namespace: 'order',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryOrderList, payload);
      const resData = {
        list: response.data.list || [],
        pagination: {
          current: response.data.pageNum || 1,
          pageSize: response.data.pageSize || 10,
          total: response.data.total || 0,
        },
      };
      resData.list.map(item => {
        const date = moment();
        const deliveryDate = moment(item.deliveryDate);
        const time = (date - deliveryDate) / (24 * 60 * 60 * 1000);
        if (item.status != 0 || time >= 1) {
          Object.assign(item, { disabled: true });
        }
      });
      yield put({
        type: 'save',
        payload: resData,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addOrder, payload);
      if (callback) callback(response);
    },
    * schedule({ payload, callback }, { call }) {
      const response = yield call(scheduleOrder, payload);
      if (callback) callback(response);
    },
    * orderCancel({ payload, callback }, { call }) {
      const response = yield call(scheduleCancel, payload);
      if (callback) callback(response);
    },
    * orderProgress({ payload, callback }, { call }) {
      const response = yield call(queryOrderProgress, payload);
      if (callback) callback(response);
    },
    * optimize({ payload, callback }, { call }) {
      const response = yield call(scheduleOptimize, payload);
      if (callback) callback(response);
    },
    * orderExecute({ payload, callback }, { call }) {
      const response = yield call(scheduleExecute, payload);
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
