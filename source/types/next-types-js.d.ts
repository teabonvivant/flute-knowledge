declare module "next" {
  export type MetadataTitle =
    | string
    | {
        readonly default?: string;
        readonly template?: string;
        readonly absolute?: string;
      };

  export type Metadata = {
    readonly title?: MetadataTitle;
    readonly description?: string;
    readonly robots?: { readonly index?: boolean; readonly follow?: boolean };
    readonly metadataBase?: URL;
    readonly alternates?: {
      readonly canonical?: string;
    };
    readonly openGraph?: {
      readonly title?: string;
      readonly description?: string;
      readonly type?: string;
      readonly locale?: string;
    };
  };
}

declare module "next/types.js" {
  export type ResolvingMetadata = Promise<unknown>;
  export type ResolvingViewport = Promise<unknown>;
}

declare module "next/link" {
  import type * as React from "react";

  export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    readonly href: string;
    readonly prefetch?: boolean;
    readonly replace?: boolean;
    readonly scroll?: boolean;
  };

  const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module "next/image" {
  import type * as React from "react";

  export type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
    readonly src: string;
    readonly alt: string;
    readonly width?: number;
    readonly height?: number;
    readonly fill?: boolean;
    readonly priority?: boolean;
    readonly sizes?: string;
  };

  const Image: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<HTMLImageElement>>;
  export default Image;
}

declare module "next/navigation" {
  export function notFound(): never;
  export function usePathname(): string;
}
