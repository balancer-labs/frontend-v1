import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Private from '@/views/Private.vue';
import MyPools from '@/views/MyPools.vue';
import Create from '@/views/Create.vue';
import Setup from '@/views/Setup.vue';
import Wallet from '@/views/Wallet.vue';
import Token from '@/views/Token.vue';
import NewPool from '@/views/NewPool.vue';
import Pool from '@/views/Pool.vue';
import PoolTokens from '@/views/Pool/Tokens.vue';
import PoolSwaps from '@/views/Pool/Swaps.vue';
import PoolShares from '@/views/Pool/Shares.vue';
import PoolSettings from '@/views/Pool/Settings.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: Home },
  { path: '/private', name: 'private', component: Private },
  { path: '/my-pools', name: 'my-pools', component: MyPools },
  { path: '/create', name: 'create', component: Create },
  { path: '/setup', name: 'setup', component: Setup },
  { path: '/wallet', name: 'wallet', component: Wallet },
  { path: '/token/:id', name: 'token', component: Token },
  {
    path: '/pool/new',
    name: 'new-pool',
    component: NewPool
  },
  {
    path: '/pool/:id',
    component: Pool,
    children: [
      { path: '', name: 'pool', component: PoolTokens },
      { path: 'swaps', name: 'pool-swaps', component: PoolSwaps },
      { path: 'shares', name: 'pool-shares', component: PoolShares },
      { path: 'settings', name: 'pool-settings', component: PoolSettings }
    ]
  },
  { path: '/*', name: 'error-404', beforeEnter: (to, from, next) => next('/') }
];

const router = new VueRouter({
  routes
});

export default router;
