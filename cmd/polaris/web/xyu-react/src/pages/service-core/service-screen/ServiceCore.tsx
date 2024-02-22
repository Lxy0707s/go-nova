import { ProCard, StatisticCard } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
import {BarCharts, LinerChart, PieCharts} from '../../home';
import {Navigate} from "react-router-dom";


const { Statistic } = StatisticCard;

export const ServiceCore = () => {
    return (
        <Navigate
            to={`/service-core/screen`}
            replace
        />
    )
}

export const ServiceScreen = () => {
    const [responsive, setResponsive] = useState(false);

    return (
      <RcResizeObserver
          key="resize-observer"
          onResize={(offset) => {
              setResponsive(offset.width < 596);
          }}
      >
          <ProCard
              title="数据概览"
              extra="2023年7月1日 星期六"
              split={responsive ? 'horizontal' : 'vertical'}
              headerBordered
              bordered
          >
              <ProCard split="horizontal">
                  <ProCard split="horizontal">
                      <ProCard split="vertical">
                          <StatisticCard
                              statistic={{
                                  title: '昨日全部流量',
                                  value: 211,
                                  description: (
                                      <Statistic
                                          title="较本月平均流量"
                                          value="8.04%"
                                          trend="down"
                                      />
                                  ),
                              }}
                          />
                          <StatisticCard
                              statistic={{
                                  title: '本月累计流量',
                                  value: 324,
                                  description: (
                                      <Statistic title="月同比" value="8.04%" trend="up" />
                                  ),
                              }}
                          />
                      </ProCard>
                      <ProCard split="vertical">
                          <StatisticCard
                              statistic={{
                                  title: '运行中实验',
                                  value: '12/56',
                                  suffix: '个',
                              }}
                          />
                          <StatisticCard
                              statistic={{
                                  title: '历史实验总数',
                                  value: '101',
                                  suffix: '个',
                              }}
                          />
                      </ProCard>
                      <ProCard split="vertical">
                          <StatisticCard
                              title="流量统计"
                              chart={<BarCharts/>}
                          />
                      </ProCard>
                  </ProCard>
              </ProCard>
              <ProCard split="horizontal">
                  <ProCard split="horizontal">
                      <StatisticCard
                          title="流量占用情况"
                          chart={
                              <PieCharts/>
                          }
                      />
                      <StatisticCard
                          title="流量走势"
                          chart={<LinerChart/>}
                      />
                  </ProCard>
              </ProCard>
          </ProCard>
      </RcResizeObserver>
  )
}