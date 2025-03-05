export type SomeComponentType = React.ComponentType<{
  documentId: string
  document: {
    some: string
  }
}>

type SomeComponentProps = {
  text: string
}

export default function SomeComponent(props: SomeComponentProps) {
  return <span className="some-component">{props.text}</span>
}

export const ThirdComponent: SomeComponentType = (props) => {
  return <span>ThirdComponent: {props.document.some}</span>
}
