// src/utils/legacyHelper.d.ts
declare module 'legacy-helper' {
    export function doSomething(arg: any): any;
  }
  
  // src/services/someService.ts
  import { doSomething } from 'legacy-helper';
  
  function processData(data: any): void {
    // TODO: Add proper typing
    const result = doSomething(data);
    // ...
  }