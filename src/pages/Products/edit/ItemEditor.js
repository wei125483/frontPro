import React, { Component } from 'react';
import { Input, Form, Select } from 'antd';

const { Option } = Select.Option;
const { TextArea } = Input;

class ItemEditor extends Component {

  render () {
    const { data, getFieldDecorator } = this.props;
    const hideFileds = ['id', 'name'];
    const areaFileds = ['fields', 'rule'];
    const getItem = (dt) => {
      if (areaFileds.indexOf(dt.name) > -1) {
        return <TextArea rows={4}/>;
      } else if (Array.isArray(dt.value)) {
        return <Select mode="multiple" style={{ width: '100%' }}>
          {dt.value.map(item => <Option key={item}>{item}</Option>)}
        </Select>;
      } else {
        return <Input/>;
      }
    };

    const input = data.map((dt, i) => {
      return <Form.Item label={dt.name} key={i}
                        style={{ display: hideFileds.indexOf(dt.name) > -1 ? 'none' : 'block' }}>
        {getFieldDecorator(dt.name, {
          initialValue: dt.value || '',
        })(getItem(dt))}
      </Form.Item>;
    });

    return (
      <React.Fragment>
        {input}
      </React.Fragment>
    );
  }
}

export default ItemEditor;
