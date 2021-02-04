import Vue from "vue"
import Vuex from "vuex"
import EventBus from "../event/event-bus"
import CrawlerIntervalExecutor from "../util/graph/crawlerIntervalExecutor"
 
Vue.use(Vuex);
 
const STATICS = {
  emptyData: {
    nodes: [],
    links: []
  },
  sampleData: {
    nodes: [ { id: 0, value: 'www.google.com' }, { id: 1, value: 'www.amazon.com' } ],
    links: [ { source: 0, target: 1} ]
  }
}
Object.freeze(STATICS);
const JSONClone = obj => JSON.parse(JSON.stringify(obj));

/**
 * Store for graph/crawler state.
 */
export default new Vuex.Store({
  state: {
    fgData: JSONClone(STATICS.emptyData), // ForceGraph data.
    fgNodeIdMap: new Map(),               // ForceGraph node id lookup ("crawlerId.nodeId" => fgNodeId)
    crawlerExecutors: [],                 // Crawler executors.
    crawlerExecutorsActive: [],           // Active crawler executors. TODO fix, workaround for last-minute ID issue.
    helpers: {
      getExecId: (state, exec) => {
        return state.crawlerExecutors.findIndex(e => e === exec);
      },
      getExecIdByCrawler: (state, crawler) => {
        return state.crawlerExecutors.findIndex(e => e.crawler === crawler);
      }
    }
  },
  getters: {
    getExecId: state => exec => {
      return state.crawlerExecutors.findIndex(e => e === exec);
    },
  },
  mutations: {
    addFgNode(state, { crawler, nextValue }) {
      const { nodes, links } = state.fgData;
      const execId = state.helpers.getExecIdByCrawler(state, crawler); // TODO decouple crawlerId from crawlerExec idx.

      const nextFgId = nodes.length;
      const currFgId = state.fgNodeIdMap.get(`${execId}.${crawler.target}`)
      const isFirst = typeof currFgId === "undefined";
      if (isFirst) {
        state.fgData = {
          nodes: [...nodes, { id: nextFgId, value: nextValue, execId: execId }],
          links: [...links]
        };
      } else {
        state.fgData = {
          nodes: [...nodes, { id: nextFgId, value: nextValue, execId: execId }],
          links: [...links, { source: currFgId, target: nextFgId, execId: execId}]
        };
      }
      state.fgNodeIdMap.set(`${execId}.${nextValue}`, nextFgId)
    },
    addCrawlerExecutor(state, crawlerExecutor) {
      state.crawlerExecutors.push(crawlerExecutor);
      state.crawlerExecutorsActive.push(crawlerExecutor); // See state note, crawlerExecutorsActive
    },
    removeCrawlerExecutor(state, exec) {
      const execId = state.helpers.getExecId(state, exec);
      if (typeof execId !== undefined) {
        state.crawlerExecutors[execId] == null;
        state.crawlerExecutorsActive = state.crawlerExecutorsActive.filter(
          exec => exec != state.crawlerExecutors[execId]); // See state note, crawlerExecutorsActive

        state.fgData = {
          nodes: state.fgData.nodes.filter(n => n.execId !== execId),
          links: state.fgData.links.filter(l => l.execId !== execId)
        }
        for (let key of state.fgNodeIdMap.keys()) {
          const execId = parseInt(key.split('.')[0]);
          if (execId === execId) {
            state.fgNodeIdMap.delete(key);
          }
        }
        EventBus.$emit('graph-update');
      }
    },
    toggleCrawlerExecutor(state, exec) {
      const execId = this.state.helpers.getExecId(state, exec);
      if (typeof execId !== undefined) {
        state.crawlerExecutors[execId].toggle();
      }
    },
    targetCrawlerNode(state, node) {
      const exec = state.crawlerExecutors[node.execId];
      const crawler = exec.crawler;
      crawler.target = node.value;

      // TODO move this logic to crawler
      const queue = crawler._nextQueues.get(node.value);
      crawler.targetNexts = queue ? queue.length : undefined;
    },
    stopAll(state) {
      state.crawlerExecutors.map(x => x.stop());
    },
    reset(state) {
      state.fgData = JSONClone(STATICS.emptyData);
      state.fgNodeIdMap = new Map();
      state.crawlerExecutors = [];
    }
  },
  actions: {
    executeCrawler: ({ commit }, crawler) => {
      const executeOnForceGraph = (crawler) => {
        crawler.nextForTarget()
          .then(nextValue => {
            if (nextValue) {
              commit('addFgNode', {
                crawler: crawler,
                nextValue: nextValue
              });
              EventBus.$emit('graph-update');
            }
          });
      };
      const crawlerExecutor = new CrawlerIntervalExecutor(crawler, executeOnForceGraph);
      crawlerExecutor.start();

      // WARN: order of these commits dependant on coupling (crawlerId <-> crawlerExec idx)
      commit('addCrawlerExecutor', crawlerExecutor);
      commit('addFgNode', { crawler: crawler, nextValue: crawler.root });
      EventBus.$emit('graph-update');
    }
  }
});