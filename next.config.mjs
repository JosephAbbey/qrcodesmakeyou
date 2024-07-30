// import withSerwistInit from '@serwist/next'

// const withSerwist = withSerwistInit({
//   swSrc: './src/app-worker.ts',
//   swDest: './public/sw.js',
//   reloadOnOnline: true,
// })

/** @type {import('next').NextConfig} */
const nextConfig =
  // withSerwist(
  {
    experimental: {
      reactCompiler: true,
    },
  }
// )

export default nextConfig
