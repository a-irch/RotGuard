import type { Page } from '@/types/Page';
import { MoreHorizontalIcon } from 'lucide-react';

import EditRestrict from './EditRestrict';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface RestrictedDropdownProps {
  page: Page;
  onDelete: (page: Page) => void;
  onEdit: (page: Page, editedPage: Page) => void;
}

const RestrictedDropdown = ({
  page,
  onDelete,
  onEdit,
}: RestrictedDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="justify-end"
          onSelect={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
          <EditRestrict page={page} onEdit={onEdit} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(page)}
          className="justify-end text-red-600 focus:bg-red-50 focus:text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RestrictedDropdown;
