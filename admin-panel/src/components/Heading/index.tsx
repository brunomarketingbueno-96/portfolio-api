interface HeadingProps {
  level: number;
  icon?: string;
  title: string;
}

export default function Heading({ level, icon, title }: HeadingProps) {
  const render = () => {
    switch (level) {
      case 1:
        return (
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {icon && <span className="text-2xl"> {icon} </span>}
            {title}
          </h1>
        )
      case 2:
        return <h2>{title}</h2>
      case 3:
        return <h3>{title}</h3>
      default:
        return <h1>{title}</h1>
    }
  }

  return (
    render()
  )
}
