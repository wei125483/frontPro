import React, { Component } from 'react';
import { Input, Form, Select } from 'antd';

const { Option } = Select.Option;

export default class ItemEditor extends Component {

  render() {
    const { itemData = {}, resourceList = [], equipList = [], getFieldDecorator } = this.props;
    console.log(resourceList,equipList);
    return <React.Fragment>
      <Form.Item label='工序产出产品' key={0}>
        {getFieldDecorator('produceId', {
          initialValue: itemData.produceId || '',
        })(<Select style={{ width: '100%' }} showSearch placeholder="请选择产品" optionFilterProp="children">
            {/*{*/}
              {/*resourceList.map(item => {*/}
                {/*return (<Option key={item.serial_num} value={item.materialId}>{item.materialName}</Option>);*/}
              {/*})*/}
            {/*}*/}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label='生产设备' key={1}>
        {getFieldDecorator('deviceId', {
          initialValue: itemData.deviceId || '',
        })(<Select style={{ width: '100%' }}>
            {/*{*/}
              {/*equipList.map(item => {*/}
                {/*return (<Option key={item.serialNum} value={item.deviceId}>{item.deviceName}</Option>);*/}
              {/*})*/}
            {/*}*/}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label='转序数量' key={2}>
        {getFieldDecorator('minNum', {
          initialValue: itemData.minNum || '',
        })(<Input/>)}
      </Form.Item>
    </React.Fragment>;
  }
}
