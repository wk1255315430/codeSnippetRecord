import classnames from 'classnames';
import React from 'react';
import './style/index.less';
import { getAttribute } from '../../util/tool';

export default class BannerItem extends React.Component {
  render() {
    const { prefixCls, value, name, unit} = this.props;
    return (
      <div className={classnames(`${prefixCls}`)}>
        <div>
          <span className={classnames(`${prefixCls}-valuenum`)}>{value}</span>
          <span className={classnames(`${prefixCls}-unit`)}>{unit}</span>
        </div>
        <div className={classnames(`${prefixCls}-desc`)}>{name}</div>
      </div>
    );
  }
}
BannerItem.defaultProps = {
  prefixCls: 'banner-item',
  attributes: [],
  desc:''
};

