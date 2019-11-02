<template>
  <div v-if="balance">
    <!-- balance -->
    <section class="nes-container with-title">
      <h3 class="title">balance</h3>
      <div v-for="(value, key) in balance" :key="key">
        <div class="nes-container is-rounded">
          {{key}}
          <ul v-for="(value, key) in value" :key="key" class="nes-list">
            <li v-if="key==='0'"><i class="nes-icon coin is-small"></i> {{value/100000000}}</li>
            <li v-else><i class="nes-icon trophy is-small"></i> token id=<b>{{key}}</b> amount={{value}}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- send to -->
    <section class="nes-container with-title">
      <h3 class="title">send to address</h3>

      <!-- from -->
      <div class="nes-field is-inline">
        <label for="sender-account-name">sender</label>
        <div class="nes-select">
          <select required id="sender-account-name">
            <option value="" disabled selected hidden>Select...</option>
            <template v-for="(value, key) in balance">
              <option :value="key" :key="key">{{key}}</option>
            </template>
          </select>
        </div>
      </div>

      <!-- outputs -->
      <div class="nes-container with-title is-centered">
        <p class="title">outputs</p>
        <ol v-if="sendTo>0" id="tx-output-list">
          <tx-output v-for="index in sendTo" :key="index"></tx-output>
        </ol>
        <span v-else>no outputs</span>
      </div>

      <!-- action -->
      <div>
        <button v-on:click="sendTo++" type="button" class="nes-btn is-success">ADD OUTPUT</button>
        <button v-on:click="sendToAddress" type="button" class="nes-btn is-primary">SEND BY THIS</button>
        <button v-on:click="clearOutputList" type="button" class="nes-btn is-warning">CLEAR</button>
      </div>

      <!-- transaction info -->
      <div v-show="sendTxInfo" class="nes-table-responsive">
        <table class="nes-table is-bordered is-centered">
          <tr v-for="(value, key) in sendTxInfo" :key="key">
            <th>{{key}}</th><td>{{value}}</td>
          </tr>
        </table>
      </div>
    </section>

    <!-- receive from -->
    <section class="nes-container with-title">
      <h3 class="title">receive from account</h3>

      <!-- to -->
      <div class="nes-field is-inline">
        <label for="receive-account-name">recipient</label>
        <div class="nes-select">
          <select v-on:change="getReceiveAddress" required id="receive-account-name">
            <option value="" disabled selected hidden>Select...</option>
            <template v-for="(value, key) in balance">
              <option :value="key" :key="key">{{key}}</option>
            </template>
          </select>
        </div>
      </div>

      <!-- address/qr-code -->
      <div class="nes-field">
        <div v-if="receiveAddress" class="nes-container with-title is-centered">
          <p class="title">generated</p>
          <table style="width: 100%">
            <tr>
              <th>QR CODE</th>
              <th>ADDRESS</th>
            </tr>
            <tr>
              <td><qr-code :value="receiveAddress.address" :options="{ width: 600 }"></qr-code></td>
              <td><input :value="receiveAddress.address" type="text" class="nes-input"></td>
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
import store from '@/store'
import txOutput from './txOutput'
import QrCode from 'vue-qrcode'

export default {
  name: 'Account',
  data: function () {
    return {
      balance: null,
      errorMessage: null,
      sendTo: 0,
      sendTxInfo: null,
      receiveAddress: null
    }
  },
  components: {
    'tx-output': txOutput,
    'qr-code': QrCode
  },
  methods: {
    updateBalanceInfo: function () {
      if (store.state.endpointConfig.name !== null) {
        this.axios.get(store.getters.getEndpoint + '/private/listbalance')
          .then((response) => {
            this.balance = response.data
            console.log(this.balance)
          }).catch((error) => {
            window.alert(error)
            console.error(error)
          })
      }
    },
    clearOutputList: function () {
      this.sendTo = 0
      const elm = document.getElementById('sender-account-name')
      elm.selectedIndex = -1
    },
    sendToAddress: function () {
      const senderElm = document.getElementById('sender-account-name')
      if (senderElm.selectedIndex < 1) return
      const outputElm = document.getElementById('tx-output-list')
      if (outputElm === null) return
      if (outputElm.childElementCount < 1) return
      let outputs = []
      for (let elm of outputElm.children) {
        let address = elm.children[1].value
        if (address.length !== 44) return
        let amount = Math.round(parseFloat(elm.children[2].value) * 100000000)
        if (amount < 1) return
        let coinId = 0
        outputs.push([address, coinId, amount])
      }
      if (outputs.length < 1) return
      const ask = window.confirm('Try to send?')
      if (!ask) return
      this.axios.post(store.getters.getEndpoint + '/private/sendmany', JSON.stringify({
        sender: senderElm.value,
        pairs: outputs
      }), {
        xsrfHeaderName: 'X-CSRF-Token',
        withCredentials: true
      }).then((response) => {
        this.sendTxInfo = response.data
        console.log(response.data)
      }).catch((error) => {
        window.alert(error)
        console.error(error)
      })
    },
    getReceiveAddress: function () {
      const receiveElm = document.getElementById('receive-account-name')
      if (receiveElm.selectedIndex < 1) return
      this.axios.get(store.getters.getEndpoint + '/private/newaddress', {
        params: {
          account: receiveElm.value
        }
      }).then((response) => {
        this.receiveAddress = response.data
        console.log(response.data)
      }).catch((error) => {
        window.alert(error)
        console.error(error)
      })
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
      this.updateBalanceInfo()
    },
    getAccountTxs: function (val, oldVal) {
      this.updateBalanceInfo()
    }
  },
  mounted () {
    this.updateBalanceInfo()
  }
}
</script>

<style scoped>
section {
  margin: 20px 5px;
  padding: 10px;
}
table {
  font-size: small;
}
</style>
