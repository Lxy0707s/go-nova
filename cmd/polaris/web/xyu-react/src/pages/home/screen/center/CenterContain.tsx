import React, {useEffect} from 'react';
import { CenterPage, CenterBottom } from './style';
import { inject, observer} from 'mobx-react';
import Map from './Map';
import { ScreenProps } from '../props.interface';

const CenterContain: React.FC<ScreenProps> = inject("screenStore")(
    observer( (props:ScreenProps)=>{
        const { screenStore } = props
        useEffect(
            ()=>{
                screenStore.queryMapData()
                screenStore.queryDetailsList()
                const interval = setInterval(() => {
                    screenStore.queryMapData()
                    screenStore.queryDetailsList()
                    screenStore.queryGql()
                }, 10000); // 10s一次

                return () => {
                    clearInterval(interval); // 组件卸载时清除定时器
                };
            },[screenStore])

        return (
            <CenterPage >
                <Map mapData={screenStore.mapData}/>
                <CenterBottom>
                    <div className='detail-list'>
                        {screenStore.detailsList ? screenStore.detailsList.map((item:any, index:number) => {
                                return (
                                    <div className='detail-list-item' key={index}>
                                        <img
                                            src={require(`../../../../assets/images/center-details-data${
                                                index + 1
                                            }.png`)}
                                            alt={item.title}
                                        />
                                        <div className='detail-item-text'>
                                            <div className='text-style'>{item.title}</div>
                                            <span>{item.number}</span>
                                            <span className='unit'>{item.unit}</span>
                                        </div>
                                    </div>
                                );
                            })
                            : ''}
                    </div>
                </CenterBottom>
            </CenterPage>
        )}
    )
)

export default CenterContain;
