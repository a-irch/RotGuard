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

import { useRestrictList } from '~/hooks/useRestrictList';

import WebsiteFavicon from './WebsiteFavIcon';

const RestrictList = () => {
  const { restrictList, addPage, removePage, editPage } = useRestrictList();

  return (
    <div className="mt-4">
      <h2 className="border-t pb-4 pt-2 text-xl font-semibold">
        Restricted Websites
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Daily limit</TableHead>
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
              <TableCell>Default</TableCell>
              <TableCell className="text-right">
                <RestrictedDropdown
                  page={page}
                  onDelete={removePage}
                  onEdit={editPage}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-3 flex justify-end">
        <AddRestrict addRestricted={addPage} />
      </div>
    </div>
  );
};

export default RestrictList;
