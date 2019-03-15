declare module 'react-element-to-jsx-string' {
  export interface Options {
    showFunctions?: boolean;
    displayName?(): string;
  }

  export default function render(
    element: React.ReactNode,
    options: Options
  ): string;
}
