<template>
  <div class = "wrap">
    <div class="graph" ></div>
  </div>
</template>

<script>
import EventBus from '../event/event-bus'
import ForceGraph from 'force-graph';

/**
 * Vue component for force-directed graph rendering of crawled nodes.
 */
export default {
  name: 'Graph',
  mounted: function () {
    const graph = ForceGraph();

    // Reference element for canvas re-size. TODO less hacky impl.
    const resizerEl = document.querySelector('#resize-hack');
    window.addEventListener('resize', () => {
      graph.width(resizerEl.clientWidth);
      graph.height(resizerEl.clientHeight);
    });

    const graphEl = this.$el.querySelector('.graph');
    graph(graphEl)
      .width(resizerEl.clientWidth)
      .height(resizerEl.clientHeight)
      .backgroundColor('whitesmoke')
      .graphData(this.$store.state.fgData)
      .nodeId('id')
      .nodeLabel('value')
      .nodeCanvasObject((node, ctx, globalScale) => {
          const fontSize = 18/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textBaseline = 'middle';

          ctx.fillStyle = 'rgba(0, 0, 0, .8)';
          ctx.fillText(node.id + '. ' + node.value, node.x + 4 + fontSize / 4, node.y);
        })
      .nodeCanvasObjectMode(() => 'after')
      .linkSource('source')
      .linkTarget('target')
      .linkDirectionalArrowLength(4)
      .onNodeClick((node) => {
        this.$store.commit('targetCrawlerNode', node);
      });

    EventBus.$on('graph-update', () => {
      graph.graphData(this.$store.state.fgData)
    });
  }
}
</script>

<style scoped>
.graph {
  position: absolute;
}
</style>
