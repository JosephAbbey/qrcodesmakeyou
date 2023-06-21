<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    SvelteUIProvider,
    fns,
    AppShell,
    Navbar,
    Header,
    Title,
    Divider,
    ShellSection,
    Footer,
    Button,
    Group,
    Space,
    Seo,
    ActionIcon
  } from '@svelteuidev/core';
  import { onMount } from 'svelte';
  import { GithubLogo, Moon, Sun, Gear, Home, ColorWheel } from 'svelte-radix';

  let theme: 'dark' | 'light' = 'dark';

  onMount(() => {
    theme =
      (localStorage.getItem('theme') == null
        ? null
        : localStorage.getItem('theme') == 'dark'
        ? 'dark'
        : 'light') ??
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark');
    window.addEventListener(
      'storage',
      ({ key, newValue: value }) => key == 'theme' && (theme = value == 'dark' ? 'dark' : 'light')
    );
  });

  function toggleTheme() {
    theme = theme == 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  }
</script>

<Seo title="qrcodesmakeyou" titleTemplate="%t% | qrcodesmakeyou" nofollow={true} noindex={true} />

<SvelteUIProvider withGlobalStyles themeObserver={theme}>
  <AppShell>
    <Header height="2rem" slot="header">
      <Group override={{ 'justify-content': 'flex-end' }}>
        <ActionIcon color="teal" variant="filled" on:click={() => goto('/')}>
          <Home />
        </ActionIcon>
        <ActionIcon color="teal" variant="filled" on:click={() => goto('/themes')}>
          <ColorWheel />
        </ActionIcon>
        <ActionIcon color="teal" variant="filled">
          <GithubLogo />
        </ActionIcon>
        <ActionIcon color="teal" variant="filled" on:click={toggleTheme}>
          {#if theme == 'dark'}
            <Sun />
          {:else}
            <Moon />
          {/if}
        </ActionIcon>
        <ActionIcon color="teal" variant="filled" on:click={() => goto('/settings')}>
          <Gear />
        </ActionIcon>
      </Group>
    </Header>

    <ShellSection grow>
      <slot />
    </ShellSection>
  </AppShell>
</SvelteUIProvider>
