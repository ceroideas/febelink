import slugify from "slugify";

// TODO: Add all desired languages to the array.
// https://www.loc.gov/standards/iso639-2/php/code_list.php
export const supportedLanguages = (): string[] => {
    return ['es', 'en'];
}

export const answerOptions = (): {text: string, value: string}[] => {
    return [
        {text: "1", value: "1"},
        {text: "3", value: "3"},
        {text: "5", value: "5"},
        {text: "∞", value: "99"},
    ];
}

export const toSlug = (text: string): string => {
    return !!text ? slugify(text) : '';
}