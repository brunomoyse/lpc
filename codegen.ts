
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./server/graphql/**/*.graphql",
  //documents: "src/**/*.vue",
  generates: {
    './composables/types.ts': {
      plugins: ['typescript', 'typescript-operations']
    }
  }
};
export default config;
