import { toast } from 'sonner';

import { useStorage } from '@plasmohq/storage/hook';

import type { Page } from '~/types/Page';

export const useRestrictList = () => {
  const [restrictList, setRestrictList] = useStorage<Page[]>(
    'restrict-list',
    [],
  );

  const addPage = (newPage: Page) => {
    const isDuplicate = restrictList?.some(
      (page) => page.domain === newPage.domain,
    );

    if (isDuplicate) {
      toast.error('Site already restricted', {
        description: `${newPage.domain} is already in your list.`,
        position: 'bottom-right',
      });
      return false;
    }

    setRestrictList((prev) => [...(prev || []), newPage]);
    toast.success('Website restricted', {
      description: `${newPage.name} has been added to your list.`,
      position: 'bottom-right',
    });
    return true;
  };

  const removePage = (pageToRemove: Page) => {
    setRestrictList(
      (prev) => prev?.filter((p) => p.domain !== pageToRemove.domain) || [],
    );

    toast.success('Website removed from restrict list !', {
      position: 'bottom-right',
      action: {
        label: 'Undo',
        onClick: () => {
          setRestrictList((prev) => [...(prev || []), pageToRemove]);
        },
      },
    });
  };

  const editPage = (oldPage: Page, newPage: Page) => {
    setRestrictList((prev) => {
      const list = prev?.filter((p) => p.domain !== oldPage.domain) || [];
      return [...list, newPage];
    });
    toast.success('Website updated !', { position: 'bottom-right' });
  };

  const incrementDailySession = (today: string, domain: string) => {
    setRestrictList((prev) =>
      (prev || []).map((page) => {
        if (page.domain === domain || domain.endsWith('.' + page.domain)) {
          const currentStats = page.stats || {};
          return {
            ...page,
            stats: {
              ...currentStats,
              [today]: (currentStats[today] || 0) + 1,
            },
          };
        }
        return page;
      }),
    );
  };

  return {
    restrictList,
    addPage,
    removePage,
    editPage,
    incrementDailySession,
  };
};
