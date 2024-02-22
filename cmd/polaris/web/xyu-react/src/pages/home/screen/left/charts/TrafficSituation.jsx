import React, { PureComponent } from 'react';
import { trafficOptions } from './options';
import Chart from "@/components/charts/chart";

class TrafficSituation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      renderer: 'canvas',
    };
  }

  render() {
    const { renderer } = this.state;
    const { trafficSitua } = this.props;
    return (
      <div
        style={{
          width: '3.375rem',
          height: '4.125rem',
        }}>
        {trafficSitua ? (
          <Chart renderer={renderer} option={trafficOptions(trafficSitua)} />
        ) : (
          ''
        )}
      </div>
    );
  } //endrender
}

export default TrafficSituation;
