import typescript from "rollup-plugin-typescript2";
import pkg from "../package.json";

const options = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    typescript({
      typescript: require("typescript"),
      tsconfig: "config/tsconfig.rollup.json",
      clean: true,
    })
  ]
};

export default options;
