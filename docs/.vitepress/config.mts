import { defineConfig } from 'vitepress'

export default defineConfig({
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      title: "知识的歌者",
      description: "记录学习 & 总结人生",
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
        }
      }
    }
  },
  themeConfig: {
    logo: '/logo.png',
    externalLinkIcon: true,
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
  head: [['link', { rel: 'icon', href: '/logo.png' }]]
})
