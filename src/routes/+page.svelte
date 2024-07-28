<script lang="ts">
  import {
    Button,
    TextInput,
    Group,
    Space,
    Grid,
    Image,
    Card,
    Badge,
    Text,
    Container,
    Center,
    MediaQuery,
    Tabs,
    Box,
    Collapse,
    Title,
    Checkbox,
    NativeSelect
  } from '@svelteuidev/core';
  import {
    Download,
    Share1,
    Video,
    GithubLogo,
    Play,
    Copy,
    Check,
    MagicWand,
    DropdownMenu
  } from 'svelte-radix';

  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import QRCode from '$lib/QRCode.svelte';
  import QrCode from '$lib/QRCode.svelte';
  import type { Theme } from '@prisma/client';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { notify } from '../stores/notifications';
  export let data: PageData;

  // some apps use shared text some use shared url?
  let url =
    $page.url.searchParams.get('shared_url') ??
    $page.url.searchParams.get('shared_text') ??
    'https://qr.josephabbey.dev/';
  let theme: Theme | undefined = undefined;
  let code: QRCode;

  let width = 0;

  onMount(() => {
    width = window.innerWidth;
  });

  let wifi = false;

  let ssid = '';
  let password = '';
  let security = 'WPA';
  let hidden = false;
</script>

