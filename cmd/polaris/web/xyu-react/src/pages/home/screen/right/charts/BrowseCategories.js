import React, { PureComponent } from 'react';
import Chart from '@/components/charts/chart';
import { BrowseCategoriesOptions } from './options';

// 关联数据类别
class BrowseCategories extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      renderer: 'canvas',
    };
  }

  render() {
    const { renderer } = this.state;
    const { browseCategories } = this.props;
    return (
      <div
        style={{
          width: '12.375rem',
          height: '12.3rem',
        }}>
        {browseCategories ? (
          <Chart
            renderer={renderer}
            option={BrowseCategoriesOptions(browseCategories)}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default BrowseCategories;
