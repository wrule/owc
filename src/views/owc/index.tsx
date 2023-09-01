import { Button, Card, Col, Input, InputNumber, Progress, QRCode, Row, Space, Spin, Statistic, Table } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import progress from './progress.gif';
import style from './index.module.scss';
import axios from 'axios';
import { Best, WorkerHub } from './workerHub';

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

export
function OWC() {
  const hubRef = useRef<WorkerHub | null>();
  const [workers, setWorkers] = useState<number>(0);
  const [qrcode, setQRCode] = useState<boolean>(false);
  const [best, setBest] = useState<Best>({ value: 0, params: { } });
  const [iterations, setIterations] = useState<number>(0);
  const [optimizers, setOptimizers] = useState<number>(0);
  const [startTime, setStartTime] = useState(0);
  const [nowTime, setNowTime] = useState(0);

  const runWorkerHub = async () => {
    if (hubRef.current === undefined) {
      hubRef.current = null;
      hubRef.current = new WorkerHub(
        await fetchObjectURL('/script.js'),
        (best) => setBest(best),
        (change, iterations) => setIterations(iterations),
        (change: number, workers: number) => {
          console.log(change, workers);
          setWorkers(workers);
        },
      );
      setStartTime(Date.now());
      setInterval(() => setNowTime(Date.now()), 1000);
    }
  };

  const timeCost = useMemo(() => {
    if (!nowTime || !startTime) return '00:00:00';
    const seconds = Math.floor((nowTime - startTime) / 1000);
    let result = '';
    result = ':' + (seconds % 60).toString().padStart(2, '0');
    result = ':' + (Math.floor(seconds / 60) % 60).toString().padStart(2, '0') + result;
    result = Math.floor(seconds / 3600).toString().padStart(2, '0') + result;
    return result;
  }, [nowTime, startTime]);

  useEffect(() => {
    runWorkerHub();
  }, []);

  return <div className={style.com}>
    {workers > 0 && <Row justify="center">
      <img className={style.progress} src={progress} />
    </Row>}
    <Row justify="space-between">
      <Space>
        <h3>Worker:</h3>
        <InputNumber
          style={{ width: '4rem' }}
          min={0}
          value={workers}
          onChange={(value) => {
            if (value != null && hubRef.current)
              setWorkers(hubRef.current.ChangeWorkers(Math.floor(value)));
          }}
        />
      </Space>
      <Button
        type="primary"
        onClick={() => setQRCode(!qrcode)}>
        {qrcode ? 'Collapse' : 'QRCode'}
      </Button>
    </Row>
    {qrcode && <Row justify="center">
      <QRCode value={window.location.href} />
    </Row>}
    <Row gutter={16}>
      <Col span={12}>
        <Card>
          <Statistic
            title="Best"
            value={best.value}
            valueStyle={{ fontWeight: 'bolder', cursor: 'pointer' }}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Statistic
            title="Iterations"
            value={iterations}
          />
        </Card>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Card>
          <Statistic
            title="Optimizers"
            value={optimizers}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Statistic
            title="TimeCost"
            value={timeCost}
          />
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <Table
          showHeader={false}
        />
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <Table
          showHeader={false}
        />
      </Col>
    </Row>
  </div>;
}
