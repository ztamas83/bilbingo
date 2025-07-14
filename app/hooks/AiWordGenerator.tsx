import { useState, useCallback, useEffect, useMemo } from 'react';
import { gemini } from '../../firebase.config'; // Adjust the import path as necessary
import { configureModel } from './gemini_config';

type AiWordGeneratorResult = {
    words: object[] | null;
    loading: boolean;
    error: string | null;
};

export function useAiWordGenerator(numWords: number): AiWordGeneratorResult {
    const [words, setWords] = useState<object[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const agent = useMemo(() => configureModel(gemini), [gemini]);

    const generateWord = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Replace this with your actual AI word generation logic or API call
            const result = await agent.generateContent(`generate ${numWords} words that kids of 7 and 9 year olds can understand. The words should be related to a road trip, animals, cities or just general every-day words. return them as an array in the following example format: {type: 'emoji', content: '🚛', text: 'Lastbil'}`);
            console.log(result.response.text());
            setWords(result.response.text()!);

        } catch (err: any) {
            setError(err.message || 'Unknown error');
            setWords(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (numWords > 0) {
            generateWord();
        }
    }, [numWords, generateWord]);

    return { words, loading, error };
}