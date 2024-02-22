import {
    RightPage,
    RightTopBox,
    RightCenterBox,
    RightBottomBox,
} from './style';
import { ModuleTitle } from '../common/style';
import UserIdentityCategory from './charts/UserIdentityCategory';
import Feedback from './charts/Feedback';
import OfflinePortal from './charts/OfflinePortal';
import BrowseCategories from './charts/BrowseCategories';

const browseCategoryData = {
    browseCategories: {
            data: [782, 621.2, 322.1, 525.3, 265, 224],
            indicator: [
                {
                    name: 'Go',
                    max: 1000,
                },
                {
                    name: 'Java',
                    max: 1000,
                },
                {
                    name: 'Python',
                    max: 1000,
                },
                {
                    name: 'React',
                    max: 1000,
                },
                {
                    name: 'Shell',
                    max: 1000,
                },
                {
                    name: 'other',
                    max: 1000,
                },
            ],
        },
    userIdentityCategory: {
            data: [
                {
                    name: 'P8s',
                    value: 40,
                },
                {
                    name: 'ES/Tengin',
                    value: 67,
                },
                {
                    name: 'Logstash',
                    value: 56,
                },
                {
                    name: 'Grafana',
                    value: 80,
                },
                {
                    name: 'Kafka',
                    value: 89,
                },
            ],
        },
    offline: {
            feedback: [
                {
                    title: '在线用户数',
                    number: 90,
                },
                {
                    title: '新用户数',
                    number: 82,
                },
                {
                    title: '离线用户数',
                    number: 34,
                },
            ],
            offlinePortalData: {
                data1: [80, 152, 101, 134, 90, 130],
                data2: [120, 182, 191, 210, 170, 110],
                data3: [110, 132, 201, 154, 150, 80],
                data4: [90, 142, 161, 114, 190, 170],
                xData: ['9:00', '12:00', '15:00', '18:00', '21:00', '00:00'],
                barData: [32.2, 60.0, 32.6, 36.4, 53.3, 35.0],
            },
        },
}

export const RightScreen = () => {
    const { browseCategories, userIdentityCategory,offline } = browseCategoryData;
    return (
        <RightPage >
            {/* 顶部图表 */}
            <RightTopBox>
                <div className='right-top'>
                    <div className='right-top-content'>
                        <BrowseCategories browseCategories = {browseCategories}></BrowseCategories>
                        <img
                            alt='地球'
                            className='earth-gif'
                            src={require('../../../../assets/images/earth-rotate.gif')}
                        />
                    </div>
                </div>
            </RightTopBox>
            {/* 中部图表 */}
            <RightCenterBox>
                <ModuleTitle>
                    <i className='iconfont'>&#xe7fd;</i>
                    <span>开源组件使用情况</span>
                </ModuleTitle>
                <UserIdentityCategory userIdentityCategory={userIdentityCategory}></UserIdentityCategory>
            </RightCenterBox>
            {/* 底部图表 */}
            <RightBottomBox>
                <div className='right-bottom-borderBox13'>
                    <div className='right-bottom'>
                        <ModuleTitle>
                            <i className='iconfont'>&#xe790;</i>
                            <span>主要项目流量统计</span>
                        </ModuleTitle>
                        {/* 反馈 */}
                        <div className='feedback-box'>
                            {offline
                                ? offline.feedback.map((item, index) => {
                                    return (
                                        <div className='feedback-box-item' key={index}>
                                            <Feedback FeedbackData={item}></Feedback>
                                            <span className='dis-text'>{item.title}</span>
                                        </div>
                                    )}) : ''}
                        </div>
                        {/* 门店 */}
                        <div className='offline-portal-box'>
                            {offline ? (<OfflinePortal offlinePortalData={offline.offlinePortalData}/>) : ('')}
                        </div>
                    </div>
                </div>
            </RightBottomBox>
        </RightPage>
    )
}