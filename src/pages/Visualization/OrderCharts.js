import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, DatePicker, Select, Button, Col, Row, Modal, message, Radio } from 'antd';
import moment from 'moment/moment';

const { RangePicker } = DatePicker;

@connect(({ materials, loading }) => ({
  materials,
  loading: loading.models.materials,
}))
class OrderCharts extends PureComponent {
  state = {
    timeColumns: [],
    formValues: {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().subtract(-30, 'days').format('YYYY-MM-DD'),
    },
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
  getFormValues (values) {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'materials/fetch',
    //   payload: { ...values },
    // });
  }

  render () {
    const { timeColumns, formValues } = this.state;
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
    </Card></div>);
  };
}

export default OrderCharts;
