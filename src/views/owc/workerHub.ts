
export
interface Best {
  value: number;
  params: any;
}

export
class WorkerHub {
  public constructor(private scriptURL: string) {

  }

  private workers: Worker[] = [];
  private iterations = 0;
  private best: Best = { value: -Infinity, params: { } };

  private createWorker() {
    const worker = new Worker(this.scriptURL);
    worker.onmessage = (event) => {
      const type: string = event.data?.type;
      const data: any = event.data?.data;
      if (type === 'iterations') this.iterations += data ?? 0;
      if (type === 'best' && data?.value > this.best.value) {
        console.log(data);
      }
    };
    return worker;
  }

  public ChangeWorkers(num: number) {
    let diff = num - this.workers.length;
    if (diff > 0)
      this.workers.push(...Array(diff).fill(0).map(() => this.createWorker()));
    if (diff < 0) {
      diff = -diff;
      while (diff > 0 && this.workers.length > 1)
        this.workers.pop()?.terminate();
    }
    return this.workers.length;
  }
}
