interface Props {
  url: string
  title: string
}

export default function VideoEmbed({ url, title }: Props) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-bg-card border border-border-subtle">
      <iframe
        src={url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  )
}
