import Chart from '@/components/charts/chart';
import { mapOptions } from './options';

const Map = ({mapData}:any) => {
    const renderer = "canvas"
    return (
        <div
            style={{
                width: '35.625rem',
                height: '27.125rem',
                marginTop: '2rem',
            }}>
            {
                mapData?<Chart renderer={renderer} option={mapOptions(mapData)} />:''
            }
        </div>
    );
}

export default Map;
