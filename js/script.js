'use strict';

/* document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
  }); */

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

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.list.tags a',
  //optTagSelector = '.list-horizontal a',
  optArticleAuthorSelector = '.post .post-author',
  optArticleAuthorSelectorLink = '.post-author a',
  optTagsListSelector = '.list.tags',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

const generateTitleLinks = function(customSelector=''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log('customSelector' ,customSelector);
  let html = '';

  for(const article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    console.log(articleTitle);
    /* get the title from the title element */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
  const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * (optCloudClassCount - 1) + 1 );
  return classNumber;
};

const generateTags = function(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(const article of articles){
    /* find tags wrapper */
    let tagsWrapper = document.querySelector(optTagsListSelector);
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
      let linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
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
    console.log(tagsWrapper);
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsHTML += '<li><a class="' + optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) +'" href="#tag-' + tag + '">' + tag + '</a><span>' + '(' + allTags[tag] + ')</span></li>';
    console.log('allTagsHTML', allTagsHTML);
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
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
  const tagsActive = document.querySelectorAll('a.active[href^="#tag-"]');
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
  const linkTags = document.querySelectorAll(optArticleTagsSelector);
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
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for each articles */
  for(const article of articles){
    /* get author from data-author attribute */
    const author = article.getAttribute('data-author');
    /* replace spaces with dashes between author name and surname*/
    const authorHref = author.replace(' ', '-');
    /* generate HTML of the link */
    const html = '<a href="#author-' + authorHref + '"><span>by ' + author + '</span></a>';
    console.log(html);
    /* find author paragraph */
    const authorParagraph = article.querySelector(optArticleAuthorSelector);
    /* add html variable with empty string */
    let listHTML = '';
    /* add generated html to listHtml variable */
    listHTML = listHTML + html;
    console.log('List HTML', listHTML);
    /* insert the link HTML code into authorParagraph */
    authorParagraph.innerHTML = listHTML;
  }
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
  const authorArticlesActive = document.querySelectorAll('a.active[href^="' + authorHref + '"]');
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
  const authorActives = document.querySelectorAll(optArticleAuthorSelectorLink);
  /* START LOOP: for each link */
  for(const authorActive of authorActives){
    /* add tagClickHandler as event listener for that link */
    authorActive.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
};

addClickListenersToAuthors();


