import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { configs as tseslintConfigs } from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.kilo']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslintConfigs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    rules: {
      'react-refresh/only-export-components': ['error', { allowConstantExport: true, allowExportNames: ['badgeVariants', 'buttonVariants', 'toggleVariants', 'navigationMenuTriggerStyle', 'useFormField', 'Form', 'FormItem', 'FormLabel', 'FormControl', 'FormDescription', 'FormMessage', 'FormField', 'useSidebar'] }],
    },
  },
  {
    files: ['src/app/components/ui/form.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
