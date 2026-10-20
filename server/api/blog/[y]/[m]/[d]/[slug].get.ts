export default defineEventHandler(async (event) => {
  const { y, m, d, slug } = getRouterParams(event);
  const article = await getArticle(y!, m!, d!, slug!);
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }
  return article;
});
