import React, { PureComponent } from 'react';
import Chart from '@/components/charts/chart';
import { OfflinePortalOptions } from './options';

class OfflinePortal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      renderer: 'canvas',
    };
  }

  render() {
    const { renderer } = this.state;
    const { offlinePortalData } = this.props;
    return (
      <div
        style={{
          width: '26.75rem',
          height: '10.875rem',
        }}>
        <Chart
          renderer={renderer}
          option={OfflinePortalOptions(offlinePortalData)}
        />
      </div>
    );
  }
}

export default OfflinePortal;
