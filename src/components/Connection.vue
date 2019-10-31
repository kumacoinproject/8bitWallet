<template>
  <div>
    <!-- connection select -->
    <section v-if="!connectionEstablished" class="nes-container with-title">
      <h3 class="title">connection select</h3>
      <div class="nes-select">
        <select v-on:change="selectedEndpoint">
            <option value="" disabled="" selected="" hidden="">manual</option>
            <template v-for="(item, index) in endpoints">
              <option :key="index" :value="index">{{item.name}}</option>
            </template>
          </select>
      </div>

      <div class="item">
        <div class="nes-field is-inline">
          <template v-if="selectIndex===null">
            <label for="url_field">endpoint</label>
            <input type="text" id="url_field" class="nes-input" placeholder="url" value="http://127.0.0.1:3000">
          </template>
          <template v-else>
            <label for="url2_field">endpoint</label>
            <input type="text" id="url2_field" class="nes-input" placeholder="url"
                   :value="endpoints[selectIndex].protocol+'://'+endpoints[selectIndex].url" disabled>
          </template>
        </div>
        <button v-on:click="establishConnect" type="button" class="nes-btn is-primary">SELECT</button>
        <span v-show="message!==null" style="color: red">{{message}}</span>
      </div>
    </section>

    <!-- connection status -->
    <section v-else class="nes-container with-title">
      <h3 class="title">connection status</h3>
      <div v-if="pingTime" class="lists">
        <ul class="nes-list is-disc">
          <li>REST: {{getRestEndpoint}}</li>
          <li>WS: {{websocketEstablished}}</li>
          <li>ping: {{pingTime}}mS</li>
        </ul>
      </div>
      <div v-else>
        please wait for ping response...
      </div>

      <div v-show="pingStatus" class="nes-table-responsive">
        <table class="nes-table is-bordered is-centered">
          <template v-for="(value, key) in pingStatus">
            <tr :key="key"><th>{{key}}</th><td>{{value}}</td></tr>
          </template>
        </table>
      </div>
      <button v-on:click="clearConnect" type="button" class="nes-btn is-warning">DISCONNECT</button>
    </section>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Connection',
  data: function () {
    return {
      endpoints: [
        {
          name: 'localhost',
          protocol: 'http',
          url: '127.0.0.1:3000'
        },
        {
          name: 'testnet official',
          protocol: 'https',
          url: 'testnet.pycontract.tk'
        }
      ],
      selectIndex: null,
      message: null,
      pingTime: null,
      pingStatus: null
    }
  },
  computed: {
    connectionEstablished: function () {
      return store.state.socket.isConnected && store.state.endpointConfig.name !== null
    },
    websocketEstablished: function () {
      return store.state.socket.isConnected
    },
    getRestEndpoint: function () {
      return store.getters.getEndpoint
    }
  },
  methods: {
    selectedEndpoint: function (event) {
      let dom = event.target.options[event.target.options.selectedIndex]
      this.selectIndex = Number(dom.value)
    },
    establishConnect: function (event) {
      // check button is enable
      if (this.isButtonDisable(event.target)) {
        return
      }

      // disable button
      this.toggleButton(event.target)

      // get selected endpoint
      let endpointConfig = null
      if (this.selectIndex === null) {
        let protoUrl = document.getElementById('url_field').value.split('://')
        endpointConfig = {
          name: 'manual',
          protocol: protoUrl[0],
          url: protoUrl[1]
        }
      } else {
        endpointConfig = this.endpoints[this.selectIndex]
      }

      // API check
      this.axios.get(endpointConfig.protocol + '://' + endpointConfig.url + '/private/getsysteminfo')
        .then((response) => {
          // REST is OK, WS check
          if (endpointConfig.protocol === 'http') {
            this.$connect('ws://' + endpointConfig.url + '/private/ws')
          } else {
            this.$connect('wss://' + endpointConfig.url + '/private/ws')
          }
        }).then((response) => {
          store.state.endpointConfig = endpointConfig
          store.state.globalMessage = 'API and WS connected!'
          this.pingStateUpdate()
        }).catch((error) => {
          console.error(error)
          this.message = error.message
          // enable button
          this.toggleButton(event.target)
        })
    },
    clearConnect: function (event) {
      this.message = null
      store.state.endpointConfig = {
        name: null,
        protocol: null,
        url: null
      }
      store.state.accountTxs.length = 0
      this.toggleButton(event.target)
      this.$disconnect()
      store.state.globalMessage = 'connection cleared'
    },
    toggleButton: function (button) {
      if (button.classList.contains('is-disabled')) {
        button.classList.add('is-primary')
        button.classList.remove('is-disabled')
      } else {
        button.classList.remove('is-primary')
        button.classList.add('is-disabled')
      }
    },
    isButtonDisable: function (button) {
      return button.classList.contains('is-disabled')
    },
    pingStateUpdate: function pingStateUpdate () {
      this.pingTime = null
      let watch = new Date().getTime()
      this.axios.get(store.getters.getEndpoint + '/public/getsysteminfo')
        .then((response) => {
          let now = new Date().getTime()
          this.pingTime = now - watch
          this.pingStatus = response.data
        }).catch((error) => {
          this.pingTime = 0
          this.pingStatus = {
            status: 'cannot connect API',
            error: error.message
          }
        })
    }
  },
  mounted () {
    // ping status update
    if (this.connectionEstablished) {
      this.pingStateUpdate()
    }
  }
}
</script>

<style scoped>
</style>
