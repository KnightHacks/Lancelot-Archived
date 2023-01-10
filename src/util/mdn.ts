import { fetch } from 'undici';

export const MDNBase = 'https://developer.mozilla.org';
export const searchMDNURL = (query: string) =>
  `${MDNBase}/api/v1/search?q=${query}` as const;

export interface MDNDocument {
  mdn_url: string;
  score: number;
  title: string;
  locale: string;
  slug: string;
  popularity: number;
  summary: string;
  highlight: MDNDocumentHighlight;
}

export interface MDNDocumentHighlight {
  body: string[];
  title: string;
}

export interface MDNResponse {
  documents: MDNDocument[];
}

export async function searchMDN(query: string): Promise<MDNDocument[]> {
  return await fetch(searchMDNURL(query))
    .then((res) => res.json())
    .then((json) => (json as MDNResponse).documents);
}
