import Vue from 'vue'
import Vuex from 'vuex'
import VueNativeSock from 'vue-native-websocket'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    globalMessage: null,
    endpointConfig: {
      name: null,
      protocol: null,
      url: null
    },
    socket: {
      isConnected: false,
      reconnectError: false
    },
    bestBlock: {
      hash: null,
      work_hash: null,
      previous_hash: null,
      f_orphan: null,
      height: null,
      difficulty: null,
      fixed_difficulty: null,
      score: null,
      flag: null,
      merkleroot: null,
      time: null,
      bits: null,
      bias: null,
      nonce: null,
      txs: []
    },
    accountTxs: [],
    unixtime: 0
  },
  mutations: {
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      // state.socket.isConnected = true
      state.socket.isConnected = true
      console.log('websocket connected')
    },
    SOCKET_ONCLOSE (state, event) {
      // state.socket.isConnected = false
      state.socket.isConnected = false
      state.globalMessage = 'websocket connection closed'
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      if (message.cmd === 'Block') {
        state.bestBlock = message.data
        state.globalMessage = 'new block ' + message.data.height
      } else if (message.cmd === 'Accounting') {
        state.accountTxs.splice(0, 0, message.data)
        state.globalMessage = 'find new tx! ' + message.data.txhash
      }
      console.log('websocket message:', message)
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    }
  },
  getters: {
    getEndpoint: (state) => {
      // get API endpoint
      let endpointConfig = state.endpointConfig
      if (endpointConfig.name === null) {
        return null
      } else {
        return endpointConfig.protocol + '://' + endpointConfig.url
      }
    }
  },
  actions: {
    sendMessage: function (context, message) {
      // send websocket message
      Vue.prototype.$socket.send(message)
    }
  }
})

// websocket
Vue.use(VueNativeSock, 'ws://127.0.0.1:3000', {
  store,
  format: 'json',
  connectManually: true
})

export default store
