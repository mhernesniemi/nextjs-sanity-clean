import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getPosts,
  getProducts,
  type Post,
  postsQuery,
  productsQuery,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[]
    products: Post[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const posts = await getPosts(client)
  const products = await getProducts(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      posts,
      products,
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery)
  const [products] = useLiveQuery<Post[]>(props.products, productsQuery)

  console.log('posts', props)

  return (
    <div className="flex m-16">
      <div className="w-full">
        <h2 className="text-2xl font-bold">Products</h2>
        {products.map((product) => (
          <div className="my-10" key={product.store.id}>
            {product.store.title}
          </div>
        ))}
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold">Pages</h2>
        {posts.map((post) => (
          <div className="my-10" key={post._id}>
            {post.title}
          </div>
        ))}
      </div>
    </div>
  )
}
