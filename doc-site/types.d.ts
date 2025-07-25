declare module '*.css' {
  const content: string;
  export default content;
}

declare module './index.css' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}