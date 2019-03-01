import React, { Component } from 'react';
import G6Editor, { Flow } from '@antv/g6-editor';

import styles from './style.less';
import Page from './Page';
import ItemPannel from './ItemPannel';
import mark2 from './mark2.svg';

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

class Editor extends Component {
  constructor (props) {
    super(props);
    this.editor = new G6Editor();
    this.state = {
      dataList: [], // 存储内容
      relation: {},
      data: [
        {
          id: '1',
          name: 'source_kafka',
          topic: 'test1',
          group: 'test_yrw',
          partition: '60',
          replicas: '2',
          split: ',',
          fields:
            'host:string,https:string,method:string,request_body:string,uri:string,response_body:string',
        },
        {
          id: '2',
          name: 'filter_1',
          rule: 'host,uri,request_body,response_body',
          numPartition: 60,
        },
        {
          id: '3',
          name: 'filter_2',
          rule: 'host,uri,request_body,response_body',
          type: 'transform',
          numPartition: 60,
        },
        {
          id: '4',
          name: 'elasticSearch_1',
          port: '9200',
          index: 'test_2018XX',
          numShards: '3',
          numReplicas: '1',
        },
        {
          id: '5',
          name: 'elasticSearch_2',
          port: '9200',
          index: 'test2_2018XX',
          numShards: '3',
          numReplicas: '1',
        },
      ],
    };
  }

  componentDidMount () {
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
        let Obj = null;
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === item.shape) {
            Obj = JSON.parse(JSON.stringify(data[i]));
            Obj.id = item.id;
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

    // 初始化
    const { data, relation } = this.state;
    const list = [];
    data.forEach(dt => {
      this.registerNode(dt);
      // 需要页面加载完成之后渲染有数据的
      if (relation.nodes && relation.nodes.length > 0) {
        page.read(relation);
        relation.nodes.map(item => {
          let obj = {};
          if (item.shape === dt.id) {
            obj = JSON.parse(JSON.stringify(dt));
            obj.id = item.id;
            list.push(obj);
          }
          return obj;
        });
      }
    });
    this.setState({ dataList: list });
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
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].id === e.id) {
        dataList[i] = e;
      }
    }
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
      return Object.assign(item, { childens: [] });
    });
    edges.map(item => {
      sourceIds.push(item.source); // 保存所有子类ID
      const source = newData[ids.indexOf(item.source)] || {}; // 从何处
      const target = newData[ids.indexOf(item.target)] || {}; // 到何处
      if (source && source.id && target && target.id) {
        target.childens.push({ ...source });
      }
      return '';
    });
    ids.map((id, index) => {
      if (sourceIds.indexOf(id) === -1) {
        parentData = newData[index];
      }
      return '';
    });
    // console.log('父类ID为：', parentData);
  };

  render () {
    const { relation, dataList, data } = this.state;
    return (
      <div className={styles.editor}>
        <ItemPannel editor={this.editor} data={data}/>
        <Page
          relation={relation}
          callBack={this.callBack}
          editor={this.editor}
          dataList={dataList}
        />
      </div>
    );
  }
}

export default Editor;
