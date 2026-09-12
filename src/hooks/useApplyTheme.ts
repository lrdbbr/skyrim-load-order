import { useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'

/**
 * Applique le thème choisi sur l'élément <html> via data-theme, pour que
 * les variables CSS déclarées dans index.css prennent effet. index.html
 * applique aussi la valeur persistée de façon synchrone (avant React) pour
 * éviter un flash du thème par défaut au chargement.
 */
export function useApplyTheme() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
}
