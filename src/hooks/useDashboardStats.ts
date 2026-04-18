/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { Request, User } from '../types';

export const useDashboardStats = (requests: Request[], user: User | null) => {
  return useMemo(() => {
    if (!user) return { totalRequests: 0, totalHelped: 0, recentActivity: [] };

    const myRequests = requests.filter(r => r.authorId === user.id);
    const requestsIHelped = requests.filter(r => r.helperIds?.includes(user.id));
    
    // Sort recent activity by date
    const allActivity = [...myRequests, ...requestsIHelped].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
    });

    return {
      totalRequests: myRequests.length,
      totalHelped: requestsIHelped.length,
      myRequests,
      requestsIHelped,
      recentActivity: allActivity.slice(0, 5)
    };
  }, [requests, user]);
};
