import { defineConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'
import { resolveURL } from 'ufo'

export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-JYEBV84K3Q' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-JYEBV84K3Q');`
    ]
  ],
  sitemap: {
    hostname: 'https://one.litingyes.top'
  },
  themeConfig: {
    logo: '/logo.png',
    externalLinkIcon: true,
    outline: [2, 4],
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/litingyes/one' }
    ]
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "One",
      description: "知识的歌者",
      themeConfig: {
        footer: {
          message: '基于 CC0-1.0 许可发布',
          copyright: '版权所有 © 2024-当前 刘惠'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        editLink: {
          pattern: 'https://github.com/litingyes/one/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页面'
        },
        lastUpdated: {
          text: '最后更新于',
        },
        nav: [
          {
            text: '前端',
            items: [
              {
                text: 'Vue.js',
                link: '/fe/vue/request'
              }
            ]
          },
          {
            text: '后端',
            items: [
              {
                text: '技术规范',
                link: '/be/spec/restful-api'
              }
            ]
          }
        ],
        sidebar: {
          '/fe/': [
            {
              text: 'Vue.js',
              items: [
                {
                  text: 'Vue.js 生态最佳请求方案',
                  link: '/fe/vue/request'
                }
              ]
            }
          ]
        }
      }
    },
    en: {
      label: "English",
      lang: "en-US",
      title: "One",
      description: "The singer of knowledge",
      themeConfig: {
        footer: {
          message: 'Released under the CC0-1.0 License.',
          copyright: 'Copyright © 2024-present Liting'
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        editLink: {
          pattern: 'https://github.com/litingyes/one/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdated: {
          text: 'Last updated at',
        },
        nav: [
          {
            text: 'Front End',
            items: [
              {
                text: 'Vue.js',
                link: '/en/fe/vue/request'
              }
            ]
          },
          {
            text: 'Back End',
            items: [
              {
                text: 'Spec',
                link: '/en/be/spec/restful-api'
              }
            ]
          }
        ],
        sidebar: {
          '/en/fe/': [
            {
              text: 'Vue.js',
              items: [
                {
                  text: 'Best Request Solution in Vue.js Ecosystem',
                  link: '/en/fe/vue/request'
                }
              ]
            }
          ]
        }
      }
    }
  },
  transformPageData(pageData, ctx) {
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      [
        'meta',
        {
          author: 'Liting'
        }
      ],
      [
        'meta',
        {
          name: 'og:title',
          content: pageData.title
        }
      ],
      [
        'meta',
        {
          name: 'og:type',
          content: 'article'
        }
      ],
      [
        'meta',
        {
          name: 'og:url',
          content: resolveURL(ctx.siteConfig.sitemap!.hostname, pageData.filePath).replace('.md', '.html')
        }
      ],
    )
  },
  vite: {
    plugins: [UnoCSS()]
  },
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'catppuccin-latte',
      dark:'catppuccin-mocha'
    }
  }
})
