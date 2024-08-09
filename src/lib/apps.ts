import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiLinkedin,
  SiSnapchat,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons'

export const apps = [
  {
    label: 'Facebook',
    value: 'facebook',
    icon: SiFacebook,
    url: (username) => `https://facebook.com/${username}`,
  },
  {
    label: 'YouTube',
    value: 'youtube',
    icon: SiYoutube,
    url: (username) => `https://youtube.com/user/${username}`,
  },
  {
    label: 'Twitter',
    value: 'twitter',
    icon: SiX,
    url: (username) => `https://twitter.com/${username}`,
  },
  {
    label: 'Instagram',
    value: 'instagram',
    icon: SiInstagram,
    url: (username) => `https://instagram.com/${username}`,
  },
  {
    label: 'GitHub',
    value: 'github',
    icon: SiGithub,
    url: (username) => `https://github.com/${username}`,
  },
  {
    label: 'Snapchat',
    value: 'snapchat',
    icon: SiSnapchat,
    url: (username) => `https://snapchat.com/add/${username}?src=QR_CODE`,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin',
    icon: SiLinkedin,
    url: (username) => `https://linkedin.com/in/${username}`,
  },
] as const satisfies {
  label: string
  value: string
  icon: React.ComponentType
  url: (username: string) => string
}[]
