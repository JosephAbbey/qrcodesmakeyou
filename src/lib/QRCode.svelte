<script lang="ts">
  import type { Theme } from '@prisma/client';
  import qrcode from './qrcode';

  export let url: string;
  export let theme: Omit<Theme, 'id' | 'userId'> | undefined = undefined;
  export let margin = 4;
  export let svg: string = '';

  type CopyMimeType = 'image/svg+xml' | 'image/png';
  type MimeType = 'image/svg+xml' | 'image/png' | 'image/jpg';

  export function blob(
    mimetype: MimeType = 'image/svg+xml'
  ): Promise<{ filename: string; mimetype: MimeType; blob: Blob }> {
    return new Promise((resolve, reject) => {
      if (mimetype == 'image/svg+xml') {
        resolve({
          filename: 'qrcode.svg',
          mimetype,
          blob: new Blob([svg])
        });
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 600;
        const ctx = canvas.getContext('2d')!;

        const img = new Image();

        img.addEventListener('load', () => {
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (b) =>
              resolve({
                filename: 'qrcode.' + mimetype.substring(6),
                mimetype,
                blob: b!
              }),
            mimetype
          );
        });

        img.src = 'data:image/svg+xml;base64,' + btoa(svg);
      }
    });
  }

  export function data(
    mimetype: MimeType = 'image/svg+xml'
  ): Promise<{ filename: string; mimetype: MimeType; url: string }> {
    return new Promise((resolve, reject) => {
      if (mimetype == 'image/svg+xml') {
        resolve({
          filename: 'qrcode.svg',
          mimetype,
          url: 'data:image/svg+xml;base64,' + btoa(svg)
        });
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 600;
        const ctx = canvas.getContext('2d')!;

        const img = new Image();

        img.addEventListener('load', () => {
          ctx.drawImage(img, 0, 0);

          resolve({
            filename: 'qrcode.' + mimetype.substring(6),
            mimetype,
            url: canvas.toDataURL(mimetype)
          });
        });

        img.src = 'data:image/svg+xml;base64,' + btoa(svg);
      }
    });
  }

  export async function share(mimetype?: MimeType) {
    const b = await blob(mimetype);
    await navigator.share({
      title: b.filename,
      files: [new File([b.blob], b.filename, { type: b.mimetype })]
    });
  }

  export async function copy(mimetype: CopyMimeType = 'image/png') {
    if (mimetype == 'image/png')
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': (await blob(mimetype)).blob })
      ]);
    else await navigator.clipboard.writeText(svg);
  }

  export async function download(mimetype?: MimeType) {
    const d = await data(mimetype);
    const link = document.createElement('a');
    link.download = d.filename;
    link.href = d.url;
    link.click();
  }
</script>

{#await qrcode(url, theme, margin).then((s) => (svg = s))}
  <div class="code placeholder" />
{:then code}
  <div class="code">
    {@html code}
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .code {
    width: 100%;
    aspect-ratio: 1;
  }
</style>
