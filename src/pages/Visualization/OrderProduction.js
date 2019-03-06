import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Select, Button, Col, Row, Modal, message, Radio } from 'antd';
import moment from 'moment';

class OrderProduction extends PureComponent {
  state = {
    timeColumns: [],
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

  componentDidMount() {

    // colList.map((item, index) => {
    //   item.title = `12/${index}`;
    //   item.dataIndex = `time${index}`;
    // });
    // this.setState({ timeColumns: colList });
  }

  componentDidUpdate() {
    const { dataList } = this.props;
    const { apsTasks = [] } = dataList;
    const taskList = [];
    const columns = [];
    const dates = [];
    apsTasks.map(item => {
      const rows = [];
      item.childTaskList.map((task) => {
        const date = task.startTime.split(' ')[0];
        if (dates.indexOf(date) === -1) {
          dates.push(date);
        }
        for (let i = 0; i < rows; i++) {
          if (rows[i].date === date) {
            rows[i].num += task.yield;
            return;
          }
        }
        rows.push({ date, num: task.yield });
      });
      taskList.push(rows);
    });
    dates.map(item => {
      columns.push({
        title: item,
        dataIndex: `date${item}`,
      });
    });
    console.log(taskList);
  }

  onClear() {
    const { dispatch, onClose } = this.props;
    const that = this;
    // 取消订单排程
    dispatch({
      type: 'order/orderCancel',
      callback(response) {
        const { code } = response;
        that.setState({ timeColumns: [] });
        onClose();
        if (code !== 200) {
          message.warning(response.message);
        }
      },
    });
  }

  onSave() {

  }

  render() {
    const { timeColumns } = this.state;
    const { onClose, dataList } = this.props;
    const { apsTasks = [], dateList, deviceLoads, materialPlans, moldLoads } = dataList;
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
    return (<div style={{ position: 'relative' }}>
      {
        apsTasks.length > 0 && <Card bordered={false}>
          <div style={infoBoxStyle}>
            <div className='baseInfo' style={{ width: '480px' }}>
              <Table pagination={false} title={() => <div style={titleStyle}>基础信息</div>}
                     columns={this.baseColumns} dataSource={apsTasks}/>
            </div>
            <div className='timeInfo' style={{ width: '100%' }}>
              <Table pagination={false} title={() => <div style={titleStyle}>时间</div>} columns={timeColumns}
                     scroll={{ x: 560 }}
                     dataSource={[]}/>
            </div>
          </div>
          <div style={btnBoxStyle}>
            <Button type='primary'>一键优化</Button> &nbsp;&nbsp;
            <Button type='primary'>保存</Button>&nbsp;&nbsp;&nbsp;
            <Button type='default' onClick={this.onClear}>取消</Button>
          </div>
        </Card>
      }</div>);
  };
}

export default OrderProduction;
