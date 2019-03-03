import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip, Label } from 'bizcharts';
import { connect } from 'dva';
import { DatePicker, Card } from 'antd';

import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;

@connect(({ materials, loading }) => ({
  materials,
  loading: loading.models.materials,
}))
class FeedingCharts extends PureComponent {
  state = {
    formValues: {
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    },
    isNoData: true,
  };

  componentDidMount () {
    this.dispathFetch();
  }

  dispathFetch () {
    const { formValues } = this.state;
    this.getFormValues(formValues);
  }

  getFormValues (values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/fetch',
      payload: { ...values },
    });
  }

  render () {
    const { materials: { data: dataList }, loading } = this.props;
    const { formValues, isNoData } = this.state;
    const { data = [], dates = [] } = dataList.list;
    const source = [];
    const yNames = [];
    const xDates = [...dates];

    data.map(item => {
      yNames.push(item.name);
      item.apsMaterialPlans.map(d => {
        const obj = {};
        obj.name = d.workDate;
        obj.date = item.name;
        obj.sales = d.amount;
        source.push(obj);
      });
    });

    const onChange = (dateString) => {
      const values = { ...formValues };
      values.startDate = dateString[0];
      values.endDate = dateString[1];
      this.getFormValues(values);
    };

    const cols = {
      name: {
        type: 'cat',
        values: xDates,
      },
      date: {
        type: 'cat',
        values: yNames,
      },
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.search}>
            <span>筛选日期：</span>
            <RangePicker
              defaultValue={[moment(formValues.startDate), moment(formValues.endDate)]}
              onChange={(e, dateString) => onChange(dateString)}/>
            <br/>
            <br/>
          </div>
          {
            isNoData && <div className={styles.noData}>
              <img alt="暂无数据"
                   src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"/>
              <p className="ant-empty-description">暂无数据</p>
            </div>
          }
          {
            !isNoData && <Chart height={600} data={source} scale={cols} padding={[20, 80, 120, 85]} forceFit>
              <Axis name="name" grid={{
                align: 'center',
                lineStyle: { lineWidth: 1, lineDash: null, stroke: '#f0f0f0' },
                showFirstLine: true,
              }}/>
              <Axis name="date"
                    grid={{ align: 'center', lineStyle: { lineWidth: 1, lineDash: null, stroke: '#f0f0f0' } }}/>
              <Tooltip
                containerTpl='<div class="g2-tooltip"><p class="g2-tooltip-title"></p><table class="g2-tooltip-list"></table></div>'
                itemTpl='<tr class="g2-tooltip-list-item"><td style="color:{color}">投料数量：</td><td>{value}</td></tr>'
                offset={50}
                g2-tooltip={{
                  position: 'absolute',
                  visibility: 'hidden',
                  border: '1px solid #efefef',
                  backgroundColor: 'white',
                  color: '#000',
                  opacity: '0.8',
                }}
                g2-tooltip-list={{}}/>
              <Geom type="polygon" position="name*date" color={['sales', '#BAE7FF-#1890FF-#0050B3']}
                    style={{ stroke: '#fff', lineWidth: 1 }}>
                <Label content="sales" offset={-2}
                       textStyle={{
                         fill: '#fff',
                         fontWeight: 'bold',
                         shadowBlur: 2,
                         shadowColor: 'rgba(0, 0, 0, .45)',
                       }}/>
              </Geom>
            </Chart>
          }

        </Card>
      </div>
    );
  }
}

export default FeedingCharts;
