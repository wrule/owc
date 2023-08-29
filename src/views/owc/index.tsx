import { Col, Row, Spin } from 'antd';
import React from 'react';
import progress from './progress.gif';

export
function OWC() {
  return <Spin size="large" spinning={true} tip={<span style={{ fontSize: '1rem' }}>数据加载中...</span>}>
    <Row>
      <Col span={12}>
        {/* <img src={progress} /> */}
      </Col>
      <Col span={12}>
      </Col>
    </Row>
  </Spin>;
}
