import nextTranspileModules from "next-transpile-modules";

const withTM = nextTranspileModules(["rc-util", "rc-picker"]);

const nextConfig = withTM({
  reactStrictMode: true,
});

export default nextConfig;
