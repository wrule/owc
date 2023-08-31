import { Button, Col, Input, InputNumber, Progress, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import progress from './progress.gif';
import style from './index.module.scss';
import axios from 'axios';
import { WorkerHub } from './workerHub';

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
  const [workers, setWorkers] = useState<number>();

  const runWorkerHub = async () => {
    if (hubRef.current === undefined) {
      hubRef.current = null;
      console.log(1122);
      hubRef.current = new WorkerHub(
        await fetchObjectURL('/script.js'),
        console.log,
        console.log,
        (change: number, workers: number) => {
          console.log(change, workers);
          setWorkers(workers);
        },
      );
    }
  };

  useEffect(() => {
    runWorkerHub();
  }, []);

  return <div>
    <InputNumber
      value={workers}
      onChange={(value) => {
        if (value && hubRef.current) {
          setWorkers(hubRef.current.ChangeWorkers(value));
        }
      }}
    />
  </div>;
}
