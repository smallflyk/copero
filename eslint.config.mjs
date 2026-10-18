import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'
export default tseslint.config(
 {ignores:['.next/**','out/**','node_modules/**','design-qa/**']},
 js.configs.recommended,
 ...tseslint.configs.recommended,
 {files:['**/*.{ts,tsx,mjs}'],languageOptions:{globals:{window:'readonly',document:'readonly',navigator:'readonly',URL:'readonly',Blob:'readonly',HTMLFormElement:'readonly',HTMLDivElement:'readonly',CanvasRenderingContext2D:'readonly',console:'readonly',process:'readonly',Buffer:'readonly',Request:'readonly',Response:'readonly',Headers:'readonly'}},rules:{'@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_'}],'no-undef':'off'}},
 {files:['**/*.{tsx,ts}'],plugins:{'react-hooks':hooks},rules:hooks.configs.recommended.rules},
)
