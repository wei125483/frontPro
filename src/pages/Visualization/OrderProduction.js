import React, { PureComponent } from 'react';
import { Card, Table, Button, message, Popover, Popconfirm, Icon } from 'antd';
import moment from 'moment';

class OrderProduction extends PureComponent {
  state = {
    baseList: [],
    timeColumns: [],
    timeDataList: [],
  };

  baseColumns = [
    {
      title: '订单号',
      dataIndex: 'orderId',
    },
    {
      title: '工艺',
      dataIndex: 'craftName',
    },
    {
      title: '产品',
      dataIndex: 'productId',
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

  componentDidUpdate (prevProps) {
    const { dataList } = this.props;
    if (prevProps.dataList !== dataList) {
      const { apsTasks = [] } = dataList;
      const taskList = [];
      const columns = [];
      const dates = [];
      apsTasks.map(item => {
        const rows = {};
        item.childTaskList.map((task) => {
          const date = task.startTime.split(' ')[0];
          if (dates.indexOf(date) === -1) {
            dates.push(date);
          }
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

      dates.sort((a, b) => {
        return moment(a) - moment(b);
      });
      dates.map(item => {
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
            ) : '';
          },
        });
      });
      this.setState({
        timeColumns: columns,
        baseList: apsTasks,
        timeDataList: taskList,
      });
    }
  }

  render () {
    const { timeColumns, timeDataList, baseList } = this.state;
    const { dataList } = this.props;
    const { apsTasks = [] } = dataList;
    const infoBoxStyle = {
      display: 'flex',
    };
    const titleStyle = {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 600,
    };
    const btnBoxStyle = {
      position: 'absolute',
      bottom: '10',
      marginTop: '30px',
      width: '100%',
      padding: '5px 64px',
      textAlign: 'right',
    };
    const onClearSchedule = () => {
      const { dispatch, onClose } = this.props;
      const that = this;
      // 取消订单排程
      dispatch({
        type: 'order/orderCancel',
        callback (response) {
          const { code } = response;
          message.success('取消成功');
          that.setState({ timeColumns: [], baseList: [], timeDataList: [] });
          onClose();
          if (code !== 200) {
            message.warning(response.message);
          }
        },
      });
    };

    const onSaveSchedule = () => {
      const { dispatch, onClose } = this.props;
      const that = this;
      // 保存订单排程
      dispatch({
        type: 'order/orderExecute',
        payload: { execute: true },
        callback (response) {
          const { code } = response;
          message.success('保存成功');
          that.setState({ timeColumns: [], timeDataList: [], baseList: [] });
          onClose();
          if (code !== 200) {
            message.warning(response.message);
          }
        },
      });
    };

    const onOptimize = () => {
      const { dispatch, scheVisibleOptimize } = this.props;
      const that = this;

      // 优化订单排程
      dispatch({
        type: 'order/optimize',
        callback (response) {
          const { code } = response;
          if (code !== 200) {
            message.warning(response.message);
            return;
          }
          scheVisibleOptimize(true);
          that.setState({ timeColumns: [], timeDataList: [], baseList: [] });
          // onClose();
        },
      });
    };

    return (<div style={{ position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
        {
          apsTasks.length > 0 && <Card bordered={false}>
            <div style={infoBoxStyle}>
              <div className='baseInfo' style={{ width: timeColumns.length > 0 ? '480px' : '100%' }}>
                <Table pagination={false} title={() => <div style={titleStyle}>基础信息</div>}
                       columns={this.baseColumns} dataSource={baseList}/>
              </div>
              {
                timeColumns.length > 0 ? <div className='timeInfo' style={{ width: 'calc(100% - 480px)' }}>
                  <Table pagination={false} title={() => <div style={titleStyle}>时间</div>} columns={timeColumns}
                         scroll={{ x: 1460 }}
                         dataSource={timeDataList}/>
                </div> : ''
              }
            </div>
            <div style={btnBoxStyle}>
              <Button type='primary' onClick={onOptimize}>一键优化</Button> &nbsp;&nbsp;
              <Button type='primary' onClick={onSaveSchedule}>保存</Button>&nbsp;&nbsp;&nbsp;
              <Popconfirm title="是否取消排程的订单？"
                          onConfirm={onClearSchedule}
                          icon={<Icon type="question-circle-o" style={{ color: 'red' }}/>}>
                <Button type='default'>取消</Button>
              </Popconfirm>,
            </div>
          </Card>
        }</div>
    );
  };
}

export default OrderProduction;
