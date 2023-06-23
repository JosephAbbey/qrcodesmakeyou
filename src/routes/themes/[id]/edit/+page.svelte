<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import QrCode from '$lib/QRCode.svelte';
  import { Button, Group, Space, TextInput } from '@svelteuidev/core';
  import minifyPath from '$lib/minifyPath';
  import type { Theme } from '@prisma/client';
  export let data: PageData;

  let corners_path: string = data.theme.corners_path ?? '';
  let corners_fill: string = data.theme.corners_fill ?? '#000000';
  let light: string = data.theme.light ?? '#ffffff';
  let dark: string = data.theme.dark ?? '#000000';

  function update() {
    const data: Omit<Theme, 'id'> = { corners_fill, corners_path, dark, light };
    if (data.corners_fill == '#000000') data.corners_fill = null;
    if (data.corners_path) {
      if (data.corners_path == '') data.corners_path = null;
      else corners_path = data.corners_path = minifyPath(data.corners_path);
    }
    if (data.dark == '#000000') data.dark = null;
    if (data.light == '#ffffff') data.light = null;
    fetch('../update', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
</script>

<div class="container">
  <div class="code">
    <QrCode url={$page.url.href} theme={{ corners_fill, corners_path, dark, light }} />
  </div>
  <Space h="sm" />
  <Group>
    <input type="color" name="light" id="light" bind:value={light} />
    <input type="color" name="dark" id="dark" bind:value={dark} />
    <TextInput
      style="font-family: monospace"
      type="text"
      name="corners_path"
      id="corners_path"
      bind:value={corners_path}
    />
    <input type="color" name="corners_fill" id="corners_fill" bind:value={corners_fill} />
    <Space h="sm" />
    <Button type="button" on:click={update}>Save</Button>
  </Group>
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
