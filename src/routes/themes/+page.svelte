<script lang="ts">
  import { page } from '$app/stores';
  import QrCode from '$lib/QRCode.svelte';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { Button, Card, Center, Container, Grid, MediaQuery } from '@svelteuidev/core';
  export let data: PageData;
</script>

<!-- <Center> -->
<MediaQuery
  largerThan="lg"
  styles={{
    marginInline: '20%'
  }}
>
  <Grid>
    {#each data.themes as theme}
      <Grid.Col span={6}>
        <Card shadow="md">
          <Container m="sm">
            <QrCode url={$page.url.href + theme.id} {theme} margin={1} />
          </Container>
          <Button
            fullSize
            variant="light"
            href={$page.url + theme.id}
            on:click={() => goto($page.url + theme.id)}>View</Button
          >
        </Card>
      </Grid.Col>
    {/each}
  </Grid>
</MediaQuery>
<!-- </Center> -->
