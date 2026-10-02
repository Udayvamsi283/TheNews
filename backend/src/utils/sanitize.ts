import sanitizeHtml from 'sanitize-html';

export const sanitizeArticleHtml = (dirtyHtml: string): string => {
  if (!dirtyHtml) return '';

  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'figure', 'figcaption',
      'div', 'span',
      'iframe'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title', 'class'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
      iframe: [
        'src', 'width', 'height', 'frameborder',
        'allow', 'allowfullscreen', 'title', 'class'
      ],
      '*': ['class', 'style', 'id', 'data-*']
    },
    allowedIframeHostnames: [
      'www.youtube.com',
      'youtube.com',
      'player.vimeo.com',
      'open.spotify.com',
      'w.soundcloud.com'
    ],
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce secure rel on external links
        if (attribs.href && (attribs.href.startsWith('http://') || attribs.href.startsWith('https://'))) {
          attribs.rel = 'noopener noreferrer';
        }
        return {
          tagName,
          attribs
        };
      }
    }
  });
};
