import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, DatePicker, Popover } from 'antd';
import moment from 'moment/moment';

const { RangePicker } = DatePicker;

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
class OrderCharts extends PureComponent {
  state = {
    timeColumns: [],
    timeDataList: [],
    dataList: [],
    formValues: {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().subtract(-30, 'days').format('YYYY-MM-DD'),
    },
  };

  baseColumns = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      render: (r, rows) => {
        return rows.order.id;
      },
    },
    {
      title: '工艺',
      dataIndex: 'craftName',
    },
    {
      title: '产品',
      dataIndex: 'productId',
      render: (r, rows) => {
        return rows.product.name;
      },
    },
    {
      title: '数量',
      dataIndex: 'num',
      render: (r, rows) => {
        return rows.product.num;
      },
    },
    {
      title: '生产设备',
      dataIndex: 'device',
      render: (r, rows) => {
        return rows.device.name;
      },
    },
  ];

  componentDidMount () {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'order/all',
      payload: {
        ...formValues,
      },
    });
  }

  componentDidUpdate (preProps) {
    const { order: { list } } = this.props;
    if (list != preProps.order.list) {
      const { dateSet, tasks } = list;
      const columns = [];
      const taskList = [];
      tasks.map(item => {
        const rows = {};
        item.childTaskList.map((task) => {
          const date = task.startTime.split(' ')[0];
          if (rows[`date${date}`]) {
            rows[`date${date}`].date = date;
            rows[`date${date}`].num += task.yield;
            rows[`date${date}`].childs.push({ startTime: task.startTime, endTime: task.endTime, num: task.yield });
            return;
          }
          rows[`date${date}`] = {
            date,
            num: task.yield,
            childs: [{ startTime: task.startTime, endTime: task.endTime, num: task.yield }],
          };
        });
        taskList.push(rows);
      });
      dateSet.map(item => {
        columns.push({
          title: item,
          dataIndex: `date${item}`,
          align: 'center',
          width: '100px',
          render: (t) => {
            let childHtml = '';
            if (t) {
              const { childs = [] } = t;
              childHtml = (<div>
                {
                  childs.map((item, index) => {
                    return (
                      <p key={index}>
                        {`${index + 1}、`}
                        <strong>开始时间：</strong><span style={{ color: '#1890ff' }}>{item.startTime}</span>；
                        <strong>结束时间：</strong><span style={{ color: '#1890ff' }}>{item.endTime}</span>；
                        <strong>产能：</strong><span style={{ color: '#1890ff' }}>{item.num}</span>
                      </p>
                    );
                  })
                }
              </div>);
            }

            return t ? (
              <Popover content={childHtml} title="时间详情" trigger="hover">
                <div
                  style={{ backgroundColor: '#1890ff', color: '#fff', width: '100px', margin: '0 auto' }}>{t.num}</div>
              </Popover>
            ) : (<div style={{ width: '100px', margin: '0 auto' }}/>);
          },
        });
      });

      this.setState({
        timeColumns: columns,
        timeDataList: taskList,
        dataList: tasks,
      });
    }
  }

  getFormValues (values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/all',
      payload: {
        ...values,
      },
    });
    // this.setState({ formValues: values });
  }

  render () {
    const { loading } = this.props;
    const { timeColumns, timeDataList, dataList, formValues } = this.state;
    const infoBoxStyle = {
      display: 'flex',
    };
    const titleStyle = {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 600,
    };
    const onChange = (dateString) => {
      const values = { ...formValues };
      values.startDate = dateString[0];
      values.endDate = dateString[1];
      this.getFormValues(values);
    };
    return (<div style={{ position: 'relative' }}><Card bordered={false}>
      <div style={{ borderBottom: '1px solid #e2e2e2' }}>
        <span>筛选日期：</span>
        <RangePicker
          defaultValue={[moment(formValues.startDate), moment(formValues.endDate)]}
          onChange={(e, dateString) => onChange(dateString)}/>
        <br/>
        <br/>
      </div>
      <div style={infoBoxStyle}>
        <div className='baseInfo' style={{ width: timeColumns.length > 0 ? '480px' : '100%' }}>
          <Table pagination={false} title={() => <div style={titleStyle}>基础信息</div>} loading={loading}
                 columns={this.baseColumns} dataSource={dataList}/>
        </div>
        {
          timeColumns.length > 0 ? <div className='timeInfo' style={{ width: 'calc(100% - 480px)' }}>
            <Table pagination={false} title={() => <div style={titleStyle}>时间</div>} columns={timeColumns}
                   scroll={{ x: 1460 }}
                   dataSource={timeDataList}/>
          </div> : ''
        }
      </div>
    </Card></div>);
  };
}

export default OrderCharts;
