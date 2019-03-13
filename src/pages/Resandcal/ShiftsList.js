import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Col,
  Row,
  List,
  Popconfirm,
  message,
} from 'antd';

import styles from './index.less';
import CreateForm from './ShiftsForm.js';
import moment from 'moment';

/* eslint react/no-multi-comp:0 */
@connect(({ shifts, loading }) => ({
  shifts,
  loading: loading.models.shifts,
}))
class ShiftsList extends PureComponent {
  state = {
    modalVisible: false,
    weekCheckout: 0,
    itemData: {},
    addShifList: [{ index: '0', name: '', startTime: '', endTime: '' }],
    weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
  };

  componentDidMount () {
    this.handleStandard();
  }

  handleModalVisible = (flag, item = {}) => {
    if (item.id) {
      const shifList = [];
      item.shift && JSON.parse(item.shift).map((shift, index) => {
        shifList.push(Object.assign({ ...shift }, {
          startTime: moment(shift.startTime, 'HH:mm'),
          endTime: moment(shift.endTime, 'HH:mm'),
          index: index + '',
        }));
      });
      if (shifList.length > 0) {
        this.setState({ addShifList: shifList });
      }
    } else {
      this.setState({
        addShifList: [{ index: '0', name: '', startTime: '', endTime: '' }],
      });
    }
    this.setState({
      itemData: item,
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

  changeShifList = (obj = {}) => {
    this.setState({ ...obj });
  };

  handleAdd = (fields, form) => {
    const { dispatch } = this.props;
    const { itemData } = this.state;
    const isAdd = !itemData.id;
    const that = this;

    dispatch({
      type: isAdd ? 'shifts/add' : 'shifts/update',
      payload: {
        ...fields,
      },
      callback: response => {
        if (response.code === 200) {
          message.success(isAdd ? '添加成功' : '更新成功');
          that.setState({
            itemData: {},
            addShifList: [{ index: '0', name: '', startTime: '', endTime: '' }],
            modalVisible: false,
          });
          form.resetFields();
        } else {
          message.warning(response.message);
        }
        this.handleStandard();
      },
    });

  };

  confirmDel = rows => {
    const { dispatch } = this.props;
    if (!rows || !rows.id) return;
    dispatch({
      type: 'shifts/remove',
      payload: { id: rows.id },
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

  render () {
    const {
      shifts: { data },
      loading,
    } = this.props;
    const { modalVisible, weeks } = this.state;
    const parentMethods = {
      changeWeeks: this.changeWeeks,
      state: this.state,
      changeShifList: this.changeShifList,
      handleAdd: this.handleAdd,
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
                        <a onClick={() => this.handleModalVisible(true, item)}>编辑</a>,
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
                        <Col span={14}>{weeks[(item.weekStart - 1) || 0]}</Col>
                        <Col span={10}>结束周期</Col>
                        <Col span={14}>{weeks[(item.weekEnd - 1) || 0]}</Col>
                        <Col span={10}>开始日期</Col>
                        <Col span={14}>{item.startDate}</Col>
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
