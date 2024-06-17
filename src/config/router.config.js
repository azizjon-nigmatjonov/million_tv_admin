// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { liveTv } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/dashboard'),
        meta: { title: 'dashboard', keepAlive: true, icon: 'pie-chart', permission: ['dashboard'] },
      },

      // customers
      {
        path: '/customers',
        name: 'customers',
        hideChildrenInMenu: true,
        component: RouteView,
        redirect: '/customers/list',
        meta: { title: 'customers', icon: 'team', permission: ['customer'] },
        children: [
          {
            path: '/customers/list',
            name: 'CustomersList',
            component: () => import('@/views/customers/CustomersList'),
            meta: { title: 'customers', keepAlive: true, permission: ['customer'] },
          },
          {
            path: '/customers/create',
            name: 'CustomersCreate',
            component: () => import('@/views/customers/CustomersCreate'),
            meta: { title: 'customers', keepAlive: true, permission: ['customer'] },
          },
          {
            path: '/customers/update/:id',
            name: 'CustomersUpdate',
            component: () => import('@/views/customers/CustomersCreate'),
            meta: { title: 'customers', keepAlive: true, permission: ['customer'] },
          },
        ],
      },

      {
        path: '/movieSettings',
        name: 'movieSettings',
        component: RouteView,
        meta: { title: 'movieSettings', icon: 'youtube', permission: ['category', 'genre', 'tag', 'movie', 'staff'] },
        children: [
          // movies
          {
            path: '/movie',
            name: 'movies',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/movie/list',
            meta: { title: 'movies', icon: 'play-circle', permission: ['movie'] },
            children: [
              {
                path: '/movie/list',
                name: 'MoviesList',
                component: () => import('@/views/movies/MoviesListV2'),
                meta: { title: 'movies', keepAlive: true, permission: ['movie'] },
              },
              {
                path: '/movie/create',
                name: 'MoviesCreate',
                component: () => import('@/views/movies/MoviesCreate'),
                meta: { title: 'movies', keepAlive: true, permission: ['movie'] },
              },
              {
                path: '/movie/update/:id',
                name: 'MoviesUpdate',
                component: () => import('@/views/movies/MoviesCreate'),
                meta: { title: 'movies', keepAlive: true, permission: ['movie'] },
              },
              {
                path: '/movie/seasons',
                name: 'MoviesSeasons',
                hideChildrenInMenu: true,
                component: RouteView,
                meta: { title: 'movies', keepAlive: true, permission: ['movie'] },
                children: [
                  {
                    path: '/movie/:movieId/seasons/list',
                    name: 'SeasonsList',
                    component: () => import('@/views/seasons/SeasonsList'),
                    meta: { title: 'moviesSeasons', keepAlive: true, permission: ['movie'] },
                  },
                  {
                    path: '/movie/:movieId/seasons/create',
                    name: 'SeasonsCreate',
                    component: () => import('@/views/seasons/SeasonsCreate'),
                    meta: { title: 'moviesSeasons', keepAlive: true, permission: ['movie'] },
                  },
                  {
                    path: '/movie/:movieId/seasons/update/:id',
                    name: 'SeasonsUpdate',
                    component: () => import('@/views/seasons/SeasonsCreate'),
                    meta: { title: 'moviesSeasons', keepAlive: true, permission: ['movie'] },
                  },
                  {
                    path: '/movie/seasons/episodes',
                    name: 'SeasonsUpdate',
                    hideChildrenInMenu: true,
                    component: RouteView,
                    meta: { title: 'moviesEpisodes', keepAlive: true, permission: ['movie'] },
                    children: [
                      {
                        path: '/movie/:movieId/seasons/:seasonId/episodes/list',
                        name: 'EpisodesList',
                        component: () => import('@/views/episodes/EpisodesList'),
                        meta: { title: 'moviesEpisodes', keepAlive: true, permission: ['movie'] },
                      },
                      {
                        path: '/movie/:movieId/seasons/:seasonId/episodes/create',
                        name: 'EpisodesCreate',
                        component: () => import('@/views/episodes/EpisodesCreate'),
                        meta: { title: 'movieEpisodeCreate', keepAlive: true, permission: ['movie'] },
                      },
                      {
                        path: '/movie/:movieId/seasons/:seasonId/episodes/update/:id',
                        name: 'EpisodesUpdate',
                        component: () => import('@/views/episodes/EpisodesCreate'),
                        meta: { title: 'movieEpisodeUpdate', keepAlive: true, permission: ['movie'] },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // feateured-list

          {
            path: '/featured-movies',
            name: 'featured-movies',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/featured-movies/list',
            meta: { title: 'featured-movies', icon: 'heart', permission: ['featured-movie'] },
            children: [
              {
                path: '/featured-movies/list',
                name: 'FeaturedMoviesList',
                component: () => import('@/views/featured-movies/FeaturedMoviesList'),
                meta: { title: 'featured-movies', keepAlive: true, permission: ['featured-movie'] },
              },
              {
                path: '/featured-movies/create',
                name: 'FeaturedMoviesCreate',
                component: () => import('@/views/featured-movies/FeaturedMoviesCreate'),
                meta: { title: 'featured-movies', keepAlive: true, permission: ['featured-movie'] },
              },
              {
                path: '/featured-movies/update/:id',
                name: 'FeaturedMoviesUpdate',
                component: () => import('@/views/featured-movies/FeaturedMoviesCreate'),
                meta: { title: 'featured-movies', keepAlive: true, permission: ['featured-movie'] },
              },
            ],
          },
          // category
          {
            path: '/category',
            name: 'category',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/category/list',
            meta: { title: 'categories', icon: 'form', permission: ['category'] },
            children: [
              {
                path: '/category/list',
                name: 'CategoriesList',
                component: () => import('@/views/categories/CategoriesList'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
              {
                path: '/category/create',
                name: 'CategoriesCreate',
                component: () => import('@/views/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
              {
                path: '/category/update/:id',
                name: 'CategoriesUpdate',
                component: () => import('@/views/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
            ],
          },

          // genres

          {
            path: '/genre',
            name: 'genres',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/genre/list',
            meta: { title: 'genres', icon: 'shop', permission: ['genre'] },
            children: [
              {
                path: '/genre/list',
                name: 'GenresList',
                component: () => import('@/views/genres/GenresList'),
                meta: { title: 'genres', keepAlive: true, permission: ['genre'] },
              },
              {
                path: '/genre/create',
                name: 'GenresCreate',
                component: () => import('@/views/genres/GenresCreate'),
                meta: { title: 'genres', keepAlive: true, permission: ['genre'] },
              },
              {
                path: '/genre/update/:id',
                name: 'GenresUpdate',
                component: () => import('@/views/genres/GenresCreate'),
                meta: { title: 'genres', keepAlive: true, permission: ['genre'] },
              },
            ],
          },

          // tags

          {
            path: '/tag',
            name: 'tags',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/tag/list',
            meta: { title: 'tags', icon: 'tag', permission: ['genre'] },
            children: [
              {
                path: '/tag/list',
                name: 'TagsList',
                component: () => import('@/views/tags/TagsList'),
                meta: { title: 'tags', keepAlive: true, permission: ['genre'] },
              },
              {
                path: '/tag/create',
                name: 'TagsCreate',
                component: () => import('@/views/tags/TagsCreate'),
                meta: { title: 'tags', keepAlive: true, permission: ['genre'] },
              },
              {
                path: '/tag/update/:id',
                name: 'TagsUpdate',
                component: () => import('@/views/tags/TagsCreate'),
                meta: { title: 'tags', keepAlive: true, permission: ['genre'] },
              },
            ],
          },

          // comment list
          // {
          //   path: '/comments',
          //   name: 'Comments',
          //   hideChildrenInMenu: true,
          //   component: RouteView,
          //   redirect: '/comments/list',
          //   meta: { title: 'comment', icon: 'message', permission: ['category'] },
          //   children: [
          //     {
          //       path: '/comments/list',
          //       name: 'CommentsList',
          //       component: () => import('@/views/comments/CommentsList'),
          //       meta: { title: 'category', keepAlive: true, permission: ['category'] },
          //     },
          //     {
          //       path: '/like/create',
          //       name: 'CommentCreate',
          //       component: () => import('@/views/comments/CommentsCreate'),
          //       meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          //     },
          //     {
          //       path: '/dislike/create',
          //       name: 'CommentCreate',
          //       component: () => import('@/views/comments/CommentsCreate'),
          //       meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          //     },
          //     {
          //       path: '/comments/update/:id',
          //       name: 'CommentsUpdate',
          //       component: () => import('@/views/comments/CommentsCreate'),
          //       meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          //     },
          //   ],
          // },

          // actors
          {
            path: '/staff',
            name: 'staff',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/staff/list',
            meta: { title: 'staff', icon: 'video-camera', permission: ['staff'] },
            children: [
              {
                path: '/staff/list',
                name: 'StaffList',
                component: () => import('@/views/staff/StaffList'),
                meta: { title: 'staff', keepAlive: true, permission: ['staff'] },
              },
              {
                path: '/staff/create',
                name: 'StaffCreate',
                component: () => import('@/views/staff/StaffCreate'),
                meta: { title: 'staff', keepAlive: true, permission: ['staff'] },
              },
              {
                path: '/staff/update/:id',
                name: 'StaffUpdate',
                component: () => import('@/views/staff/StaffCreate'),
                meta: { title: 'staff', keepAlive: true, permission: ['staff'] },
              },
            ],
          },
        ],
      },

      // TV Shows
      {
        path: '/tvchannel',
        name: 'TvChannel',
        component: RouteView,
        meta: { title: 'tvChannel', icon: liveTv, permission: ['category', 'genre'] },
        children: [
          // TV Category
          {
            path: '/tvcategory',
            name: 'TvVategory',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/tvcategory/list',
            meta: { title: 'category', permission: ['category'] },
            children: [
              {
                path: '/tvcategory/list',
                name: 'TvCategoriesList',
                component: () => import('@/views/tvchannels/categories/CategoriesList'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
              {
                path: '/tvcategory/create',
                name: 'TvCategoriesCreate',
                component: () => import('@/views/tvchannels/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
              {
                path: '/tvcategory/update/:id',
                name: 'TvCategoriesUpdate',
                component: () => import('@/views/tvchannels/categories/CategoriesCreate'),
                meta: { title: 'categories', keepAlive: true, permission: ['category'] },
              },
            ],
          },
          // TV Channel
          {
            path: '/channel',
            name: 'Channel',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/channel/list',
            meta: { title: 'channel', permission: ['genre'] },
            children: [
              {
                path: '/channel/list',
                name: 'ChannelList',
                component: () => import('@/views/tvchannels/channel/ChannelList'),
                meta: { title: 'channel', keepAlive: true, permission: ['genre'] },
              },
              {
                path: '/channel/create',
                name: 'ChannelCreate',
                component: () => import('@/views/tvchannels/channel/ChannelCreate'),
                meta: { title: 'channel', keepAlive: true, permission: ['genre'] },
              },
              {
                path: '/channel/update/:id',
                name: 'ChannelUpdate',
                component: () => import('@/views/tvchannels/channel/ChannelCreate'),
                meta: { title: 'channel', keepAlive: true, permission: ['genre'] },
              },
            ],
          },
        ],
      },

      // Subscriptions
      {
        path: '/subscriptionSettings',
        name: 'subscriptionSettings',
        hideChildrenInMenu: true,
        component: RouteView,
        redirect: '/subscription/category/list',
        meta: { title: 'subscriptions', icon: 'calendar', permission: ['category', 'genre'] },
        children: [
          {
            path: '/subscription/category/list',
            name: 'SubscriptionCategoryList',
            component: () => import('@/views/subscriptions/category/CategoriesList'),
            meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          },
          {
            path: '/subscription/category/create',
            name: 'SubscriptionCategoriesCreate',
            component: () => import('@/views/subscriptions/category/CategoriesCreate'),
            meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          },
          {
            path: '/subscription/category/update/:id',
            name: 'SubscriptionCategoriesUpdate',
            component: () => import('@/views/subscriptions/category/CategoriesCreate'),
            meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          },
          {
            path: '/subscription/list2',
            name: 'SubscriptionsList2',
            component: () => import('@/views/subscriptions/SubscriptionsList'),
            meta: { title: 'subscriptions', keepAlive: true, permission: ['genre'] }, // permossion should be subscription
          },
          {
            path: '/subscription/create',
            name: 'SubscriptionCreate',
            component: () => import('@/views/subscriptions/SubscriptionsCreate'),
            meta: { title: 'subscriptions', keepAlive: true, permission: ['genre'] }, // permossion should be subscription
          },
          {
            path: '/subscription/premier/list',
            name: 'PremiersList',
            component: () => import('@/views/subscriptions/premier/PremiersList'),
            meta: { title: 'premierslist', keepAlive: true, permission: ['genre'] }, // permossion should be subscription
          },
          {
            path: '/subscription/update/:id',
            name: 'SubscriptionsUpdate',
            component: () => import('@/views/subscriptions/SubscriptionsCreate'),
            meta: { title: 'subscriptions', keepAlive: true, permission: ['genre'] }, // permossion should be subscription
          },
        ],
      },
      // Order Table
      {
        path: '/order-table',
        name: 'orderTable',
        hideChildrenInMenu: true,
        component: RouteView,
        redirect: '/orderTable/category/list',
        meta: { title: 'orderTable', icon: 'weibo-square', permission: ['test'] },
        children: [
          {
            path: '/orderTable/category/list',
            name: 'OrderTableList',
            component: () => import('@/views/orderTable/category/CategoriesList'),
            meta: { title: 'categories', keepAlive: true, permission: ['test'] },
          },
          {
            path: '/orderTable/category/create',
            name: 'OrderTableCreate',
            component: () => import('@/views/orderTable/category/CategoriesCreate'),
            meta: { title: 'categories', keepAlive: true, permission: ['test'] },
          },
          {
            path: '/orderTable/category/update/:id',
            name: 'OrderTableUpdate',
            component: () => import('@/views/orderTable/category/CategoriesCreate'),
            meta: { title: 'categories', keepAlive: true, permission: ['test'] },
          },
        ],
      },
      // Promocode
      {
        path: '/promocode',
        name: 'promocode',
        hideChildrenInMenu: true,
        component: RouteView,
        redirect: '/promocode/list',
        meta: { title: 'promocodes', icon: 'aliwangwang', permission: ['category'] },
        children: [
          {
            path: '/promocode/list',
            name: 'PromocodeList',
            component: () => import('@/views/promocode/List'),
            meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          },
          {
            path: '/promocode/create',
            name: 'PromocodeCreate',
            component: () => import('@/views/promocode/Create'),
            meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          },
          {
            path: '/promocode/update/:id',
            name: 'PromocodeUpdate',
            component: () => import('@/views/promocode/Create'),
            meta: { title: 'categories', keepAlive: true, permission: ['category'] },
          },
        ],
      },

      // Tariffs
      // {
      //   path: '/tariffs',
      //   name: 'tariffs',
      //   hideChildrenInMenu: true,
      //   component: RouteView,
      //   redirect: '/tariffs/list',
      //   meta: { title: 'tariffs', icon: 'tags', permission: [ 'tariff' ] },
      //   children: [
      //     {
      //       path: '/tariffs/list',
      //       name: 'TarifsList',
      //       component: () => import('@/views/tariffs/TarifsList'),
      //       meta: { title: 'tariffs', keepAlive: true, permission: [ 'tariff' ] }
      //     },
      //     {
      //       path: '/tariffs/create',
      //       name: 'TarifsCreate',
      //       component: () => import('@/views/tariffs/TarifsCreate'),
      //       meta: { title: 'tariffs', keepAlive: true, permission: [ 'tariff' ] }
      //     },
      //     {
      //       path: '/tariffs/update/:id',
      //       name: 'TarifsUpdate',
      //       component: () => import('@/views/tariffs/TarifsCreate'),
      //       meta: { title: 'tariffs', keepAlive: true, permission: [ 'tariff' ] }
      //     }
      //   ]
      // },

      // Notifications
      {
        path: '/notifi',
        name: 'notifications',
        component: RouteView,
        redirect: '/notifications',
        meta: { title: 'notifications', icon: 'bell', permission: ['notification'] },
        children: [
          {
            path: '/notifications',
            name: 'notifications',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/notifications/list',
            meta: { title: 'notifications', permission: ['notification'] },
            children: [
              {
                path: '/notifications/list',
                name: 'TarifsList',
                component: () => import('@/views/notifications'),
                meta: { title: 'notifications', keepAlive: true, permission: ['notification'] },
              },
              {
                path: '/notifications/create',
                name: 'TarifsCreate',
                component: () => import('@/views/notifications/detail'),
                meta: { title: 'notifications', keepAlive: true, permission: ['notification'] },
              },
              {
                path: '/notifications/update/:id',
                name: 'TarifsUpdate',
                component: () => import('@/views/notifications/detail'),
                meta: { title: 'notifications', keepAlive: true, permission: ['notification'] },
              },
            ],
          },
          {
            path: '/custom-notifications',
            name: 'CustomNotification',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/custom-notifications/list',
            meta: { title: 'customNotifications', permission: ['notification'] },
            children: [
              {
                path: '/custom-notifications/list',
                name: 'CustomNotificationList',
                component: () => import('@/views/notifications/custom/table'),
                meta: { title: 'customNotifications', keepAlive: true, permission: ['notification'] },
              },
              {
                path: '/custom-notifications/create',
                name: 'CustomNotificationListCreate',
                component: () => import('@/views/notifications/custom/index'),
                meta: { title: 'customNotifications', keepAlive: true, permission: ['notification'] },
              },
              {
                path: '/custom-notifications/update/:id',
                name: 'CustomNotificationListUpdate',
                component: () => import('@/views/notifications/custom/index'),
                meta: { title: 'customNotifications', keepAlive: true, permission: ['notification'] },
              },
            ],
          },
        ],
      },
      {
        path: '/reports',
        name: 'reports',
        component: RouteView,
        redirect: '/reports/transactions',
        meta: { title: 'reports', icon: 'profile', permission: ['report'] },
        children: [
          {
            path: '/reports/transactions',
            name: 'transactions',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/transactions/list',
            meta: { title: 'transactions', icon: 'dollar', permission: ['report'] },
            children: [
              {
                path: '/transactions/list',
                name: 'TransactionsList',
                component: () => import('@/views/transactions/List'),
                meta: { title: 'transactions', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/payment',
            name: 'payment',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/payment/list',
            meta: { title: 'consolidated_payment_raiser', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/payment/list',
                name: 'OperatorsList',
                component: () => import('@/views/reports/payment/List'),
                meta: { title: 'operators', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          // {
          //   path: '/reports/movies',
          //   name: 'ReportMovies',
          //   hideChildrenInMenu: true,
          //   component: RouteView,
          //   redirect: '/reports/movies/list',
          //   meta: { title: 'reports.movie', icon: 'play-square', permission: ['tariff'] },
          //   children: [
          //     {
          //       path: '/reports/movies/list',
          //       name: 'ReportMoviesList',
          //       component: () => import('@/views/reports/List'),
          //       meta: { title: 'reports.movie', keepAlive: true, permission: ['tariff'] }
          //     }
          //   ]
          // },
          {
            path: '/reports/count-subscriptions',
            name: 'count-subscriptions',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/count-subscriptions/list',
            meta: { title: 'count-subscription', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/count-subscriptions/list',
                name: 'count-subscriptions-list',
                component: () => import('@/views/reports/countSubscriptions/index.vue'),
                meta: { title: 'count-subscriptions', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/recently-subcriptions',
            name: 'recently-subcriptions',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/recently-subcriptions/list',
            meta: { title: 'recently-subcriptions', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/recently-subcriptions/list',
                name: 'recently-subcriptions-list',
                component: () => import('@/views/reports/recentlySubcriptions/index.vue'),
                meta: { title: 'recently-subcriptions', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/tvod',
            name: 'tvod',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/tvod/list',
            meta: { title: 'Последние купленные фильмы', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/tvod/list',
                name: 'tvod-list',
                component: () => import('@/views/reports/tvod/index.vue'),
                meta: { title: 'Последние купленные фильмы', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/most-viewed-tv-channels',
            name: 'most-viewed-tv-channels',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/most-viewed-tv-channels/list',
            meta: { title: 'most-viewed-tv-channels', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/most-viewed-tv-channels/list',
                name: 'most-viewed-tv-channels-list',
                component: () => import('@/views/reports/mostViewedTvChannels/index.vue'),
                meta: { title: 'most-viewed-tv-channels', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/most-viewed-movies',
            name: 'most-viewed-movies',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/most-viewed-movies/list',
            meta: { title: 'Самые просматриваемые фильмы', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/most-viewed-movies/list',
                name: 'most-viewed-movies-list',
                component: () => import('@/views/reports/mostViewedMovies/index.vue'),
                meta: { title: 'most-viewed-movies', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/most-viewed-serials',
            name: 'most-viewed-serials',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/most-viewed-serials/list',
            meta: { title: 'Самые просматриваемые сериалы', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/most-viewed-serials/list',
                name: 'most-viewed-serials-list',
                component: () => import('@/views/reports/mostViewedSerials/index.vue'),
                meta: { title: 'most-viewed-serials', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/most-active-users',
            name: 'most-active-users',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/most-active-users/list',
            meta: { title: 'most-active-users', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/most-active-users/list',
                name: 'most-active-users-list',
                component: () => import('@/views/reports/mostActiveUsers'),
                meta: { title: 'most-active-users', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/most-famed-platforms',
            name: 'most-famed-platforms',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/most-famed-platforms/list',
            meta: { title: 'Самые популярные платформы', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/most-famed-platforms/list',
                name: 'most-famed-platforms-list',
                component: () => import('@/views/reports/mostFamedtPlatforms'),
                meta: { title: 'most-famed-platforms', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/most-viewed-ages',
            name: 'most-viewed-ages',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/most-viewed-ages/list',
            meta: { title: 'Самые популярные возрастные группы ', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/most-viewed-ages/list',
                name: 'most-viewed-ages-list',
                component: () => import('@/views/reports/mostViewedAges/index.vue'),
                meta: { title: 'most-viewed-ages', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/hourly-visitors',
            name: 'hourly-visitors',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/hourly-visitors/list',
            meta: { title: 'Статистика просмотров по времени суток', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/hourly-visitors/list',
                name: 'hourly-visitors-list',
                component: () => import('@/views/reports/statisticsHourlyVisitors/index.vue'),
                meta: { title: 'hourly-visitors', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/more-paid-user',
            name: 'more-paid-user',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/more-paid-user/list',
            meta: { title: 'more-paid-user', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/more-paid-user/list',
                name: 'more-paid-user-list',
                component: () => import('@/views/reports/morePaidUser'),
                meta: { title: 'more-paid-user', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/user-information',
            name: 'user-information',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/user-information/list',
            meta: { title: 'Подключённые абоненты', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/user-information/list',
                name: 'user-information-list',
                component: () => import('@/views/reports/userInformation'),
                meta: { title: 'user-information', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/connected-subscription',
            name: 'connected-subscription',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/connected-subscription/list',
            meta: { title: 'connected-unconnected-subscription', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/connected-subscription/list',
                name: 'connected-subscription-list',
                component: () => import('@/views/reports/connectedSubscription'),
                meta: { title: 'connected-subscription', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/user-activity-period',
            name: 'UserProfile',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/user-activity-period/list',
            meta: { title: 'Ежедневная динамика абонентов', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/user-activity-period/list',
                name: 'user-activity-period',
                component: () => import('@/views/reports/userActivityPeriod/index.vue'),
                meta: { title: 'UserProfile', keepAlive: true, permission: ['report'] },
              },
            ],
          },
          {
            path: '/reports/profit',
            name: 'profit',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/reports/profit/list',
            meta: { title: 'Динамика роста продаж', icon: 'play-square', permission: ['report'] },
            children: [
              {
                path: '/reports/profit/list',
                name: 'profit-list',
                component: () => import('@/views/reports/profitReport/index.vue'),
                meta: { title: 'profit', keepAlive: true, permission: ['report'] },
              },
            ],
          },
        ],
      },
      // {
      //   path: '/instruction',
      //   name: 'instruction',
      //   hideChildrenInMenu: true,
      //   component: RouteView,
      //   redirect: '/instruction/guide/list',
      //   meta: { title: 'guideList', icon: 'audit', permission: [ 'tariff' ] },
      //   children: [
      //     {
      //       path: '/instruction/preview/:guid',
      //       name: 'GuidePreview',
      //       component: () => import('@/views/instruction/PreviewGuide'),
      //       meta: { title: 'GuidePreview', keepAlive: true, permission: ['tariff'] }
      //     },
      //     {
      //       path: '/instruction/guide/list',
      //       name: 'GuideList',
      //       component: () => import('@/views/instruction/GuideList'),
      //       meta: { title: 'guideList', keepAlive: true, permission: [ 'tariff' ] }
      //     },
      //     {
      //       path: '/instruction/guide/create',
      //       name: 'GuideCreate',
      //       component: () => import('@/views/instruction/GuideList'),
      //       meta: { title: 'guideCreate', keepAlive: true, permission: [ 'tariff' ] }
      //     },
      //     {
      //       path: '/instruction/:guid/:name/list',
      //       name: 'InstructionList',
      //       component: () => import('@/views/instruction/ins/InstructionList'),
      //       meta: { title: 'instructionList', keepAlive: true, permission: [ 'tariff' ] }
      //     },
      //     {
      //       path: '/instruction/:guid/:name/create',
      //       name: 'InstructionCreate',
      //       component: () => import('@/views/instruction/ins/InstructionCreate'),
      //       meta: { title: 'instructionCreate', keepAlive: true, permission: [ 'tariff' ] }
      //     },
      //     {
      //       path: '/instruction/:guid/:name/edit/:insid',
      //       name: 'InstructionEdit',
      //       component: () => import('@/views/instruction/ins/InstructionCreate'),
      //       meta: { title: 'instructionUpdate', keepAlive: true, permission: [ 'tariff' ] }
      //     }
      //   ]
      // },

      {
        path: '/settings',
        name: 'settings',
        component: RouteView,
        redirect: '/settings/list',
        meta: { title: 'settings', icon: 'setting', permission: ['settings'] },
        children: [
          {
            path: '/settings',
            name: 'sessions',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/settings/list',
            meta: { title: 'sessions', icon: 'control', permission: ['settings', 'permission', 'admin'] },
            children: [
              {
                path: '/settings/list',
                name: 'SettingsList',
                component: () => import('@/views/settings/SettingsList'),
                meta: { title: 'settings', keepAlive: true, permission: ['settings'] },
              },
              {
                path: '/settings/create',
                name: 'SettingsCreate',
                component: () => import('@/views/settings/SettingsCreate'),
                meta: { title: 'settings', keepAlive: true, permission: ['settings'] },
              },
              {
                path: '/settings/update/:id',
                name: 'SettingsUpdate',
                component: () => import('@/views/settings/SettingsCreate'),
                meta: { title: 'settings', keepAlive: true, permission: ['settings'] },
              },
            ],
          },
          {
            path: '/permissions',
            name: 'permissions',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/permissions/list',
            meta: { title: 'permissions', icon: 'lock', permission: ['permission'] },
            children: [
              {
                path: '/permissions/list',
                name: 'PermissionsList',
                component: () => import('@/views/permissions/PermissionsList'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permission'] },
              },
              {
                path: '/permissions/create',
                name: 'PermissionsCreate',
                component: () => import('@/views/permissions/PermissionsCreate'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permission'] },
              },
              {
                path: '/permissions/update/:id',
                name: 'PermissionsUpdate',
                component: () => import('@/views/permissions/PermissionsCreate'),
                meta: { title: 'permissions', keepAlive: true, permission: ['permission'] },
              },
            ],
          },
          {
            path: '/admins',
            name: 'admins',
            hideChildrenInMenu: true,
            component: RouteView,
            redirect: '/admins/list',
            meta: { title: 'admins', icon: 'team', permission: ['admin'] },
            children: [
              {
                path: '/admins/list',
                name: 'AdminsList',
                component: () => import('@/views/admins/AdminsList'),
                meta: { title: 'admins', keepAlive: true, permission: ['admin'] },
              },
              {
                path: '/admins/create',
                name: 'AdminsCreate',
                component: () => import('@/views/admins/AdminsCreate'),
                meta: { title: 'admins', keepAlive: true, permission: ['admin'] },
              },
              {
                path: '/admins/update/:id',
                name: 'AdminsUpdate',
                component: () => import('@/views/admins/AdminsCreate'),
                meta: { title: 'admins', keepAlive: true, permission: ['admin'] },
              },
            ],
          },
          {
            path: '/gpu',
            name: 'gpu',
            hideChildrenInMenu: true,
            component: () => import('@/views/gpu/GPU'),
            meta: { title: 'GPU', icon: 'tool', permission: ['tariff'] },
            children: [],
          },
        ],
      },
      {
        path: '/cabinet',
        name: 'cabinet',
        hidden: true,
        component: () => import('@/views/cabinet/Cabinet'),
        meta: { title: 'personal_settings', icon: 'team', permission: ['permission'] },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult'),
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined,
      },
    ],
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
]
