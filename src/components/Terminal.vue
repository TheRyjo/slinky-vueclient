<template>
  <div class="terminal">
      <div class="cli-wrapper">
        <vue-command
          :hide-bar="hideBar"
          :prompt="prompt"
          :commands="commands"
          :cursor.sync="cursor"
          :history.sync="history"
          :stdin.sync="stdin"
          :help-timeout="3000"
          :help-text="helpText"
          show-help/>
      </div>
  </div>
</template>

<script>
import VueCommand, { createStdout, createStderr, createDummyStdout } from 'vue-command'
import 'vue-command/dist/vue-command.css'
import EventBus from '../event/event-bus'
import SlinkyService from '../service/slinkyService';
import Crawler from '../util/graph/crawler';
import { normalizeHttpUrl, isValidHttpUrl } from '../util/url-utils'

const slinkyService = new SlinkyService();
const shuffle = arr => 
  [...arr].reduceRight((res,_,__,s) => 
    (res.push(s.splice(0|Math.random()*s.length,1)[0]), res),[]);

/**
 * Vue component for issuing crawler/graph commands with a console interface.
 */
export default {
  name: 'Terminal',
  components: {
    VueCommand
  },
  data: () => ({
    hideBar: true,
    prompt: "~demo@slinky:#/",
    stdin: '',
    cursor: 0,
    commands: {
      help: undefined,
      clear: undefined,
      crawl: undefined,
      /**
       * List sample site urls.
       */
      sites: ({ _ }) => {
        if (_ && _.length == 2 ) {
          const extractUrl = link => link.value;
          switch(_[1]) {
            case 'ls': {
              return slinkyService.getTopSitesUrls()
                .then(links => {
                  const urls = links.map(extractUrl);
                  return createStdout(JSON.stringify(urls));
                })
            }
            case 'get5': {
              const get5 = arr => arr.slice(0, 5);
              return slinkyService.getTopSitesUrls()
                .then(links => {
                  const shuffled = shuffle(links);
                  const links5 = get5(shuffled);
                  const urls = links5.map(extractUrl);
                  return createStdout(JSON.stringify(urls));
                })
            }
          }
        }
        return createStderr(`Invalid "sites" subcommand: ${_[1]}, must be in ["ls", "get5"]`);
      }
    },
    history: [],
    helpText: 'help',
  }),
  created: function() {
    /**
     * Display help
     */
    this.commands.help = () => {
      this.cursor = 0;
      return createStdout(`&nbsp&nbspAvailable commands: ${[
        'help',
        'crawl url [absoluteURL]',
        'crawl word [word]',
        'sites ls',
        'sites get5',
        'stop',
        'reset'].join(', ')}`)
    }
    /**
     * Clear the console
     */
    this.commands.clear = () => {
        this.history = [];
        return createDummyStdout();
    }
    /**
     * Perform a crawl staring at a root value.
     *   Ex1. $ crawl url http://www.google.com
     *   Ex2. $ crawl word happy
     */
    this.commands.crawl = ({ _ }) => {
      if (_.length !== 3) {
        return createStderr('Invalid usage "crawl"');
      }

      const [ , type, nodeVal] = _;
      switch (type) {
        case "url": {
          const rootUrl = normalizeHttpUrl(nodeVal);
          if (!isValidHttpUrl(rootUrl)) {
            return createStderr(`Invalid "crawl" url: ${rootUrl}`);
          }
          this.$store.actions
          this.$store.dispatch('executeCrawler', 
                             new Crawler(rootUrl, url => slinkyService.getLinkedUrls(url)));
          break;
        }
        case "word": {
          this.$store.dispatch('executeCrawler', 
                             new Crawler(nodeVal, word => slinkyService.getRelatedWords(word)));
          break;
        }
        default: {
          return createStderr(`Invalid "crawl" type: ${type}, must be in ["url", "word"]`);
        }
      }
      return createStdout('Added crawler...');
    }
    /**
     * Stop all crawls.
     */
    this.commands.stop = () => {
      this.$store.commit('stopAll');
      EventBus.$emit('graph-update');

      return createDummyStdout();
    }
    /**
     * Clear all crawls from graph.
     */
    this.commands.reset = ({ _ }) => {
      if (_.length !== 1) {
        return createStderr('Invalid usage "reset"');
      }
      this.$store.commit('reset');
      EventBus.$emit('graph-update');

      return createDummyStdout();
    }
  }
}
</script>

<style scoped>
.cli-wrapper {
    background-color: rgb(17,17,17);
    overflow-y: scroll;
    height: 105px;
    max-height: 105px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
