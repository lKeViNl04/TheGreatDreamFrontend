import { Routes } from '@angular/router';

export const financeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import(/* webpackChunkName: "finance-main-page" */'../finance/finance').then(f => f.Finance),
    children: [
      { path: '', redirectTo: 'cashbox', pathMatch: 'full' },
      { path: 'cashbox', loadComponent: () => import(/* webpackChunkName: "finance-cashbox-page" */'./features/cashbox/pages/cashbox/cashbox').then(c => c.Cashbox) },
      { path: 'monthly-expense', loadComponent: () => import(/* webpackChunkName: "finance-monthly-expense-page" */'./features/monthly-expense/pages/monthly-expense/monthly-expense').then(me => me.MonthlyExpense) },
      { path: 'monthly-fee', loadComponent: () => import(/* webpackChunkName: "finance-monthly-fee-page" */'./features/monthly-fee/pages/monthly-fee/monthly-fee').then(mf => mf.MonthlyFee) },
    ]
  }
];

