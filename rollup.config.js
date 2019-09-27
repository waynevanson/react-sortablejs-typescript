import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const options =  {
  input: 'src/components/react-sortable/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfig: "rollup.tsconfig.json"
    })
  ]
}

export default options