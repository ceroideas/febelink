export interface Pricing {
    title: string;
    price: number;
    bandwidth: string;
    onlinespace: string;
    support: string;
}

export interface TeamMember {
    pic: string,
    name: string,
    tag: string,
    linkedin: string,
    liTag?: string // Algunos links eran con www. y otros con es.
}