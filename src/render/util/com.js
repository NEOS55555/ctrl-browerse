import { addClass, removeClass } from '.'

export const globalEvtMap = {
  softwareTransparent: () => addClass(document.body, 'transparent'),
  softwareColorful: () => removeClass(document.body, 'transparent'),
}
