'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorRightList: Handlebars.compile(document.querySelector('#template-author-right-list').innerHTML)
};

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
    title: '.post-title',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.list.authors',
  },
  link: {
    authors: {
      list: '.list.authors a',
      post: '.post-author a',
    },
    tags: {
      list: '.list.tags a',
      post: '.post-tags .list a',
    },
  },
};

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  console.log('clickedElement: ' + clickedElement);
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

const generateTitleLinks = function(customSelector=''){
  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  /* for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  console.log('customSelector' ,customSelector);
  let html = '';

  for(const article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);
    /* find the title element */
    const articleTitle = article.querySelector(select.article.title).innerHTML;
    console.log(articleTitle);
    /* get the title from the title element */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);
    /* create HTML of the link */
    html = html + linkHTML;
    console.log(html);
    /* insert link into titleList */
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
};

generateTitleLinks();

const calculateTagsParams = function(tags){
  const params = {max: 0, min: 999999};
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
};

calculateTagsParams();

const calculateTagClass = function(count, params){
  const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * (opts.tagSizes.count - 1) + 1 );
  return classNumber;
};

const generateTags = function(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  /* START LOOP: for every article: */
  for(const article of articles){
    /* find tags wrapper */
    let tagsWrapper = article.querySelector(select.article.tags);
    console.log(tagsWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');
    /* split tags into array */
    const arrayTags = tags.split(' ');
    /* START LOOP: for each tag */
    for(const tag of arrayTags){
      /* generate HTML of the link */
      const linkHTMLData = {tags: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      //let linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log('linkHTML', linkHTML);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */

    console.log(html);
    tagsWrapper.innerHTML = html;
    console.log('tagsWrapper', tagsWrapper);
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    console.log('allTagsData', allTagsData);
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsData to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTags);
};

generateTags();

const tagClickHandler = function(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('clickedElement', clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href', href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log(tag);
  /* find all tag links with class active */
  const tagsActive = document.querySelectorAll(select.all.linksTo.tags);
  /* START LOOP: for each active tag link */
  for(const tagActive of tagsActive){
    /* remove class active */
    console.log(tagActive);
    tagActive.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  let tagLinksHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(const tagLink of tagLinksHref){
    /* add class active */
    console.log(tagLink);
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};

const addClickListenersToTags = function(){
  /* find all links to tags */
  const linkTags = document.querySelectorAll(select.link.tags.post + ',' + select.link.tags.list);
  console.log('linkTags', linkTags);
  /* START LOOP: for each link */
  for(const linkTag of linkTags){
    console.log(linkTags);
    /* add tagClickHandler as event listener for that link */
    linkTag.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
};

addClickListenersToTags();

const generateAuthors = function(){
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  /* START LOOP: for each articles */
  for(const article of articles){
    /* get author from data-author attribute */
    const author = article.getAttribute('data-author');
    /* replace spaces with dashes between author name and surname*/
    const authorHref = author.replace(' ', '-');
    /* generate HTML of the link */
    const linkHTMLData = {author: authorHref};
    const linkHTML = templates.authorLink(linkHTMLData);
    console.log(linkHTML);
    /* find author paragraph */
    const authorParagraph = article.querySelector(select.article.author);
    /* add html variable with empty string */
    let listHTML = '';
    /* add generated html to listHtml variable */
    listHTML = listHTML + linkHTML;
    console.log('List HTML', listHTML);
    /* insert the link HTML code into authorParagraph */
    authorParagraph.innerHTML = listHTML;
    /* check if this link is NOT already in allAuthors */
    if(!allAuthors[author]) {
      /* add tag to allAuthors object */
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  /* END LOOP: for every article: */
  }
  /* find list of authors in right column */
  const authorsList = document.querySelector(select.listOf.authors);
  /*  create variable for all authors HTML code */
  const allAuthorsData = {authors: []};
  /* START LOOP: for each tag in allAuthors: */
  for(let author in allAuthors) {
    /* generate code of a link and add it to allAuthorsData */
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author]
    });
    console.log('allAuthorsHTML', allAuthorsData);
  /* END LOOP: for each tag in allTags: */
  }
  /* add HTML from allTagsHTML to authorList */
  authorsList.innerHTML = templates.authorRightList(allAuthorsData);
  console.log(authorsList);
};

generateAuthors();

const authorClickHandler = function(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('clickedElement', clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const authorHref = clickedElement.getAttribute('href');
  console.log('authorHref', authorHref);
  /* make a new constant "author" and extract tag from the "href" constant */
  const author = authorHref.replace('#author-', '').replace('-', ' ');
  console.log('author', author);
  /* find all author links with class active */
  const authorArticlesActive = document.querySelectorAll('a[href^="' + authorHref + '"]');
  /* START LOOP: for each active author link */
  for(const authorArticleActive of authorArticlesActive){
    /* remove class active */
    authorArticleActive.classList.remove('active');
  /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorArticlesHref = document.querySelectorAll('a[href="' + authorHref + '"]');
  /* START LOOP: for each found author link */
  for(const authorArticleHref of authorArticlesHref){
    console.log(authorArticleHref);
    /* add class active */
    authorArticleHref.classList.add('active');
  /* END LOOP: for each active author link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
};


const addClickListenersToAuthors = function(){
  /* find all links to author */
  const authorActives = document.querySelectorAll(select.link.authors.post + ',' + select.link.authors.list);
  /* START LOOP: for each link */
  for(const authorActive of authorActives){
    /* add tagClickHandler as event listener for that link */
    authorActive.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
};

addClickListenersToAuthors();
