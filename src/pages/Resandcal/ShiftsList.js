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
  const { modalVisible, form, handleAdd, handleModalVisible, addShifList, handleAddShifList } = props;

  const onAddMould = () => {
    const obj = addShifList;
    obj.push({ id: new Date().getTime(), name: '', upTime: '', dowmTime: '' });
    handleAddShifList(obj);
  };
  const onDelMould = (index) => {
    const obj = addShifList;
    obj.splice(index, 1);
    handleAddShifList(obj);
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
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
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="出勤模式">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入至少五个字符的物料名称！', min: 5 }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <div className={styles.noFill}/>
        </Col>

        <Col span={12}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="班次名称">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <Icon className={styles.addIcon} onClick={onAddMould} type="plus-circle"
                title="添加班次"/>
        </Col>
        <Col span={12}>
          <div className={styles.noFill}/>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="上班时间">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<TimePicker style={{ 'width': '100%' }}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="下班时间">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<TimePicker style={{ 'width': '100%' }}/>)}
          </FormItem>
        </Col>

        {
          addShifList.map((item, index) => {
            return (
              <div key={item.id}>
                <Col span={12}>
                  <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label='班次名称'>
                    {form.getFieldDecorator('desc' + item.id, {
                      rules: [{ required: true }],
                      initialValue: item.proId || '',
                    })(
                      <Input placeholder="请输入"/>,
                    )}
                  </FormItem>
                  <Icon className={styles.delIcon + ' ' + styles.addIcon} onClick={(e) => onDelMould(index)}
                        type="minus-circle"/>
                </Col>
                <Col span={12}>
                  <div className={styles.noFill}/>
                </Col>
                <Col span={12}>
                  <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="上班时间">
                    {form.getFieldDecorator('upTime' + item.id, {
                      rules: [{ required: true }],
                    })(<TimePicker style={{ 'width': '100%' }}/>)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="下班时间">
                    {form.getFieldDecorator('dowmTime' + item.id, {
                      rules: [{ required: true }],
                    })(<TimePicker style={{ 'width': '100%' }}/>)}
                  </FormItem>
                </Col>
              </div>
            );
          })
        }

        <Col span={12}>
          <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="应用日期">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<DatePicker style={{ 'width': '100%' }}/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="班次模式">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(
              <Select style={{ width: '100%' }}>
                <Option value="0">重复</Option>
                <Option value="1">起止</Option>
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="num" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="使用状态">
            {form.getFieldDecorator('desc', {
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
    modalVisible: false,
    addShifList: [],
    formValues: {},
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'shifts/fetch',
    });
  }

  handleModalVisible = flag => {
    this.setState({
      addShifList: [],
      modalVisible: !!flag,
    });
  };

  // 添加addModalLenght
  handleAddShifList = (array) => {
    this.setState({
      addShifList: JSON.parse(JSON.stringify(array)),
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

  render () {
    const {
      shifts: { shifts },
      loading,
    } = this.props;
    const { modalVisible, addShifList } = this.state;
    const parentMethods = {
      addShifList: addShifList,
      handleAdd: this.handleAdd,
      handleAddShifList: this.handleAddShifList,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.cardList}>
              <List
                rowKey="id"
                loading={loading}
                grid={{ gutter: 24, lg: 4, md: 3, sm: 1, xs: 1 }}
                justify="space-between"
                dataSource={[]}
                renderItem={item =>
                  item ? (
                    <List.Item key={item.id}>
                      <Card className={styles.card}
                            actions={[<a>删除</a>, <a onClick={() => this.handleModalVisible(true)}>编辑</a>]}>
                        <Card.Meta
                          title={<a className={styles.cardTitle}>{item.title}</a>}
                        />
                        {
                          item.members.map((mem) => {
                            return (<Row gutter={{ md: 8, lg: 24, xl: 48 }} key={mem.id} justify="space-between">
                              <Col span={8}>{mem.name}</Col>
                              <Col span={16}>{mem.id}</Col>
                            </Row>);
                          })
                        }
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }} justify="space-between">
                          <Col span={8}>模式</Col>
                          <Col span={16}>重复</Col>
                          <Col span={8}>应用日期</Col>
                          <Col span={16}>2018-12-01</Col>
                          <Col span={8}>状态</Col>
                          <Col span={16}>开启中</Col>
                        </Row>
                      </Card>
                    </List.Item>
                  ) : (
                    <List.Item>
                      <Button type="dashed" className={styles.newButton} onClick={() => this.handleModalVisible(true)}>
                        <Icon type="plus"/> 新建班次
                      </Button>
                    </List.Item>
                  )
                }
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
