import AddRestrict from '@/components/AddRestrict';
import RestrictedDropdown from '@/components/RestrictedDropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Page } from '@/types/Page';
import { toast } from 'sonner';

import { useStorage } from '@plasmohq/storage/hook';

import WebsiteFavicon from './WebsiteFavIcon';

const RestrictList = () => {
  const [restrictList, setRestrictList] = useStorage<Page[]>(
    'restrict-list',
    [],
  );

  const editRestrict = (page: Page, editedPage: Page) => {
    const list = restrictList.filter((p) => p !== page);
    list.push(editedPage);
    setRestrictList(list);
    toast.success('Website updated !');
  };

  const addRestricted = (newPage: Page) => {
    setRestrictList([...restrictList, newPage]);
    toast.success('Website added to restrict list !');
  };
  const removeRestricted = (page: Page) => {
    const list = restrictList.filter((p) => p !== page);
    setRestrictList(list);
    toast.success('Website removed from restrict list !', {
      action: {
        label: 'Undo',
        onClick: () => {
          setRestrictList([...list, page]);
        },
      },
    });
  };

  return (
    <div className="mt-4">
      <h2 className="border-t pb-4 pt-2 text-xl font-semibold">
        Session Configuration
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Session</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restrictList.map((page) => (
            <TableRow key={page.name}>
              <TableCell>
                <WebsiteFavicon domain={page.domain} name={page.name} />
              </TableCell>
              <TableCell>{page.name}</TableCell>
              <TableCell>{page.domain}</TableCell>
              <TableCell>Default</TableCell>
              <TableCell className="text-right">
                <RestrictedDropdown
                  page={page}
                  onDelete={removeRestricted}
                  onEdit={editRestrict}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-3 flex justify-end">
        <AddRestrict addRestricted={addRestricted} />
      </div>
    </div>
  );
};

export default RestrictList;
