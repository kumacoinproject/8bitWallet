<template>
  <div v-if="transaction">

    <!-- transaction -->
    <section class="nes-container with-title">
      <h3 class="title">transaction</h3>
      <div v-for="item in transaction" :key="item.hash">
        <div class="nes-container is-rounded with-title">
          <h3 class="title">

            <!-- badge -->
            <a class="nes-badge">
              <span v-if="item.recode_flag==='unconfirmed'" class="is-error">unconfirmed</span>
              <span v-if="item.height===null" class="is-primary">confirmed</span>
              <span v-else-if="getBestBlock.height-item.height<6" class="is-warning">{{getBestBlock.height-item.height}} confirm</span>
              <span v-else class="is-success">{{getBestBlock.height-item.height}} confirm</span>
            </a>
          </h3>

          <!-- tx info -->
          <table>
          <tr v-for="(value, key) in item" :key="key" class="table">
            <template v-if="key==='txhash'">
              <td colspan="2" style="font-size: small">{{value}}</td>
            </template>
            <template v-else-if="key==='movement'">
                <th>movement</th>
                <td>
                  <ul v-for="(value, user) in value" :key="user">
                    <div v-for="(amount, coinId) in value" :key="coinId">
                      <template v-if="coinId==='0'">
                        <template v-if="amount>0">{{user}} receive <i class="nes-icon coin is-small"></i> {{amount/100000000}}</template>
                       <template v-else>{{user}} send <i class="nes-icon coin is-small"></i> {{-amount/100000000}}</template>
                      </template>
                      <template v-else>
                        <template v-if="amount>0">{{user}} receive <i class="nes-icon close is-small"></i> {{coinId}}:{{amount}}</template>
                        <template v-else>{{user}} send <i class="nes-icon trophy is-small"></i> {{coinId}}:{{-amount}}</template>
                      </template>
                    </div>
                  </ul>
                </td>
            </template>
            <template v-else>
                <th>{{key}}</th><td>{{value}}</td>
            </template>
          </tr>
          </table>
        </div>
      </div>
    </section>
  </div>

  <div v-else-if="connectionEstablished">
    <p class="nes-balloon from-left nes-pointer">please wait for update...</p>
    <div><i class="nes-octocat"></i></div>
  </div>

  <div v-else>
    <p class="nes-balloon from-left nes-pointer">do not endpoint established!</p>
    <div><i class="nes-octocat"></i></div>
  </div>
</template>

<script>
import store from '../store'

export default {
  name: 'Transaction',
  data: function () {
    return {
      transaction: null
    }
  },
  methods: {
    updateTransactionInfo: function () {
      if (store.state.endpointConfig.name !== null) {
        this.axios.get(store.getters.getEndpoint + '/private/listtransactions')
          .then((response) => {
            this.transaction = response.data.txs
            console.log(this.transaction)
          }).catch((error) => {
            window.alert(error)
            console.error(error)
          })
      }
    }
  },
  computed: {
    connectionEstablished: function () {
      return store.state.socket.isConnected && store.state.endpointConfig.name !== null
    },
    getBestBlock: function () {
      return store.state.bestBlock
    },
    getAccountTxs: function () {
      return store.state.accountTxs
    }
  },
  watch: {
    getBestBlock: function (val, oldVal) {
      this.updateTransactionInfo()
    },
    getAccountTxs: function (val, oldVal) {
      this.updateTransactionInfo()
    }
  },
  mounted () {
    this.updateTransactionInfo()
  }
}
</script>

<style scoped>
section {
  margin: 10px 5px;
  padding: 10px;
}
table {
  font-size: small;
}
</style>
