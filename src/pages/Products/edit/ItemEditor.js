import React, { Component } from 'react';
import { Input, Row, Col, Form, Select, Button } from 'antd';

const { Option } = Select;

class ItemEditor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      equipInfo: [],
      deviceList: [],
    };
  }

  componentDidMount () {
    const { itemData = {} } = this.props;
    const deviceIds = itemData.devices ? itemData.devices.map((item) => {
      return item.id;
    }) : [];
    this.setState({
      deviceList: deviceIds || [],
      equipInfo: itemData.devices || [],
    });
  }

  // 新增或删除设备信息的时候触发
  changeEquip (v) {
    const { equipInfo } = this.state;
    const { equipList } = this.props;
    const names = [];
    equipList.map(item => {
      v.map(vi => {
        if (vi === item.deviceId) {
          names.push(item.deviceName);
        }
      });
    });
    const list = [...equipInfo];
    if (v.length === 0) {
      this.setState({ equipInfo: [] });
      return false;
    }
    if (v.length > list.length) {
      list.push({ id: v[v.length - 1], name: names[v.length - 1], productivity: '' });
    } else if (v.length < list.length) {
      list.map((item, index) => {
        if (v.indexOf(item.id) === -1) {
          list.splice(index, 1);
        }
      });
    }
    this.setState({ equipInfo: list });
  }

  // 改变设备产能的时候触发
  changeEquipNum (v, index) {
    const { equipInfo } = this.state;
    const list = [...equipInfo];
    list[index].productivity = v;
    this.setState({ equipInfo: list });
  }

  vFormTest (v) {
    const moldInitV = {};
    if (v) {
      moldInitV.initialValue = v;
    }
    return moldInitV;
  };

  render () {
    const { itemData = {}, resourceList = [], equipList = [], getFieldDecorator, handleSubmit } = this.props;
    const { equipInfo, deviceList } = this.state;

    return <React.Fragment>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={12}>
          <Form.Item label='工序产出产品' key={0}>
            {getFieldDecorator('produceId', {
              rules: [{ required: true, message: '请选择产品信息！' }],
              initialValue: itemData.produceId || '',
            })(<Select style={{ width: '100%' }}>
                {
                  resourceList.map(item => {
                    return (<Option key={item.serial_num} value={item.materialId}>{item.materialName}</Option>);
                  })
                }
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='生产设备' key={1}>
            {getFieldDecorator('deviceId', {
              rules: [{ required: true, message: '请选择设备信息！' }],
              ...this.vFormTest(deviceList),
            })(<Select style={{ width: '100%' }} onChange={(v) => this.changeEquip(v)} mode="multiple" showSearch
                       optionFilterProp="children">
                {
                  equipList.map(item => {
                    return (<Option key={item.serialNum} value={item.deviceId}>{item.deviceName}</Option>);
                  })
                }
              </Select>,
            )}
          </Form.Item>
        </Col>
        {
          equipInfo.map((item, index) => {
            return (<Col span={12} key={item.id}><Form.Item label={`${item.name}    产能`} key={item.id}>
              {getFieldDecorator(`deviceNum${index}`, {
                rules: [{ required: true, message: '请输入产能！' }],
                initialValue: item.productivity || '',
              })(<Input type='number' onChange={(e) => this.changeEquipNum(e.target.value, index)} addonAfter={'个/h'}
                        maxLength={7}/>)}
            </Form.Item></Col>);
          })
        }
        <Col span={12}>
          <Form.Item label='转序数量' key={2}>
            {getFieldDecorator('minLimitNum', {
              rules: [{ required: true, message: '请输入转序数量！' }],
              initialValue: itemData.minLimitNum || '',
            })(<Input type='number' addonAfter={'个'} maxLength={7}/>)}
          </Form.Item>
        </Col>
      </Row>
      <br/>
      <Button type="primary" onClick={() => handleSubmit(equipInfo)} block>保存</Button>
    </React.Fragment>;
  }
}

export default ItemEditor;
