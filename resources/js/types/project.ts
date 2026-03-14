export interface Project {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    status: 'pending' | 'generating' | 'draft' | 'finalized' | 'failed';
    language: string;
    template_id: string | null;
    description: string | null;
    chapters_count?: number;
    created_at: string;
    updated_at: string;
    chapters?: Chapter[];
    sources?: Source[];
}

export interface Chapter {
    id: number;
    project_id: number;
    title: string;
    order: number;
    content: string | null;
    status: 'empty' | 'draft' | 'generating' | 'revised' | 'final';
    created_at: string;
    updated_at: string;
}

export interface Source {
    id: number;
    project_id: number;
    title: string;
    type: string;
    content: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
}
