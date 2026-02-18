import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import "~/globals.css"
import SessionTime from './SessionTime';
import { Toaster } from '@/components/ui/sonner';
import RestrictList from './RestrictList';

const Options = () => {

    return (
        <>
            <div className='mx-auto flex flex-col gap-4 py-6 w-[52rem]'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-3xl'>Options</CardTitle>
                        <CardDescription>Modify RotGuard parameters to match your needs.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <SessionTime />
                        <RestrictList />
                    </CardContent>
                </Card>
            </div>
            <Toaster/>
        </>
        
    );
}

export default Options;