/**
 * A runner for crawler sessions.
 */
export default class CrawlerIntervalExecutor {
    constructor(crawler, execute, interval = 1.6) {
      this.crawler = crawler;   // Crawler to execute on.
      this.interval = interval; // Execution interval.
      this._execute = execute;  // Execution operation.
      this._tmout = null;       // Internal timer ref. for execution management.
    }
  
    running() {
      return !!this._tmout;
    }
  
    start() {
      if (this.running()) return;
  
      this._tmout = setTimeout((function intervalFn(){
        this._execute(this.crawler);
        this._tmout = setTimeout((intervalFn).bind(this), 1000 * this.interval)
      }).bind(this), 1000 * this.interval);
    }
  
    stop() {
      if (!this.running()) return;
  
      clearInterval(this._tmout);
      this._tmout = null;
    }
  
    toggle() {
      this.running() ? this.stop() : this.start();
    }
  
    execute() {
      this._execute(this.crawler)
    }
  }