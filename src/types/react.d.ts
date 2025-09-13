import React from 'react';

declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: React.DependencyList): void;
  
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [key: string]: any;
  }
}

// Global type declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    
    interface IntrinsicAttributes {
      [key: string]: any;
    }
  }
  
  // Allow any HTML attributes on all elements
  interface HTMLAttributes<T> {
    [key: string]: any;
  }
}
