/**
 * schema.org data (JSON-LD) that tells search engines who the site is
 * about and what each page is. BaseLayout writes it into the page head.
 * Only facts the site already shows go here.
 */
import { SITE, SOCIAL } from './constants';
import { BCP47, type Lang } from './i18n';

const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Kaan Usta',
  alternateName: 'Yusuf Kaan Usta',
  jobTitle: 'Full-Stack Developer',
  url: SITE.url,
  sameAs: [SOCIAL.linkedin, SOCIAL.github, SOCIAL.youtube, SOCIAL.itchio],
};
const author = { '@type': 'Person', '@id': PERSON_ID, name: 'Kaan Usta', url: SITE.url };

/** Home page: the person and the site. */
export function homeLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        inLanguage: BCP47[lang],
        publisher: { '@id': PERSON_ID },
      },
    ],
  };
}

/** A blog post. */
export function postLd(p: { title: string; description: string; url: string; image: string; published: Date; modified?: Date; lang: Lang }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    url: p.url,
    mainEntityOfPage: p.url,
    image: [p.image],
    datePublished: p.published.toISOString(),
    dateModified: (p.modified ?? p.published).toISOString(),
    inLanguage: BCP47[p.lang],
    author,
    publisher: author,
  };
}

/** A project page. */
export function projectLd(p: { title: string; description: string; url: string; image?: string; year: number; keywords: string[]; lang: Lang }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.description,
    url: p.url,
    ...(p.image && { image: [p.image] }),
    dateCreated: String(p.year),
    keywords: p.keywords.join(', '),
    inLanguage: BCP47[p.lang],
    creator: author,
  };
}
