import config from './auth.config'
import NextAuth from 'next-auth'

export const { auth: middleware } = NextAuth(config)
