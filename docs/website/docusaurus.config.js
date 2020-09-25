module.exports = {
  title: 'Huishoudboekje',
  tagline: 'Huishoudboekje Schaalbaar Documentatie',
  url: 'https://huishoudboekje.gitlab.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'commonground',
  projectName: 'huishoudboekje',
  customFields: {
    gettingStarted: '/documentatie/aan-de-slag',
  },
  themeConfig: {
    navbar: {
      title: 'Huishoudboekje',
      logo: {
        alt: 'Sloothuizen logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'documentatie/aan-de-slag',
          label: 'Documentatie',
          position: 'left'},
        {
          to: 'developers/local-development',
          label: 'Developers',
          position: 'right',
        },
        {
          href: 'https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/home',
          label: 'Wiki',
          position: 'right',
        },
        {
          href: 'https://gitlab.com/commonground/huishoudboekje/app-new',
          label: 'GitLab',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       // {
      //       //   label: 'Style Guide',
      //       //   to: 'docs/',
      //       // },
      //       // {
      //       //   label: 'Second Doc',
      //       //   to: 'docs/doc2/',
      //       // },
      //     ],
      //   },
      //   {
      //     title: 'Community',
      //     items: [
      //       // {
      //       //   label: 'Stack Overflow',
      //       //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //       // },
      //       // {
      //       //   label: 'Discord',
      //       //   href: 'https://discordapp.com/invite/docusaurus',
      //       // },
      //       // {
      //       //   label: 'Twitter',
      //       //   href: 'https://twitter.com/docusaurus',
      //       // },
      //     ],
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       // {
      //       //   label: 'Blog',
      //       //   to: 'blog',
      //       // },
      //       // {
      //       //   label: 'GitHub',
      //       //   href: 'https://github.com/facebook/docusaurus',
      //       // },
      //     ],
      //   },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} VNG Realisatie`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://gitlab.com/commonground/huishoudboekje/app-new/-/tree/develop/docs/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
