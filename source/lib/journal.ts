import articleData from '@/data/generated/journal.json';
import categoryData from '@/data/journal-categories.json';
import sourceData from '@/data/journal-sources.json';
export type Article = {id:string;slug:string;title:string;category:string;topics:string[];sourceIds:string[];excerpt:string;sections:{heading:string;paragraphs:string[]}[];diagram:{kind:string;caption:string;nodes:{label:string;detail:string}[]};characterCount:number;minutes:number;published:string};
export const articles = articleData as Article[];
export const journalCategories = categoryData;
export const journalSources = sourceData;
export const editorialArticles = Array.from({length:10},(_,i)=>journalCategories.map(c=>articles.filter(a=>a.category===c.slug)[i]).filter((a):a is Article=>Boolean(a))).flat();
export function getArticle(slug:string){return articles.find(a=>a.slug===slug)}
export function getCategory(slug:string){return journalCategories.find(c=>c.slug===slug)!}
export function relatedArticles(article:Article){return articles.filter(a=>a.slug!==article.slug).map(a=>({a,score:(a.category===article.category?4:0)+a.topics.filter(t=>article.topics.includes(t)).length})).sort((x,y)=>y.score-x.score).slice(0,3).map(x=>x.a)}
