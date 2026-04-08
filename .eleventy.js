module.exports = function(eleventyConfig) {
  // ドキュメントファイルをビルド対象から除外
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("design.md");
  eleventyConfig.ignores.add("plan.md");

  // 静的ファイルのコピー
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("posts/**/*.jpg");
  eleventyConfig.addPassthroughCopy("posts/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("posts/**/*.png");
  eleventyConfig.addPassthroughCopy("posts/**/*.gif");
  eleventyConfig.addPassthroughCopy("posts/**/*.webp");
  eleventyConfig.addPassthroughCopy("posts/**/*.svg");

  // グローバルデータ
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

  // postsコレクション（日付降順）
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("./posts/**/index.md").reverse();
  });

  // 日付フィルター: "2025/09/01" 形式
  eleventyConfig.addFilter("dateDisplay", function(dateObj) {
    const d = new Date(dateObj);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  });

  // 日付フィルター: "2025-09-01" 形式（datetime属性用）
  eleventyConfig.addFilter("dateAttr", function(dateObj) {
    const d = new Date(dateObj);
    return d.toISOString().split("T")[0];
  });

  return {
    pathPrefix: "/AIForum-website/",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "docs"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
