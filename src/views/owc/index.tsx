import { Button, Col, Progress, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import progress from './progress.gif';
import style from './index.module.scss';
import axios from 'axios';


async function fetchResource(url: string) {
  const cacheUrl = localStorage.getItem(url);
  if (cacheUrl != null) {
    try {
      const res = await axios.get(cacheUrl);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }
  const res = await axios.get(url);
  const blob = new Blob([res.data], { type: res.headers['content-type'] });
  const objectUrl = URL.createObjectURL(blob);
  localStorage.setItem(url, objectUrl);
  return res.data;
}

function Ready() {
  const [scriptProgress, setScriptProgress] = useState<number>(0);
  const [dataProgress, setDataProgress] = useState<number>(0);

  const load = async () => {
    console.log(1);
    const rsp = await fetchResource('/data.json');
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
