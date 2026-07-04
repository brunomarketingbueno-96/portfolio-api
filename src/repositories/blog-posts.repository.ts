import { db } from '../db/index.js';
import { blogPosts, blogPostTranslations } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

type BlogPost = typeof blogPosts.$inferSelect;
type BlogPostTranslation = typeof blogPostTranslations.$inferSelect;

type NewBlogPost = typeof blogPosts.$inferInsert;
type NewBlogPostTranslation = typeof blogPostTranslations.$inferInsert;

export const findAllBlogPosts = async (
  publishedOnly: boolean = false
): Promise<Array<BlogPost & { translations: BlogPostTranslation[] }>> => {
  return await db.query.blogPosts.findMany({
    where: publishedOnly ? eq(blogPosts.isPublished, true) : undefined,
    with: { translations: true },
  });
};

export const findBlogPostById = async (
  id: string
): Promise<(BlogPost & { translations: BlogPostTranslation[] }) | undefined> => {
  return await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
    with: { translations: true },
  });
};

export const findBlogPostBySlugAndLang = async (
  language: string,
  slug: string
): Promise<(BlogPost & { translations: BlogPostTranslation[] }) | undefined> => {
  const translationRecord = await db.query.blogPostTranslations.findFirst({
    where: and(
      eq(blogPostTranslations.language, language),
      eq(blogPostTranslations.slug, slug)
    ),
    with: {
      post: {
        with: { translations: true },
      },
    },
  });

  if (!translationRecord) return undefined;

  if (!translationRecord.post.isPublished) return undefined;

  return translationRecord.post;
};

export const createBlogPostRecord = async (
  postData: NewBlogPost,
  translations: Omit<NewBlogPostTranslation, 'postId'>[]
) => {
  return await db.transaction(async (tx) => {
    const [post] = await tx.insert(blogPosts).values(postData).returning();

    if (!post) return null;

    let insertedTranslations: BlogPostTranslation[] = [];

    if (translations?.length) {
      insertedTranslations = await tx.insert(blogPostTranslations).values(
        translations.map((t) => ({
          ...t,
          postId: post.id,
        }))
      ).returning();
    }

    return {
      ...post,
      translations: insertedTranslations,
    };
  });
};

export const updateBlogPostRecord = async (
  id: string,
  postData: Partial<NewBlogPost>,
  translations: Omit<NewBlogPostTranslation, 'postId'>[]
) => {
  return await db.transaction(async (tx) => {
    const [updatedPost] = await tx.update(blogPosts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!updatedPost) return null;

    let updatedTranslations: BlogPostTranslation[] = [];

    if (translations && Array.isArray(translations)) {
      await tx.delete(blogPostTranslations).where(eq(blogPostTranslations.postId, id));

      if (translations.length > 0) {
        updatedTranslations = await tx.insert(blogPostTranslations).values(
          translations.map((t) => ({
            ...t,
            postId: id,
          }))
        ).returning();
      }
    }

    return {
      ...updatedPost,
      translations: updatedTranslations,
    };
  });
};

export const deleteBlogPostRecord = async (id: string) => {
  const [deletedPost] = await db.delete(blogPosts)
    .where(eq(blogPosts.id, id))
    .returning({ id: blogPosts.id });

  if (!deletedPost) return null;

  return deletedPost;
};
