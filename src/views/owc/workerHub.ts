
export
interface Best {
  value: number;
  params: any;
}

export
class WorkerHub {
  public constructor(
    private scriptURL: string,
    private emitBest: (best: Best) => void,
    private emitIterations: (iterations: number) => void,
    private emitWorkers: (workers: number) => void,
  ) {
    setInterval(() => {
      this.emitIterations(this.iterations);
      this.iterations = 0;
    }, 5000);
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
        this.best = data;
        this.emitBest(this.best);
      }
    };
    return worker;
  }

  public ChangeWorkers(num: number) {
    let diff = num - this.workers.length;
    if (diff > 0)
      this.workers.push(...Array(diff).fill(0).map(() => this.createWorker()));
    if (diff < 0) {
      let abs = -diff;
      while (abs-- > 0 && this.workers.length > 1)
        this.workers.pop()?.terminate();
    }
    if (diff !== 0) this.emitWorkers(diff);
    return this.workers.length;
  }

  public UpdateBest(best: Best) {
    if (best.value > this.best.value) this.best = best;
  }
}
