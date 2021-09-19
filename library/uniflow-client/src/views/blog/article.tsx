import React from 'react';
import { Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { pathTo } from '../../routes';
import { MDXProvider } from '../../components';
import { FC } from 'react';

export interface ArticleProps {
  article: {
    body: string;
    timeToRead: string;
    excerpt: string;
    frontmatter: {
      title: string;
      author: {
        fields: {
          slug: string;
        };
        name: string;
        image: {
          childImageSharp: {
            gatsbyImageData: IGatsbyImageData;
          };
        };
      };
      cover: {
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData;
        };
        extension: string;
        publicURL: string;
      };
      coverSeo: {
        publicURL: string;
      };
      coverAuthor: string;
      coverOriginalUrl: string;
      tags: string[];
      date: string;
    };
    parent: {
      relativePath: string;
    };
  };
  previous?: {
    frontmatter: {
      title: string;
    };
    fields: {
      slug: string;
    };
  };
  next?: {
    frontmatter: {
      title: string;
    };
    fields: {
      slug: string;
    };
  };
}

const Article: FC<ArticleProps> = (props) => {
  const { article, previous, next } = props;

  return (
    <section className="section container-fluid">
      <figure className="figure-fluid">
        {article.frontmatter.cover.childImageSharp && (
          <GatsbyImage
            image={article.frontmatter.cover.childImageSharp.gatsbyImageData}
            className="figure-img img-fluid"
            alt="Cover"
          />
        )}
        {article.frontmatter.cover.extension === 'svg' && (
          <img
            className="figure-img img-fluid"
            src={article.frontmatter.cover.publicURL}
            alt="Cover"
          />
        )}
        <figcaption className="figure-caption text-center">
          credit{' '}
          <a href={article.frontmatter.coverOriginalUrl} target="_blank" rel="noopener noreferrer">
            {article.frontmatter.coverAuthor}
          </a>
        </figcaption>
      </figure>

      <h3 className="my-4">{article.frontmatter.title}</h3>

      <div className="row pt-4 mb-3">
        <div className="col-sm-12 text-center">
          <small>
            Posted {article.frontmatter.date} by
            <GatsbyImage
              image={article.frontmatter.author.image.childImageSharp.gatsbyImageData}
              alt={article.frontmatter.author.name}
              className="rounded-circle mx-2"
              style={{ verticalAlign: 'middle', display: 'inline-block' }}
            />
            <Link
              to={pathTo('contributor', {
                slug: article.frontmatter.author.fields.slug,
              })}
            >
              {article.frontmatter.author.name}
            </Link>
            <span> - </span>
            <i>{article.timeToRead} min read</i>
          </small>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-sm-12">
          <MDXProvider>
            <MDXRenderer>{article.body}</MDXRenderer>
          </MDXProvider>
          <p>
            <a
              href={`https://github.com/uniflow-io/uniflow/edit/1.x/docs/blog/${article.parent.relativePath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faEdit} /> Edit this page on GitHub
            </a>
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-auto">
          {previous && (
            <Link to={pathTo('article', { slug: previous.fields.slug })} className="pull-left">
              <FontAwesomeIcon icon={faArrowLeft} /> {previous.frontmatter.title}
            </Link>
          )}
        </div>
        <div className="col-auto ms-auto">
          {next && (
            <Link to={pathTo('article', { slug: next.fields.slug })} className="pull-right">
              {next.frontmatter.title} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Article;
