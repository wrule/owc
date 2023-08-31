
export
class WorkerHub {
  public constructor(private scriptURL: string) {

  }

  private workers: Worker[] = [];

  public ChangeWorkers(num: number) {
    let diff = num - this.workers.length;
    if (diff > 0) {
      this.workers.push(...Array(diff).fill(0).map(() => new Worker(this.scriptURL)));
    }
    if (diff < 0) {
      diff = -diff;
      while (diff > 0 && this.workers.length > 1)
        this.workers.pop()?.terminate();
    }
    return this.workers.length;
  }
}
