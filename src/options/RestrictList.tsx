import AddRestrict from "@/components/AddRestrict";
import RestrictedDropdown from "@/components/RestrictedDropdown";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Page } from "@/types/Page";
import { useStorage } from "@plasmohq/storage/hook";
import { toast } from "sonner";

const RestrictList = () => {
    const [restrictList, setRestrictList] = useStorage<Page[]>('restrict-list', []);

    const editRestrict = (page: Page, editedPage: Page) => {
        let list = restrictList.filter(p => p !== page);
        list.push(editedPage);
        setRestrictList(list);
        toast.success('Website updated !');
    }

    const addRestricted = (newPage: Page) => {
        let list = Object.assign([], restrictList); // make a copy of the current list
        list.push(newPage);
        setRestrictList(list);
        toast.success('Website added to restrict list !');
    }
    const removeRestricted = (page: Page) => {
        let list = restrictList.filter(p => p !== page);
        setRestrictList(list);
        toast.success('Website removed from restrict list !');
    }
    
    return(
        <div className="mt-4">
            <h2 className="border-t pb-4 pt-2 text-xl font-semibold">
                Session Configuration
            </h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {restrictList.map((page) => (
                        <TableRow key={page.name}>
                            <TableCell>{page.name}</TableCell>
                            <TableCell>{page.url}</TableCell>
                            <TableCell>Default</TableCell>
                            <TableCell className="text-right">
                                <RestrictedDropdown page={page} onDelete={removeRestricted} onEdit={editRestrict}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-3 flex justify-end">
                <AddRestrict addRestricted={addRestricted}/>
            </div>
        </div>
    )
}

export default RestrictList;