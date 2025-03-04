interface IData {
    label: string;
    value: string;
    children?: IData[];
}

export interface ExtendedHTMLElement extends HTMLElement {
    datas?: IData[];
}