<div class="container">
  <Group>
    <TextInput type="text" name="code" id="code" bind:value={url} />
    <Button type="button" on:click={() => (wifi = !wifi)}><MagicWand /></Button>
  </Group>

  <Collapse open={wifi}>
    <!-- WIFI:S:<SSID>;T:<WEP|WPA|nopass>;P:<PASSWORD>;H:<true|false|blank>;; -->
    <Space h="md" />
    <Title order={3}>WiFi Network:</Title>
    <Space h="md" />
    <TextInput type="text" name="ssid" id="ssid" placeholder="SSID" bind:value={ssid} />
    <Space h="md" />
    {#if security != 'nopass'}
      <TextInput
        type="text"
        name="password"
        id="password"
        placeholder="Password"
        bind:value={password}
      />
      <Space h="md" />
    {/if}
    <NativeSelect
      name="security"
      id="security"
      data={['WEP', 'WPA', { value: 'nopass', label: 'No Password' }]}
      bind:value={security}
    />
    <Space h="md" />
    <Checkbox name="hidden" id="hidden" label="Hidden Network" bind:checked={hidden} />
    <Space h="md" />
    <Button
      type="button"
      on:click={() => {
        url = `WIFI:S:${ssid};T:${security};P:${password};H:${hidden ? 'true' : 'false'};;`;
      }}>Generate</Button
    >
  </Collapse>

  <Space h="md" />

  <div class="code">
    <QRCode {url} {theme} bind:this={code} />
  </div>

  <Space h="md" />

  <Group override={{ justifyContent: 'center' }}>
    <Button type="button" on:click={() => code.download('image/svg+xml')}>
      <Download /><Space w="sm" /> Save (.svg)
    </Button>
    <Button type="button" on:click={() => code.download('image/png')}>
      <Download /><Space w="sm" /> Save (.png)
    </Button>
    <Button type="button" on:click={() => code.share('image/png')}>
      <Share1 /><Space w="sm" /> Share (.png)
    </Button>
    <Button
      type="button"
      on:click={() => (
        code.copy('image/png'),
        notify({
          title: 'Copied',
          icon: Check,
          color: 'green',
          body: 'Code copied to clipboard.'
        })
      )}
    >
      <Copy /><Space w="sm" /> Copy (.png)
    </Button>
  </Group>

  {#if data.themes.length > 0 && data.quick_gens.length > 0}
    <Space h="md" />

    <Center override={{ 'align-items': 'unset' }}>
      {#if width > 800}
        <Grid mx={200}>
          <Grid.Col span={6}>
            <Grid>
              <Grid.Col span={12}><Center><Text>Quick Gens</Text></Center></Grid.Col>
              {#each data.quick_gens as item}
                <Grid.Col span={6}>
                  <Card shadow="md">
                    <!-- {#if item.img} -->
                    <Card.Section padding="lg">
                      <Image
                        fit="cover"
                        usePlaceholder
                        src={item.img}
                        height={100}
                        alt={item.title}
                      />
                    </Card.Section>
                    <!-- {/if} -->

                    <Center>
                      <Text align="center" my="sm">{item.title}</Text>
                    </Center>

                    <Group noWrap>
                      {#if item.provider == 'yt'}
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => goto(item.url)}
                        >
                          <Video />
                        </Button>
                      {:else if item.provider == 'yt mu'}
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => goto(item.url)}
                        >
                          <Play />
                        </Button>
                      {:else if item.provider == 'gh'}
                        <Button
                          fullSize
                          variant="light"
                          color="dark"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="dark"
                          on:click={() => goto(item.url)}
                        >
                          <GithubLogo />
                        </Button>
                      {:else if item.provider == 'sp'}
                        <Button
                          fullSize
                          variant="light"
                          color="green"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="green"
                          on:click={() => goto(item.url)}
                        >
                          <Play />
                        </Button>
                      {:else}
                        <Button fullSize variant="light" on:click={() => (url = item.url)}>
                          Generate
                        </Button>
                        <Button fullSize variant="light" on:click={() => goto(item.url)}>Go</Button>
                      {/if}
                    </Group>
                  </Card>
                </Grid.Col>
              {/each}
            </Grid>
          </Grid.Col>
          <Grid.Col span={6}>
            <Grid>
              <Grid.Col span={12}><Center><Text>Themes</Text></Center></Grid.Col>
              <Grid.Col span={6}>
                <Card shadow="md">
                  <Container m="sm">
                    <QrCode {url} margin={1} />
                  </Container>
                  <Button fullSize variant="light" on:click={() => (theme = undefined)}>
                    Apply
                  </Button>
                </Card>
              </Grid.Col>
              {#each data.themes as i_theme}
                <Grid.Col span={6}>
                  <Card shadow="md">
                    <Container m="sm">
                      <QrCode {url} theme={i_theme} margin={1} />
                    </Container>
                    <Button fullSize variant="light" on:click={() => (theme = i_theme)}>
                      Apply
                    </Button>
                  </Card>
                </Grid.Col>
              {/each}
            </Grid>
          </Grid.Col>
        </Grid>
      {:else}
        <Tabs grow>
          <Tabs.Tab label="Quick Gens">
            <Grid>
              {#each data.quick_gens as item}
                <Grid.Col span={6}>
                  <Card shadow="md">
                    <!-- {#if item.img} -->
                    <Card.Section padding="lg">
                      <Image
                        fit="cover"
                        usePlaceholder
                        src={item.img}
                        height={100}
                        alt={item.title}
                      />
                    </Card.Section>
                    <!-- {/if} -->

                    <Center>
                      <Text align="center" my="sm">{item.title}</Text>
                    </Center>

                    <Group noWrap>
                      {#if item.provider == 'yt'}
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => goto(item.url)}
                        >
                          <Video />
                        </Button>
                      {:else if item.provider == 'yt mu'}
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="red"
                          on:click={() => goto(item.url)}
                        >
                          Go
                        </Button>
                      {:else if item.provider == 'gh'}
                        <Button
                          fullSize
                          variant="light"
                          color="dark"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="dark"
                          on:click={() => goto(item.url)}
                        >
                          <GithubLogo />
                        </Button>
                      {:else if item.provider == 'sp'}
                        <Button
                          fullSize
                          variant="light"
                          color="green"
                          on:click={() => (url = item.url)}
                        >
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          color="green"
                          on:click={() => goto(item.url)}
                        >
                          Go
                        </Button>
                      {:else}
                        <Button fullSize variant="light" on:click={() => (url = item.url)}>
                          Generate
                        </Button>
                        <Button
                          fullSize
                          variant="light"
                          href={item.url}
                          on:click={() => goto(item.url)}>Go</Button
                        >
                      {/if}
                    </Group>
                  </Card>
                </Grid.Col>
              {/each}
            </Grid>
          </Tabs.Tab>
          <Tabs.Tab label="Themes">
            <Grid>
              <Grid.Col span={6}>
                <Card shadow="md">
                  <QrCode {url} margin={1} />
                  <Button fullSize variant="light" on:click={() => (theme = undefined)}>
                    Apply
                  </Button>
                </Card>
              </Grid.Col>
              {#each data.themes as i_theme}
                <Grid.Col span={6}>
                  <Card shadow="md">
                    <QrCode {url} theme={i_theme} margin={1} />
                    <Button fullSize variant="light" on:click={() => (theme = i_theme)}>
                      Apply
                    </Button>
                  </Card>
                </Grid.Col>
              {/each}
            </Grid>
          </Tabs.Tab>
        </Tabs>
      {/if}
    </Center>
  {/if}
</div>

<style>
  .container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }

  .code {
    width: 80%;
    max-width: 20rem;
  }
</style>
