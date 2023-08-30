import { Button, Col, Progress, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import progress from './progress.gif';
import style from './index.module.scss';
import axios from 'axios';

async function fetchObjectURL(url: string) {
  let objectURL = localStorage.getItem(url);
  if (objectURL != null) {
    try {
      await fetch(objectURL);
      return objectURL;
    } catch (err) { console.error(err); }
  }
  const res = await fetch(url);
  const blob = new Blob([await res.text()], {
    type: res.headers.get('content-type') ?? 'text/plain',
  });
  objectURL = URL.createObjectURL(blob);
  localStorage.setItem(url, objectURL);
  return objectURL;
}

function Ready() {
  const [scriptProgress, setScriptProgress] = useState<number>(0);
  const [dataProgress, setDataProgress] = useState<number>(0);

  const load = async () => {
    console.log(1);
    const rsp = await fetchObjectURL('/data.json');
    console.log(2);
  };

  useEffect(() => {
    load();
  }, []);

  return <div className={style.com}>
    <Button onClick={() => {
      window.open(window.location.href);
    }}>Fork</Button>
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
