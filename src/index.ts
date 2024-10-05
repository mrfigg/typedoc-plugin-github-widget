/**
 * @packageDocumentation
 *
 * @document ../LICENSE
 */

'use strict'

import { Application, ParameterType, Renderer } from 'typedoc'

import { getPackageJson } from '@mrfigg/typedoc-plugin-lib-utils'

import { JSDOM } from 'jsdom'

/** @private */
export function load(app: Application) {
  app.options.addDeclaration({
    name: 'githubWidgetUrl',
    help: 'The url for the Github widget',
    type: ParameterType.String,
  })

  app.options.addDeclaration({
    name: 'githubWidgetTarget',
    help: 'The anchor target of the Github widget',
    type: ParameterType.String,
    defaultValue: '_blank',
  })

  let href: string | undefined
  let target = '_blank'

  app.renderer.on(Renderer.EVENT_BEGIN, () => {
    href = app.options.getValue('githubWidgetUrl') as string | undefined

    target =
      (app.options.getValue('githubWidgetTarget') as string | undefined) ??
      target

    if (href) {
      return
    }

    const packageJson = getPackageJson(app)

    if (packageJson) {
      if (
        !href &&
        typeof packageJson.repository === 'object' &&
        typeof packageJson.repository.url === 'string'
      ) {
        href =
          packageJson.repository.url.match(
            /^(?:git\+)?([A-Za-z]+?:\/\/(?:www\.)?github\.com\/[^$]+?)(?:\.git)?$/
          )?.[1] ?? undefined
      }

      if (!href && typeof packageJson.homepage === 'string') {
        href =
          packageJson.homepage.match(
            /^(?:git\+)?([A-Za-z]+?:\/\/(?:www\.)?github\.com\/[^$]+?)(?:\.git)?$/
          )?.[1] ?? undefined
      }
    }

    if (!href) {
      app.logger.warn('Failed to auto-detect Github url')
    }
  })

  app.renderer.on(Renderer.EVENT_END_PAGE, (event) => {
    if (!event.contents || !href) {
      return
    }

    const dom = new JSDOM(event.contents)
    const window = dom.window
    const document = window.document

    const widgets = document.querySelector(
      'header.tsd-page-toolbar > div.tsd-toolbar-contents > div#tsd-widgets'
    )

    if (!widgets) {
      return
    }

    const anchor = document.createElement('a')

    anchor.classList.add('tsd-widget')
    anchor.classList.add('tsd-toolbar-icon')
    anchor.classList.add('github-widget')
    anchor.classList.add('no-caption')

    anchor.setAttribute('href', href)
    anchor.setAttribute('aria-label', 'Github')
    anchor.setAttribute('target', target)

    anchor.innerHTML = `<svg width="20" height="20" style="transform: translateY(-2px);" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="var(--color-text)"/></svg>`

    widgets.prepend(anchor)

    event.contents = dom.serialize()
  })
}
