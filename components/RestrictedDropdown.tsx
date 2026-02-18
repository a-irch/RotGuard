import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import type { Page } from "@/types/Page";
import EditRestrict from "./EditRestrict";

interface RestrictedDropdownProps {
  page: Page
  onDelete: (page: Page) => void
  onEdit: (page : Page, editedPage : Page) => void;
}

const RestrictedDropdown = ({ page, onDelete, onEdit }: RestrictedDropdownProps) => {
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
                    onSelect={(e) => {e.preventDefault(); e.stopPropagation();}}
                >
                    <EditRestrict 
                        page={page}
                        onEdit={onEdit}
                    />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => onDelete(page)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 justify-end"
                >
                    Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
    );
}

export default RestrictedDropdown;