
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import( /* webpackChunkName: "dashboard-page" */'./features/dashboard/pages/dashboard/dashboard').then(d => d.Dashboard) },
    { path: 'member', loadComponent: () => import(/* webpackChunkName: "member-page" */ './features/member/pages/member/member').then(m => m.Member) },
    {
        path: 'finance',
        loadChildren: () => import( /* webpackChunkName: "finance-route" */ './features/finance/finance.routes').then(m => m.financeRoutes)
    },
    { path: '**', loadComponent: () => import( /* webpackChunkName: "not-found-page" */'./features/not-found/pages/not-found/not-found').then(nt => nt.NotFound) },
];

