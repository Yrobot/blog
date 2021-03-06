import Head from 'next/head';

import Menu from 'components/Menu';
import Comment from 'components/Comment';
import Layout from 'components/Layout';
import BlogProgress from 'components/BlogProgress';
import BlogList from 'components/BlogList';
import WelcomeCard from 'components/WelcomeCard';
import GithubList from 'components/GithubList';
import { TransProvider } from 'I18N';
import zh from 'locales/zh-CN.js';
import en from 'locales/en-US.js';

const languages = { zh, en };

export default function Index({ typePosts = [], compeled, draftCount }) {
  return (
    <TransProvider data={languages}>
      <Layout>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
          />
          <meta name='keywords' content='yrobot,blog,博客,github,js,css,html,技术'></meta>
          <meta name='description' content='yrobot的博客，纪录技术和生活。'></meta>
          <title>Yrobot's Blog</title>
        </Head>
        <Menu />
        <div className='min-w-0 flex-auto 2xl:flex flex-row items-start justify-between'>
          <div className='min-w-0 2xl:flex-auto 2xl:mr-[50px] 2xl:pt-[30px]'>
            <BlogProgress compeled={compeled} progress={draftCount} />
            <BlogList typePosts={typePosts} />
          </div>
          <div className='2xl:flex-none 2xl:w-[580px]'>
            <WelcomeCard />
            <GithubList />
            <Comment placeholder='Leave a comment!' />
          </div>
        </div>
      </Layout>
    </TransProvider>
  );
}

export async function getStaticProps() {
  const allPosts = require('lib/api')
    .getAllPosts()
    .map(({ content, ...res }) => res);

  const draftCount = require('lib/api').getAllDrafts().length;

  const compeled = allPosts.length;

  const hashMap = {};

  allPosts.map((post) => {
    const key = (post.url || '').split('/')[2] || '其他';
    hashMap[key] = [...(hashMap[key] || []), post];
  });

  const typePosts = Object.entries(hashMap).map(([title, list]) => ({
    title,
    list,
  }));

  typePosts.unshift({
    title: 'All',
    list: allPosts,
  });

  return {
    props: { typePosts, compeled, draftCount },
  };
}
