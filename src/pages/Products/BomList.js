import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Col, Row, Icon, Modal, message } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from './index.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    modalLenght,
    handleAddModalLenght,
  } = props;
  const onAddMould = () => {
    const obj = modalLenght;
    obj.push({ id: new Date().getTime(), proId: '', proNum: '' });
    handleAddModalLenght(obj);
  };
  const onDelMould = index => {
    const obj = modalLenght;
    obj.splice(index, 1);
    handleAddModalLenght(obj);
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
      width={960}
      title="新增产品BOM"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={24}>
          <h3>产品</h3>
        </Col>
        <Col span={8}>
          <FormItem key="name" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="模具名称">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入至少五个字符的产品名称！', min: 5 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem key="proId" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="模具编号">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="产品编号">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <h3>产品BOM</h3>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="料品编码">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="数量">
            {form.getFieldDecorator('desc', {
              rules: [{ required: true }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        {modalLenght.map((item, index) => {
          return (
            <div key={index}>
              <Col span={12}>
                <FormItem
                  key="type"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  label="料品编码"
                >
                  {form.getFieldDecorator(`desc${item.id}`, {
                    rules: [{ required: true }],
                    initialValue: item.proId || '',
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem key="type" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="数量">
                  {form.getFieldDecorator(`num${item.id}`, {
                    rules: [{ required: true }],
                    initialValue: item.proNum || '',
                  })(<Input placeholder="请输入" />)}
                  <Icon
                    className={styles.formIcon}
                    onClick={e => onDelMould(index)}
                    type="minus-circle"
                  />
                </FormItem>
              </Col>
            </div>
          );
        })}
        <Col span={24}>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={onAddMould}
            icon="plus"
          >
            新增一条BOM
          </Button>
        </Col>
      </Row>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ boms, loading }) => ({
  boms,
  loading: loading.models.boms,
}))
@Form.create()
class BomList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    modalLenght: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    formValues: {},
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: '产品编号',
      dataIndex: 'serialNum',
    },
    {
      title: 'BOM',
      children: [
        {
          title: '配置产品编码',
          dataIndex: 'street1',
        },
        {
          title: '数量',
          dataIndex: 'num',
        },
      ],
    },
    {
      title: '规格',
      dataIndex: 'specification',
    },
    {
      title: '类型',
      dataIndex: 'productType',
      render: val => {
        // 1 - 原料； 2 - 半成品； 3 - 成品
        const index = val || 1;
        return ['原料', '半成品', '成品'][index - 1];
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'boms/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg = [], sorter = {}) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.setState({ pagination });

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'boms/fetch',
      payload: params,
    });
  };

  // 删除
  handleMenuClick = () => {
    const { dispatch } = this.props;
    const { selectedRows, pagination } = this.state;
    if (selectedRows.length === 0) return;
    const ids = [];
    selectedRows.map(item => {
      ids.push(`${item.id}`);
      return '';
    });
    dispatch({
      type: 'boms/remove',
      payload: { ids },
      callback: response => {
        if (response.code === 200) {
          message.success('删除成功');
          this.setState({ selectedRows: [] });
        } else {
          message.warning(response.message);
        }
        this.handleStandardTableChange(pagination);
      },
    });
  };

  // 勾选选择
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 显示隐藏弹框
  handleModalVisible = flag => {
    this.setState({
      modalLenght: [],
      modalVisible: !!flag,
    });
  };

  // 添加addModalLenght
  handleAddModalLenght = array => {
    this.setState({
      modalLenght: JSON.parse(JSON.stringify(array)),
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'boms/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  render() {
    const {
      boms: { data },
      loading,
    } = this.props;
    const { selectedRows, modalLenght, modalVisible } = this.state;
    const parentMethods = {
      modalLenght,
      handleAddModalLenght: this.handleAddModalLenght,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleMenuClick} key="remove">
                    批量删除
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </div>
    );
  }
}

export default BomList;
