import { ref, computed } from '@nuxtjs/composition-api'
import {
  useContent,
  extractComponents,
  componentsQuery,
} from '@vsf-enterprise/graphcms'

const useCmsBlog = () => {
  const { search, content } = useContent('blog')
  const orderBy = ref('desc')
  const searchTerm = ref('')

  const getBlogPosts = () => {
    return search({
      customQuery: `
        {
        blogs(where: { title_contains: "${
          searchTerm.value
        }" }, orderBy: createdAt_${orderBy.value.toUpperCase()}) {
          __typename
          createdAt
          id
          url
          title
          excerpt
          image {
            url
          }
          content {
            __typename
            ${componentsQuery}
          }
        }
      }
      `,
    })
  }

  const getSingleBlogPost = (id) => {
    return search({
      customQuery: `
        {
        blog(where: { url: "${id}" }) {
          __typename
          createdAt
          id
          url
          title
          excerpt
          image {
            url
          }
          content {
            __typename
            ${componentsQuery}
          }
        }
      }
      `,
    })
  }

  const truncateExcerpt = (excerpt) => {
    const maxLength = 128
    if (excerpt.length > maxLength) {
      return `${excerpt.substring(0, maxLength)} ...`
    } else {
      return excerpt
    }
  }

  const formatDate = (date) => {
    return date.split('T')[0].split('-').reverse().join('.')
  }

  const blogPosts = computed(() => {
    if (!content.value.blogs) return []

    return extractComponents(content.value.blogs as any).map((component) => ({
      ...component.props,
      excerpt: truncateExcerpt(component.props.excerpt),
      createdAt: formatDate(component.props.createdAt),
    }))
  })

  const blogPost = computed(() => {
    if (!content.value.blog) return null

    return extractComponents([content.value.blog] as any).map((component) => ({
      ...component.props,
      excerpt: truncateExcerpt(component.props.excerpt),
      createdAt: formatDate(component.props.createdAt),
    }))[0]
  })

  return {
    getBlogPosts,
    blogPosts,
    getSingleBlogPost,
    blogPost,
    orderBy,
    searchTerm,
  }
}

export default useCmsBlog
