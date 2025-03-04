// Add module declaration for JSON imports
declare module '*.json' {
  const value: {
    users: any[];
    tasks: any[];
  };
  export default value;
}
