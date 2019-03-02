import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Col,
  Row,
  List,
  TimePicker,
  Popconfirm,
  Select,
  Switch,
  Icon,
  Modal,
  message,
} from 'antd';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    changeWeeks,
    state,
    handleAddShifList,
  } = props;

  const { weeks, itemData, weekCheckout, addShifList } = state;
  const onAddMould = () => {
    addShifList.push({ id: addShifList.length + '', name: '', startTime: '', endTime: '' });
    handleAddShifList(addShifList);
  };
  const onDelMould = index => {
    if (addShifList.length > 1) {
      addShifList.splice(index, 1);
      handleAddShifList(addShifList);
    }
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      console.log(fieldsValue, addShifList);
      // handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      width={1000}
      title="新增出勤模式"
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

        {addShifList.length && addShifList.map((item, index) => {
          return (
            <div key={item.id}>
              <Col span={12}>
                <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="班次名称">
                  {form.getFieldDecorator(`shiftName${item.id}`, {
                    initialValue: item.name || '',
                    rules: [{ required: true, message: '请输入班次名称！' }],
                  })(<Input placeholder="请输入" maxLength={30}/>)}
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
                  {form.getFieldDecorator(`start${item.id}`, {
                    initialValue: item.startTime || '',
                    rules: [{ required: true, message: '请输入上班时间' }],
                  })(<TimePicker style={{ width: '100%' }}/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="下班时间">
                  {form.getFieldDecorator(`end${item.id}`, {
                    initialValue: item.endTime,
                    rules: [{ required: true, message: '请输入下班时间' }],
                  })(<TimePicker style={{ width: '100%' }}/>)}
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
              initialValue: itemData.endDate,
              rules: [{ required: true }],
            })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="使用状态">
            {form.getFieldDecorator('desc', {
              initialValue: itemData.enable || 0,
              rules: [{ required: true }],
            })(<Switch checkedChildren="开" unCheckedChildren="关" defaultChecked/>)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ shifts, loading }) => ({
  shifts,
  loading: loading.models.shifts,
}))
@Form.create()
class ShiftsList extends PureComponent {
  state = {
    modalVisible: true,
    weekCheckout: 0,
    itemData: {},
    weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
    addShifList: [{ id: '0', name: '', startTime: '', endTime: '' }],
  };

  componentDidMount() {
    this.handleStandard();
  }

  handleModalVisible = flag => {
    this.setState({
      addShifList: [],
      modalVisible: !!flag,
    });
  };

  handleStandard = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shifts/fetch',
    });
  };
  changeWeeks = (v) => {
    this.setState({
      weekCheckout: v,
    });
  };
  // 添加addModalLenght
  handleAddShifList = array => {
    this.setState({
      // addShifList: JSON.parse(JSON.stringify(array)),
      addShifList: array,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  confirmDel = rows => {
    const { dispatch } = this.props;
    if (!rows || !rows.id) return;
    const ids = [];
    ids.push(rows.id);
    dispatch({
      type: 'shifts/remove',
      payload: { ids },
      callback: response => {
        if (response.code === 200) {
          message.success('删除成功');
        } else {
          message.warning(response.message);
        }
        this.handleStandard();
      },
    });
  };

  render() {
    const {
      shifts: { data },
      loading,
    } = this.props;
    const { modalVisible, weeks } = this.state;
    const parentMethods = {
      changeWeeks: this.changeWeeks,
      state: this.state,
      handleAdd: this.handleAdd,
      handleAddShifList: this.handleAddShifList,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新增</Button>
            </div>
            <div className={styles.cardList}>
              <List
                rowKey="id"
                loading={loading}
                grid={{ gutter: 24, lg: 5, md: 3, sm: 2, xs: 1 }}
                justify="space-between"
                dataSource={data.list}
                renderItem={item => (
                  <List.Item key={item.id} style={{ minWidth: '228px' }}>
                    <Card
                      className={styles.card}
                      actions={[
                        <Popconfirm
                          title="确认要删除这条班次模式吗？"
                          onConfirm={() => this.confirmDel(item)}
                          okText="确定"
                          cancelText="取消">
                          <a>删除</a>
                        </Popconfirm>,
                        <a onClick={() => this.handleModalVisible(true)}>编辑</a>,
                      ]}
                    >
                      <Card.Meta title={<div className={styles.cardTitle}>{item.name}</div>}/>
                      <div className={styles.shiftsBox}>
                        {JSON.parse(item.shift).map((mem, index) => {
                          return (
                            <Row key={index} justify="space-between" className={styles.shiftsRow}>
                              <Col span={10}>
                                <strong>{mem.name}</strong>
                              </Col>
                              <Col span={14}>{`${mem.startTime} - ${mem.endTime}`}</Col>
                            </Row>
                          );
                        })}
                      </div>
                      <Row justify="space-between" className={styles.shiftsRow}>
                        <Col span={10}>开始周期</Col>
                        <Col span={14}>{weeks[(item.weekStart - 1) || 0]}（循环）</Col>
                        <Col span={10}>结束周期</Col>
                        <Col span={14}>{weeks[(item.weekEnd - 1) || 0]}（循环）</Col>
                        <Col span={10}>截止日期</Col>
                        <Col span={14}>{item.endDate}</Col>
                        <Col span={10}>状态</Col>
                        <Col span={14}>{['停用', '启用'][item.enable]}</Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </div>
    );
  }
}

export default ShiftsList;
