import { Button, Col, Input, InputNumber, Progress, Row, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
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

let iterations = 0;
let best = { value: -Infinity, params: { } as any };
let workers: Worker[] = [];

export
function OWC() {
  const workerRef = useRef<Worker | null>();

  const onBest = (best: { value: number, params: any }) => {
    console.log(best);
  };

  const onIterations = (iterations: number) => {
    console.log(iterations);
  };

  const runWorker = async () => {
    if (workerRef.current === undefined) {
      workerRef.current = null;
      workerRef.current = new Worker(await fetchObjectURL('/script.js'));
      workerRef.current.onmessage = (event) => {
        const func = ({
          'best': onBest,
          'iterations': onIterations,
        }[event.data?.type as string]);
        func?.(event.data?.data);
      };
    }
  };


  useEffect(() => {
    // console.log(navigator.hardwareConcurrency);
    runWorker();
  }, []);

  return <div>
    <InputNumber
      min={1}
    />
  </div>;
}
