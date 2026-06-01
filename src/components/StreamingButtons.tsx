interface Props {
  youtube_url?: string
  spotify_url?: string
  apple_music_url?: string
  soundcloud_url?: string
  size?: 'sm' | 'md' | 'lg'
}

// Inline SVG platform logos
function YoutubeLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
    </svg>
  )
}

function SpotifyLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.7 0 12 0zm5.5 17.3c-.2.4-.7.5-1 .3-2.8-1.7-6.3-2.1-10.4-1.1-.4.1-.8-.2-.9-.6-.1-.4.2-.8.6-.9 4.5-1 8.4-.6 11.5 1.3.4.2.5.7.2 1zm1.5-3.3c-.3.4-.8.6-1.3.3-3.2-2-8.1-2.6-11.9-1.4-.5.1-1-.1-1.2-.6-.1-.5.1-1 .6-1.2 4.3-1.3 9.7-.7 13.4 1.6.4.3.6.8.4 1.3zm.1-3.4C15.3 8.1 8.8 7.9 5.2 9c-.6.2-1.2-.2-1.4-.8-.2-.6.2-1.2.8-1.4 4.2-1.3 11.2-1 15.6 1.7.5.3.7 1 .4 1.5-.3.5-1 .7-1.5.4z"/>
    </svg>
  )
}

function AppleMusicLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208A7.068 7.068 0 0 0 .05 5.015C.017 5.368 0 5.724 0 6.08v11.84c0 .36.018.718.05 1.073.1 1.04.44 1.994 1.077 2.82.567.739 1.3 1.264 2.154 1.596.667.257 1.363.374 2.077.4.288.01.575.018.864.018h11.85c.323 0 .646-.007.968-.023.89-.05 1.736-.28 2.503-.77 1.023-.658 1.71-1.576 2.062-2.752.135-.45.21-.912.23-1.38.02-.372.03-.748.03-1.122V6.124zm-8.983 7.15a3.78 3.78 0 0 1-1.09.515c-.405.12-.826.172-1.254.153-.44-.02-.86-.14-1.26-.3a3.65 3.65 0 0 1-1.17-.773 3.29 3.29 0 0 1-.77-1.15 3.57 3.57 0 0 1-.255-1.355c0-.474.085-.94.265-1.375.18-.44.44-.84.78-1.18.34-.34.74-.6 1.18-.78.45-.18.92-.267 1.39-.267.37 0 .73.05 1.08.153.334.1.64.247.92.443V5.22l-5.43 1.1v7.04c0 .21-.013.415-.04.617-.08.628-.324 1.19-.7 1.667-.374.478-.858.817-1.434.996a3.7 3.7 0 0 1-1.198.15c-.44-.02-.855-.14-1.254-.302a3.66 3.66 0 0 1-1.17-.77 3.29 3.29 0 0 1-.77-1.153 3.58 3.58 0 0 1-.256-1.356c0-.474.086-.94.266-1.375.18-.44.44-.84.78-1.18.34-.34.74-.6 1.18-.78.45-.18.92-.267 1.39-.267.37 0 .73.05 1.08.153.32.1.617.24.89.427V5.22s3.46-.703 5.43-1.1v9.154z"/>
    </svg>
  )
}

function SoundCloudLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 12.225c-.041 0-.082.006-.123.011.166-2.169 1.97-3.877 4.179-3.877.539 0 1.056.107 1.528.3.186-3.033 2.676-5.44 5.743-5.44 3.195 0 5.787 2.592 5.787 5.787 0 .17-.008.338-.023.505.214-.044.435-.067.661-.067 1.82 0 3.294 1.475 3.294 3.294 0 1.819-1.474 3.293-3.293 3.293H1.175C.527 15.031 0 14.505 0 13.857v-.428c0-.648.527-1.175 1.175-1.204zm.022.776c-.25.013-.447.218-.447.468v.428c0 .258.211.469.469.469h18.753c1.346 0 2.437-1.092 2.437-2.437 0-1.346-1.091-2.438-2.437-2.438-.281 0-.552.05-.805.14l-.463.163-.062-.479a4.946 4.946 0 0 0-.024-.486v-.001c0-2.715-2.202-4.918-4.919-4.918-2.501 0-4.569 1.87-4.877 4.303l-.072.572-.555-.157a3.186 3.186 0 0 0-.874-.122c-1.714 0-3.117 1.364-3.187 3.065l-.018.429h.081z"/>
    </svg>
  )
}

const BUTTONS = [
  {
    key: 'youtube',
    urlKey: 'youtube_url' as const,
    label: 'YouTube',
    sublabel: 'Watch',
    bg: 'bg-[#FF0000] hover:bg-[#cc0000]',
    Logo: YoutubeLogo,
  },
  {
    key: 'spotify',
    urlKey: 'spotify_url' as const,
    label: 'Spotify',
    sublabel: 'Listen',
    bg: 'bg-[#1DB954] hover:bg-[#19a349]',
    Logo: SpotifyLogo,
  },
  {
    key: 'apple',
    urlKey: 'apple_music_url' as const,
    label: 'Apple Music',
    sublabel: 'Listen',
    bg: 'bg-gradient-to-r from-[#FC5C7D] to-[#6A82FB] hover:opacity-90',
    Logo: AppleMusicLogo,
  },
  {
    key: 'soundcloud',
    urlKey: 'soundcloud_url' as const,
    label: 'SoundCloud',
    sublabel: 'Listen',
    bg: 'bg-[#FF5500] hover:bg-[#e64d00]',
    Logo: SoundCloudLogo,
  },
] as const

export default function StreamingButtons({ youtube_url, spotify_url, apple_music_url, soundcloud_url, size = 'md' }: Props) {
  const urls = { youtube_url, spotify_url, apple_music_url, soundcloud_url }
  const available = BUTTONS.filter((b) => urls[b.urlKey])
  if (available.length === 0) return null

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18
  const padding = size === 'sm' ? 'px-3 py-2' : size === 'lg' ? 'px-6 py-3.5' : 'px-4 py-2.5'
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'

  return (
    <div className="flex flex-wrap gap-3">
      {available.map(({ key, urlKey, label, sublabel, bg, Logo }) => (
        <a
          key={key}
          href={urls[urlKey]}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2.5 ${padding} rounded-xl font-semibold text-white transition-all duration-200 active:scale-95 shadow-lg ${bg}`}
        >
          <Logo size={iconSize} />
          <span className={textSize}>{label}</span>
          {size !== 'sm' && <span className={`${textSize} opacity-60 font-normal`}>· {sublabel}</span>}
        </a>
      ))}
    </div>
  )
}
