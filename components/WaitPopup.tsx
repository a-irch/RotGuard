import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

const WAITING_TIME_SEC = 10;

const WaitPopup = () => {
    const [isAccepted, setIsAccepted] = useState<Boolean>(false);
    const [progress,setProgress] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(WAITING_TIME_SEC);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const cancel = () => {
        window.open("https://google.com", "_self");
    };

    useEffect(() => {
        if (!isAccepted) return;

        const startTime = Date.now();
        const duration = WAITING_TIME_SEC * 1000;

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;

            const newProgress = Math.min((elapsed / duration) * 100, 100);
            const remainingSeconds = Math.ceil((duration - elapsed) / 1000);

            setProgress(newProgress);
            setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);

            if (elapsed >= duration) {
                clearInterval(interval);
                setIsVisible(false);
            }
        }, 20);

        return () => clearInterval(interval);
    }, [isAccepted]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-xl">
            <Card className="w-[33rem] text-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">This page is restricted</CardTitle>
                    <CardDescription className="text-xl">You need to wait before accessing to this page...</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">

                    {
                        !isAccepted ? 
                            <>
                                <p>Do you really need to access this page ?</p>
                                <div className="flex gap-2 justify-end">
                                    <Button 
                                        variant="destructive"
                                        onClick={() => cancel()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="secondary"
                                        onClick={() => setIsAccepted(!isAccepted)}
                                    >
                                        Access
                                    </Button>
                                </div>
                            </>
                        :
                            <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
                                <p className="text-center font-medium">
                                    Accessing page in <span className="font-bold text-primary">{timeLeft}</span> seconds
                                </p>
                                <Progress value={progress}/>
                            </div>
                    }
                    
                </CardContent>
            </Card>
        </div>
    )
}

export default WaitPopup;