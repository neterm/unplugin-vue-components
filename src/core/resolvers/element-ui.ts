import type {
  ComponentResolver,
  SideEffectsInfo,
} from '../../types'
import { kebabCase } from '../utils'

export interface ElementUiResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default 'css'
   */
  importStyle?: boolean | 'css' | 'sass'

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp

  /**
   * theme name, like '@qzdata/element-theme-qzdata'
   */
  themeName?: string
}

function getSideEffects(
  partialName: string,
  options: ElementUiResolverOptions,
): SideEffectsInfo | undefined {
  const { importStyle = 'css', themeName } = options

  if (!importStyle)
    return

  if (importStyle === 'sass') {
    if (themeName) {
      return [
        `${themeName}/src/base.scss`,
        `${themeName}/src/${partialName}.scss`,
      ]
    }

    return [
      'element-ui/packages/theme-chalk/src/base.scss',
      `element-ui/packages/theme-chalk/src/${partialName}.scss`,
    ]
  }
  else {
    if (themeName) {
      return [
        `${themeName}/lib/base.css`,
        `${themeName}/lib/${partialName}.css`,
      ]
    }

    return [
      'element-ui/lib/theme-chalk/base.css',
      `element-ui/lib/theme-chalk/${partialName}.css`,
    ]
  }
}

/**
 * Resolver for Element-UI
 * @link https://element.eleme.cn/#/zh-CN
 * @version @element-ui ^2.15.3, @vue ^2.6.14
 * @author @nabaonan
 */
export function ElementUiResolver(options: ElementUiResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (options.exclude && name.match(options.exclude))
        return
      if (/^El[A-Z]/.test(name)) {
        const compName = name.slice(2)
        const partialName = kebabCase(compName)
        if (partialName === 'collapse-transition') {
          return {
            from: `element-ui/lib/transitions/${partialName}`,
          }
        }
        return {
          from: `element-ui/lib/${partialName}`,
          sideEffects: getSideEffects(partialName, options),
        }
      }
    },
  }
}
