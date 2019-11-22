<template>
  <div v-if="setupComplete">
    <section class="nes-container with-title">
      <h3 class="title">best block</h3>

      <!-- block mined progress -->
      <div>
        <span>{{getTimeBlockAfter}}s passed after best block mined</span>
        <progress v-if="getTimeBlockAfter<120" class="nes-progress is-error" :value="getTimeBlockAfter" max="120"></progress>
        <progress v-else-if="getTimeBlockAfter<600" class="nes-progress is-primary" :value="getTimeBlockAfter" max="600"></progress>
        <progress v-else class="nes-progress is-success" :value="getTimeBlockAfter" max="3600"></progress>
      </div>

      <!-- best block -->
      <div class="nes-table-responsive">
        <table class="nes-table is-bordered is-centered">
          <template v-for="(value, key) in getBestBlock">
            <tr :key="key" v-show="value">
              <th>{{key.replace('_h', 'H')}}</th>
              <td v-if="key==='txs'">
                <template v-for="(item, index) in value">
                  <div :key="index">{{index}}:{{item}}</div>
                </template>
              </td>
              <td v-else>{{value}}</td>
            </tr>
          </template>
        </table>
      </div>
    </section>

    <!-- account related txs -->
    <section class="nes-container with-title">
      <h3 class="title">new account transactions</h3>
      <div v-if="getAccountTxs" v-for="item in getAccountTxs" :key="item.txhash">
        <span style="font-size: small">{{item.txhash}}</span>
      </div>
      <div v-else>
        no account transactions
      </div>
    </section>
  </div>

  <div v-else>
    <p class="nes-balloon from-left nes-pointer">do not endpoint established!</p>
    <div><i class="nes-octocat"></i></div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'ChainState',
  computed: {
    setupComplete: function () {
      return store.state.socket.isConnected && store.state.endpointConfig.name !== null
    },
    getBestBlock: function () {
      return store.state.bestBlock
    },
    getAccountTxs: function () {
      return store.state.accountTxs
    },
    getTimeBlockAfter: function () {
      return store.state.unixtime - store.state.bestBlock.time
    }
  },
  mounted () {
    if (store.state.bestBlock.hash === null && this.setupComplete) {
      this.axios.get(store.getters.getEndpoint + '/public/getchaininfo')
        .then((response) => {
          store.state.bestBlock = response.data.best
          console.log(store.state.bestBlock)
        }).catch((error) => {
          window.alert(error)
          console.error(error.message)
        })
    }
  }
}
</script>

<style scoped>
section {
  margin: 10px 5px;
}
table {
  font-size: small;
}
</style>
