interface IData {
    label: string;
    value: string;
    children?: IData[];
}

export interface AreaData {
    label: string;
    children?: AreaData[];
}

export interface ExtendedHTMLElement extends HTMLElement {
    datas?: AreaData[];
}
