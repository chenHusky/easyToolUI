import Markdown from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

export const useMarkdown = () => {
  // isAnchor：生成标题id
  const mkit = (data: string, isAnchor = false) => {
    const md: Markdown = new Markdown({
      html: true,
      linkify: false,
    });
    if (isAnchor) {
      md.use(markdownItAnchor, {});
    }
    return md.render(data);
  };
  return {
    mkit,
  };
};
