export interface Template {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    features: string[] | null;
    category: string;
    is_premium: boolean;
    status: 'draft' | 'completed' | 'archived';
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
