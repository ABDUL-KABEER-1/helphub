/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Request } from '../types';

export interface FilterState {
  category: string;
  urgency: string;
  search: string;
  location: string;
}

export const useFilteredRequests = (requests: Request[]) => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    urgency: 'All',
    search: '',
    location: ''
  });

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesCategory = filters.category === 'All' || req.category === filters.category;
      const matchesUrgency = filters.urgency === 'All' || req.urgency === filters.urgency;
      const matchesSearch = !filters.search || 
                             req.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                             req.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                             req.aiTags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase())) ||
                             req.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesLocation = !filters.location || req.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesCategory && matchesUrgency && matchesSearch && matchesLocation;
    });
  }, [requests, filters]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      urgency: 'All',
      search: '',
      location: ''
    });
  };

  return {
    filters,
    filteredRequests,
    updateFilter,
    resetFilters
  };
};
