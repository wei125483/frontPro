import React, { Component } from 'react';
import G6Editor, { Flow } from '@antv/g6-editor';

import styles from './style.less';
import Page from './Page';
import ItemPannel from './ItemPannel';
import mark2 from './mark2.svg';
import { Form, Input, Select, Button, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

// 注册模型卡片基类
Flow.registerNode('model-card', {
  draw (item) {
    const group = item.getGraphicGroup();
    const model = item.getModel();
    const width = 184;
    const height = 40;
    const x = -width / 2;
    const y = -height / 2;
    const borderRadius = 4;
    const keyShape = group.addShape('rect', {
      attrs: {
        x,
        y,
        width,
        height,
        radius: borderRadius,
        fill: 'white',
        stroke: '#CED4D9',
      },
    });
    // 左侧色条
    group.addShape('path', {
      attrs: {
        path: [
          ['M', x, y + borderRadius],
          ['L', x, y + height - borderRadius],
          ['A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height],
          ['L', x + borderRadius, y],
          ['A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius],
        ],
        fill: this.color_type,
      },
    });
    // 类型 logo
    group.addShape('image', {
      attrs: {
        img: this.type_icon_url,
        x: x + 16,
        y: y + 12,
        width: 20,
        height: 16,
      },
    });
    // 名称文本
    const label = model.label ? model.label : this.label;
    group.addShape('text', {
      attrs: {
        text: label,
        x: x + 52,
        y: y + 13,
        textAlign: 'start',
        textBaseline: 'top',
        fill: 'rgba(0,0,0,0.65)',
      },
    });
    return keyShape;
  },
  anchor: [[0.5, 0, { type: 'input' }], [0.5, 1, { type: 'output' }]],
});

@Form.create()
class Editor extends Component {
  constructor (props) {
    super(props);
    this.editor = new G6Editor();
    this.state = {
      dataList: [], // 存储内容
      relation: {}, // 线路图位置信息
      processList: [],
      equipList: [],// 设备下拉列表
      parentData: {}, // 添加时 传参
      isAdd: true,
      data: [],
    };
  }

  componentDidMount () {

    const { itemData = {} } = this.props;
    if (itemData.id) {
      // 如果是修改数据
      this.setState({
        isAdd: false,
        relation: JSON.parse(itemData.position),
      });
    }
    const page = this.editor.getCurrentPage();
    // 显示网格线
    page.showGrid();

    // 输入锚点不可以连出边
    page.on('hoveranchor:beforeaddedge', ev => {
      if (ev.anchor.type === 'input') {
        ev.cancel = true;
      }
      // 只能有一个输出线
      const { id, dataMap } = ev.item;
      Object.getOwnPropertyNames(dataMap).map(item => {
        if (dataMap[item].source && dataMap[item].source === id) {
          ev.cancel = true;
        }
      });
    });

    page.on('dragedge:beforeshowanchor', ev => {
      // console.log(ev);
      // 只允许目标锚点是输入，源锚点是输出，才能连接
      if (!(ev.targetAnchor.type === 'input' && ev.sourceAnchor.type === 'output')) {
        ev.cancel = true;
      }
      // // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
      // if (ev.dragEndPointType === 'source' && page.anchorHasBeenLinked(ev.source, ev.sourceAnchor)) {
      //   ev.cancel = true;
      // }
    });

    // 变更后
    page.on('afterchange', ev => {
      const relation = page.save();
      const { dataList, data } = this.state;

      this.setState({ relation });
      const getItem = item => {
        const Obj = {};
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == item.shape) {
            // Obj = JSON.parse(JSON.stringify(data[i]));
            Obj.id = item.id;
            Obj.craftsId = item.shape;
            break;
          }
        }
        return Obj;
      };

      if (ev.action === 'add') {
        const item = ev.model;
        const obj = getItem(item);
        if (obj) {
          dataList.push(obj);
          this.setState({ dataList });
        }
        this.ergodicComput();
      } else if (ev.action === 'remove') {
        const item = ev.item.model;
        let index = -1;
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].id === item.id) {
            index = i;
            break;
          }
        }
        if (index !== -1) {
          dataList.splice(index, 1);
          this.setState({ dataList });
        }
        this.ergodicComput();
      }

    });

    const that = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'crafts/fetch',
      payload: {
        pageNum: 1,
        pageSize: 1000,
      },
      callback (resp) {
        const { list } = resp;
        that.setState({ data: list });

        // 初始化
        const { relation } = that.state;
        const listArr = [];
        list.forEach(dt => {
          that.registerNode(dt);
          // 需要页面加载完成之后渲染有数据的
          if (relation.nodes && relation.nodes.length > 0) {
            page.read(relation);
            relation.nodes.map(item => {
              let obj = {};
              if (item.shape === dt.id) {
                obj = JSON.parse(JSON.stringify(dt));
                obj.id = item.id;
                listArr.push(obj);
              }
              return obj;
            });
          }
        });

        that.setState({ dataList: itemData.itemList || [] });
      },
    });

    // 查询所有设备信息
    dispatch({
      type: 'equip/fetchBrief',
      callback (response) {
        const { data, code } = response;
        code == '200' && that.setState({ equipList: data });
      },
    });
  }

  registerNode = dt => {
    const obj = {
      label: dt.name,
      color_type: '#1890FF',
      type_icon_url: mark2,
      // 设置锚点
      anchor: [[0.5, 0, { type: 'input' }], [0.5, 1, { type: 'output' }]],
    };
    Flow.registerNode(dt.id, obj, 'model-card');
  };

  callBack = e => {
    // 重新赋值
    const { dataList } = this.state;
    const list = [...dataList];
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id === e.id) {
        Object.assign(list[i], e);
        break;
      }
    }
    this.setState({ dataList: list });
    this.ergodicComput();
  };

  /**
   * 格式化数据 格式化为接口所需要的数据（子父类）
   */
  ergodicComput = () => {
    const { dataList, relation } = this.state;
    const { edges = [] } = relation;
    const ids = dataList.map(item => item.id);
    const sourceIds = [];
    let parentData = {};
    const newData = JSON.parse(JSON.stringify(dataList)).map(item => {
      return Object.assign(item, { children: [] });
    });
    edges.map(item => {
      sourceIds.push(item.source); // 保存所有子类ID
      const source = newData[ids.indexOf(item.source)] || {}; // 从何处
      const target = newData[ids.indexOf(item.target)] || {}; // 到何处
      if (source && source.id && target && target.id) {
        const sources = { ...source };
        sources.grid = sources.id;
        delete sources.id;
        target.children.push({ ...sources });
      }
      return '';
    });
    ids.map((id, index) => {
      // 判断是否存在，不存在就插入新数据
      if (id && sourceIds.indexOf(id) === -1) {
        parentData = { ...newData[index] };
        parentData.grid = parentData.id;
        delete parentData.id;
      }
      return '';
    });
    this.setState({ parentData: parentData });
  };

  render () {
    const { relation, dataList, data, isAdd, equipList, parentData } = this.state;
    const { resourceList, form, handleSubmit, onClose, itemData = {} } = this.props;

    // 递归判断图例信息是否填写完整
    const checkPraentData = (pData) => {
      if (!pData.craftsId || !pData.produceId || !pData.minLimitNum || pData.devices.length < 1) {
        return false;
      }
      let flag = true;
      for (let i = 0; i < pData.children.length; i++) {
        const item = pData.children[i];
        let devFlag = true;
        if (!item.craftsId || !item.produceId || !item.minLimitNum || item.devices.length < 1) {
          flag = false;
          break;
        }
        for (let j = 0; j < item.devices.length; j++) {
          const device = item.devices[j];
          if (!device.id || !device.productivity) {
            devFlag = false;
            break;
          }
        }
        if (!devFlag) {
          flag = false;
          break;
        }
        return checkPraentData(item);
      }
      return flag;
    };

    const submitBefore = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // message.warning('请新增线路图');

        // 如果没有线路图信息 返回false
        if (!parentData.grid) {
          message.warning('请将线路信息填写完整！');
          return;
        }

        // 如果图例个数大于1 就一定要有children 否则返回false
        if (relation.nodes && relation.nodes.length > 1 && parentData.children.length < 1) {
          message.warning('请将线路信息连接完整！');
          return;
        }

        // 每个图例的信息都是必填项 否则返回false
        if (!checkPraentData(parentData)) {
          message.warning('请点击图例将线路信息补充完整！');
          return;
        }
        const params = Object.assign({}, {
          ...fieldsValue,
          position: JSON.stringify(relation),
          craftsProcess: parentData,
        });
        handleSubmit(params, form);
        // JSON.stringify(relation); // 存放线路位置信息
      });
    };
    return (
      <React.Fragment>
        <div className={styles.formBox}>
          <Form layout="inline">
            <FormItem key="title">
              <span className={styles.titleSpan}>{isAdd ? '新增工艺路线' : '修改工艺线路'}</span>
            </FormItem>
            <FormItem key="name" label="工艺线路名称">
              {form.getFieldDecorator('name', {
                initialValue: itemData.name || '',
                rules: [{ required: true, message: '请输入工艺线路名称！' }, { max: 20, message: '工艺线路名称长度不能超过20字符' }],
              })(<Input placeholder="请输入" maxLength={20}/>)}
            </FormItem>
            <FormItem key="type" label="产品名称">
              {form.getFieldDecorator('productId', {
                initialValue: itemData.productId || '',
                rules: [{ required: true, message: '请选择产品名称！' }],
              })(
                <Select style={{ width: '160px' }} placeholder="请选择">
                  {
                    resourceList.map(item => {
                      return (<Option key={item.serial_num} value={item.materialId}>{item.materialName}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <Button style={{ float: 'right', margin: '10px 50px 0 0' }} type="default" size="small"
                    onClick={onClose} icon="close-circle">取消</Button>
            <Button className={styles.DrawerSaveBtn} type="primary" onClick={submitBefore} size="small"
                    icon="file-done">保存</Button>
          </Form>
        </div>
        <div className={styles.editor}>
          <ItemPannel editor={this.editor} data={data}/>
          <Page
            resourceList={resourceList}
            equipList={equipList}
            relation={relation}
            callBack={this.callBack}
            editor={this.editor}
            dataList={dataList}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Editor;
