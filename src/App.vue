<template>
  <div id="app">
    <header>
      <p v-show="globalMessage!==null" class="nes-balloon from-left" style="position: absolute">
        {{globalMessage}}
      </p>
      <div>
        <h1>
          <img class="nes-avatar is-medium" src="./assets/python-min-x64.png" alt="logo">
          <span>8bitWallet {{ version }}</span>
        </h1>
        <span>
          8bitWallet is an HTML-based GUI interface bind to bc4py node.
          You can control accounts, send to, view history and action contracts.
          We use <a href="https://nostalgic-css.github.io/NES.css/" target="_blank">NES.css</a>
          for CSS template.
        </span>
      </div>
    </header>

    <!-- select buttons -->
    <div>
      <router-link to="/Connection">
        <button type="button" @click="selectTabBtn" class="nes-btn is-primary">Connection</button></router-link>
      <router-link to="/ChainState">
        <button type="button" @click="selectTabBtn" class="nes-btn">ChainState</button></router-link>
      <router-link to="/Account">
        <button type="button" @click="selectTabBtn" class="nes-btn">Account</button></router-link>
      <router-link to="/Transaction">
        <button type="button" @click="selectTabBtn" class="nes-btn">Transaction</button></router-link>
      <router-link to="/AboutMe">
        <button type="button" @click="selectTabBtn" class="nes-btn">AboutMe</button></router-link>
    </div>

    <!-- main content -->
    <router-view></router-view>

    <!-- footer -->
    <footer class="footer">
      <p>
        <a href="http://github.com/namuyan/8bitWallet">8bitWallet</a>
        <span>-</span>
        <a href="http://github.com/namuyan">namuyang</a>
        <span>-</span>
        <a href="https://twitter.com/namuyan_mine">@2019</a>
      </p>
    </footer>
  </div>
</template>

<script>
import store from '@/store'

function autoDeleteGlobalMessage () {
  let watch = null
  let oldMessage = null
  setInterval(function () {
    let time = new Date().getTime()
    if (store.state.globalMessage !== null) {
      if (oldMessage !== store.state.globalMessage) {
        oldMessage = store.state.globalMessage
        watch = null
      } else if (watch === null) {
        watch = time
      } else if (store.state.globalMessage.length < 2) {
        store.state.globalMessage = null
        watch = null
      } else if (watch < time - 10000) {
        oldMessage = store.state.globalMessage.slice(1)
        store.state.globalMessage = oldMessage
      }
    }
  }, 250)
}

export default {
  name: 'App',
  // dynamic
  data: function () {
    return {}
  },
  // static
  computed: {
    version: () => '1.0.0',
    globalMessage: () => store.state.globalMessage
  },
  methods: {
    selectTabBtn: (event) => {
      const selectName = event.target.innerHTML
      const parent = event.target.parentElement.parentElement

      // change color of selected button
      for (const key in parent.children) {
        const obj = parent.children[key]
        if (typeof obj !== 'object') { continue }
        if (obj.innerText === selectName) {
          obj.children[0].classList.add('is-primary')
        } else if (obj.children[0].classList.contains('is-primary')) {
          obj.children[0].classList.remove('is-primary')
        }
      }
    }
  },
  mounted () {
    autoDeleteGlobalMessage()
  }
}
</script>

<style>
  .footer p {
    text-align: right;
  }
  .footer a {
    color: black;
    text-decoration: none;
    text-align: center;
  }
</style>
