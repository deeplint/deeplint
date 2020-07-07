module.exports = {
  title: 'DeepLint',
  url: 'https://deeplint.com',
  baseUrl: '/',
  favicon: 'img/icons/favicon.ico',
  organizationName: 'DeepLint', // Usually your GitHub org/user name.
  projectName: 'DeepLint', // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
    defaultDarkMode: false,
    navbar: {
      title: '',
      logo: {
        alt: 'DeepLint',
        src: 'img/full-logo.svg',
      },
      links: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        {to: 'blog', label: 'Blog', position: 'right'},
        {
          href: 'https://github.com/deeplint/deeplint',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'What is DeepLint?',
              to: 'docs/',
            },
            {
              label: 'Get started',
              to: 'docs/install',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/deeplint',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/deeplint/deeplint',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DeepLint`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'intro',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/deeplint/deeplint/edit/master/web/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/deeplint/deeplint/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
