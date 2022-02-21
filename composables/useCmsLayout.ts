import { useContent } from '@vsf-enterprise/graphcms'
import { onMounted, computed, useContext } from '@nuxtjs/composition-api'

const useCmsLayout = () => {
  const { search: searchLayout, content: layout } = useContent('layout')
  const context = useContext()

  context.i18n.onLanguageSwitched = async () => {
    await getLayout()
    applyCmsTranslations(context.i18n.locale)
  }

  const getLayout = () =>
    searchLayout({
      customQuery: `
          {
            layout(where: { url: "cms-layout" }, locales: ${context.i18n.locale}) {
              header {
                __typename
                logo {
                  url
                }
                navigation {
                  caption
                  link
                }
                search_placeholder
              }
              footer {
                __typename
                items {
                  heading
                  items {
                    caption
                    link
                  }
                }
              }
              styleGuide {
                __typename
                color_primary {
                  hex
                }
                color_secondary {
                  hex
                }
                color_text {
                  hex
                }
                font_primary
                font_secondary
                button_radius
              }
              translations {
                translations
              }
            }
          }
        `,
    })

  onMounted(async () => {
    applyCmsTranslations(context.i18n.locale)
  })

  const applyCmsTranslations = (locale) => {
    const translations = getLayoutPart('translations') as any

    if (!translations.value.length) return

    context.i18n.mergeLocaleMessage(locale, translations.value[0].translations)
  }

  const getLayoutPart = (part) => computed(() => (layout.value.layout ? [layout.value.layout[part]] : []))

  const styleGuide = computed(() =>
    getLayoutPart('styleGuide').value.map((item) => ({
      ...item,
      color_primary: item.color_primary.hex,
      color_secondary: item.color_secondary.hex,
      color_text: item.color_text.hex,
    })),
  )

  const header = computed(() => {
    const extractedHeader = layout.value.layout && layout.value.layout.header

    return {
      logo: extractedHeader ? extractedHeader.logo : { url: null, alt: null },
      navigation: extractedHeader ? extractedHeader.navigation : [],
    }
  })

  const footer = computed(() => {
    const extractedFooter = layout.value.layout && layout.value.layout.footer

    return {
      items: extractedFooter ? extractedFooter.items : [],
    }
  })

  return {
    getLayout,
    translations: getLayoutPart('translations'),
    styleGuide,
    header,
    footer,
  }
}

export default useCmsLayout
