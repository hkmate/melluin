import evn from './assets/app-config.json';

export interface Environment {
    baseURL: string;
    reportMailAddress: string;
    questionnaireForChild?: string;
    questionnaireForParent?: string;
}

export const environment: Environment = evn;
