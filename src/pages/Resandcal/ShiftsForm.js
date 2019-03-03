import React, { PureComponent } from 'react';
import { Col, DatePicker, Form, Icon, Input, Modal, Row, Select, Switch, TimePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
import styles from './index.less';

@Form.create()
class CreateForm extends PureComponent {

  state = {
    addShifList: [{ index: '0', name: '', startTime: '', endTime: '' }],
  };

  render () {

    const { modalVisible, form, handleAdd, handleModalVisible, changeShifList, changeWeeks, state } = this.props;
    const { weeks, itemData, weekCheckout, addShifList = [] } = state;

    const onAddMould = () => {
      const newList = [...addShifList];
      newList.push({ index: addShifList.length + '', name: '', startTime: '', endTime: '' });
      changeShifList({ addShifList: newList });
    };
    const onDelMould = index => {
      if (addShifList.length > 1) {
        const newList = [...addShifList];
        newList.splice(index, 1);
        changeShifList({ addShifList: newList });
      }
    };
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // form.resetFields();
        const fields = {
          name: fieldsValue.name,
          weekStart: fieldsValue.weekStart,
          weekEnd: fieldsValue.weekEnd,
          enable: fieldsValue.enable ? 1 : 0,
          startDate: moment(new Date()).format('YYYY-MM-DD'),
          endDate: moment(fieldsValue.endDate).format('YYYY-MM-DD'),
        };
        const shift = addShifList.map(item => {
          item.startTime = moment(item.startTime).format('HH:mm');
          item.endTime = moment(item.endTime).format('HH:mm');
          return item;
        });
        const addObj = {
          shift: JSON.stringify(shift),
        };
        if (itemData.id) {
          Object.assign(addObj, { id: itemData.id });
        }

        Object.assign(fields, addObj);
        handleAdd(fields, form);
      });
    };
    const inputChange = (index, key, value) => {
      const newList = [...addShifList];
      newList[index][key] = value;
      changeShifList({ addShifList: newList });
    };
    const getDisabledHours = (index, key) => {
      const keyArrs = ['startTime', 'endTime'];
      const isStart = key === keyArrs[0];
      const endTime = isStart ? addShifList[index][keyArrs[1]] || null : addShifList[index][keyArrs[0]] || null;
      if (!endTime) return;
      const hours = [];
      for (let i = 0; i < 24; i++) {
        if ((isStart && i > endTime.format('HH')) || (!isStart && i < endTime.format('HH'))) {
          hours.push(i);
        }
      }
      return hours;
    };
    const getDisabledMinute = (selectedHour, index, key) => {
      const keyArrs = ['startTime', 'endTime'];
      const isStart = key === keyArrs[0];
      const endTime = isStart ? addShifList[index][keyArrs[1]] || null : addShifList[index][keyArrs[0]] || null;
      if (!endTime) return;
      const minutes = [];
      if (selectedHour == endTime.format('HH')) {
        for (let i = 0; i < 60; i++) {
          if ((isStart && i > endTime.format('mm')) || (!isStart && i < endTime.format('mm'))) {
            minutes.push(i);
          }
        }
      }
      return minutes;

    };
    return (
      <Modal
        destroyOnClose
        width={1000}
        title={itemData.id ? '编辑出勤模式' : '新增出勤模式'}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={12}>
            <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="模式名称">
              {form.getFieldDecorator('name', {
                initialValue: itemData.name || '',
                rules: [{ required: true, message: '请输入模式名称！' }],
              })(<Input placeholder="请输入" maxLength={30}/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <div className={styles.noFill}/>
          </Col>

          {addShifList.map((item, index) => {
            return (
              <div key={item.index}>
                <Col span={12}>
                  <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="班次名称">
                    {form.getFieldDecorator(`shiftName${item.index}`, {
                      initialValue: item.name || '',
                      rules: [{ required: true, message: '请输入班次名称！' }],
                    })(<Input placeholder="请输入" onChange={(e) => inputChange(index, 'name', e.target.value)}
                              maxLength={30}/>)}
                  </FormItem>
                  {
                    index === 0 ?
                      <Icon className={styles.addIcon} onClick={onAddMould} type="plus-circle" title="添加班次"/> :
                      <Icon className={`${styles.delIcon} ${styles.addIcon}`} onClick={() => onDelMould(index)}
                            type="minus-circle"/>
                  }
                </Col>
                <Col span={12}>
                  <div className={styles.noFill}/>
                </Col>
                <Col span={12}>
                  <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="上班时间">
                    {form.getFieldDecorator(`start${item.index}`, {
                      initialValue: item.startTime || null,
                      rules: [{ required: true, message: '请输入上班时间' }],
                    })(<TimePicker style={{ width: '100%' }}
                                   disabledHours={() => getDisabledHours(index, 'startTime')}
                                   disabledMinutes={(h) => getDisabledMinute(h, index, 'startTime')}
                                   format={'HH:mm'}
                                   hideDisabledOptions={true}
                                   onChange={(t) => inputChange(index, 'startTime', t)}/>)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="下班时间">
                    {form.getFieldDecorator(`end${item.index}`, {
                      initialValue: item.endTime || null,
                      rules: [{ required: true, message: '请输入下班时间' }],
                    })(<TimePicker style={{ width: '100%' }}
                                   disabledHours={() => getDisabledHours(index, 'endTime')}
                                   disabledMinutes={(h) => getDisabledMinute(h, index, 'endTime')}
                                   format={'HH:mm'}
                                   onChange={(t) => inputChange(index, 'endTime', t)}/>)}
                  </FormItem>
                </Col>
              </div>
            );
          })}

          <Col span={12}>
            <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开始周期">
              {form.getFieldDecorator('weekStart', {
                initialValue: itemData.weekStart || 1,
                rules: [{ required: true }],
              })(
                <Select style={{ width: '100%' }} onChange={changeWeeks}>
                  {
                    weeks.map((item, index) => {
                      return (<Option key={`start${item.index}`} value={index + 1}>{item}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="结束周期">
              {form.getFieldDecorator('weekEnd', {
                initialValue: itemData.weekEnd,
                rules: [{ required: true }],
              })(
                <Select style={{ width: '100%' }}>
                  {
                    weeks.map((item, index) => {
                      return (<Option key={`start${item.index}`} disabled={weekCheckout > index + 1}
                                      value={index + 1}>{item}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="截止日期">
              {form.getFieldDecorator('endDate', {
                initialValue: itemData.endDate ? moment(itemData.endDate) : null,
                rules: [{ required: true }],
              })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="使用状态">
              {form.getFieldDecorator('enable', {
                initialValue: !!itemData.enable,
                valuePropName: 'checked',
                rules: [{ required: true }],
              })(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
};
export default CreateForm;
