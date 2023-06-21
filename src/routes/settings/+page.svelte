<script>
  import { signIn, signOut } from '@auth/sveltekit/client';
  import { page } from '$app/stores';
  import { Button, Group, Space } from '@svelteuidev/core';
</script>

<div>
  {#if $page.data.session}
    <span class="signedInText">
      <small>Signed in as</small><br />
      <strong>{$page.data.session.user?.name ?? 'User'}</strong>
    </span>
    <Space h="sm" />
    <Group>
      <Button on:click={() => signIn()} class="button">Link account</Button>
      <Button on:click={() => signOut()} class="button">Sign out</Button>
    </Group>
  {/if}
</div>
