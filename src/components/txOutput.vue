<template>
  <li style="padding: 5px">
    <span v-show="false" class="nes-text is-error">!</span>
    <input type="text" min="44" max="44" class="nes-input" placeholder="address" style="width: auto">
    <input type="number" step="0.00000001" min="0.00000001" class="nes-input" placeholder="amount" style="width: auto">
    <button v-on:click="onRemoveOutput" type="button" class="nes-btn is-primary">DEL</button>
  </li>
</template>

<script>
export default {
  name: 'aaa',
  methods: {
    onRemoveOutput: function (event) {
      event.target.parentElement.remove()
      console.log('remove', event)
    }
  }
}
</script>
