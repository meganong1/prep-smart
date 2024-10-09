import styles from "../../app/page.module.css";
import { useCompletion } from "ai/react";

export default function Response() {
    const { complete, completion, setInput, input, stop, isLoading } = useCompletion({ api: "/api/completion" });
    return (
        <>
            <output className={styles.output}>
                <span>{completion}</span>
            </output>
        </>
    );
};