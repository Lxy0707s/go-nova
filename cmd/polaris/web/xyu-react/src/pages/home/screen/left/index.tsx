import { LeftPage, LeftTopBox, LeftBottomBox } from './style';
import {ModuleTitle} from "../../screen/common/style";
import UserSituation from "../../screen/left/charts/UserSituation";
import {StatisticCard} from "@ant-design/pro-components";
import PieContain from './charts/PieChart';
import React from "react";


const data ={
    accessFrequency: 1500,
    peakFlow: 300,
    trafficSitua: {
        timeList: ['9:00', '12:00', '15:00', '18:00', '21:00', '00:00'],
        outData: [502.84, 205.97, 332.79, 281.55, 398.35, 214.02],
        inData: [281.55, 398.35, 214.02, 179.55, 289.57, 356.14],
    },
    browseCategories: {
            data: [782, 621.2, 322.1, 525.3, 265, 224],
            indicator: [
                {
                    name: '食物',
                    max: 1000,
                },
                {
                    name: '娱乐',
                    max: 1000,
                },
                {
                    name: '运动',
                    max: 1000,
                },
                {
                    name: '家居',
                    max: 1000,
                },
                {
                    name: '机械',
                    max: 1000,
                },
                {
                    name: '学习',
                    max: 1000,
                },
            ],
        },
    userSitua: {
        header: ['用户', '时间', '状态'],
        data: [
            ['用户1', '2020-11-11 12:00', '在线'],
            ['用户2', '2020-11-11 12:00', '离线'],
            ['用户3', '2020-11-11 12:00', '在线'],
            ['用户4', '2020-11-11 12:00', '在线'],
            ['用户5', '2020-11-11 12:00', '在线'],
            ['用户6', '2020-11-11 12:00', '离线'],
            ['用户7', '2020-11-11 12:00', '在线'],
            ['用户8', '2020-11-11 12:00', '在线'],
            ['用户9', '2020-11-11 12:00', '离线'],
            ['用户11', '2020-11-11 12:00', '离线'],
            ['用户12', '2020-11-11 12:00', '离线'],
            ['用户13', '2020-11-11 12:00', '离线'],
        ],
    },
}

export const LeftScreen = () => {
  const { userSitua } = data
  return (
      <LeftPage>
          {/* 顶部图表 */}
          <LeftTopBox>
              <div className='left-top-borderBox12'>
                  <div className='left-top'>
                      <ModuleTitle>
                          <i className='iconfont'>&#xe88e;</i>
                          <span>用户数据状态</span>
                      </ModuleTitle>
                      <StatisticCard
                          className='transparent-card'
                          chart={<PieContain/>}
                      />

                  </div>
              </div>
          </LeftTopBox>
          {/* 底部图表 */}
          <LeftBottomBox>
              <div className='left-bottom-borderBox13'>
                  <div className='left-bottom'>
                      <ModuleTitle>
                          <i className='iconfont'>&#xe88e;</i>
                          <span>用户数据状态</span>
                      </ModuleTitle>
                      {/* 图表 */}
                      <UserSituation userSitua={userSitua}></UserSituation>
                  </div>
              </div>
          </LeftBottomBox>
      </LeftPage>
  )
}
