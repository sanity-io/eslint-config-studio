type SomeComponentProps = {
  text: string
}

export default function SomeComponent(props: SomeComponentProps) {
  return <span className="some-component">{props.text}</span>
}
