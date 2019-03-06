import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Input, Select, Button, Col, Row, Modal, message, Radio } from 'antd';

class OrderProduction extends PureComponent {
  state = {
    timeColumns: [],
  };

  baseColumns = [
    {
      title: '订单号',
      dataIndex: 'id',
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
    },
    {
      title: '生产设备',
      dataIndex: 'deviceId',
    },
  ];

  componentDidMount () {
    const colList = new Array(12).fill({
      title: '12/01',
    });
    colList.map((item, index) => {
      item.title = `12/${index}`;
      item.dataIndex = `time${index}`;
    });
    this.setState({ timeColumns: colList });
  }

  render () {
    const { timeColumns } = this.state;
    const { onClose } = this.props;
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
    return (<div style={{ position: 'relative' }}><Card bordered={false}>
      <div style={infoBoxStyle}>
        <div className='baseInfo' style={{ width: '480px' }}>
          <Table pagination={false} title={() => <div style={titleStyle}>基础信息</div>}
                 scroll={{ y: 540 }}
                 columns={this.baseColumns} dataSource={[]}/>
        </div>
        <div className='timeInfo' style={{ width: '100%' }}>
          <Table pagination={false} title={() => <div style={titleStyle}>时间</div>} columns={timeColumns}
                 scroll={{ y: 540 }}
                 dataSource={[]}/>
        </div>
      </div>
      <div style={btnBoxStyle}>
        <Button type='primary'>一键优化</Button> &nbsp;&nbsp;
        <Button type='primary'>保存</Button>&nbsp;&nbsp;&nbsp;
        <Button type='default' onClick={onClose}>关闭</Button>
      </div>
    </Card></div>);
  };
}

export default OrderProduction;
