import Markdown from 'markdown-it';
import { full as emoji } from 'markdown-it-emoji';

const mkit = new Markdown({ html: true, linkify: true });

export function handleMarkdown(context: string) {
    mkit.use(emoji);
    return mkit.renderInline(context);
  }