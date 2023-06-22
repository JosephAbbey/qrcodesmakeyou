<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import QrCode from '$lib/QRCode.svelte';
  import { Button, Code, Space } from '@svelteuidev/core';
  import { Check } from 'svelte-radix';
  import { notify } from '../../../stores/notifications';
  export let data: PageData;

  let saved = data.saved;

  function save() {
    saved = true;
    fetch('./save', {
      method: 'POST'
    });
  }

  function forget() {
    saved = false;
    fetch('./forget', {
      method: 'POST'
    });
  }
</script>

<div class="container">
  <div class="code">
    <QrCode url={$page.url.href} theme={data.theme} />
  </div>
  <Space h="sm" />
  {#if saved}
    <Button type="button" on:click={forget}>Forget</Button>
  {:else}
    <Button type="button" on:click={save}>Save</Button>
  {/if}
  <Space h="sm" />
  <Code
    on:click={() => (
      navigator.clipboard.writeText($page.url.href),
      notify({
        title: 'Copied',
        icon: Check,
        color: 'green',
        body: 'Link copied to clipboard.'
      })
    )}
    override={{ userSelect: 'none' }}
    color="teal"
  >
    {$page.url.href}
  </Code>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }

  .code {
    width: 80%;
    max-width: 30rem;
  }
</style>
