import { ILang } from "@/types/Languages";

const languages:Array<ILang> = [
    {code: 'en', name: 'English', required: true},
    { code: 'de', name: 'German', required: true },
    { code: 'fr', name: 'French', required: true },
    { code: 'it', name: 'Italian', required: false },
]

export {languages};