import React, { PureComponent } from 'react';
import Chart from '@/components/charts/chart';
import { FeedbackOptions } from './options';

class Feedback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      renderer: 'canvas',
      option: '',
    };
  }

  render() {
    const { renderer } = this.state;
    const { FeedbackData } = this.props;
    return (
      <div
        style={{
          width: '5.25rem',
          height: '5.25rem',
        }}>
        <Chart
          renderer={renderer}
          option={FeedbackOptions(FeedbackData)}
        />
        ;
      </div>
    );
  }
}

export default Feedback;
