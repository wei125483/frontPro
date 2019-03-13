import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Table } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

import styles from './index.less';
import { DatePicker } from 'antd/lib/index';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ materials, loading }) => ({
  materials,
  loading: loading.models.materials,
}))
@Form.create()
class FeedingList extends PureComponent {
  state = {
    dateList: [],
    baseList: [],
    timeColumns: [],
    timeDataList: [],
    formValues: {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().subtract(-30, 'days').format('YYYY-MM-DD'),
    },
  };

  componentDidMount () {
    this.dispathFetch();
  }

  componentDidUpdate (prevProps) {
    const { materials: { data: dataList } } = prevProps;
    const { dateList } = this.state;
    const { data = [], dates = [] } = dataList.list || {};
    const columns = [];
    const taskList = [];
    if (dates.length > 0 && dates != dateList) {
      dates.map(item => {
        columns.push({
          title: item,
          dataIndex: `date${item}`,
          align: 'center',
          width: '100px',
          render: (t) => {
            return (<div style={{ minWidth: '100px' }}>{t ? t.num : ''}</div>);
          },
        });
      });

      data.map(item => {
        const rows = {};
        item.apsMaterialPlans.map((task) => {
          const date = task.workDate;
          if (rows[`date${date}`]) {
            rows[`date${date}`].date = date;
            rows[`date${date}`].num += task.amount;
            rows[`date${date}`].childs.push({ date: date, num: task.amount });
            return;
          }
          rows[`date${date}`] = {
            date,
            num: task.amount,
            childs: [{ date: date, num: task.amount }],
          };
        });
        taskList.push({ ...rows, id: item.id, serialNum: item.serialNum });
      });

      const initColumns = [
        {
          title: '序号',
          width: '100px',
          dataIndex: 'id',
          render: (t) => {
            return (<div style={{ minWidth: '100px' }}>{t}</div>);
          },
        },
        {
          title: '物料编号',
          width: '100px',
          dataIndex: 'serialNum',
          render: (t) => {
            return (<div style={{ minWidth: '100px' }}>{t}</div>);
          },
        },
      ];
      this.setState({ dateList: dates, timeColumns: [...initColumns, ...columns], timeDataList: taskList });

    }
  }

  dispathFetch () {
    const { formValues } = this.state;
    this.getFormValues(formValues);
  }

  getFormValues (values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/fetch',
      payload: { ...values },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  render () {
    const { loading } = this.props;
    const { formValues, timeDataList, timeColumns } = this.state;
    const onChange = (dateString) => {
      const values = { ...formValues };
      values.startDate = dateString[0];
      values.endDate = dateString[1];
      this.getFormValues(values);
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.search}>
            <span>筛选日期：</span>
            <RangePicker
              defaultValue={[moment(formValues.startDate), moment(formValues.endDate)]}
              onChange={(e, dateString) => onChange(dateString)}/>
            <br/>
            <br/>
          </div>
          <div className={styles.tableList}>
            <Table pagination={false} columns={timeColumns} loading={loading}
                   scroll={{ x: 1200 }}
                   dataSource={timeDataList}/>
          </div>
        </Card>
      </div>
    );
  }
}

export default FeedingList;
