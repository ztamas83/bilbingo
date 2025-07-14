import { Schema, SchemaType, type GenerativeModel } from "firebase/ai";

export function configureModel(instance: GenerativeModel): GenerativeModel {
    // This function can be used to configure the Gemini AI settings if needed
    // For now, it just returns the gemini instance

    const responseSchema = {
        type: SchemaType.ARRAY,
        items: {
        type: SchemaType.OBJECT,
        properties: {
            type: { type: SchemaType.STRING, enum: ["emoji", "text"] },
            content: { type: SchemaType.STRING },
            text: { type: SchemaType.STRING }
        },
        required: ["type", "text"],
    }};

    instance.generationConfig = {
         responseSchema,
             responseMimeType: "application/json",

    }
    
    return instance;
}