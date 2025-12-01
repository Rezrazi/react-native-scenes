import {createMDX} from "fumadocs-mdx/next";
import type {NextConfig} from "next";

const withMDX = createMDX();

const config: NextConfig = {
  //output: "export",
  reactStrictMode: true,
  redirects: async () => [
    { source: "/docs", destination: "/docs/getting-started", permanent: false },
    { source: "/", destination: "/docs/getting-started", permanent: false },
  ],
  // images: {
  //   unoptimized: true,
  // }
};

export default withMDX(config);
