export const PracticeSession = () => <div>Practice Placeholder</div>;

import { useEffect } from "react";

export default function PracticePage() {

    useEffect(() => {
        console.log("Groq Key:", import.meta.env.VITE_GROQ_API_KEY);
    }, []);

    return (
        <div>
            {/* Your existing UI */}
        </div>
    );
}