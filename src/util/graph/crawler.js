/**
 * A session for exploring a graph of nodes in a directed acyclic fashion (DAG).
 */
export default class Crawler {
  /**
   * A 
   * @param {*} root - Root node of the crawler DAG
   * @param {*} nextSource - Source for next() lookups ( str => str[] )
   */
  constructor(root, nextSource) {
    this.root = root;              // Root node of the DAG.
    this.target = root;            // Node currently targed for crawling.
    this.targetNexts = undefined;  // Count of not-yet-added nexts for target.
    this.nodeSet = new Set();      // Set of all nodes in the DAG.
    this._nextSource = nextSource; // Async source for looking up a node's not-yet-added nexts.
    this._nextQueues = new Map();  // Queues of cached not-yet-added nexts.
  }

  /**
   * Retrieve a next node from the crawl.
   * @param {*} nodeId - Target node
   */
  async next(nodeId) {
    if (!this._isQueueLoaded(nodeId)) {
      await this._loadQueue(nodeId);
    }

    const queue = this._nextQueues.get(nodeId);
    let nextId = queue.pop();
    while (typeof nextId !== 'undefined' && this.nodeSet.has(nextId)) { // Also avoid cycles
      nextId = queue.pop();
    }
    this.targetNexts = queue.length; 
    this.nodeSet.add(nextId);

    return nextId;
  }

  /**
   * Retrieve a next node from the crawl for the current target.
   */
  async nextForTarget() {
    return await this.next(this.target);
  }

  /**
   * Load queue of candidate next nodes for a target.
   * @param {*} nodeId - Target node
   */
  async _loadQueue(nodeId) {
    const nextNodes = await this._nextSource(nodeId);
    this._nextQueues.set(nodeId, nextNodes);
  }

  /**
   * Count of candidate next nodes.
   * @param {*} nodeId 
   */
  nextsCt(nodeId) {
    const queue = this._nextQueues.get(nodeId);
    return queue ? queue.length : 0;
  }

  /**
   * Check if the candidate queue is loaded for a target node.
   * @param {*} nodeId - Target node
   */
  _isQueueLoaded(nodeId) {
    return typeof this._nextQueues.get(nodeId) !== 'undefined';
  }
}
