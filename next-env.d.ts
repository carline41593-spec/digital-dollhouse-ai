/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation.d.ts" />

/**
 * This file is required to make Next.js aware of your custom page extensions.
 * Learn more: https://nextjs.org/docs/app/building-your-application/configuring/app-directory#configuring-extensions
 */
declare module '*.svg' {
  import * as React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
