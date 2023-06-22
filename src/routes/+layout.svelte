<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    SvelteUIProvider,
    AppShell,
    Header,
    ShellSection,
    Group,
    Seo,
    ActionIcon,
    Center,
    Stack,
    Notification,
    Space
  } from '@svelteuidev/core';
  import { onMount } from 'svelte';
  import { GithubLogo, Moon, Sun, Gear, Home, ColorWheel, MagicWand, Check } from 'svelte-radix';

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

  import type { LayoutData } from './$types';
  import { notifications, clear } from '../stores/notifications';

  export let data: LayoutData;
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
        <ActionIcon
          color="teal"
          variant="filled"
          on:click={() => goto('https://github.com/JosephAbbey/qrcodesmakeyou')}
        >
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
          {#if data.session?.user}
            <Gear />
          {:else}
            <MagicWand />
          {/if}
        </ActionIcon>
      </Group>
    </Header>

    <Center>
      <Stack>
        {#each $notifications.slice(-5) as notification, i}
          <Notification
            title={notification.title}
            icon={notification.icon}
            color={notification.color}
            on:close={() => clear(i)}
          >
            {notification.body}
          </Notification>
        {/each}
      </Stack>
    </Center>

    <Space h="md" />

    <ShellSection grow>
      <slot />
    </ShellSection>
  </AppShell>
</SvelteUIProvider>
