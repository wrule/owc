import { Col, Progress, Row, Spin } from 'antd';
import React, { useState } from 'react';
import progress from './progress.gif';
import style from './index.module.scss';

function Ready() {
  const [scriptProgress, setScriptProgress] = useState<number>(99);
  const [dataProgress, setDataProgress] = useState<number>(100);

  return <div className={style.com}>
    <Row>
      <span>{`Script loading${scriptProgress === 100 ? ' complete' : '...'}`}</span>
      <Progress percent={scriptProgress} />
    </Row>
    <Row>
      <span>{`Data loading${dataProgress === 100 ? ' complete' : '...'}`}</span>
      <Progress percent={dataProgress} />
    </Row>
  </div>;
}

export
function OWC() {
  return <Ready />;
}
