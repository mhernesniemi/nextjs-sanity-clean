import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

export const postsQuery = groq`
*[_type == "page"] {
  title,
  _id
}
`

export const productsQuery = groq`
*[_type == "product"] {
  store {
    title,
    id
  }
}
`

export async function getPosts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(postsQuery)
}

export async function getProducts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(productsQuery)
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]`

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
  })
}

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export interface Post {
  store: any
  _type: 'post'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}
