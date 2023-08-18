declare module '@maizzle/framework' {
  export function render(
    htmlString: string,
    params: {
      tailwind: { config: Record<string, unknown>; css: string };
      maizzle: Record<string, unknown>;
      beforeRender?: (html: string) => string;
    },
  ): Promise<{ html: string }>;
}
